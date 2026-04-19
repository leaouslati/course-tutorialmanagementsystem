import { Link } from "react-router-dom";
import { Star } from "lucide-react";

export default function PackageCard({ pkg, darkMode = false }) {
  const title = pkg.title || pkg.package_name || pkg.name || "Package";
  const destination = pkg.destination || pkg.location || pkg.city || "Unknown destination";
  const price = pkg.price ?? pkg.total_price ?? 0;
  const days = pkg.duration ?? pkg.days ?? pkg.duration_days ?? 0;
  const mood = pkg.mood || pkg.category || "Experience";
  const image = pkg.imageUrl || pkg.image || pkg.thumbnail || "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80";

  const cardBg = darkMode ? "#0f1f3d" : "#ffffff";
  const cardBorder = darkMode ? "#1a3a6b" : "#e5e7eb";
  const headingColor = darkMode ? "#f8fafc" : "#111827";
  const textColor = darkMode ? "#cbd5e1" : "#4b5563";
  const badgeBg = darkMode ? "bg-slate-800 text-slate-100" : "bg-slate-100 text-slate-700";

  return (
    <article
      className="rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden h-full flex flex-col"
      style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
      aria-label={`View ${title} package, $${price}, ${days} days`}
    >
      <div className="relative h-44 bg-slate-200 overflow-hidden">
        <img
          src={image}
          alt={`Cover for ${title}`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <span className={`absolute left-4 top-4 rounded-full px-3 py-1 text-[11px] font-semibold ${badgeBg}`}>
          {destination}
        </span>
      </div>

      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <h2 className="text-base sm:text-lg font-semibold leading-snug text-left" style={{ color: headingColor }}>
            {title}
          </h2>
          <span className="text-xs uppercase tracking-[0.14em] font-semibold text-slate-500">
            {mood}
          </span>
        </div>

        <p className="text-sm leading-relaxed line-clamp-3" style={{ color: textColor }}>
          {pkg.description || pkg.short_description || "A memorable package experience."}
        </p>

        <div className="mt-auto grid gap-3 text-sm text-slate-500">
          <div className="flex items-center justify-between gap-2">
            <span className="font-semibold text-slate-900" style={{ color: headingColor }}>${price}</span>
            <span>{days} days</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-400" aria-hidden="true" />
            <span>{pkg.rating ?? pkg.avg_rating ?? "4.8"}</span>
          </div>
        </div>

        <Link
          to={`/packages/${pkg.id}`}
          className="inline-flex items-center justify-center rounded-2xl py-2 text-sm font-semibold text-white bg-[#1976D2] hover:bg-[#1565C0] transition-colors duration-200"
          aria-label={`View ${title} package details`}
        >
          View package
        </Link>
      </div>
    </article>
  );
}
