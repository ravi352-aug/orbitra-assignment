import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  Map,
  Plane,
  Settings,
  Share2,
  Sparkles,
  Upload,
  User,
  X,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { to: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { to: "/upload", label: "Upload Documents", Icon: Upload },
  { to: "/itineraries", label: "Itineraries", Icon: Map },
  { to: "/shared", label: "Shared Trips", Icon: Share2 },
  { to: "/profile", label: "Profile", Icon: User },
  { to: "/settings", label: "Settings", Icon: Settings },
];

const SidebarContent = ({ onClose }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userName = user?.name || "Traveler";

  return (
    <div className="flex h-full min-h-0 flex-col border-r border-white/10 bg-slate-950/70 shadow-2xl shadow-black/40 backdrop-blur-2xl overflow-y-auto">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-400 via-cyan-500 to-indigo-500 shadow-lg shadow-cyan-500/20">
            <Plane className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold tracking-tight text-white">
              VoyageAI
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-cyan-300/70">
              Travel Brain
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white lg:hidden"
          aria-label="Close sidebar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="px-5 py-5">
        <div className="rounded-2xl border border-cyan-400/15 bg-cyan-400/10 p-4">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/15 text-cyan-300">
            <Sparkles className="h-4 w-4" />
          </div>
          <p className="text-sm font-semibold text-white">
            AI itinerary generator
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-400">
            Upload bookings, tickets, and reservations to create structured trip
            plans.
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {navItems.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition ${
                isActive
                  ? "border border-cyan-400/20 bg-white/10 text-white shadow-lg shadow-cyan-500/10"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
                    isActive
                      ? "bg-gradient-to-br from-cyan-400 to-indigo-500 text-white"
                      : "bg-white/5 text-slate-400 group-hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span className="flex-1">{label}</span>
                {isActive ? (
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                ) : null}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 px-5 py-4">
        <div className="flex items-center gap-3 rounded-3xl bg-white/5 p-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-3xl bg-cyan-400/10 text-cyan-300 text-sm font-bold">
            {userName
              .split(" ")
              .map((part) => part[0])
              .filter(Boolean)
              .slice(0, 2)
              .join("")}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{userName}</p>
            <p className="truncate text-xs text-slate-500">View profile</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            navigate("/profile");
            onClose?.();
          }}
          className="mt-3 flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
        >
          Go to profile
        </button>
      </div>
    </div>
  );
};

const Sidebar = ({ open, onClose }) => {
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 lg:block">
        <SidebarContent />
      </aside>

      <AnimatePresence>
        {open ? (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              aria-label="Close sidebar overlay"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
              className="fixed inset-y-0 left-0 z-50 w-72 lg:hidden overflow-y-auto"
            >
              <SidebarContent onClose={onClose} />
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
