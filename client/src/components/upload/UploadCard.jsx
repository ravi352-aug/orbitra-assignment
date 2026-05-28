import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import FilePreview from "./FilePreview";
import UploadProgress from "./UploadProgress";
import { uploadFile } from "../../services/uploadService";

const ACCEPTED = {
  "application/pdf": [".pdf"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
};

const UploadCard = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadDone, setUploadDone] = useState(false);

  const onDrop = useCallback((accepted, rejected) => {
    if (rejected.length > 0) {
      toast.error("Only PDF, JPG, and PNG files are allowed.");
      return;
    }
    setFile(accepted[0]);
    setUploadDone(false);
    setProgress(0);
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: ACCEPTED,
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setProgress(0);

    try {
      const result = await uploadFile(file, (pct) => setProgress(pct));
      setUploadDone(true);
      toast.success("Document uploaded successfully!");
      if (onUploadSuccess) onUploadSuccess(result, file);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Upload failed. Please try again.";
      toast.error(msg);
      setUploading(false);
      setProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setProgress(0);
    setUploadDone(false);
  };

  const borderColor = isDragReject
    ? "border-red-500/60"
    : isDragActive
    ? "border-teal-400/80"
    : file
    ? "border-teal-500/40"
    : "border-white/10 hover:border-teal-500/40";

  return (
    <div className="w-full">
      {/* Drop Zone */}
      <AnimatePresence mode="wait">
        {!file ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            {...getRootProps()}
            className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 p-6 sm:p-10 text-center group ${borderColor} bg-white/[0.02] hover:bg-white/[0.04] hover:shadow-[0_0_30px_rgba(20,184,166,0.05)]`}

          >
            <input {...getInputProps()} />

            {/* Animated background glow on drag */}
            <AnimatePresence>
              {isDragActive && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 rounded-2xl bg-gradient-to-br from-teal-500/10 to-cyan-500/10 pointer-events-none"
                />
              )}
            </AnimatePresence>

            {/* Upload Icon */}
            <motion.div
              animate={isDragActive ? { scale: 1.08, y: -3 } : { scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="mx-auto mb-5 w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500/10 to-cyan-500/10 border border-teal-500/20 flex items-center justify-center group-hover:scale-105 transition-all duration-300"
            >

              <svg className="w-8 h-8 text-teal-400/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </motion.div>

            <h3 className="text-lg font-bold text-white mb-1 tracking-tight">
              {isDragActive ? "Drop to upload" : "Drop travel documents here"}
            </h3>
            <p className="text-sm text-slate-400 mb-4">
              or{" "}
              <span className="text-teal-400 font-medium underline underline-offset-2 decoration-dotted">
                browse to choose
              </span>
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              {["PDF", "JPG", "PNG"].map((ext) => (
                <span key={ext} className="text-[10px] uppercase tracking-wider px-3 py-1 rounded-md bg-white/5 border border-white/10 text-slate-400 font-bold">
                  {ext}
                </span>
              ))}
              <span className="text-[10px] uppercase tracking-wider px-3 py-1 rounded-md bg-white/5 border border-white/10 text-slate-500 font-bold">
                Max 10 MB
              </span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
          >
            <FilePreview file={file} onRemove={handleReset} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress */}
      <AnimatePresence>
        {(uploading || uploadDone) && (
          <UploadProgress progress={progress} fileName={file?.name} />
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <AnimatePresence>
        {file && !uploadDone && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="flex gap-3 mt-4"
          >
            <button
              onClick={handleReset}
              disabled={uploading}
              className="flex-1 py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm font-medium hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
            >
              Clear
            </button>
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="flex-[2] py-3 px-6 rounded-xl text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 relative overflow-hidden group"
              style={{
                background: uploading
                  ? "rgba(20,184,166,0.3)"
                  : "linear-gradient(135deg, #0d9488, #0891b2)",
              }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {uploading ? (
                  <>
                    <motion.svg
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </motion.svg>
                    Uploading...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    Upload Document
                  </>
                )}
              </span>
              {!uploading && (
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300" />
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success State */}
      <AnimatePresence>
        {uploadDone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mt-4 flex items-center justify-between p-4 rounded-2xl bg-teal-500/10 border border-teal-500/30"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm font-medium text-teal-300">Document uploaded successfully!</span>
            </div>
            <button
              onClick={handleReset}
              className="text-xs text-teal-400 hover:text-teal-300 font-medium transition-colors"
            >
              Upload another
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UploadCard;
