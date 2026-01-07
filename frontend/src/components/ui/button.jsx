import React from "react";

export function Button({ className = "", variant = "primary", children, ...props }) {
  const variantClass = variant === "outline" ? "btn-outline" : variant === "ghost" ? "btn-ghost" : "btn-primary";
  
  return (
    <button className={`btn ${variantClass} ${className}`} {...props}>
      {children}
    </button>
  );
}