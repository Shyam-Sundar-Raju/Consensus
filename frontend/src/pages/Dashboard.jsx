import { useState } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import ChatWindow from "../components/chat/ChatWindow";

export default function Dashboard() {
  // This state tracks which project is currently clicked in the Sidebar
  const [activeProject, setActiveProject] = useState(null);

  return (
    <div className="dashboard-layout">
      {/* Pass the setter to Sidebar so it can update the selection */}
      <Sidebar 
        activeProject={activeProject} 
        onSelectProject={setActiveProject} 
      />
      
      {/* Pass the data to ChatWindow so it knows where to send messages */}
      <ChatWindow activeProject={activeProject} />
    </div>
  );
}