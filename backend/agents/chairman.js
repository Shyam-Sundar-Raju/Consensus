async function runChairman({
    model,
    draftContent,
    watchdogVerdict,
    factVerdict,
    studentVerdict
  }) {
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
  
    const result = await model.generateContent(chairmanPrompt);
    const response = result.response.text().trim();
  
    let decision = {
      decision: "APPROVE",
      instructions: []
    };
  
    if (response.startsWith("REVISE")) {
      decision.decision = "REVISE";
      decision.instructions = response
        .split("\n")
        .slice(1)
        .map(line => line.replace("-", "").trim())
        .filter(Boolean);
    }
  
    return decision;
  }
  
  module.exports = { runChairman };
  