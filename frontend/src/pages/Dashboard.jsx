import { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { authFetch } from "../api";
import PackageCard from "../components/PackageCard";

export default function Dashboard({ darkMode = false }) {
  const { currentUser } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadRecommendations = async () => {
      setLoading(true);
      setError(null);
      if (!currentUser?.id) {
        setLoading(false);
        return;
      }
      try {
        const res = await authFetch(`/api/packages/recommendations/${currentUser.id}`);
        if (!res.ok) throw new Error("Unable to load recommendations");
        const data = await res.json();
        setRecommendations(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Unable to load recommendations");
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, [currentUser]);

  return (
    <main className={`min-h-screen px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-300 ${darkMode ? "bg-[#020a18] text-slate-100" : "bg-white text-slate-900"}`}>
      <header className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#1976D2]">Customer dashboard</p>
        <h1 className="mt-3 text-3xl sm:text-4xl font-bold">Recommended packages for you</h1>
        <p className="mt-2 max-w-2xl text-sm sm:text-base text-slate-500">Personalized package suggestions based on your profile and interests.</p>
      </header>

      {error && (
        <div className="rounded-3xl border border-red-300 bg-red-50 p-4 text-sm text-red-700 mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-3xl border border-dashed border-slate-400/50 bg-slate-50 p-8 text-center text-slate-500">Loading recommendations...</div>
      ) : recommendations.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">No recommendations available yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {recommendations.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} darkMode={darkMode} />
          ))}
        </div>
      )}
    </main>
  );
}
