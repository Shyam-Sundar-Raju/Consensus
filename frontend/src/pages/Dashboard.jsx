import { useState } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import ChatWindow from "../components/chat/ChatWindow";

export default function Dashboard() {
  const [activeProject, setActiveProject] = useState(null);
  const [chatSessionId, setChatSessionId] = useState(0);

  // 👇 CHANGED: Toggle Logic
  const handleProjectSelect = (project) => {
    // If clicking the SAME project that is already open, close it (set to null)
    if (activeProject && activeProject._id === project._id) {
      setActiveProject(null);
    } else {
      // Otherwise, open the new project
      setActiveProject(project);
    }
  };

  const handleNewChat = () => {
    setChatSessionId((prev) => prev + 1);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar 
        activeProject={activeProject} 
        onSelectProject={handleProjectSelect} // 👈 Pass the new toggle handler
        onNewChat={handleNewChat} 
      />
      
      {/* key={chatSessionId} resets the component when New Chat is clicked */}
      <ChatWindow 
        key={chatSessionId} 
        activeProject={activeProject} 
      />
    </div>
  );
}