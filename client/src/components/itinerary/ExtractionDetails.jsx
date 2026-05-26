import { AnimatePresence, motion } from "framer-motion";
import { FileSearch } from "lucide-react";
import { useState } from "react";

const ExtractionDetails = ({ extractedText }) => {
  const [open, setOpen] = useState(false);

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <span>
          <span className="flex items-center gap-2 text-base font-bold text-white">
            <FileSearch className="h-5 w-5 text-cyan-300" />
            Extracted document text
          </span>
          <span className="mt-1 block text-xs text-slate-500">
            Review the raw text used by AI for itinerary extraction.
          </span>
        </span>
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-bold text-slate-300">
          {open ? "Hide" : "Show"}
        </span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.pre
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-4 max-h-72 overflow-auto whitespace-pre-wrap rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-xs leading-6 text-slate-300"
          >
            {extractedText || "No text was extracted."}
          </motion.pre>
        ) : null}
      </AnimatePresence>
    </section>
  );
};

export default ExtractionDetails;
