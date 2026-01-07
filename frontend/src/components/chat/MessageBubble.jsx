export default function MessageBubble({ text, isUser }) {
  return (
    <div className={`message-wrapper ${isUser ? "user" : "bot"}`}>
      <div className={`chat-bubble ${isUser ? "user" : "bot"}`}>
        {text}
      </div>
    </div>
  );
}