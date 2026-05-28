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
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";

const getInitials = (name = "Traveler") =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const Navbar = ({ onMenuClick, user }) => {
  const { logout } = useAuth();
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const profileRef = useRef(null);
  const notificationsRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    toast.success("Logged out successfully");
  };

  useEffect(() => {
    if (!profileOpen && !notificationsOpen) return;

    const handleClickOutside = (event) => {
      if (
        profileOpen &&
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }

      if (
        notificationsOpen &&
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setNotificationsOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setProfileOpen(false);
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [profileOpen, notificationsOpen]);

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

        <div className="relative" ref={notificationsRef}>
          <button
            type="button"
            onClick={() => setNotificationsOpen((current) => !current)}
            className="relative rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 ? (
              <span className="absolute right-1 top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-cyan-300 text-[10px] text-slate-950">
                {unreadCount}
              </span>
            ) : (
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-cyan-300 ring-2 ring-slate-950" />
            )}
          </button>

          <AnimatePresence>
            {notificationsOpen ? (
              <motion.div
                initial={{ opacity: 0, y: -12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.96 }}
                transition={{ duration: 0.16 }}
                className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-3xl border border-white/10 bg-slate-950/95 shadow-2xl shadow-black/40 backdrop-blur-xl"
              >
                <div className="flex items-center justify-between gap-2 border-b border-white/10 px-4 py-3">
                  <div>
                    <p className="font-semibold text-white">Notifications</p>
                    <p className="text-xs text-slate-500">Recent system alerts.</p>
                  </div>
                  <button
                    type="button"
                    onClick={markAllRead}
                    className="rounded-2xl bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/10"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-5 text-sm text-slate-500">No notifications yet.</div>
                  ) : (
                    notifications.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => markRead(item.id)}
                        className={`flex w-full items-start gap-3 border-b border-white/10 px-4 py-4 text-left transition hover:bg-white/5 ${item.read ? "bg-slate-950" : "bg-white/5"}`}
                      >
                        <span className={`mt-1 h-2.5 w-2.5 rounded-full ${item.read ? "bg-slate-600" : "bg-cyan-400"}`}></span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white">{item.title}</p>
                          <p className="mt-1 text-xs text-slate-500">{item.description}</p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <div className="relative" ref={profileRef}>
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={profileOpen}
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
                    <button
                    type="button"
                    onClick={() => {
                      navigate("/profile");
                      setProfileOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-400 transition hover:bg-white/10 hover:text-white"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      navigate("/settings");
                      setProfileOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-400 transition hover:bg-white/10 hover:text-white"
                  >
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
