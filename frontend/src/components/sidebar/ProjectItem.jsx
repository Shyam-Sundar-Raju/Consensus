import { useState, useRef } from "react";
import { api } from "../../lib/api";

export default function ProjectItem({ project, isActive, onClick }) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Trigger hidden file input
  const handleUploadClick = (e) => {
    e.stopPropagation(); // Prevent selecting the project when clicking upload
    fileInputRef.current.click();
  };

  // Handle File Selection & Upload
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
      alert("Syllabus uploaded and processed successfully!");
    } catch (err) {
      alert("Upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="project-wrapper">
      <div
        className={`project-header ${isActive ? "bg-blue-50 text-blue-600" : ""}`}
        onClick={onClick}
      >
        <span>{project.name}</span>
        {isActive && <span className="project-arrow" style={{transform: "rotate(90deg)"}}>▶</span>}
      </div>

      {/* Only show details if this is the active project */}
      {isActive && (
        <div className="project-sublist">
          <div className="chat-item text-xs cursor-default">
            Level: {project.level || "General"}
          </div>
          
          {/* Syllabus Upload Button */}
          <button 
            className="new-chat-btn" 
            onClick={handleUploadClick} 
            disabled={uploading}
          >
            {uploading ? "⏳ Processing PDF..." : "📄 Upload Syllabus"}
          </button>
          
          {/* Hidden Input for File Upload */}
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