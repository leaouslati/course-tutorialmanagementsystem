import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

export default function NotFound({ darkMode = false }) {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center transition-colors duration-300"
      style={{
        background: darkMode
          ? "linear-gradient(135deg, #020b18 0%, #041530 50%, #0a2550 100%)"
          : "linear-gradient(135deg, #0D47A1 0%, #1565C0 50%, #1976D2 100%)",
      }}
    >
      <div
        className="rounded-2xl shadow-2xl px-8 py-10 max-w-md w-full"
        style={{
          backgroundColor: darkMode ? "#0f1f3d" : "#ffffff",
          border: `1px solid ${darkMode ? "#1a3a6b" : "#e2e8f0"}`,
        }}
      >
        <div className="flex flex-col items-center gap-4">
          <AlertTriangle className="w-12 h-12 text-red-500" />

          <h1
            className="text-4xl font-extrabold"
            style={{ color: darkMode ? "#f1f5f9" : "#0f172a" }}
          >
            404
          </h1>

          <p
            className="text-lg font-semibold"
            style={{ color: darkMode ? "#e2e8f0" : "#1e293b" }}
          >
            Page not found
          </p>

          <p
            className="text-sm"
            style={{ color: darkMode ? "#94a3b8" : "#64748b" }}
          >
            The page you are looking for doesn’t exist or has been moved.
          </p>

          <button
            onClick={() => navigate("/")}
            className="mt-4 px-6 py-3 rounded-xl font-semibold shadow transition"
            style={{
              backgroundColor: "#1976D2",
              color: "#ffffff",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#2196F3")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#1976D2")
            }
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}