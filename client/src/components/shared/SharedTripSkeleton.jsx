import { motion } from "framer-motion";

const SharedTripSkeleton = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
      <div className="h-5 w-3/4 bg-white/5 animate-pulse rounded-md" />
      <div className="mt-2 h-3 w-1/2 bg-white/5 animate-pulse rounded-md" />
      <div className="mt-4 flex gap-2">
        <div className="h-8 w-20 bg-white/5 animate-pulse rounded-xl" />
        <div className="h-8 w-28 bg-white/5 animate-pulse rounded-xl" />
      </div>
    </motion.div>
  );
};

export default SharedTripSkeleton;
