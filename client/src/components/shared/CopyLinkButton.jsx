import { useState } from "react";
import toast from "react-hot-toast";

const CopyLinkButton = ({ shareId, disabled }) => {
  const [loading, setLoading] = useState(false);

  const handleCopy = async () => {
    if (!shareId) return;
    const url = `${window.location.origin}/share/${shareId}`;
    try {
      setLoading(true);
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const ta = document.createElement('textarea');
        ta.value = url;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
      toast.success('Share link copied to clipboard');
    } catch (err) {
      toast.error('Unable to copy link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleCopy} disabled={disabled || loading} className="rounded-2xl bg-white/[0.04] px-3 py-2 text-sm text-slate-200 hover:bg-white/[0.06]">
      Copy Link
    </button>
  );
};

export default CopyLinkButton;
