import { motion } from "framer-motion";

const EmptySharedState = ({ onRefresh }) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 text-center">
      <h3 className="text-lg font-bold text-white">No shared trips yet</h3>
      <p className="text-sm text-slate-400 mt-2">Make a trip public to share it with friends and family.</p>
      <div className="mt-4">
        <button onClick={onRefresh} className="rounded-2xl bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white">Refresh</button>
      </div>
    </motion.div>
  );
};

export default EmptySharedState;
