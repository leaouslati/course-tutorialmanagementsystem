import { AlertCircle } from "lucide-react";
import Button from "./Button";

export default function ErrorMessage({ message, onRetry, darkMode = false }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <AlertCircle size={40} style={{ color: "#ef4444" }} aria-hidden="true" />
      <p className="text-sm font-semibold" style={{ color: "#ef4444" }}>{message}</p>
      {onRetry && (
        <Button variant="primary" size="md" darkMode={darkMode} onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}
