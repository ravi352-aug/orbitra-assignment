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
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-xl shadow-black/10 backdrop-blur-xl">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-white">Recent activity</h3>
          <p className="text-xs text-slate-500">A quick timeline of your recent travel actions.</p>
        </div>
        <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-xs font-bold text-cyan-300">
          {activities.length}
        </span>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="flex items-start gap-4 animate-pulse">
              <div className="h-10 w-10 rounded-2xl bg-white/10" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-40 rounded bg-white/10" />
                <div className="h-3 w-24 rounded bg-white/10" />
              </div>
            </div>
          ))}
        </div>
      ) : activities.length === 0 ? (
        <p className="text-sm text-slate-500">No activity yet. Upload a document to get started.</p>
      ) : (
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const Icon = iconMap[activity.type] || MapPin;
            return (
              <motion.div
                key={activity.id || index}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.04 }}
                className="flex gap-4 rounded-3xl border border-white/10 bg-slate-950/70 p-4"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-3xl bg-cyan-400/10 text-cyan-300">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-white">{activity.title}</p>
                  <p className="mt-1 text-sm text-slate-400">{activity.description}</p>
                </div>
                <div className="text-right text-xs text-slate-500">
                  {new Date(activity.timestamp).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
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
