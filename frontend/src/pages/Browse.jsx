import { useState, useEffect } from "react";
import { Search, Filter, X, ChevronDown } from "lucide-react";
import { authFetch } from "../api";
import PackageCard from "../components/PackageCard";
import Button from "../components/Button";

const MOODS = ["Adventure", "Relaxation", "Cultural", "Family", "Romantic"];

export default function Browse({ darkMode = false }) {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchText, setSearchText] = useState("");
  const [destination, setDestination] = useState("");
  const [selectedMood, setSelectedMood] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [selectedDate, setSelectedDate] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const buildParams = () => {
    const params = {};
    if (destination) params.destination = destination;
    if (selectedMood) params.mood = selectedMood;
    if (minPrice > 0 || maxPrice < 5000) {
      params.minPrice = minPrice;
      params.maxPrice = maxPrice;
    }
    if (selectedDate) params.date = selectedDate;
    return params;
  };

  const fetchPackages = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams(params).toString();
      const res = await authFetch(`/api/packages${query ? `?${query}` : ""}`);
      if (!res.ok) throw new Error("Failed to load packages");
      const data = await res.json();
      setPackages(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Unable to load packages");
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages(buildParams());
  }, [destination, selectedMood, minPrice, maxPrice, selectedDate]);

  const handleSearchKey = (event) => {
    if (event.key === "Enter") {
      setDestination(searchText.trim());
    }
  };

  const clearFilters = () => {
    setSearchText("");
    setDestination("");
    setSelectedMood("");
    setMinPrice(0);
    setMaxPrice(5000);
    setSelectedDate("");
  };

  const moodButton = (mood) => (
    <button
      key={mood}
      type="button"
      onClick={() => setSelectedMood((prev) => (prev === mood ? "" : mood))}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-150 ${selectedMood === mood ? "bg-[#1976D2] text-white" : darkMode ? "bg-slate-800 text-slate-200" : "bg-slate-100 text-slate-700"}`}
      aria-pressed={selectedMood === mood}
    >
      {mood}
    </button>
  );

  const filterPanel = (
    <div className={`space-y-5 ${darkMode ? "text-slate-100" : "text-slate-900"}`}>
      <div className="space-y-2">
        <label htmlFor="destination-search" className="text-sm font-semibold">Destination</label>
        <input
          id="destination-search"
          type="search"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={handleSearchKey}
          placeholder="Search destination and press Enter"
          aria-label="Search by destination"
          className="w-full rounded-2xl border px-4 py-3 text-sm outline-none transition-colors duration-200"
          style={{
            backgroundColor: darkMode ? "#0f172a" : "#ffffff",
            borderColor: darkMode ? "#1e293b" : "#d1d5db",
            color: darkMode ? "#f8fafc" : "#111827",
          }}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold">Mood</h2>
          <button type="button" onClick={() => setSelectedMood("")} className="text-xs font-semibold text-[#1976D2]">Clear</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {MOODS.map(moodButton)}
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-sm font-semibold">Budget</h2>
        <div className="flex items-center gap-3 text-sm">
          <span>${minPrice}</span>
          <input
            type="range"
            min="0"
            max="5000"
            value={minPrice}
            onChange={(e) => setMinPrice(Number(e.target.value))}
            aria-label="Minimum price"
            className="w-full"
          />
          <span>${maxPrice}</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span>Max</span>
          <input
            type="range"
            min="0"
            max="5000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            aria-label="Maximum price"
            className="w-full"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="travel-date" className="text-sm font-semibold">Travel date</label>
        <input
          id="travel-date"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full rounded-2xl border px-4 py-3 text-sm outline-none transition-colors duration-200"
          style={{
            backgroundColor: darkMode ? "#0f172a" : "#ffffff",
            borderColor: darkMode ? "#1e293b" : "#d1d5db",
            color: darkMode ? "#f8fafc" : "#111827",
          }}
          aria-label="Filter packages by travel date"
        />
      </div>

      <Button
        variant="outline"
        size="md"
        darkMode={darkMode}
        onClick={clearFilters}
        className="w-full"
      >
        Clear Filters
      </Button>
    </div>
  );

  return (
    <main className={`min-h-screen px-4 sm:px-6 lg:px-8 py-6 pb-12 transition-colors duration-300 ${darkMode ? "bg-[#020a18] text-slate-100" : "bg-white text-slate-900"}`}>
      <header className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#1976D2]">Browse</p>
        <h1 className="mt-3 text-3xl sm:text-4xl font-bold">Explore travel packages</h1>
        <p className="mt-2 max-w-2xl text-sm sm:text-base text-slate-500">Filter packages by destination, mood, budget, and travel date.</p>
      </header>

      <div className="flex flex-col gap-6 md:flex-row">
        <div className="md:w-80 hidden md:block shrink-0">
          <div className="rounded-3xl border p-5" style={{ backgroundColor: darkMode ? "#0b1320" : "#f8fbff", borderColor: darkMode ? "#1f334d" : "#e2e8f0" }}>
            <div className="flex items-center gap-2 text-slate-400 mb-4">
              <Filter size={18} />
              <span className="font-semibold">Filters</span>
            </div>
            {filterPanel}
          </div>
        </div>

        <div className="flex-1">
          <div className="mb-4 md:hidden">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border px-4 py-3 font-semibold transition-colors duration-200"
              style={{ borderColor: darkMode ? "#1f2937" : "#d1d5db", backgroundColor: darkMode ? "#0b1320" : "#ffffff", color: darkMode ? "#f8fafc" : "#111827" }}
              aria-label="Open filter drawer"
            >
              <Filter size={16} />
              Filters
            </button>
          </div>

          {drawerOpen && (
            <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/40 md:hidden">
              <div className={`rounded-t-3xl p-5 ${darkMode ? "bg-[#0b1320]" : "bg-white"} shadow-2xl`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-base font-semibold">Filters</div>
                  <button onClick={() => setDrawerOpen(false)} aria-label="Close filters" className="text-slate-400 hover:text-slate-600">Close</button>
                </div>
                {filterPanel}
              </div>
            </div>
          )}

          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-500">Showing</p>
              <h2 className="text-2xl font-bold">{packages.length} packages</h2>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm text-slate-500">Destination:</span>
              <strong>{destination || "Any"}</strong>
            </div>
          </div>

          {error && (
            <div className="rounded-3xl border border-red-300 bg-red-50 p-4 text-sm text-red-700 mb-6">
              {error}
            </div>
          )}

          {loading ? (
            <div className="rounded-3xl border border-dashed border-slate-400/50 bg-slate-50 p-8 text-center text-slate-500">Loading packages...</div>
          ) : packages.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
              No packages found. Try clearing your filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {packages.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} darkMode={darkMode} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
