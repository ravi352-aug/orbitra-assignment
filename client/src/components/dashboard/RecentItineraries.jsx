import { motion } from "framer-motion";
import { CalendarDays, Compass, Map, Route } from "lucide-react";

const formatDate = (date) => {
  if (!date) return "Unknown date";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "Unknown date";
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const SkeletonCard = () => (
  <div className="animate-pulse rounded-3xl border border-white/10 bg-white/[0.05] p-5">
    <div className="mb-5 h-11 w-11 rounded-2xl bg-white/10" />
    <div className="mb-3 h-4 w-40 rounded bg-white/10" />
    <div className="h-3 w-28 rounded bg-white/10" />
  </div>
);

const EmptyState = () => (
  <div className="col-span-full flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/[0.04] py-14 text-center">
    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-slate-500">
      <Compass className="h-6 w-6" />
    </div>
    <p className="text-sm font-bold text-white">No itineraries yet</p>
    <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">
      Once your uploaded documents are processed, generated itineraries will
      appear here.
    </p>
  </div>
);

const RecentItineraries = ({ itineraries = [], loading = false, error }) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.22, type: "spring", stiffness: 240, damping: 24 }}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-white">Recent itineraries</h3>
          <p className="text-xs text-slate-500">Generated AI travel plans</p>
        </div>
        <span className="rounded-full border border-violet-400/20 bg-violet-400/10 px-2.5 py-1 text-xs font-bold text-violet-300">
          {itineraries.length}
        </span>
      </div>

      {error ? (
        <div className="rounded-3xl border border-red-400/20 bg-red-400/10 p-5 text-sm text-red-200">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            [1, 2, 3].map((item) => <SkeletonCard key={item} />)
          ) : itineraries.length === 0 ? (
            <EmptyState />
          ) : (
            itineraries.map((item, index) => (
              <motion.article
                key={item._id || item.id || `${item.title}-${index}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4 }}
                className="group rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.03] p-5 shadow-xl shadow-black/10 backdrop-blur-xl transition hover:border-cyan-300/20"
              >
                <div className="mb-5 flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-400/10 text-violet-300 ring-1 ring-violet-400/20">
                    <Route className="h-5 w-5" />
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-bold text-slate-400">
                    AI Generated
                  </span>
                </div>

                <h4 className="line-clamp-2 text-base font-bold text-white">
                  {item.title || "Untitled trip"}
                </h4>
                <div className="mt-3 flex items-center gap-2 text-sm text-slate-400">
                  <Map className="h-4 w-4 text-cyan-300" />
                  <span className="truncate">
                    {item.destination || "Destination pending"}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                  <CalendarDays className="h-4 w-4" />
                  {formatDate(item.createdAt)}
                </div>
              </motion.article>
            ))
          )}
        </div>
      )}
    </motion.section>
  );
};

export default RecentItineraries;
