import { motion } from "framer-motion";
import { Cpu, FileText, Map, Share2 } from "lucide-react";

const statItems = [
  { key: "totalUploads", label: "Total uploads", icon: FileText, color: "from-cyan-400/20 to-indigo-500/5" },
  { key: "totalItineraries", label: "Total itineraries", icon: Map, color: "from-violet-500/20 to-indigo-500/5" },
  { key: "sharedTrips", label: "Shared trips", icon: Share2, color: "from-teal-500/20 to-cyan-500/5" },
  { key: "aiProcessed", label: "AI processed documents", icon: Cpu, color: "from-fuchsia-500/20 to-violet-500/5" },
];

const ProfileStats = ({ stats }) => {
  const safeStats = stats || {};

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {statItems.map((s, idx) => {
        const Icon = s.icon;
        const value = safeStats[s.key] ?? 0;

        return (
          <motion.div
            key={s.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.06, duration: 0.35 }}
            className="glass-card rounded-3xl p-5 border border-white/10 hover:bg-white/[0.06] transition-all"
          >
            <div className="flex items-center gap-3">
              <div className={`h-11 w-11 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center ring-1 ring-white/10`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-lg font-extrabold text-white leading-none">{value}</p>
                <p className="mt-2 text-xs text-slate-300 font-semibold">{s.label}</p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </section>
  );
};

export default ProfileStats;

