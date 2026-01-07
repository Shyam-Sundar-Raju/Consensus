import { useState, useEffect, useRef } from "react";
import ChatInput from "./ChatInput";
import MessageBubble from "./MessageBubble";
import { api } from "../../lib/api";

export default function ChatWindow({ activeProject }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false); // For sending new messages
  const [historyLoading, setHistoryLoading] = useState(false); // For loading old messages
  const messagesEndRef = useRef(null);

  // 1. Auto-scroll to bottom whenever messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, historyLoading]);

  // 2. Load Chat History when Project Changes
  useEffect(() => {
    if (!activeProject) {
      setMessages([]);
      return;
    }

    const fetchHistory = async () => {
      setHistoryLoading(true);
      try {
        const res = await api.get(`/messages/${activeProject._id}`);
        const history = res.data;

        if (history && history.length > 0) {
          // Transform Backend Format (role) -> Frontend Format (isUser)
          const formattedMessages = history.map((msg) => ({
            text: msg.content,
            isUser: msg.role === "user", 
          }));
          setMessages(formattedMessages);
        } else {
          // No history? Show Welcome Message
          setMessages([
            { 
              text: `Welcome to ${activeProject.name}. Upload a syllabus to start asking questions!`, 
              isUser: false 
            }
          ]);
        }
      } catch (err) {
        console.error("Failed to fetch history:", err);
        setMessages([
          { text: "⚠️ Error loading previous chat history.", isUser: false }
        ]);
      } finally {
        setHistoryLoading(false);
      }
    };

    fetchHistory();
  }, [activeProject?._id]); // Run this every time the Project ID changes

  // 3. Handle Sending New Message
  const handleSendMessage = async (text) => {
    if (!activeProject) {
      alert("Please select a project first.");
      return;
    }

    // Optimistic UI Update (Show user message immediately)
    const newMessages = [...messages, { text, isUser: true }];
    setMessages(newMessages);
    setLoading(true);

    try {
      // Send to Backend
      const res = await api.post(`/query/${activeProject._id}`, { question: text });

      // Append Bot Response
      setMessages((prev) => [
        ...prev,
        { text: res.data.answer, isUser: false }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { text: "Error getting response. Is the server running?", isUser: false }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 4. Render Logic
  if (!activeProject) {
    return (
      <main className="chat-window items-center justify-center text-gray-400">
        <div className="text-center space-y-2">
          <div className="text-4xl">👋</div>
          <p>Select a project from the sidebar to start.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="chat-window">
      {/* Messages Area */}
      <div className="message-list">
        
        {/* Loading Spinner for History */}
        {historyLoading && (
          <div className="flex justify-center p-4">
            <span className="text-sm text-gray-400 animate-pulse">Loading history...</span>
          </div>
        )}

        {/* Message List */}
        {!historyLoading && messages.map((msg, idx) => (
          <MessageBubble key={idx} text={msg.text} isUser={msg.isUser} />
        ))}

        {/* Loading Indicator for New Message */}
        {loading && (
          <div className="message-wrapper bot">
            <div className="chat-bubble bot italic text-gray-400">Thinking...</div>
          </div>
        )}
        
        {/* Invisible element to scroll to */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <ChatInput onSend={handleSendMessage} disabled={loading || historyLoading} />
    </main>
  );
}