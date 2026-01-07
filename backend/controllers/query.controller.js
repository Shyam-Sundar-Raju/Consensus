const axios = require("axios");
const Chunk = require("../models/Chunk");
const Message = require("../models/Message");
const { PYTHON_EMBEDDING_URL } = require("../utils/pythonService");

// TEMP: cosine similarity function
function cosineSimilarity(vecA, vecB) {
  const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const normA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const normB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dot / (normA * normB);
}

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
  

    // 1. Embed the question using Python
    const embedResponse = await axios.post(
        "http://localhost:8000/embed-text",
        { text: question }
      );
      

    const queryEmbedding = embedResponse.data.embedding;

    // 2. Fetch chunks for this project
    const chunks = await Chunk.find({ projectId });

    // 3. Score similarity
    const scored = chunks.map(chunk => ({
      text: chunk.text,
      score: cosineSimilarity(queryEmbedding, chunk.embedding)
    }));

    // 4. Pick top 3 relevant chunks
    const topChunks = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(c => c.text);

    // 5. Call LLM (placeholder for now)
    const { GoogleGenerativeAI } = require("@google/generative-ai");
    // 5. Call Gemini LLM
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
    model: "models/gemini-2.5-flash"
    });

    // Build prompt (Gemini likes one text block)
    const prompt = `
    You are an educational assistant.
    Answer ONLY using the syllabus content below.
    If the answer is not present, say "This is not covered in the syllabus."

    SYLLABUS:
    ${topChunks.join("\n\n")}

    QUESTION:
    ${question}
    `;

    const result = await model.generateContent(prompt);
    const finalAnswer = result.response.text();

    // Save assistant message
    await Message.create({
        projectId,
        role: "assistant",
        content: finalAnswer
  });
  

    res.json({
    answer: finalAnswer,
    usedChunks: topChunks.length
    });

  


  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Query failed" });
  }
};
