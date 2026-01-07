import React from "react";

export function Textarea({ className = "", ...props }) {
  return (
    <textarea
      className={`textarea-field ${className}`}
      {...props}
    />
  );
}