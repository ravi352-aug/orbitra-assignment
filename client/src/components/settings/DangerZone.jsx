import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { AlertTriangle, Trash2 } from "lucide-react";

const DangerZone = ({
  onDelete,
  onLogoutDevices,
  loggingOutDevices = false,
  deleting = false,
}) => {
  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-sm font-bold text-white">Danger Zone</h3>
        <p className="text-xs text-slate-400 mt-1">
          Be careful with irreversible actions.
        </p>
      </div>

      <div className="glass-card rounded-3xl border border-red-400/20 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-2xl bg-red-500/10 ring-1 ring-red-400/20 flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 text-red-300" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-200">Control your account</p>
            <p className="text-xs text-slate-300 mt-1">
              Logout sessions and delete your account permanently.
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-col sm:flex-row gap-2">
          <motion.button
            type="button"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => {
              if (!confirm("Logout all devices?")) return;
              onLogoutDevices?.();
            }}
            disabled={loggingOutDevices}
            className="rounded-2xl bg-white/[0.06] px-4 py-3 text-sm font-bold text-white ring-1 ring-white/10 hover:bg-white/[0.09] disabled:opacity-60"
          >
            {loggingOutDevices ? "Processing..." : "Logout all devices"}
          </motion.button>

          <motion.button
            type="button"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => {
              if (!confirm("Delete your account permanently? This cannot be undone.")) return;
              onDelete?.();
            }}
            disabled={deleting}
            className="rounded-2xl bg-gradient-to-r from-red-500 to-rose-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-red-500/15 disabled:opacity-60 flex items-center gap-2 justify-center"
          >
            <Trash2 className="h-4 w-4" />
            {deleting ? "Deleting..." : "Delete account"}
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default DangerZone;

