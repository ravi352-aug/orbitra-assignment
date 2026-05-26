import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Search,
  Settings,
  User,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

const getInitials = (name = "Traveler") =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const Navbar = ({ onMenuClick, user }) => {
  const { logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
  };

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/55 px-4 py-3 backdrop-blur-2xl sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-slate-500">Dashboard</p>
          <h1 className="truncate text-lg font-bold text-white">
            Welcome back, {user?.name?.split(" ")[0] || "Traveler"}
          </h1>
        </div>

        <div className="hidden w-full max-w-xs items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 md:flex">
          <Search className="h-4 w-4 text-slate-500" />
          <input
            type="search"
            placeholder="Search documents or trips"
            className="w-full bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-600"
          />
        </div>

        <button
          type="button"
          className="relative rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-cyan-300 ring-2 ring-slate-950" />
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen((current) => !current)}
            className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 py-1.5 pl-1.5 pr-3 transition hover:bg-white/10"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-500 text-xs font-bold text-white">
              {getInitials(user?.name)}
            </span>
            <span className="hidden max-w-28 truncate text-sm font-semibold text-slate-200 sm:block">
              {user?.name || "Traveler"}
            </span>
            <ChevronDown
              className={`hidden h-4 w-4 text-slate-500 transition sm:block ${
                profileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <AnimatePresence>
            {profileOpen ? (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.16 }}
                className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/95 shadow-2xl shadow-black/40 backdrop-blur-xl"
              >
                <div className="border-b border-white/10 px-4 py-3">
                  <p className="truncate text-sm font-semibold text-white">
                    {user?.name || "Traveler"}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {user?.email || "Signed in"}
                  </p>
                </div>
                <div className="p-1.5">
                  <button className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-400 transition hover:bg-white/10 hover:text-white">
                    <User className="h-4 w-4" />
                    Profile
                  </button>
                  <button className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-400 transition hover:bg-white/10 hover:text-white">
                    <Settings className="h-4 w-4" />
                    Settings
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-300 transition hover:bg-red-500/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
