import { useState, useRef } from "react";
import { api } from "../../lib/api";

export default function ProjectItem({ project, isActive, onClick, onRefresh }) {
  const [uploading, setUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef(null);

  // 1. Handle File Upload Click
  const handleUploadClick = (e) => {
    e.stopPropagation();
    fileInputRef.current.click();
  };

  // 2. Handle Project Deletion
  const handleDeleteClick = async (e) => {
    e.stopPropagation(); // ⛔ CRITICAL: Stop click from toggling the project

    if (!window.confirm(`Are you sure you want to delete "${project.name}"?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      await api.delete(`/projects/${project._id}`);
      onRefresh(); 
    } catch (err) {
      alert("Failed to delete project: " + (err.response?.data?.message || err.message));
    } finally {
      setIsDeleting(false);
    }
  };

  // 3. Handle File Upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      await api.post(`/upload/syllabus/${project._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Syllabus uploaded!");
      onRefresh();
    } catch (err) {
      alert("Upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="project-wrapper">
      {/* --- PROJECT HEADER (Always Visible) --- */}
      <div
        className={`project-header ${isActive ? "bg-blue-50 text-blue-600" : ""}`}
        onClick={onClick}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <span className="truncate flex-1 mr-2">{project.name}</span>
        
        <div className="flex items-center gap-2">
          {/* 🗑️ DELETE BUTTON (Visible on Hover or Always) */}
          <button
            onClick={handleDeleteClick}
            disabled={isDeleting}
            className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
            title="Delete Project"
          >
            {isDeleting ? (
              <span className="text-[10px]">...</span>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            )}
          </button>

          {/* ▶ ARROW ICON */}
          <span className="project-arrow" style={{
              transform: isActive ? "rotate(90deg)" : "rotate(0deg)", 
              display: "inline-block",
              transition: "transform 0.2s"
            }}>
            ▶
          </span>
        </div>
      </div>

      {/* --- DROPDOWN CONTENT --- */}
      {isActive && (
        <div className="project-sublist">
          <div className="text-xs text-gray-400 uppercase font-semibold mt-2 mb-1">
            Files & Settings
          </div>
          
          <button 
            className="chat-item text-gray-600 hover:bg-gray-100 w-full text-left" 
            onClick={handleUploadClick}
            disabled={uploading}
          >
            {uploading ? "⏳ Uploading..." : "📄 Upload Syllabus"}
          </button>

          {/* UPLOADED FILES LIST */}
          {project.files && project.files.length > 0 && (
            <>
              <div className="text-xs text-gray-400 uppercase font-semibold mt-3 mb-1">
                Syllabus Files
              </div>
              {project.files.map((file, index) => (
                <div key={index} className="chat-item text-gray-700 text-xs truncate" title={file}>
                   📎 {file}
                </div>
              ))}
            </>
          )}
          
          <div className="text-[10px] text-gray-300 mt-2 pl-2 border-l-2 border-gray-100">
            Level: {project.level || "General"}
          </div>

          <input 
            type="file" 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            accept="application/pdf"
            onChange={handleFileChange}
          />
        </div>
      )}
    </div>
  );
}