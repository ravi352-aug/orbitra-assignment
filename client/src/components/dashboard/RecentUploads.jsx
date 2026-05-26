import { motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  Image,
  Loader2,
  Sparkles,
  UploadCloud,
} from "lucide-react";

const formatTime = (date) => {
  if (!date) return "Unknown";
  const then = new Date(date).getTime();
  if (Number.isNaN(then)) return "Unknown";

  const minutes = Math.max(0, Math.floor((Date.now() - then) / 60000));
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

const getFileKind = (item) => {
  const type = item.mimetype || item.fileType || item.type || "";
  if (type.includes("pdf") || item.filename?.toLowerCase().endsWith(".pdf")) {
    return "pdf";
  }
  return "image";
};

const statusMap = {
  uploaded: {
    label: "Uploaded",
    Icon: CheckCircle2,
    className: "border-cyan-400/20 bg-cyan-400/10 text-cyan-300",
  },
  processed: {
    label: "Processed",
    Icon: CheckCircle2,
    className: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  },
  processing: {
    label: "Processing",
    Icon: Loader2,
    className: "border-amber-400/20 bg-amber-400/10 text-amber-300",
  },
  failed: {
    label: "Failed",
    Icon: AlertCircle,
    className: "border-red-400/20 bg-red-400/10 text-red-300",
  },
};

const StatusBadge = ({ status = "uploaded" }) => {
  const config = statusMap[status] || statusMap.uploaded;
  const Icon = config.Icon;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[11px] font-bold ${config.className}`}
    >
      <Icon className={`h-3 w-3 ${status === "processing" ? "animate-spin" : ""}`} />
      {config.label}
    </span>
  );
};

const SkeletonRow = () => (
  <div className="flex animate-pulse items-center gap-3 rounded-2xl p-3">
    <div className="h-11 w-11 rounded-2xl bg-white/10" />
    <div className="flex-1 space-y-2">
      <div className="h-3 w-36 rounded bg-white/10" />
      <div className="h-2.5 w-24 rounded bg-white/10" />
    </div>
    <div className="h-6 w-20 rounded-full bg-white/10" />
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-slate-500">
      <UploadCloud className="h-6 w-6" />
    </div>
    <p className="text-sm font-bold text-white">No uploads yet</p>
    <p className="mt-1 max-w-xs text-xs leading-5 text-slate-500">
      Upload a travel booking document and it will appear here.
    </p>
  </div>
);

const RecentUploads = ({
  uploads = [],
  loading = false,
  error,
  onGenerate,
  generatingUploadId,
}) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.18, type: "spring", stiffness: 240, damping: 24 }}
      className="h-full rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-xl shadow-black/10 backdrop-blur-xl"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-white">Recent uploads</h3>
          <p className="text-xs text-slate-500">Latest travel documents</p>
        </div>
        <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-xs font-bold text-cyan-300">
          {uploads.length}
        </span>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200">
          {error}
        </div>
      ) : loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map((item) => (
            <SkeletonRow key={item} />
          ))}
        </div>
      ) : uploads.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="space-y-2">
          {uploads.map((item, index) => {
            const fileKind = getFileKind(item);
            const Icon = fileKind === "pdf" ? FileText : Image;

            return (
              <motion.li
                key={item._id || item.id || `${item.filename}-${index}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.04 }}
                className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.04] p-3 transition hover:bg-white/[0.08]"
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${
                    fileKind === "pdf"
                      ? "border-red-400/20 bg-red-400/10 text-red-300"
                      : "border-sky-400/20 bg-sky-400/10 text-sky-300"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-slate-100">
                    {item.filename || item.name || "Travel document"}
                  </p>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                    <Clock className="h-3 w-3" />
                    {formatTime(item.createdAt || item.uploadedAt)}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {onGenerate ? (
                    <button
                      type="button"
                      onClick={() => onGenerate(item)}
                      disabled={generatingUploadId === item._id}
                      className="hidden items-center gap-1.5 rounded-xl border border-violet-400/20 bg-violet-400/10 px-3 py-2 text-xs font-bold text-violet-200 transition hover:bg-violet-400/15 disabled:cursor-not-allowed disabled:opacity-60 sm:inline-flex"
                    >
                      {generatingUploadId === item._id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Sparkles className="h-3.5 w-3.5" />
                      )}
                      Generate
                    </button>
                  ) : null}
                  <StatusBadge status={item.status} />
                </div>
              </motion.li>
            );
          })}
        </ul>
      )}
    </motion.section>
  );
};

export default RecentUploads;
