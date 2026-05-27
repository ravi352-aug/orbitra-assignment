import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import DashboardLayout from "../components/dashboard/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { userService } from "../services/userService";

import ProfileHero from "../components/profile/ProfileHero";
import ProfileStats from "../components/profile/ProfileStats";
import EditProfileForm from "../components/profile/EditProfileForm";
import AvatarUpload from "../components/profile/AvatarUpload";

const SkeletonCard = ({ className = "" }) => {
  return (
    <div
      className={`rounded-3xl bg-white/[0.04] border border-white/[0.07] ${className}`}
    >
      <div className="h-8 w-2/3 rounded-xl bg-white/[0.04] animate-pulse" />
      <div className="mt-3 h-4 w-1/2 rounded-xl bg-white/[0.04] animate-pulse" />
    </div>
  );
};

const Profile = () => {
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);

  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const stats = useMemo(() => {
    const p = profile || {};
    // best-guess mapping
    return {
      totalUploads: p.totalUploads ?? p.uploads ?? 0,
      totalItineraries: p.totalItineraries ?? p.itineraries ?? 0,
      sharedTrips: p.sharedTrips ?? p.shared ?? 0,
      aiProcessed: p.aiProcessed ?? p.aiDocs ?? 0,
    };
  }, [profile]);

  const joinDate = profile?.createdAt || profile?.joinDate || user?.createdAt || null;

  const fetchProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await userService.getProfile();
      // normalize: allow { profile } or direct user
      const next = res?.profile || res;
      setProfile(next);
    } catch (e) {
      setError(e.message);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async (payload) => {
    setSaving(true);
    setError("");
    try {
      const res = await userService.updateProfile(payload);
      const next = res?.profile || res;
      setProfile((prev) => ({ ...(prev || {}), ...next }));
      toast.success("Profile updated successfully");
      setEditing(false);
    } catch (e) {
      setError(e.message);
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const avatarUrl = profile?.avatarUrl || profile?.avatar || null;

  const handleAvatarUpload = async (formData) => {
    setUploadingAvatar(true);
    try {
      const res = await userService.uploadAvatar(formData);
      const nextAvatar = res?.avatarUrl || res?.avatar || res?.url || null;
      if (nextAvatar) {
        setProfile((prev) => ({ ...(prev || {}), avatarUrl: nextAvatar }));
      }
      toast.success("Avatar updated");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setUploadingAvatar(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex items-start justify-between gap-4 flex-wrap"
        >
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Profile</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Manage your account details, avatar, and travel performance.
            </p>
          </div>

          {editing ? null : (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="rounded-2xl bg-white/[0.06] px-4 py-2.5 text-sm font-bold text-white ring-1 ring-white/10 hover:bg-white/[0.09] transition"
            >
              Edit Profile
            </button>
          )}
        </motion.div>

        {loading ? (
          <div className="space-y-4">
            <SkeletonCard className="p-6" />
            <SkeletonCard className="p-6" />
          </div>
        ) : (
          <>
            <ProfileHero
              name={profile?.name || user?.name}
              email={profile?.email || user?.email}
              joinDate={joinDate}
              avatarUrl={avatarUrl}
              onEdit={() => setEditing(true)}
              editable={!editing}
            />

            <ProfileStats stats={stats} />

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-3">
                {editing ? (
                  <div className="glass-card rounded-3xl border border-white/10 p-5 sm:p-6">
                    <EditProfileForm
                      initial={{
                        name: profile?.name || user?.name,
                        email: profile?.email || user?.email,
                      }}
                      loading={saving}
                      error={error}
                      onCancel={() => {
                        setError("");
                        setEditing(false);
                      }}
                      onSave={handleSave}
                    />
                  </div>
                ) : (
                  <div className="glass-card rounded-3xl border border-white/10 p-5 sm:p-6">
                    <h3 className="text-sm font-bold text-white">Profile Details</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Avatar and basic information are managed below.
                    </p>

                    <div className="mt-5">
                      <AvatarUpload
                        currentAvatar={avatarUrl}
                        disabled={saving || uploadingAvatar}
                        loading={uploadingAvatar}
                        onUpload={async (fd) => handleAvatarUpload(fd)}
                      />
                    </div>

                    {error ? (
                      <p className="mt-4 text-sm text-red-300">{error}</p>
                    ) : null}
                  </div>
                )}
              </div>

              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="glass-card rounded-3xl border border-white/10 p-5 sm:p-6"
                >
                  <h3 className="text-sm font-bold text-white">TravelAI Insights</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Your profile is used to personalize AI itinerary generation and
                    keep your journey history organized.
                  </p>

                  <ul className="mt-4 space-y-2">
                    <li className="text-xs text-slate-300">
                      • Upload documents to fuel AI extraction.
                    </li>
                    <li className="text-xs text-slate-300">
                      • Generate detailed day-by-day plans.
                    </li>
                    <li className="text-xs text-slate-300">
                      • Share trips with friends using a secure link.
                    </li>
                  </ul>
                </motion.div>
              </div>
            </div>
          </>
        )}

        {error && !loading ? (
          <div className="rounded-3xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-100">
            {error}
          </div>
        ) : null}
      </div>
    </DashboardLayout>
  );
};

export default Profile;

