import { useState } from "react";
import toast from "react-hot-toast";

const ShareTripCard = ({ shareId }) => {
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}/share/${shareId}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Share link copied to clipboard");
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      toast.error("Unable to copy link");
    }
  };

  if (!shareId) return null;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 flex items-center justify-between gap-3">
      <div>
        <p className="text-sm font-bold text-white">Share this itinerary</p>
        <p className="text-xs text-slate-400">Anyone with the link can view this trip</p>
      </div>
      <div className="flex items-center gap-2">
        <input readOnly value={shareUrl} className="hidden sm:inline-block bg-transparent border border-white/5 px-3 py-2 rounded-md text-xs text-slate-300 max-w-sm truncate" />
        <button onClick={handleCopy} className="px-3 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-blue-500 text-white text-sm font-semibold">
          {copied ? "Copied" : "Copy link"}
        </button>
      </div>
    </div>
  );
};

export default ShareTripCard;
