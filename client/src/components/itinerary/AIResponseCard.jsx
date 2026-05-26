import { motion } from "framer-motion";
import { Bot, RefreshCw, Wand2 } from "lucide-react";

const processingSteps = [
  "Reading document text",
  "Finding travel entities",
  "Structuring trip details",
  "Preparing itinerary view",
];

const AIResponseCard = ({ loading, error, onRetry, rawResponse }) => {
  if (loading) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-5 backdrop-blur-xl"
      >
        <div className="flex items-center gap-3">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/15 text-cyan-200">
            <Bot className="h-6 w-6" />
            <span className="absolute inset-0 animate-ping rounded-2xl border border-cyan-300/30" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">AI is generating your itinerary</h3>
            <p className="text-xs text-cyan-100/70">Gemini is extracting travel details from your document.</p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {processingSteps.map((step, index) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15, repeat: Infinity, repeatDelay: 1.8 }}
              className="rounded-2xl border border-white/10 bg-white/10 p-3 text-sm font-semibold text-cyan-50"
            >
              {step}
            </motion.div>
          ))}
        </div>
      </motion.section>
    );
  }

  if (error) {
    return (
      <section className="rounded-3xl border border-red-400/20 bg-red-400/10 p-5">
        <h3 className="text-base font-bold text-red-100">AI generation failed</h3>
        <p className="mt-2 text-sm text-red-100/80">{error}</p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-red-400/15 px-4 py-2 text-sm font-bold text-red-100 transition hover:bg-red-400/20"
        >
          <RefreshCw className="h-4 w-4" />
          Retry generation
        </button>
      </section>
    );
  }

  if (!rawResponse) return null;

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl">
      <div className="mb-4 flex items-center gap-2">
        <Wand2 className="h-5 w-5 text-violet-300" />
        <h3 className="text-base font-bold text-white">AI response</h3>
      </div>
      <pre className="max-h-72 overflow-auto whitespace-pre-wrap rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-xs leading-6 text-slate-300">
        {rawResponse}
      </pre>
    </section>
  );
};

export default AIResponseCard;
