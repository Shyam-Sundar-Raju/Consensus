import { useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

export default function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (text.trim() && !disabled) {
      onSend(text);
      setText("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-input-area">
      <div className="input-container">
        <Textarea 
          placeholder="Ask a question about the syllabus..." 
          className="textarea-field" 
          style={{border:'none', boxShadow: 'none'}} 
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />
        <Button onClick={handleSend} disabled={disabled || !text.trim()}>
          {disabled ? "..." : "Send"}
        </Button>
      </div>
    </div>
  );
}