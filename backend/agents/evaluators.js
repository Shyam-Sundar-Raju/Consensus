// backend/agents/evaluators.js

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
  
  async function runEvaluators({
    model,
    topChunks,
    draftContent,
    studentLevel
  }) {
    const watchdogPrompt = `
  You are a strict Curriculum Watchdog.
  
  Respond with ONE LINE ONLY.
  
  PASS
  or
  FAIL: issue1 | issue2
  
  SYLLABUS:
  ${topChunks.join("\n\n")}
  
  ANSWER:
  ${draftContent}
  
  
  IMPORTANT RULE:
  If a statement is classified as INFERRED but is actually explicit in the syllabus,
  this is acceptable and should NOT cause a FAIL.
  
  Only mark FAIL when:
  - Content is marked EXPLICIT but is not supported by the syllabus
  - External information is introduced
  `;
  
    const factSentinelPrompt = `
  You are a strict Fact Sentinel.
  
  Respond with ONE LINE ONLY.
  
  PASS
  or
  FAIL: issue1 | issue2
  
  SYLLABUS:
  ${topChunks.join("\n\n")}
  
  ANSWER:
  ${draftContent}
  
  
  If a statement is classified as INFERRED but is actually explicit in the syllabus,
  do NOT mark FAIL.
  Only mark FAIL when unsupported or external facts are introduced.
  `;
  
    const simulatedStudentPrompt = `
  You are a simulated student.
  
  PROFILE:
  - Learning level: ${studentLevel}
  - You have no prior knowledge beyond what is typical for this level.
  
  TASK:
  Read the ANSWER below and attempt to understand it.
  
  If anything is confusing, unclear, assumes prior knowledge,
  or uses unexplained jargon, mark FAIL.
  
  Respond with ONE LINE ONLY.
  
  PASS
  or
  FAIL: confusion1 | confusion2
  
  Do NOT rewrite the answer.
  Do NOT explain concepts.
  Only report where you got confused.
  Do NOT fail simply because the answer is short or cautious.
  Fail ONLY if understanding is blocked.
  
  
  ANSWER:
  ${draftContent}
  `;
  
    // 🔥 Parallel execution (unchanged behaviour)
    const [watchdogResult, factResult, studentResult] = await Promise.all([
      model.generateContent(watchdogPrompt),
      model.generateContent(factSentinelPrompt),
      model.generateContent(simulatedStudentPrompt)
    ]);
  
    return {
        watchdogVerdict: parseVerdict(watchdogResult.response.text()),
        factVerdict: parseVerdict(factResult.response.text()),
        studentVerdict: parseVerdict(studentResult.response.text())
      };
      
  }
  
  module.exports = {
    runEvaluators
  };
  