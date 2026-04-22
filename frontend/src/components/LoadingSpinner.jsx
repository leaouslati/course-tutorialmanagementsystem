export default function LoadingSpinner({ darkMode = false, message = "Loading...", fullPage = false }) {
  const spinner = (
    <>
      <div
        role="status"
        aria-label={message}
        className="w-10 h-10 border-4 border-[#1976D2] border-t-transparent rounded-full animate-spin"
      />
      <p className="text-sm font-medium" style={{ color: darkMode ? "#94a3b8" : "#64748b" }}>
        {message}
      </p>
    </>
  );

  if (fullPage) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4"
        style={{ backgroundColor: darkMode ? "#060f1e" : "#F4F8FD" }}
      >
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      {spinner}
    </div>
  );
}
