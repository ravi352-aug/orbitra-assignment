import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Cpu, FileText, Loader2, Map, RefreshCw, Share2, Sparkles, Upload } from "lucide-react";
import toast from "react-hot-toast";

import DashboardLayout from "../components/dashboard/DashboardLayout";
import HeroSection from "../components/dashboard/HeroSection";
import RecentItineraries from "../components/dashboard/RecentItineraries";
import RecentUploads from "../components/dashboard/RecentUploads";
import StatsCard from "../components/dashboard/StatsCard";
import DashboardAnalytics from "../components/analytics/DashboardAnalytics";
import ActivityTimeline from "../components/analytics/ActivityTimeline";
import AIResponseCard from "../components/itinerary/AIResponseCard";
import ExtractionDetails from "../components/itinerary/ExtractionDetails";
import ItineraryCard from "../components/itinerary/ItineraryCard";
import TravelSummary from "../components/itinerary/TravelSummary";
import UploadCard from "../components/upload/UploadCard";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";
import { dashboardService } from "../services/dashboardService";
import { itineraryService } from "../services/itineraryService";

const defaultStats = {
  totalUploads: 0,
  totalItineraries: 0,
  sharedTrips: 0,
  aiProcessed: 0,
};

const defaultAnalytics = {
  uploadsPerWeek: [],
  itinerariesPerMonth: [],
  transportDistribution: [],
  recentActivities: [],
};

const statConfig = [
  { key: "totalUploads", label: "Total uploads", Icon: Upload, trend: "+12%" },
  { key: "totalItineraries", label: "Itineraries", Icon: Map, trend: "+8%" },
  { key: "sharedTrips", label: "Shared trips", Icon: Share2 },
  { key: "aiProcessed", label: "AI processed", Icon: Cpu },
];

const normalizeStats = (payload) => {
  const stats = payload?.stats || payload || {};
  return {
    ...defaultStats,
    ...stats,
    totalItineraries:
      stats.totalItineraries ?? stats.generatedItineraries ?? defaultStats.totalItineraries,
  };
};

const normalizeUploads = (payload) =>
  Array.isArray(payload?.uploads)
    ? payload.uploads
    : Array.isArray(payload)
    ? payload
    : [];

const normalizeItineraries = (payload) =>
  Array.isArray(payload?.itineraries)
    ? payload.itineraries
    : Array.isArray(payload)
    ? payload
    : [];

const getUploadId = (upload) => upload?._id || upload?.id || upload?.uploadId;

const Dashboard = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();
  const [stats, setStats] = useState(defaultStats);
  const [uploads, setUploads] = useState([]);
  const [itineraries, setItineraries] = useState([]);
  const [analysis, setAnalysis] = useState(defaultAnalytics);
  const [latestUpload, setLatestUpload] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  const [generatingUploadId, setGeneratingUploadId] = useState("");
  const [generationError, setGenerationError] = useState("");
  const [loading, setLoading] = useState({
    stats: true,
    uploads: true,
    itineraries: true,
  });
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [analyticsError, setAnalyticsError] = useState("");
  const [errors, setErrors] = useState({
    stats: "",
    uploads: "",
    itineraries: "",
  });

  const loadDashboard = useCallback(async ({ silent = false } = {}) => {
    if (!silent) {
      setLoading({ stats: true, uploads: true, itineraries: true });
      setErrors({ stats: "", uploads: "", itineraries: "" });
      setAnalyticsLoading(true);
      setAnalyticsError("");
    }

    const [statsResult, uploadsResult, itinerariesResult, analyticsResult] =
      await Promise.allSettled([
        dashboardService.getStats(),
        dashboardService.getRecentUploads(),
        dashboardService.getRecentItineraries(),
        dashboardService.getAnalytics(),
      ]);

    if (statsResult.status === "fulfilled") {
      setStats(normalizeStats(statsResult.value));
      setErrors((current) => ({ ...current, stats: "" }));
    } else {
      setStats(defaultStats);
      setErrors((current) => ({
        ...current,
        stats: statsResult.reason?.message || "Unable to load dashboard stats",
      }));
    }

    if (uploadsResult.status === "fulfilled") {
      setUploads(normalizeUploads(uploadsResult.value));
      setErrors((current) => ({ ...current, uploads: "" }));
    } else {
      setUploads([]);
      setErrors((current) => ({
        ...current,
        uploads: uploadsResult.reason?.message || "Unable to load uploads",
      }));
    }

    if (itinerariesResult.status === "fulfilled") {
      setItineraries(normalizeItineraries(itinerariesResult.value));
      setErrors((current) => ({ ...current, itineraries: "" }));
    } else {
      setItineraries([]);
      setErrors((current) => ({
        ...current,
        itineraries:
          itinerariesResult.reason?.message || "Unable to load itineraries",
      }));
    }

    if (analyticsResult.status === "fulfilled") {
      setAnalysis(analyticsResult.value.analytics || defaultAnalytics);
      setAnalyticsError("");
    } else {
      setAnalysis(defaultAnalytics);
      setAnalyticsError(
        analyticsResult.reason?.message || "Unable to load analytics data",
      );
    }

    setLoading({ stats: false, uploads: false, itineraries: false });
    setAnalyticsLoading(false);
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const handleGenerateItinerary = useCallback(
    async (upload) => {
      const uploadId = getUploadId(upload);

      if (!uploadId) {
        toast.error("Upload id was not found");
        return;
      }

      setGenerationError("");
      setGeneratingUploadId(uploadId);

      try {
        const result = await itineraryService.generateItinerary(uploadId);
        setAiResult(result);
        toast.success("AI itinerary generated");
        addNotification({
          title: "Itinerary generated",
          description: `${result.title || "Your trip"} is ready to view.`,
          type: "success",
        });
        window.setTimeout(() => loadDashboard({ silent: true }), 1200);
        if (result?._id) {
          navigate(`/itinerary/${result._id}`);
        }
      } catch (error) {
        setGenerationError(error.message);
        toast.error(error.message);
      } finally {
        setGeneratingUploadId("");
      }
    },
    [loadDashboard, navigate],
  );

  const handleUploadSuccess = useCallback(
    (result, file) => {
      const upload = result?.upload || result;
      const optimisticUpload = {
        _id: upload?._id || String(Date.now()),
        filename: upload?.filename || file.name,
        mimetype: upload?.mimetype || file.type,
        size: upload?.size || file.size,
        status: upload?.status || "uploaded",
        createdAt: upload?.createdAt || new Date().toISOString(),
      };

      setLatestUpload(optimisticUpload);
      setAiResult(null);
      setGenerationError("");
      setUploads((current) => [optimisticUpload, ...current].slice(0, 5));
      setStats((current) => ({
        ...current,
        totalUploads: (current.totalUploads || 0) + 1,
        aiProcessed: (current.aiProcessed || 0) + 1,
      }));
      toast.success("Upload ready for AI generation");
      addNotification({
        title: "Document uploaded",
        description: `${optimisticUpload.filename} is ready for AI parsing.`,
        type: "info",
      });
      window.setTimeout(() => loadDashboard({ silent: true }), 1500);
    },
    [loadDashboard],
  );

  const hasAnyError = useMemo(
    () => Boolean(errors.stats || errors.uploads || errors.itineraries),
    [errors],
  );

  const travelDetails = aiResult?.travelDetails;
  const isGenerating = Boolean(generatingUploadId);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <HeroSection user={user} />

        {hasAnyError ? (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-amber-400/20 bg-amber-400/10 px-4 py-4 sm:px-5 sm:py-5 text-sm text-amber-100 flex items-start justify-between gap-4"
          >
            <div>
              <p className="font-semibold text-amber-200">⚠️ Some data unavailable</p>
              <p className="mt-1 text-xs text-amber-100/80">
                Dashboard sections that failed to load are shown below. Please refresh the page if the issue persists.
              </p>
            </div>
            <button
              type="button"
              onClick={() => loadDashboard()}
              className="shrink-0 rounded-xl border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-xs font-semibold text-amber-200 transition hover:bg-amber-400/20"
              aria-label="Retry loading dashboard data"
            >
              <RefreshCw className="h-3 w-3" />
            </button>
          </motion.div>
        ) : null}

        {/* ─── Top Section: Analytics & Score ─── */}
        <section className="grid gap-5 grid-cols-1 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 sm:p-6 shadow-xl shadow-black/10 backdrop-blur-xl"
          >
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="flex flex-col gap-1">
                <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">Performance insight</p>
                <h2 className="text-2xl font-bold text-white">Travel analytics</h2>
              </div>
              <p className="text-sm text-slate-400">
                See your document processing trends, itinerary growth, and transport usage.
              </p>
            </div>
            <div className="mt-5 rounded-2xl bg-slate-950/80 px-4 py-3 text-sm">
              <p className="text-slate-400">Top transport type</p>
              <p className="mt-2 text-xl font-bold text-white">{stats.mostUsedTransport || "—"}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 sm:p-6 shadow-xl shadow-black/10 backdrop-blur-xl"
          >
            <p className="text-sm text-slate-500">AI processing score</p>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-slate-950/80 p-4 text-center">
                <p className="text-3xl font-bold text-white">{stats.aiProcessed}</p>
                <p className="mt-2 text-xs text-slate-400">AI-powered plans</p>
              </div>
              <div className="flex items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 p-4 text-center text-white shadow-lg shadow-cyan-500/20">
                <div>
                  <p className="text-2xl font-bold">{stats.sharedTrips}</p>
                  <p className="mt-1 text-xs text-cyan-100">Shared</p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ─── Stats Cards ─── */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statConfig.map(({ key, label, Icon, trend }, index) => (
            <StatsCard
              key={key}
              label={label}
              value={stats[key]}
              icon={Icon}
              trend={trend}
              index={index}
              loading={loading.stats}
            />
          ))}
        </section>

        {/* ─── Upload Section ─── */}
        <section className="grid gap-5 grid-cols-1 lg:grid-cols-[1.6fr_1fr]">
          <motion.div

            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14, type: "spring", stiffness: 240, damping: 24 }}
            className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 sm:p-6 shadow-xl shadow-black/10 backdrop-blur-xl"
          >
            <div className="mb-5 flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300 ring-1 ring-cyan-400/20">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Upload travel document
                  </h3>
                  <p className="text-xs text-slate-500">
                    PDF, JPG, or PNG up to 10 MB
                  </p>
                </div>
              </div>

              {latestUpload ? (
                <button
                  type="button"
                  onClick={() => handleGenerateItinerary(latestUpload)}
                  disabled={isGenerating}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-blue-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-500/20 transition hover:translate-y-[-1px] active:translate-y-[0px] disabled:opacity-60 whitespace-nowrap"
                  aria-busy={isGenerating}
                >
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  Generate
                </button>
              ) : null}
            </div>

            <div className="flex-1">
              <UploadCard onUploadSuccess={handleUploadSuccess} />
            </div>
          </motion.div>

          <RecentUploads
            uploads={uploads}
            loading={loading.uploads}
            error={errors.uploads}
            onGenerate={handleGenerateItinerary}
            generatingUploadId={generatingUploadId}
            limit={3}
          />

        </section>

        {/* ─── Itineraries Section ─── */}
        <RecentItineraries
          itineraries={itineraries}
          loading={loading.itineraries}
          error={errors.itineraries}
        />

        {/* ─── Analytics Section ─── */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {analyticsError ? (
            <div className="rounded-3xl border border-red-400/20 bg-red-400/10 p-5 sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-red-200">Analytics failed to load</p>
                  <p className="mt-1 text-xs text-red-100/80">{analyticsError}</p>
                </div>
                <button
                  type="button"
                  onClick={() => loadDashboard()}
                  className="shrink-0 rounded-xl border border-red-400/30 bg-red-400/10 px-3 py-2 text-xs font-semibold text-red-200 transition hover:bg-red-400/20"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : (
            <>
              <DashboardAnalytics analytics={analysis} loading={analyticsLoading} error={analyticsError} />
              <ActivityTimeline activities={analysis.recentActivities} loading={analyticsLoading} />
            </>
          )}
        </motion.section>

        {/* ─── Generation Result ─── */}
        <AIResponseCard
          loading={isGenerating}
          error={generationError}
          onRetry={() => latestUpload && handleGenerateItinerary(latestUpload)}
          rawResponse={aiResult?.rawAIResponse}
        />

        {travelDetails ? (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24 }}
            className="space-y-5"
          >
            <TravelSummary details={travelDetails} />
            <ItineraryCard details={travelDetails} />
            {aiResult?.extractedText ? (
              <ExtractionDetails extractedText={aiResult.extractedText} />
            ) : null}
          </motion.section>
        ) : null}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
