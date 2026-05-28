import { motion } from "framer-motion";
import {
  CalendarDays,
  FileText,
  MapPin,
  Share2,
  Sparkles,
} from "lucide-react";

const iconMap = {
  upload: FileText,
  itinerary: Sparkles,
  shared: Share2,
  profile: CalendarDays,
};

const ActivityTimeline = ({ activities = [], loading = false }) => {
  const formatActivityDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 sm:p-5 shadow-xl shadow-black/10 backdrop-blur-xl">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-white">Recent activity</h3>
          <p className="text-xs text-slate-500">A quick timeline of your recent travel actions.</p>
        </div>
        <span className="self-start sm:self-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-xs font-bold text-cyan-300 shrink-0">
          {activities.length}
        </span>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="flex items-start gap-3 sm:gap-4 animate-pulse">
              <div className="h-10 w-10 shrink-0 rounded-2xl bg-white/10" />
              <div className="flex-1 min-w-0 space-y-2">
                <div className="h-4 w-32 rounded bg-white/10" />
                <div className="h-3 w-24 rounded bg-white/10" />
              </div>
            </div>
          ))}
        </div>
      ) : activities.length === 0 ? (
        <p className="text-sm text-slate-500">No activity yet. Upload a document to get started.</p>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {activities.map((activity, index) => {
            const Icon = iconMap[activity.type] || MapPin;
            return (
              <motion.div
                key={activity.id || index}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.04 }}
                className="flex gap-3 sm:gap-4 rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-950/70 p-3 sm:p-4"
              >
                <div className="flex h-10 sm:h-11 w-10 sm:w-11 shrink-0 items-center justify-center rounded-2xl sm:rounded-3xl bg-cyan-400/10 text-cyan-300">
                  <Icon className="h-4 sm:h-5 w-4 sm:w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm sm:text-base font-semibold text-white truncate">{activity.title}</p>
                  <p className="mt-1 text-xs sm:text-sm text-slate-400 line-clamp-2">{activity.description}</p>
                </div>
                <div className="text-right text-xs text-slate-500 shrink-0 whitespace-nowrap">
                  {formatActivityDate(activity.timestamp)}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ActivityTimeline;
