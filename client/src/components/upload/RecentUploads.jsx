import { motion, AnimatePresence } from "framer-motion";

const formatSize = (bytes) => {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatTime = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const getIcon = (type) => {
  if (type === "application/pdf") {
    return (
      <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
    );
  }
  return (
    <svg className="w-5 h-5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <rect x="3" y="3" width="18" height="18" rx="3" strokeWidth={1.5} />
      <circle cx="8.5" cy="8.5" r="1.5" strokeWidth={1.5} />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 15l-5-5L5 21" />
    </svg>
  );
};

const EmptyState = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex flex-col items-center justify-center py-10 text-center"
  >
    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
      <svg className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    </div>
    <p className="text-sm font-medium text-slate-400">No uploads yet</p>
    <p className="text-xs text-slate-600 mt-1">Your uploaded documents will appear here</p>
  </motion.div>
);

const RecentUploads = ({ uploads }) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-white">Recent Uploads</h2>
          {uploads.length > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-400 font-medium">
              {uploads.length}
            </span>
          )}
        </div>
        {uploads.length > 0 && (
          <span className="text-xs text-slate-500">This session</span>
        )}
      </div>

      <AnimatePresence>
        {uploads.length === 0 ? (
          <EmptyState />
        ) : (
          <ul className="space-y-2">
            {uploads.map((item, i) => (
              <motion.li
                key={item.id || i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/8 hover:border-white/10 transition-all duration-200 group"
              >
                {/* Icon */}
                <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors">
                  {getIcon(item.type)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate">{item.name}</p>
                  <p className="text-xs text-slate-500">{formatSize(item.size)}</p>
                </div>

                {/* Meta */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-slate-500">{formatTime(item.uploadedAt)}</span>
                  <div className="w-5 h-5 rounded-full bg-teal-500/15 flex items-center justify-center">
                    <svg className="w-3 h-3 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RecentUploads;
