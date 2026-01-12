import { useEffect } from "react";
import { useParams } from "react-router-dom";

export const RedirectPage: React.FC = () => {
  const { shortId } = useParams<{ shortId: string }>();

  useEffect(() => {
    const isReserved = (id: string) => {
      const reserved = [
        "shorten",
        "analytics",
        "dashboard",
        "login",
        "register",
      ];
      return reserved.includes(id);
    };
    if (!shortId || isReserved(shortId)) return;
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/url/${shortId}`;
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
