import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { useEffect } from "react";

const gradients = [
  "from-cyan-400/20 to-indigo-500/10 border-cyan-400/20",
  "from-violet-400/20 to-fuchsia-500/10 border-violet-400/20",
  "from-emerald-400/20 to-cyan-500/10 border-emerald-400/20",
  "from-amber-400/20 to-orange-500/10 border-amber-400/20",
];

const AnimatedNumber = ({ value }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) =>
    Math.round(latest).toLocaleString(),
  );

  useEffect(() => {
    const controls = animate(count, Number(value) || 0, {
      duration: 0.9,
      ease: "easeOut",
    });
    return controls.stop;
  }, [count, value]);

  return <motion.span>{rounded}</motion.span>;
};

const StatsCard = ({
  label,
  value = 0,
  icon: Icon,
  trend,
  trendUp = true,
  index = 0,
  loading = false,
}) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, type: "spring", stiffness: 260, damping: 24 }}
      whileHover={{ y: -3 }}
      className={`rounded-2xl border bg-gradient-to-br p-5 shadow-xl shadow-black/10 backdrop-blur-xl ${gradients[index % gradients.length]}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/10">
          {Icon ? <Icon className="h-5 w-5" /> : null}
        </div>

        {trend ? (
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[11px] font-bold ${
              trendUp
                ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                : "border-red-400/20 bg-red-400/10 text-red-300"
            }`}
          >
            {trendUp ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {trend}
          </span>
        ) : null}
      </div>

      <div className="mt-5">
        {loading ? (
          <div className="space-y-3">
            <div className="h-8 w-20 animate-pulse rounded-lg bg-white/10" />
            <div className="h-3 w-28 animate-pulse rounded bg-white/10" />
          </div>
        ) : (
          <>
            <p className="text-3xl font-black tracking-tight text-white">
              <AnimatedNumber value={value} />
            </p>
            <p className="mt-1 text-sm font-medium text-slate-400">{label}</p>
          </>
        )}
      </div>
    </motion.article>
  );
};

export default StatsCard;
