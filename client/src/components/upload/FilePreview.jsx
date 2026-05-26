import { motion } from "framer-motion";
import { FileText, Image, X } from "lucide-react";
import { useEffect } from "react";

const fmt = (b) => {
  if (b < 1024) return `${b} B`;
  if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1048576).toFixed(1)} MB`;
};

const FilePreview = ({ file, onRemove }) => {
  const isPdf = file.type === "application/pdf";
  const isImg = file.type.startsWith("image/");
  const previewUrl = isImg ? URL.createObjectURL(file) : null;
  const ext = file.name.split(".").pop()?.toUpperCase();

  // Cleanup object URL on unmount or file change
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] mt-4 group"
    >
      {/* Thumbnail */}
      <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/20 flex items-center justify-center">
        {isImg && previewUrl ? (
          <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
        ) : isPdf ? (
          <FileText className="w-5 h-5 text-indigo-400" />
        ) : (
          <Image className="w-5 h-5 text-violet-400" />
        )}
      </div>

      {/* Meta */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate">{file.name}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/20 font-medium">{ext}</span>
          <span className="text-[10px] text-slate-500">{fmt(file.size)}</span>
        </div>
      </div>

      {/* Remove */}
      <button
        onClick={onRemove}
        className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
};

export default FilePreview;
