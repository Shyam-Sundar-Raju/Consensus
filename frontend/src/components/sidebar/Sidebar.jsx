import { useEffect, useState } from "react";
import ProjectItem from "./ProjectItem";
import UserMenu from "../common/UserMenu";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { api } from "../../lib/api";

export default function Sidebar({ activeProject, onSelectProject }) {
  const [projects, setProjects] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");

  // 1. Fetch Projects on Load
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

  // 2. Create New Project
  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;
    try {
      const res = await api.post("/projects", { 
        name: newProjectName, 
        level: "Beginner" // Default level, or add an input for this
      });
      setProjects([...projects, res.data]); // Add new project to list
      setNewProjectName("");
      setIsCreating(false);
    } catch (err) {
      alert("Failed to create project");
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        ✨ LLM Workspace
      </div>

      <div className="sidebar-content">
        <div className="sidebar-label">Your Projects</div>
        
        {projects.length === 0 && (
          <p className="text-gray-400 text-sm px-3">No projects yet.</p>
        )}

        {projects.map((proj) => (
          <ProjectItem 
            key={proj._id} 
            project={proj} 
            isActive={activeProject?._id === proj._id}
            onClick={() => onSelectProject(proj)}
          />
        ))}

        {/* Inline Create Form */}
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