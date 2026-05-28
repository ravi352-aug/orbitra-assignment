import { Link } from "react-router-dom";
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
      className="flex flex-col h-full rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 shadow-xl backdrop-blur-xl"
    >
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight">Recent uploads</h3>
          <p className="text-xs text-slate-500">Last {uploads.length} documents processed</p>
        </div>
        <span className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-bold text-slate-400">
          {uploads.length}
        </span>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200">
          {error}
        </div>
      ) : loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((item) => (
            <SkeletonRow key={item} />
          ))}
        </div>
      ) : uploads.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="flex-1 overflow-hidden overflow-x-hidden">
            <ul className="space-y-3 max-h-[480px] overflow-y-auto pr-2 custom-scrollbar [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-cyan-500/30 transition-all">
            {uploads.map((item, index) => {
              const fileKind = getFileKind(item);
              const Icon = fileKind === "pdf" ? FileText : Image;
              const uploadId = item._id || item.id;
              const viewItinerary = item.itineraryId;
              const rawPath = item.filepath ? item.filepath.replace(/\\/g, "/") : "";
              const fileUrl = rawPath.includes("/uploads")
                ? rawPath.slice(rawPath.indexOf("/uploads"))
                : item.filename
                ? `/uploads/${item.filename}`
                : null;

              return (
                <motion.li
                  key={uploadId || `${item.filename}-${index}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex flex-col gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-4 transition-all hover:bg-white/[0.04] hover:border-white/10 group"
                >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                      fileKind === "pdf"
                        ? "border-red-400/20 bg-red-400/10 text-red-300"
                        : "border-sky-400/20 bg-sky-400/10 text-sky-300"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-100 group-hover:text-white transition-colors">
                      {item.filename || item.name || "Travel document"}
                    </p>
                    <div className="mt-0.5 flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                      <Clock className="h-3 w-3" />
                      {formatTime(item.createdAt || item.uploadedAt)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <StatusBadge status={item.status} />
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-white/5">
                  {viewItinerary ? (
                    <Link
                      to={`/itinerary/${viewItinerary}`}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-[11px] font-bold text-emerald-300 transition hover:bg-emerald-400/20"
                    >
                      View Itinerary
                    </Link>
                  ) : onGenerate ? (
                    <button
                      type="button"
                      onClick={() => onGenerate(item)}
                      disabled={generatingUploadId === uploadId}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-violet-400/20 bg-violet-400/10 px-3 py-2 text-[11px] font-bold text-violet-300 transition hover:bg-violet-400/15 disabled:opacity-60"
                    >
                      {generatingUploadId === uploadId ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Sparkles className="h-3.5 w-3.5" />
                      )}
                      Generate
                    </button>
                  ) : null}
                  {fileUrl ? (
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-bold text-slate-300 transition hover:bg-white/10"
                    >
                      View File
                    </a>
                  ) : null}
                </div>
              </motion.li>
            );
          })}
        </ul>
        </div>
        </>
      )}
    </motion.section>
  );
};

export default RecentUploads;
