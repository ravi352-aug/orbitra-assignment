import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import UploadCard from "../components/upload/UploadCard";
import RecentUploads from "../components/upload/RecentUploads";

/* ─── Sidebar nav items ────────────────────────────────── */
const NAV_ITEMS = [
  {
    label: "Dashboard",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },
  {
    label: "Upload",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
        />
      </svg>
    ),
    active: true,
  },
  {
    label: "Itineraries",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
        />
      </svg>
    ),
  },
  {
    label: "History",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    label: "Settings",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  },
];

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
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
        />
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
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
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
          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
        />
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
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [recentUploads, setRecentUploads] = useState([]);

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || { name: "Traveler" };
    } catch {
      return { name: "Traveler" };
    }
  })();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleUploadSuccess = (result, file) => {
    setRecentUploads((prev) => [
      {
        id: result?.id || Date.now(),
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  /* ── Sidebar ── */
  const Sidebar = ({ mobile = false }) => (
    <aside
      className={
        mobile
          ? "fixed inset-0 z-50 flex"
          : "hidden lg:flex w-64 flex-col shrink-0"
      }
    >
      {mobile && (
        <div
          className="flex-1 bg-black/60 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div
        className={`flex flex-col h-full bg-[#0b1120]/95 border-r border-white/5 backdrop-blur-xl ${
          mobile ? "w-64" : "w-64"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-lg shadow-lg shadow-teal-500/30">
            ✈️
          </div>
          <div>
            <span className="text-sm font-bold text-white tracking-tight">TravelAI</span>
            <p className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">Itinerary Generator</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                item.active
                  ? "bg-teal-500/15 text-teal-300 border border-teal-500/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              <span className={item.active ? "text-teal-400" : ""}>{item.icon}</span>
              {item.label}
              {item.active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-400" />
              )}
            </button>
          ))}
        </nav>

        {/* User */}
        <div className="px-4 py-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-sm font-bold text-white shrink-0">
              {user.name?.[0]?.toUpperCase() || "T"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user.name}</p>
              <p className="text-[10px] text-slate-500 truncate">{user.email || "traveler@ai.com"}</p>
            </div>
            <button
              onClick={handleLogout}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg text-slate-500 hover:text-red-400"
              title="Logout"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-[#060d1a] overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Sidebar */}
      {sidebarOpen && <Sidebar mobile />}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top Navbar */}
        <header className="shrink-0 flex items-center justify-between px-4 sm:px-6 py-4 bg-[#060d1a]/80 backdrop-blur-xl border-b border-white/5 z-10">
          <div className="flex items-center gap-3">
            {/* Mobile menu toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div>
              <h1 className="text-base font-bold text-white leading-tight">Upload Documents</h1>
              <p className="text-xs text-slate-500 hidden sm:block">AI-powered travel document extraction</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Notification bell */}
            <button className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all relative">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-teal-400" />
            </button>

            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-sm font-bold text-white">
              {user.name?.[0]?.toUpperCase() || "T"}
            </div>
          </div>
        </header>

        {/* Scrollable body */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
          {/* Ambient background orbs */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden -z-0">
            <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-teal-600/8 blur-3xl" />
            <div className="absolute top-1/2 -left-40 w-80 h-80 rounded-full bg-cyan-600/6 blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full bg-violet-600/5 blur-3xl" />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto space-y-6">

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
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-white">Upload Travel Document</h2>
                    <p className="text-xs text-slate-500">PDF, JPG, or PNG — up to 10 MB</p>
                  </div>
                </div>

                <UploadCard onUploadSuccess={handleUploadSuccess} />
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
                ].map((doc, i) => (
                  <motion.div
                    key={doc.label}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.42 + i * 0.05 }}
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
        </main>
      </div>
    </div>
  );
};

export default UploadPage;
