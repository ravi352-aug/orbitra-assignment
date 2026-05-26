import { motion } from "framer-motion";
import { Building2, CalendarDays, MapPin, Plane, Timer } from "lucide-react";

const fields = [
  { key: "source", label: "Source", Icon: MapPin },
  { key: "destination", label: "Destination", Icon: MapPin },
  { key: "travelDate", label: "Travel date", Icon: CalendarDays },
  { key: "airline", label: "Airline", Icon: Plane },
  { key: "hotel", label: "Hotel", Icon: Building2 },
  { key: "timings", label: "Timings", Icon: Timer },
];

const fallback = "Not found";

const TravelSummary = ({ details }) => {
  const data = details || {};

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-xl shadow-black/10 backdrop-blur-xl"
    >
      <div className="mb-5">
        <h3 className="text-base font-bold text-white">Travel summary</h3>
        <p className="text-xs text-slate-500">Details extracted from the uploaded document</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {fields.map(({ key, label, Icon }, index) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            className="rounded-2xl border border-white/10 bg-slate-950/35 p-4"
          >
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300 ring-1 ring-cyan-400/20">
              <Icon className="h-4 w-4" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              {label}
            </p>
            <p className="mt-1 break-words text-sm font-bold text-white">
              {data[key] || fallback}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default TravelSummary;
