import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Bot, Sparkles } from "lucide-react";
import { itineraryService } from "../services/itineraryService";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import TravelSummary from "../components/itinerary/TravelSummary";
import DayTimeline from "../components/itinerary/DayTimeline";
import ShareTripCard from "../components/itinerary/ShareTripCard";
import ExtractionDetails from "../components/itinerary/ExtractionDetails";
import toast from "react-hot-toast";
import CopyLinkButton from "../components/shared/CopyLinkButton";

const ItineraryDetails = () => {
  const { id } = useParams();
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [errorType, setErrorType] = useState("");

  const loadItinerary = async () => {
    const requestId = id;
    setLoading(true);
    setError("");
    setErrorType("");

    try {
      console.log("Fetching itinerary:", id);
      const res = await itineraryService.getItinerary(id);
      console.log("Itinerary details response:", res);

      // Guard against out-of-order async responses.
      if (requestId !== id) return;

      // itineraryService.getItinerary returns the itinerary document directly.
      const data = res;

      if (!data?._id) {
        throw new Error("Itinerary not found");
      }

      setItinerary(data);

    } catch (err) {
      // Guard against out-of-order async responses.
      if (requestId !== id) return;

      const message = err.message || "Unable to fetch itinerary";
      const nextErrorType = /unauthorized|not authorized|token failed/i.test(message)
        ? "unauthorized"
        : /not found|404|Itinerary not found/i.test(message)
          ? "notfound"
          : "server";

      setError(message);
      setErrorType(nextErrorType);

      toast.error(message);
    } finally {
      // Guard against out-of-order async responses.
      if (requestId === id) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadItinerary();
  }, [id]);

  const fallbackItineraryText = itinerary
    ? `Day 1
- Review the extracted travel details and keep the uploaded document available.
- Confirm departure, arrival, booking references, and passenger details before travel.

Day 2
- Continue with the available trip plan for ${itinerary.destination || "your destination"}.
- Use the extracted document data on this page as the source of truth.`
    : "";
  const itineraryText = itinerary?.itinerary || fallbackItineraryText;

  const safeTitle = itinerary?.title || "Untitled trip";


  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-xl shadow-black/10">
            <div className="h-4 w-48 animate-pulse rounded bg-slate-700 mb-4" />
            <div className="space-y-3">
              <div className="h-4 w-full animate-pulse rounded bg-slate-700" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-slate-700" />
              <div className="h-4 w-11/12 animate-pulse rounded bg-slate-700" />
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    const heading =
      errorType === "unauthorized"
        ? "Unauthorized"
        : errorType === "notfound"
        ? "Itinerary not found"
        : "Unable to load itinerary";
    const subtitle =
      errorType === "unauthorized"
        ? "Your session has expired or you are not signed in. Please log in again."
        : errorType === "notfound"
        ? "This itinerary may not exist or you do not have access to it."
        : "A server error occurred while loading your itinerary. Please try again.";

    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="rounded-3xl border border-red-400/20 bg-red-400/10 p-6 text-center">
            <p className="text-lg font-bold text-white">{heading}</p>
            <p className="mt-2 text-sm text-red-100/80">{subtitle}</p>
            <p className="mt-2 text-sm text-red-100/80">{error}</p>
            <button
              type="button"
              onClick={loadItinerary}
              className="mt-5 rounded-2xl bg-gradient-to-r from-violet-500 to-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:brightness-110"
            >
              Retry
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!itinerary) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-center">
            <p className="text-lg font-bold text-white">Unable to load itinerary</p>
            <p className="mt-2 text-sm text-slate-400">
              It may have been removed, or your session might have expired.
            </p>
            <button
              type="button"
              onClick={loadItinerary}
              className="mt-5 rounded-2xl bg-white/[0.06] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
            >
              Retry
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-10">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <nav className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-widest">
              <span>Itineraries</span>
              <span>/</span>
              <span className="text-cyan-400">Details</span>
            </nav>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{safeTitle}</h2>

            {itinerary.fallback ? (
              <p className="mt-2 text-sm font-semibold text-amber-200">
                AI unavailable - showing a saved basic itinerary.
              </p>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            <CopyLinkButton shareId={itinerary.shareId} disabled={!itinerary.shareId} />
            <button
              onClick={async () => {
                try {
                  const res = await itineraryService.toggleShareTrip(itinerary._id);
                  setItinerary((current) => ({ ...current, isShared: res.isShared }));
                  toast.success('Share state updated');
                } catch (err) {
                  toast.error(err.message || 'Unable to toggle share');
                }
              }}
              className="rounded-2xl bg-white/[0.06] px-5 py-2.5 text-sm font-bold text-white ring-1 ring-white/10 hover:bg-white/[0.09] transition"
            >
              {itinerary.shareId ? 'Disable Sharing' : 'Make Public'}
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <TravelSummary details={{ ...itinerary }} />
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-violet-400" />
                <h3 className="text-lg font-bold text-white tracking-tight">Detailed Itinerary</h3>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-1 shadow-2xl">
                <DayTimeline itineraryText={itineraryText} />
              </div>
            </section>
            <ExtractionDetails extractedText={itinerary.extractedText || ''} />
          </div>
          
          <aside className="space-y-6">
            <ShareTripCard shareId={itinerary.shareId} />
            <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-6 backdrop-blur-xl">
              <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Bot className="h-4 w-4 text-cyan-400" />
                AI Processing Context
              </h4>
              <pre className="whitespace-pre-wrap text-[11px] leading-relaxed text-slate-400 max-h-96 overflow-auto custom-scrollbar">
                {itineraryText}
              </pre>
            </div>
          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ItineraryDetails;
