import toast from "react-hot-toast";

const ShareButton = ({ shareId }) => {
  const onShare = async () => {
    if (!shareId) return;
    const url = `${window.location.origin}/share/${shareId}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Shared Trip', url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard');
      }
    } catch (err) {
      toast.error('Unable to share');
    }
  };

  return (
    <button onClick={onShare} className="rounded-2xl bg-white/[0.04] px-3 py-2 text-sm text-slate-200 hover:bg-white/[0.06]">
      Share
    </button>
  );
};

export default ShareButton;
