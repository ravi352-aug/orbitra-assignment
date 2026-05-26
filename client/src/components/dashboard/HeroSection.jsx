import { motion } from "framer-motion";
import { ArrowRight, Bot, Sparkles, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = ({ user }) => {
  const navigate = useNavigate();
  const firstName = user?.name?.split(" ")[0] || "Traveler";

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/20 backdrop-blur-2xl sm:p-8"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(34,211,238,0.22),transparent_30%),radial-gradient(circle_at_80%_30%,rgba(168,85,247,0.24),transparent_34%)]" />

      <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">
            <Sparkles className="h-3.5 w-3.5" />
            AI powered travel planning
          </div>

          <h2 className="max-w-3xl text-3xl font-black tracking-tight text-white sm:text-4xl">
            Turn booking documents into clean itineraries, {firstName}.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
            Upload flight tickets, hotel reservations, and travel documents.
            VoyageAI extracts the details and prepares organized plans for your
            next trip.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate("/upload")}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-indigo-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:scale-[1.02]"
            >
              <Upload className="h-4 w-4" />
              Upload document
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => navigate("/itineraries")}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-5 py-3 text-sm font-bold text-slate-200 transition hover:bg-white/15"
            >
              View itineraries
            </button>
          </div>
        </div>

        <div className="hidden justify-end lg:flex">
          <div className="relative h-56 w-72 rounded-[2rem] border border-white/10 bg-slate-950/40 p-5 shadow-2xl shadow-cyan-950/40">
            <div className="absolute -right-4 -top-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-400 to-indigo-500 shadow-lg shadow-cyan-400/20">
              <Bot className="h-8 w-8 text-white" />
            </div>
            <div className="space-y-3">
              {["Flight details detected", "Hotel dates extracted", "Daily plan generated"].map(
                (item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.18 + index * 0.08 }}
                    className="rounded-2xl border border-white/10 bg-white/10 p-3"
                  >
                    <div className="mb-2 h-2 w-20 rounded-full bg-cyan-300/60" />
                    <p className="text-sm font-semibold text-white">{item}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      AI confidence {94 + index}%
                    </p>
                  </motion.div>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default HeroSection;
