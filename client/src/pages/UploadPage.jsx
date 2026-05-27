import { useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import UploadCard from "../components/upload/UploadCard";
import RecentUploads from "../components/upload/RecentUploads";

/* ─── Upload instructions ──────────────────────────────── */
const INSTRUCTIONS = [
  {
    step: "01",
    title: "Upload Your Document",
    desc: "Drag & drop or select a flight ticket, hotel booking, or travel document (PDF/JPG/PNG).",
    color: "from-teal-500/20 to-teal-600/5",
    border: "border-teal-500/20",
    icon: (
      <svg className="w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    ),
  },
  {
    step: "02",
    title: "AI Extraction",
    desc: "Our AI reads your document and extracts flights, hotels, dates, and booking references.",
    color: "from-sky-500/20 to-sky-600/5",
    border: "border-sky-500/20",
    icon: (
      <svg className="w-5 h-5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    step: "03",
    title: "Smart Itinerary",
    desc: "Get a beautiful, organized day-by-day travel itinerary generated automatically.",
    color: "from-violet-500/20 to-violet-600/5",
    border: "border-violet-500/20",
    icon: (
      <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
  },
];

/* ─── Stat card data ───────────────────────────────────── */
const STATS = [
  { label: "Documents Processed", value: "2.4k", icon: "📄", trend: "+12%" },
  { label: "Itineraries Created", value: "1.8k", icon: "🗺️", trend: "+8%" },
  { label: "Countries Covered", value: "64", icon: "✈️", trend: "+3" },
];

/* ═══════════════════════════════════════════════════════ */
const UploadPage = () => {
  const [recentUploads, setRecentUploads] = useState([]);
  const [uploadId, setUploadId] = useState(null);

  const handleUploadSuccess = (result, file) => {
    const upload = result?.upload || result;
    const id = upload?._id || upload?.id || Date.now();
    setUploadId(id);
    setRecentUploads((prev) => [
      {
        id,
        name: upload?.filename || file.name,
        size: upload?.size || file.size,
        type: upload?.mimetype || file.type,
        uploadedAt: upload?.createdAt || new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* ── Stats Row ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3"
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.04] border border-white/[0.07] backdrop-blur-sm hover:bg-white/[0.06] transition-all duration-300"
            >
              <span className="text-2xl">{stat.icon}</span>
              <div>
                <p className="text-lg font-bold text-white leading-none">{stat.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
              </div>
              <span className="ml-auto text-xs text-teal-400 font-semibold">{stat.trend}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Main Upload + Recent ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Upload Card */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="lg:col-span-3 p-5 rounded-3xl bg-white/[0.04] border border-white/[0.07] backdrop-blur-sm"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 border border-teal-500/30 flex items-center justify-center">
                <svg className="w-4 h-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">Upload Travel Document</h2>
                <p className="text-xs text-slate-500">PDF, JPG, or PNG — up to 10 MB</p>
              </div>
            </div>

            <UploadCard onUploadSuccess={handleUploadSuccess} />
            {uploadId ? (
              <div className="mt-4 rounded-2xl border border-teal-500/20 bg-teal-500/5 p-4 text-sm text-teal-100">
                Upload completed successfully. Upload ID saved for AI generation.
              </div>
            ) : null}
          </motion.div>

          {/* Recent Uploads */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.4 }}
            className="lg:col-span-2 p-5 rounded-3xl bg-white/[0.04] border border-white/[0.07] backdrop-blur-sm"
          >
            <RecentUploads uploads={recentUploads} />
          </motion.div>
        </div>

        {/* ── How It Works ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="p-5 rounded-3xl bg-white/[0.04] border border-white/[0.07] backdrop-blur-sm"
        >
          <div className="flex items-center gap-2 mb-5">
            <h2 className="text-sm font-semibold text-white">How It Works</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/10">3 steps</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {INSTRUCTIONS.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.08 }}
                className={`relative p-4 rounded-2xl bg-gradient-to-br ${item.color} border ${item.border} overflow-hidden group hover:-translate-y-0.5 transition-transform duration-200`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-black/20 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="text-2xl font-black text-white/5 leading-none select-none">{item.step}</span>
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Supported formats ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38, duration: 0.4 }}
          className="p-5 rounded-3xl bg-white/[0.04] border border-white/[0.07] backdrop-blur-sm"
        >
          <h2 className="text-sm font-semibold text-white mb-4">Supported Document Types</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { emoji: "✈️", label: "Flight Tickets", exts: "PDF, JPG, PNG" },
              { emoji: "🏨", label: "Hotel Bookings", exts: "PDF, JPG" },
              { emoji: "🚂", label: "Train / Bus Tickets", exts: "PDF, PNG" },
              { emoji: "📋", label: "Travel Itineraries", exts: "PDF" },
            ].map((doc) => (
              <motion.div
                key={doc.label}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.42 }}
                className="flex flex-col items-center text-center p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/8 transition-all duration-200"
              >
                <span className="text-2xl mb-2">{doc.emoji}</span>
                <p className="text-xs font-semibold text-slate-200 leading-tight">{doc.label}</p>
                <p className="text-[10px] text-slate-600 mt-1">{doc.exts}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default UploadPage;

