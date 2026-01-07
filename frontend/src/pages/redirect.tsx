import { useEffect } from "react";
import { useParams } from "react-router-dom";

export const RedirectPage: React.FC = () => {
  const { shortId } = useParams<{ shortId: string }>();

  useEffect(() => {
    if (shortId) {
      // Redirect to backend endpoint which will handle the actual redirect
      window.location.href = `http://localhost:5000/url/${shortId}`;
    }
  }, [shortId]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-gray-400">Redirecting...</p>
      </div>
    </div>
  );
};
