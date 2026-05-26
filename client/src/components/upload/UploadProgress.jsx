import { motion } from "framer-motion";

const UploadProgress = ({ progress, fileName }) => {
  const done = progress === 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="mt-4 p-4 rounded-2xl bg-white/[0.04] border border-white/[0.07]"
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium text-slate-300 truncate max-w-[200px]">{fileName}</p>
        <span className={`text-xs font-bold ml-2 shrink-0 ${done ? "text-emerald-400" : "text-indigo-400"}`}>
          {done ? "✓ Done" : `${progress}%`}
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-white/[0.07] overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: done ? "linear-gradient(90deg,#10b981,#06b6d4)" : "linear-gradient(90deg,#6366f1,#d946ef)" }}
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: "easeOut", duration: 0.3 }}
        />
      </div>
      {!done && <p className="text-[10px] text-slate-600 mt-1.5">Processing your document…</p>}
    </motion.div>
  );
};

export default UploadProgress;
