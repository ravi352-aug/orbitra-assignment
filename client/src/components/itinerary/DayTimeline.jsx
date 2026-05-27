import { motion } from "framer-motion";

const parseDays = (text) => {
  if (!text) return [];

  // Try to split by 'Day' markers
  const parts = text.split(/\n(?=Day\s*\d+)/i);
  if (parts.length > 1) return parts.map((p) => p.trim()).filter(Boolean);

  // Fallback split by double newlines
  return text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
};

const DayTimeline = ({ itineraryText }) => {
  const days = parseDays(itineraryText);

  return (
    <div className="space-y-4">
      {days.map((dayText, idx) => (
        <motion.article
          key={idx}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-white/10 bg-white/[0.02] p-4"
        >
          <h4 className="font-bold text-white mb-2">{`Day ${idx + 1}`}</h4>
          <pre className="whitespace-pre-wrap text-sm text-slate-300">{dayText}</pre>
        </motion.article>
      ))}
      {days.length === 0 && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-sm text-slate-400">No itinerary content available.</div>
      )}
    </div>
  );
};

export default DayTimeline;
