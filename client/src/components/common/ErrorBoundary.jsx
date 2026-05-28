import { useState, useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

const ErrorBoundary = ({ children, onError }) => {
  const [error, setError] = useState(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (event) => {
      console.error("Error caught by boundary:", event.error);
      setError(event.error);
      setHasError(true);
      if (onError) onError(event.error);
    };

    const handleRejection = (event) => {
      console.error("Unhandled promise rejection:", event.reason);
      setError(event.reason);
      setHasError(true);
      if (onError) onError(event.reason);
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, [onError]);

  const handleRetry = () => {
    setError(null);
    setHasError(false);
    window.location.reload();
  };

  if (hasError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070b18] p-4">
        <div className="rounded-3xl border border-red-400/20 bg-red-400/10 p-6 sm:p-8 max-w-md text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-red-400/10 mx-auto text-red-300">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h1 className="text-xl font-bold text-white">Something went wrong</h1>
          <p className="mt-2 text-sm text-red-100/80">
            {error?.message || "An unexpected error occurred. Please try again."}
          </p>
          <button
            type="button"
            onClick={handleRetry}
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-red-500/20 transition hover:scale-[1.02]"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default ErrorBoundary;
