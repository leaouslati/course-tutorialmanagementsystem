import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Heart, Clock, CalendarDays, MapPin, Sparkles } from "lucide-react";
import { authFetch } from "../api";
import Button from "../components/Button";

export default function PackageDetails({ darkMode = false }) {
  const { id } = useParams();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wishlisted, setWishlisted] = useState(false);
  const [savingWishlist, setSavingWishlist] = useState(false);
  const [error, setError] = useState(null);

  const loadPackage = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await authFetch(`/api/packages/${id}`);
      if (!res.ok) throw new Error("Package not found");
      const data = await res.json();
      setPkg(data);
    } catch (err) {
      setError(err.message || "Unable to load package");
    } finally {
      setLoading(false);
    }
  };

  const loadWishlist = async () => {
    try {
      const res = await authFetch(`/api/packages/wishlist`);
      if (!res.ok) return;
      const data = await res.json();
      const contains = Array.isArray(data) && data.some((item) => item.id === id || item.package_id === id);
      setWishlisted(contains);
    } catch {
      // ignore wishlist fetch failures silently
    }
  };

  useEffect(() => {
    loadPackage();
    loadWishlist();
  }, [id]);

  const toggleWishlist = async () => {
    if (!pkg || savingWishlist) return;
    setSavingWishlist(true);
    setWishlisted((prev) => !prev);
    try {
      if (wishlisted) {
        const res = await authFetch(`/api/packages/wishlist/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Unable to remove from wishlist");
      } else {
        const res = await authFetch(`/api/packages/wishlist`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ package_id: id }),
        });
        if (!res.ok) throw new Error("Unable to add to wishlist");
      }
    } catch (err) {
      setWishlisted((prev) => !prev);
      setError(err.message || "Could not update wishlist");
    } finally {
      setSavingWishlist(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen p-6">Loading package details...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen p-6 text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  if (!pkg) {
    return null;
  }

  const title = pkg.title || pkg.package_name || pkg.name || "Package";
  const destination = pkg.destination || pkg.location || pkg.city || "Destination";
  const price = pkg.price ?? pkg.total_price ?? 0;
  const days = pkg.duration ?? pkg.days ?? pkg.duration_days ?? 0;
  const rating = pkg.rating ?? pkg.avg_rating ?? 4.8;
  const image = pkg.imageUrl || pkg.image || pkg.thumbnail || "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80";
  const mood = pkg.mood || pkg.category || "Adventure";

  return (
    <main className={`min-h-screen px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-300 ${darkMode ? "bg-[#020a18] text-slate-100" : "bg-white text-slate-900"}`}>
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-start">
        <div className="space-y-6">
          <div className="rounded-[2rem] overflow-hidden shadow-xl" style={{ backgroundColor: darkMode ? "#07101f" : "#f8fafc" }}>
            <img src={image} alt={title} className="w-full h-72 object-cover sm:h-96" />
          </div>

          <div className="rounded-[2rem] border p-6" style={{ borderColor: darkMode ? "#1f334d" : "#e2e8f0", backgroundColor: darkMode ? "#07101f" : "#ffffff" }}>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-[#1976D2]">{mood}</p>
                <h1 className="mt-3 text-3xl font-bold" style={{ color: darkMode ? "#f8fafc" : "#0f172a" }}>{title}</h1>
                <p className="mt-2 text-sm text-slate-500">{destination}</p>
              </div>
              <button
                type="button"
                onClick={toggleWishlist}
                disabled={savingWishlist}
                className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-colors duration-200"
                style={{ backgroundColor: wishlisted ? "#7c3aed" : darkMode ? "#0f172a" : "#f8fafc", color: wishlisted ? "white" : darkMode ? "#f8fafc" : "#111827" }}
                aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart size={18} fill={wishlisted ? "currentColor" : "none"} stroke={wishlisted ? "currentColor" : "currentColor"} />
                {wishlisted ? "Remove" : "Add to wishlist"}
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border p-4" style={{ borderColor: darkMode ? "#1f334d" : "#e2e8f0" }}>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Price</p>
                <p className="mt-2 text-xl font-semibold">${price}</p>
              </div>
              <div className="rounded-3xl border p-4" style={{ borderColor: darkMode ? "#1f334d" : "#e2e8f0" }}>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Duration</p>
                <p className="mt-2 text-xl font-semibold">{days} days</p>
              </div>
              <div className="rounded-3xl border p-4" style={{ borderColor: darkMode ? "#1f334d" : "#e2e8f0" }}>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Rating</p>
                <p className="mt-2 flex items-center gap-2 text-xl font-semibold">
                  <Sparkles size={18} className="text-yellow-400" aria-hidden="true" />
                  {rating}
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border p-5" style={{ borderColor: darkMode ? "#1f334d" : "#e2e8f0" }}>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Departure</p>
                  <p className="mt-2 text-sm">{pkg.departure_location || pkg.start_location || "City center"}</p>
                </div>
                <div className="rounded-3xl border p-5" style={{ borderColor: darkMode ? "#1f334d" : "#e2e8f0" }}>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Travel date</p>
                  <p className="mt-2 text-sm">{pkg.date || pkg.travel_date || "Flexible"}</p>
                </div>
              </div>

              <div className="rounded-3xl border p-6" style={{ borderColor: darkMode ? "#1f334d" : "#e2e8f0" }}>
                <h2 className="text-lg font-semibold mb-3">What to expect</h2>
                <p className="text-sm leading-7 text-slate-500">{pkg.description || pkg.details || "This package includes a rich itinerary with guided activities, carefully selected accommodations, and local experiences."}</p>
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-[2rem] border p-6" style={{ borderColor: darkMode ? "#1f334d" : "#e2e8f0", backgroundColor: darkMode ? "#07101f" : "#ffffff" }}>
            <h2 className="text-xl font-semibold mb-4">Package details</h2>
            <ul className="space-y-3 text-sm text-slate-500">
              <li className="flex items-center gap-3">
                <CalendarDays className="w-4 h-4 text-[#1976D2]" aria-hidden="true" />
                <span>{pkg.duration_text || `${days} days`} · {pkg.available_slots ? `${pkg.available_slots} slots` : "Open availability"}</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-[#1976D2]" aria-hidden="true" />
                <span>{destination}</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-[#1976D2]" aria-hidden="true" />
                <span>{pkg.duration_note || "Full itinerary included"}</span>
              </li>
            </ul>
          </div>

          <Button variant="primary" size="lg" darkMode={darkMode} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            Book now
          </Button>
        </aside>
      </div>
    </main>
  );
}
