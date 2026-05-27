import { motion } from "framer-motion";

const ThemeCard = ({ selected, title, description, onClick }) => {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={
        selected
          ? "rounded-3xl border border-cyan-300/30 bg-gradient-to-br from-cyan-400/15 to-indigo-500/5 p-5 text-left ring-1 ring-white/10"
          : "rounded-3xl border border-white/10 bg-white/[0.04] p-5 text-left ring-1 ring-white/10 hover:bg-white/[0.06]"
      }
    >
      <p className="text-sm font-bold text-white">{title}</p>
      <p className="mt-2 text-xs text-slate-400">{description}</p>
    </motion.button>
  );
};

export default ThemeCard;

