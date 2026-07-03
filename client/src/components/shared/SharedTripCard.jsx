import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { itineraryService } from "../../services/itineraryService";
import CopyLinkButton from "./CopyLinkButton";

const SharedTripCard = ({ itinerary, onDelete, onToggled }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const shareId = itinerary?.shareId;

  const handleToggle = async () => {
    if (!itinerary?._id) return;
    setLoading(true);
    try {
      const res = await itineraryService.toggleShareTrip(itinerary._id);
      const next = res.itinerary || res;
      onToggled && onToggled(next);
    } catch (err) {
      alert(err.message || "Unable to update share state");
    } finally {
      setLoading(false);
    }
  };

  const handleView = () => {
    if (!itinerary?._id) return;
    navigate(`/itinerary/${itinerary._id}`);
  };

  const transportType = itinerary?.transportType || "Unknown";
  const travelDate = itinerary?.travelDate || "—";
  const destination = itinerary?.destination || itinerary?.title || "Untitled";
  const source = itinerary?.source || "";

  const badgeClass = shareId
    ? "bg-cyan-500/20 text-cyan-200 border border-cyan-400/20"
    : "bg-white/5 text-slate-300 border border-white/10";

  const preview = useMemo(() => {
    const raw = itinerary?.itineraryText || itinerary?.itinerary || "";
    return typeof raw === "string" ? raw : "";
  }, [itinerary]);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 shadow-xl shadow-black/10 backdrop-blur-sm overflow-hidden"
    >
      <div className="flex flex-col gap-3 min-w-0">
        <div className="flex items-start gap-3 min-w-0">
          <div className="flex-1 min-w-0">
            <h4 className="text-base sm:text-lg font-bold text-white truncate">
              {destination}
            </h4>
            <p className="text-xs text-slate-400 mt-1 truncate">
              {source ? `${source} → ` : ""}
              {itinerary?.destination || ""}
            </p>

            <div className="mt-3 flex flex-wrap gap-2 items-center text-xs">
              <span className="rounded-full bg-white/5 px-2 py-1 text-slate-200 border border-white/10">
                {transportType}
              </span>
              <span className="rounded-full bg-white/5 px-2 py-1 text-slate-200 border border-white/10">
                {travelDate}
              </span>
              <span className={`rounded-full px-2 py-1 text-slate-200 ${badgeClass}`}>
                {shareId ? "Public" : "Private"}
              </span>
              {itinerary?.shareBadge ? (
                <span className="rounded-full bg-gradient-to-r from-cyan-400/15 to-indigo-500/15 px-2 py-1 text-cyan-100 border border-white/10">
                  {itinerary.shareBadge}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        {/* Itinerary preview */}
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
          <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 break-words">
            {preview ? preview : "No preview available"}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 items-stretch sm:items-center">
          <button
            onClick={handleView}
            className="w-full sm:w-auto rounded-xl bg-white/[0.06] px-3 py-2 text-sm font-semibold text-white hover:bg-white/[0.08] transition"
          >
            View itinerary
          </button>

          <div className="w-full sm:w-auto">
            <CopyLinkButton shareId={shareId} disabled={!shareId} />
          </div>

          <button
            onClick={handleToggle}
            disabled={loading}
            className="w-full sm:w-auto rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10 disabled:opacity-60 transition"
          >
            {shareId ? "Disable" : "Make Public"}
          </button>

          <button
            onClick={() => onDelete && onDelete(itinerary._id)}
            className="w-full sm:w-auto rounded-xl border border-red-500/10 bg-red-500/5 px-3 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/10 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </motion.article>
  );
};

export default SharedTripCard;

