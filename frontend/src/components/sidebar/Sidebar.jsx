import { useEffect, useState } from "react";
import ProjectItem from "./ProjectItem";
import UserMenu from "../common/UserMenu";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { api } from "../../lib/api";

// 1. Receive onNewChat here 👇
export default function Sidebar({ activeProject, onSelectProject, onNewChat }) {
  const [projects, setProjects] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects");
      setProjects(res.data);
    } catch (err) {
      console.error("Failed to load projects", err);
    }
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;
    try {
      await api.post("/projects", { name: newProjectName, level: "Beginner" });
      setNewProjectName("");
      setIsCreating(false);
      fetchProjects();
    } catch (err) {
      alert("Failed to create project");
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src="/logo.jpeg" alt="Consensus Logo" className="w-8 h-8 rounded" />
        <span>Consensus</span>
      </div>

      <div className="sidebar-content">
        <div className="sidebar-label">Your Projects</div>
        
        {projects.map((proj) => (
          <ProjectItem 
            key={proj._id} 
            project={proj} 
            isActive={activeProject?._id === proj._id}
            onClick={() => onSelectProject(proj)}
            onRefresh={fetchProjects}
            onNewChat={onNewChat} // 2. Pass it down here 👇
          />
        ))}

        {isCreating && (
          <div className="p-2 border border-blue-100 rounded bg-blue-50 m-2">
            <Input 
              placeholder="Project Name..." 
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="mb-2 h-8 bg-white"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleCreateProject} className="h-7 text-xs">Create</Button>
              <Button size="sm" variant="ghost" onClick={() => setIsCreating(false)} className="h-7 text-xs">Cancel</Button>
            </div>
          </div>
        )}
      </div>

      <div className="sidebar-footer">
        {!isCreating && (
          <Button variant="outline" className="w-full mb-2" onClick={() => setIsCreating(true)}>
            + New Project
          </Button>
        )}
        <UserMenu />
      </div>
    </aside>
  );
}