import { useState, useEffect } from "react";
import ChatInput from "./ChatInput";
import MessageBubble from "./MessageBubble";
import { api } from "../../lib/api";

export default function ChatWindow({ activeProject }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Clear chat when project changes
  useEffect(() => {
    setMessages([
      { text: `Welcome to ${activeProject ? activeProject.name : "LLM Workspace"}. Upload a syllabus to start asking questions!`, isUser: false }
    ]);
  }, [activeProject]);

  const handleSendMessage = async (text) => {
    if (!activeProject) {
      alert("Please select a project first.");
      return;
    }

    // 1. Add User Message immediately
    const newMessages = [...messages, { text, isUser: true }];
    setMessages(newMessages);
    setLoading(true);

    try {
      // 2. Send to Backend RAG API
      const res = await api.post(`/query/${activeProject._id}`, { question: text });

      // 3. Add AI Response
      setMessages([
        ...newMessages,
        { text: res.data.answer, isUser: false }
      ]);
    } catch (err) {
      setMessages([
        ...newMessages,
        { text: "Error getting response. Did you upload a syllabus?", isUser: false }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!activeProject) {
    return (
      <main className="chat-window items-center justify-center text-gray-400">
        <p>Select a project from the sidebar to start.</p>
      </main>
    );
  }

  return (
    <main className="chat-window">
      <div className="message-list">
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} text={msg.text} isUser={msg.isUser} />
        ))}
        {loading && (
          <div className="message-wrapper bot">
            <div className="chat-bubble bot italic text-gray-400">Thinking...</div>
          </div>
        )}
      </div>
      <ChatInput onSend={handleSendMessage} disabled={loading} />
    </main>
  );
}