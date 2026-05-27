import { motion } from "framer-motion";

const ProfileHero = ({
  name,
  email,
  joinDate,
  avatarUrl,
  onEdit,
  editable = true,
}) => {
  const initials = (name || "Traveler")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card rounded-3xl border border-white/10 p-6 sm:p-8 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(34,211,238,0.22),transparent_34%),radial-gradient(circle_at_80%_30%,rgba(168,85,247,0.24),transparent_38%)]" />
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 rounded-3xl overflow-hidden ring-1 ring-white/10 bg-white/[0.04]">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-2xl font-bold text-white">{initials}</div>
            )}
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">{name || "Traveler"}</h2>
            <p className="mt-1 text-sm text-slate-300 font-medium">{email || "—"}</p>
            <p className="mt-2 text-xs text-slate-400">
              Joined {joinDate ? new Date(joinDate).toLocaleDateString() : "—"}
            </p>
          </div>
        </div>

        {editable ? (
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center justify-center rounded-2xl bg-white/[0.06] px-5 py-3 text-sm font-bold text-white ring-1 ring-white/10 hover:bg-white/[0.09] transition-all"
          >
            Edit Profile
          </button>
        ) : null}
      </div>
    </motion.section>
  );
};

export default ProfileHero;

