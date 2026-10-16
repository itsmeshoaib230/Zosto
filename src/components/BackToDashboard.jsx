import React from "react";
import { useNavigate } from "react-router-dom";

export default function BackToDashboard() {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate("/dashboard")}
      aria-label="Back to Dashboard"
      title="Back to Dashboard"
      style={{
        border: "none",
        background: "#eaf3ff",
        color: "#0866ff",
        borderRadius: "10px",
        padding: "10px 14px",
        fontSize: "24px",
        cursor: "pointer",
        marginRight: "12px",
      }}
    >
      ←
    </button>
  );
}