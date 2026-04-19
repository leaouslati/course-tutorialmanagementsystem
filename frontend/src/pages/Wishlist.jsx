import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { authFetch } from "../api";
import PackageCard from "../components/PackageCard";
import Button from "../components/Button";

export default function Wishlist({ darkMode = false }) {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadWishlist = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await authFetch(`/api/packages/wishlist`);
      if (!res.ok) throw new Error("Unable to load wishlist");
      const data = await res.json();
      setPackages(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load wishlist");
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const removeFromWishlist = async (packageId) => {
    try {
      const res = await authFetch(`/api/packages/wishlist/${packageId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Unable to remove package");
      setPackages((prev) => prev.filter((pkg) => pkg.id !== packageId));
    } catch (err) {
      setError(err.message || "Could not remove package from wishlist");
    }
  };

  return (
    <main className={`min-h-screen px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-300 ${darkMode ? "bg-[#020a18] text-slate-100" : "bg-white text-slate-900"}`}>
      <header className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#1976D2]">Wishlist</p>
        <h1 className="mt-3 text-3xl sm:text-4xl font-bold">Saved travel packages</h1>
        <p className="mt-2 max-w-2xl text-sm sm:text-base text-slate-500">Your wishlist is synced to your account for easy access later.</p>
      </header>

      {error && (
        <div className="rounded-3xl border border-red-300 bg-red-50 p-4 text-sm text-red-700 mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-3xl border border-dashed border-slate-400/50 bg-slate-50 p-8 text-center text-slate-500">Loading wishlist...</div>
      ) : packages.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">No saved packages yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {packages.map((pkg) => (
            <div key={pkg.id} className="relative">
              <PackageCard pkg={pkg} darkMode={darkMode} />
              <Button
                variant="outline"
                size="sm"
                darkMode={darkMode}
                onClick={() => removeFromWishlist(pkg.id)}
                className="absolute right-4 top-4"
                aria-label={`Remove ${pkg.title || pkg.package_name || "package"} from wishlist`}
              >
                <Trash2 size={14} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
