import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { itineraryService } from "../../services/itineraryService";
import CopyLinkButton from "./CopyLinkButton";

const SharedTripCard = ({ itinerary, onDelete, onToggled }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
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
    navigate(`/itinerary/${itinerary._id}`);
  };

  const shareId = itinerary.shareId;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <h4 className="text-lg font-bold text-white truncate">{itinerary.title || itinerary.destination || 'Untitled'}</h4>
          <p className="text-xs text-slate-400 mt-1 truncate">{itinerary.source || ''} → {itinerary.destination || ''}</p>
          <div className="mt-3 flex flex-wrap gap-2 items-center text-xs">
            <span className="rounded-full bg-white/5 px-2 py-1 text-slate-200">{itinerary.transportType || 'Unknown'}</span>
            <span className="rounded-full bg-white/5 px-2 py-1 text-slate-200">{itinerary.travelDate || '—'}</span>
            <span className={`rounded-full px-2 py-1 ${itinerary.shareId ? 'bg-cyan-500/20 text-cyan-200' : 'bg-white/5 text-slate-300'}`}>{itinerary.shareId ? 'Public' : 'Private'}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <button onClick={handleView} className="rounded-2xl bg-white/[0.06] px-3 py-2 text-sm font-semibold text-white hover:bg-white/[0.08]">View Trip</button>

        <CopyLinkButton shareId={shareId} disabled={!shareId} />

        <button onClick={handleToggle} disabled={loading} className="ml-auto rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10">
          {itinerary.shareId ? 'Disable Sharing' : 'Make Public'}
        </button>

        <button onClick={() => onDelete && onDelete(itinerary._id)} className="rounded-2xl border border-red-500/10 bg-red-500/5 px-3 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/10">
          Delete
        </button>
      </div>
    </motion.article>
  );
};

export default SharedTripCard;
