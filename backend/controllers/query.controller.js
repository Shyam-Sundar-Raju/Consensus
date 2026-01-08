const axios = require("axios");
const Chunk = require("../models/Chunk");
const Message = require("../models/Message");
const Project = require("../models/Project");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { runContentArchitect } = require("../agents/contentArchitect");
const { runEvaluators } = require("../agents/evaluators");


// --------------------
// Utility functions
// --------------------

function cosineSimilarity(vecA, vecB) {
  const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const normA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const normB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dot / (normA * normB);
}

function parseVerdict(text) {
  const cleaned = text.trim();

  if (cleaned === "PASS") {
    return { status: "PASS", issues: [] };
  }

  if (cleaned.startsWith("FAIL")) {
    const parts = cleaned.split(":");
    const issues = parts[1]
      ? parts[1].split("|").map(i => i.trim())
      : ["Unspecified issue"];

    return { status: "FAIL", issues };
  }

  return {
    status: "FAIL",
    issues: ["Invalid watchdog response format"]
  };
}

// --------------------
// Main Controller
// --------------------

exports.askQuestion = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ message: "Question required" });
    }

    // Save user message
    await Message.create({
      projectId,
      role: "user",
      content: question
    });

    // 1. Embed question
    const embedResponse = await axios.post(
      "http://localhost:8000/embed-text",
      { text: question }
    );

    const queryEmbedding = embedResponse.data.embedding;

    // 2. Retrieve syllabus chunks
    const chunks = await Chunk.find({ projectId });

    const scored = chunks.map(chunk => ({
      text: chunk.text,
      score: cosineSimilarity(queryEmbedding, chunk.embedding)
    }));

    const topChunks = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(c => c.text);

      const project = await Project.findById(projectId);

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      const studentLevel = project.level;
      

    // 3. Gemini setup
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "models/gemini-2.5-flash"
    });

    // 4. Content Architect prompt
    const draftContent = await runContentArchitect({
      model,
      topChunks,
      question
    });
    

    // 5. Watchdog prompts
    

    const { runEvaluators } = require("../agents/evaluators");

    const {
      watchdogVerdict,
      factVerdict,
      studentVerdict
    } = await runEvaluators({
      model,
      topChunks,
      draftContent,
      studentLevel
    });



    console.log("Curriculum Watchdog:", watchdogVerdict);
    console.log("Fact Sentinel:", factVerdict);
    console.log("Simulated Student:", studentVerdict);

    const chairmanPrompt = `
You are the Chairman of an academic AI council.

INPUTS:
- Draft answer
- Curriculum Watchdog verdict
- Fact Sentinel verdict
- Simulated Student verdict

TASK:
Decide whether the draft should be APPROVED or REVISED.

If APPROVED:
Respond with:
APPROVE

If REVISED:
Respond with:
REVISE:
- instruction1
- instruction2

Rules:
- Be concise and actionable
- Do NOT rewrite the answer
- Do NOT add new information
- Only base your decision on the verdicts provided

DRAFT ANSWER:
${draftContent}

CURRICULUM WATCHDOG:
${watchdogVerdict.status}
Issues: ${watchdogVerdict.issues.join("; ")}

FACT SENTINEL:
${factVerdict.status}
Issues: ${factVerdict.issues.join("; ")}

SIMULATED STUDENT:
${studentVerdict.status}
Issues: ${studentVerdict.issues.join("; ")}
`;

const chairmanResult = await model.generateContent(chairmanPrompt);
const chairmanResponse = chairmanResult.response.text().trim();

let chairmanDecision = {
    decision: "APPROVE",
    instructions: []
  };
  
  if (chairmanResponse.startsWith("REVISE")) {
    chairmanDecision.decision = "REVISE";
    chairmanDecision.instructions = chairmanResponse
      .split("\n")
      .slice(1)
      .map(i => i.replace("-", "").trim())
      .filter(Boolean);
  }

  console.log("Chairman:", chairmanDecision);

  let finalAnswer = draftContent;

if (chairmanDecision.decision === "REVISE") {
  const rewritePrompt = `
  You are an educational explainer for students.

  Your job is to produce a clear, natural, student-facing explanation.
  
  IMPORTANT:
  - Do NOT mention syllabus, inference, or analysis
  - Do NOT use headings like "explicitly stated"
  - Do NOT classify content
  - Do NOT explain beyond what is present
  - Use simple language suitable for the student level
  - If information is missing, say so plainly
  
  You are NOT analyzing.
  You are EXPLAINING.
  

ORIGINAL ANSWER:
${draftContent}

REVISION INSTRUCTIONS:
${chairmanDecision.instructions.join("\n")}

RULES:
- Follow instructions exactly
- Do NOT add new information
- Do NOT use external knowledge
- Maintain syllabus grounding

SYLLABUS:
${topChunks.join("\n\n")}
`;

  const rewriteResult = await model.generateContent(rewritePrompt);
  finalAnswer = rewriteResult.response.text();
}


    // 7. Save assistant message
    await Message.create({
        projectId,
        role: "assistant",
        content: finalAnswer
      });
      

    // 8. Respond
    res.json({
        answer: finalAnswer,
        agent: "Council Chairman",
        decision: chairmanDecision.decision,
        checks: {
          curriculum: watchdogVerdict.status,
          factual: factVerdict.status,
          student: studentVerdict.status
        }
      });
      
      

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Query failed" });
  }
};
