# CONSENSUS

# 🧠 Learning-Aware Generative AI System  
### Adversarial Multi-Agent LLM Council for Education

---

## 📌 Overview

Generative AI systems are fast and fluent, but **not learning-aware**.  
In educational contexts, this leads to **hallucinations**, **off-curriculum explanations**, and **level-inappropriate content**, creating a heavy verification burden for teachers, students, and institutions.

This project presents a **Learning-Aware Generative AI System** that replaces single-model generation with a **multi-agent academic council**.  
Instead of trusting one AI output, content is **generated, verified, stress-tested, revised, and approved** before being shown to the user.

---

## 🚨 Problem Statement

In real classrooms and self-learning platforms:

- AI generates confident but **factually incorrect explanations**
- Content **drifts away from prescribed curricula**
- Explanations are **misaligned with student learning levels**
- Educators face a growing **verification bottleneck**

Existing LLMs optimize for fluency, not for **correctness, curriculum alignment, or pedagogy**.

---

## 💡 Proposed Solution: LLM Council Architecture

We introduce an **Adversarial Multi-Agent System** inspired by academic peer review.

Instead of a single AI monologue, content passes through a **Council of Specialized LLM Agents**, each responsible for enforcing a specific educational constraint.

Only **Council-approved content** reaches the user.

---

## 🏛️ LLM Council Roles

| Agent | Responsibility |
|-----|---------------|
| **Content Architect** | Generates an initial syllabus-grounded draft |
| **Curriculum Watchdog** | Verifies strict curriculum alignment |
| **Fact Sentinel** | Detects unsupported or hallucinated claims |
| **Simulated Student** | Tests clarity and level-appropriateness |
| **Chairman** | Aggregates verdicts, enforces revision, approves output |

---

## 🔁 System Flow

User Question
↓
Curriculum Retrieval (RAG)
↓
Content Architect (Draft)
↓
Curriculum Watchdog (Scope Check)
↓
Fact Sentinel (Factual Check)
↓
Simulated Student (Level Check)
↓
Chairman (Decision + Rewrite)
↓
Final Answer + Review Trace


This pipeline **mechanically reduces hallucinations** and enforces pedagogical correctness.

---

## 🧱 Architecture Diagram

<img width="856" height="402" alt="image" src="https://github.com/user-attachments/assets/d54f271c-4d18-4e78-81f0-c768e7e92ee7" />


---

## ✨ Key Features

- 📚 Curriculum-aware content generation  
- 🧠 Hallucination prevention via independent verification  
- 🎓 Level-appropriate explanations  
- 🔍 Explainable AI with review trace  
- 💬 Persistent project-based chat history  
- 🗂️ PDF syllabus upload & semantic retrieval  
- 🔐 Multi-user authentication and project isolation  

---

## 🛠️ Tech Stack

### Frontend
- React
- shadcn/ui
- Tailwind CSS

### Backend
- Node.js + Express
- MongoDB

### AI & ML
- Google Gemini (LLM Agents)
- Sentence Transformers (Embeddings)
- Python FastAPI (Embedding Service)
- Retrieval-Augmented Generation (RAG)

---

## 🎯 Why This Matters

AI in education must be **governed, not just prompted**.

By enforcing **structured disagreement and consensus**, this system transforms generative AI from a risky shortcut into a **reliable, curriculum-aligned, and pedagogically sound teaching assistant**.

---

## 🏁 Future Scope

- Persistent review trace storage
- Teacher-controlled agent configuration
- Bias and inclusivity checks
- Presentation generation
- Voice-based interaction

---

## 🌱 Inspiration

This work is inspired by **Andrej Karpathy’s idea of “LLM Councils”**, where multiple specialized models critique and refine each other instead of relying on a single monolithic generation.  

We adapt this concept to the **education domain**, emphasizing curriculum alignment, factual correctness, and learner-level appropriateness through adversarial yet cooperative agent roles.

---

---

## 👥 Team

Built during a **24-hour hackathon** by a team of two, focusing on **correctness, explainability, and educational impact**.

---
