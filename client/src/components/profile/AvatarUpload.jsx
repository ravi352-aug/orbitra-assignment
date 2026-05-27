import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Upload } from "lucide-react";

const AvatarUpload = ({
  currentAvatar,
  onUpload,
  disabled = false,
  loading = false,
  className = "",
}) => {
  const inputRef = useRef(null);
  const [localError, setLocalError] = useState("");

  const triggerPick = () => {
    if (disabled || loading) return;
    inputRef.current?.click();
  };

  const onFileChange = async (e) => {
    setLocalError("");
    const file = e.target.files?.[0];

    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setLocalError("Please select an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setLocalError("Max avatar size is 5MB.");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    await onUpload(formData, file);

    // allow re-uploading the same file
    e.target.value = "";
  };

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
        className="relative"
      >
        <div className="h-24 w-24 rounded-3xl overflow-hidden ring-1 ring-white/10 bg-white/[0.04]">
          {currentAvatar ? (
            <img
              src={currentAvatar}
              alt="User avatar"
              className="h-full w-full object-cover"
              draggable={false}
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-2xl">✈️</div>
          )}
        </div>
      </motion.div>

      <div className="flex-1 space-y-2">
        <p className="text-sm font-semibold text-white">Avatar</p>
        <p className="text-xs text-slate-400">PNG/JPG up to 5MB. Updates your profile instantly.</p>

        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onFileChange}
            disabled={disabled || loading}
          />

          <button
            type="button"
            onClick={triggerPick}
            disabled={disabled || loading}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/[0.06] px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-white/10 hover:bg-white/[0.09] disabled:opacity-60"
          >
            <Upload className="h-4 w-4" />
            {loading ? "Uploading..." : "Upload new"}
          </button>

          {localError ? (
            <p className="text-xs text-red-300">{localError}</p>
          ) : (
            <p className="text-xs text-slate-500">Recommended: square image</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AvatarUpload;

