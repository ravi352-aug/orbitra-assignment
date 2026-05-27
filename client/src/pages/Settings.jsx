import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/dashboard/DashboardLayout";

import SettingsSection from "../components/settings/SettingsSection";
import ToggleSwitch from "../components/settings/ToggleSwitch";
import ThemeCard from "../components/settings/ThemeCard";
import DangerZone from "../components/settings/DangerZone";
import PreferenceSelect from "../components/settings/PreferenceSelect";

import { userService } from "../services/userService";

const Settings = () => {
  const { user, logout } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [profileSettings, setProfileSettings] = useState({
    notifications: {
      email: true,
      itineraryAlerts: true,
      uploadCompletion: true,
      aiGeneration: true,
    },
    aiPreferences: {
      verbosity: "detailed", // concise | detailed
      style: "balanced", // balanced | adventurous | cultural
      responseLength: 800, // best-guess
    },
    privacy: {
      publicItineraries: false,
      allowSharing: true,
    },
    appearance: {
      theme: "dark",
      density: "comfortable", // compact | comfortable
    },
  });

  const [accountForm, setAccountForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const computedInitials = useMemo(() => {
    return (user?.name || "Traveler")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0].toUpperCase())
      .join("");
  }, [user?.name]);

  const fetchSettings = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await userService.getSettings();
      const next = res?.settings || res;
      setProfileSettings((prev) => ({
        ...prev,
        ...next,
      }));
      setAccountForm({
        name: next?.name || user?.name || "",
        email: next?.email || user?.email || "",
      });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveAccount = async () => {
    setSaving(true);
    setError("");
    try {
      await userService.updateProfile({
        name: accountForm.name.trim(),
        email: accountForm.email.trim(),
      });
      toast.success("Account details saved");
    } catch (e) {
      setError(e.message);
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const savePassword = async () => {
    setSaving(true);
    setError("");
    try {
      await userService.updatePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success("Password updated");
      setPasswordForm({ currentPassword: "", newPassword: "" });
    } catch (e) {
      setError(e.message);
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    setError("");
    try {
      await userService.updateSettings(profileSettings);
      toast.success("Settings saved");
    } catch (e) {
      setError(e.message);
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const deleting = false;
  const loggingOutDevices = false;

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
            <h2 className="text-xl sm:text-2xl font-bold text-white">Settings</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Customize account, appearance, notifications, and AI preferences.
            </p>
          </div>

          <button
            type="button"
            onClick={saveSettings}
            disabled={saving || loading}
            className="rounded-2xl bg-gradient-to-r from-cyan-400 to-indigo-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/15 transition hover:scale-[1.01] disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save all"}
          </button>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="glass-card rounded-3xl border border-white/10 p-6 animate-pulse"
              >
                <div className="h-6 w-2/3 bg-white/[0.05] rounded-xl" />
                <div className="mt-3 h-4 w-1/2 bg-white/[0.05] rounded-xl" />
                <div className="mt-3 h-4 w-2/3 bg-white/[0.05] rounded-xl" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Account Settings */}
            <SettingsSection
              title="Account Settings"
              subtitle="Update personal information and change your password."
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-slate-300">Name</label>
                  <input
                    value={accountForm.name}
                    onChange={(e) => setAccountForm((p) => ({ ...p, name: e.target.value }))}
                    className="w-full rounded-2xl glass-input px-4 py-3 text-sm text-white outline-none"
                    placeholder="Your name"
                  />

                  <label className="text-xs font-semibold text-slate-300">Email</label>
                  <input
                    value={accountForm.email}
                    onChange={(e) => setAccountForm((p) => ({ ...p, email: e.target.value }))}
                    className="w-full rounded-2xl glass-input px-4 py-3 text-sm text-white outline-none"
                    placeholder="you@example.com"
                  />

                  <div className="pt-2">
                    <motion.button
                      type="button"
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={saveAccount}
                      disabled={saving}
                      className="rounded-2xl bg-white/[0.06] px-4 py-3 text-sm font-bold text-white ring-1 ring-white/10 hover:bg-white/[0.09] disabled:opacity-60"
                    >
                      Save account
                    </motion.button>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-semibold text-slate-300">Current password</label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))}
                    className="w-full rounded-2xl glass-input px-4 py-3 text-sm text-white outline-none"
                    placeholder="••••••••"
                  />

                  <label className="text-xs font-semibold text-slate-300">New password</label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))}
                    className="w-full rounded-2xl glass-input px-4 py-3 text-sm text-white outline-none"
                    placeholder="At least 6 characters"
                  />

                  <div className="pt-2">
                    <motion.button
                      type="button"
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={savePassword}
                      disabled={saving || !passwordForm.newPassword}
                      className="rounded-2xl bg-gradient-to-r from-cyan-400 to-indigo-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/15 transition hover:scale-[1.01] disabled:opacity-60"
                    >
                      Change password
                    </motion.button>
                  </div>
                </div>
              </div>
            </SettingsSection>

            {/* Appearance */}
            <SettingsSection
              title="Appearance"
              subtitle="Fine tune your dashboard look and feel."
            >
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <ThemeCard
                    title="Dark"
                    description="Deep travel AI backdrop"
                    selected={profileSettings.appearance?.theme === "dark"}
                    onClick={() =>
                      setProfileSettings((p) => ({
                        ...p,
                        appearance: { ...(p.appearance || {}), theme: "dark" },
                      }))
                    }
                  />
                  <ThemeCard
                    title="Midnight"
                    description="Extra contrast for clarity"
                    selected={profileSettings.appearance?.theme === "midnight"}
                    onClick={() =>
                      setProfileSettings((p) => ({
                        ...p,
                        appearance: { ...(p.appearance || {}), theme: "midnight" },
                      }))
                    }
                  />
                </div>

                <PreferenceSelect
                  label="UI density"
                  value={profileSettings.appearance?.density || "comfortable"}
                  onChange={(v) =>
                    setProfileSettings((p) => ({
                      ...p,
                      appearance: { ...(p.appearance || {}), density: v },
                    }))
                  }
                  options={[
                    { value: "compact", label: "Compact" },
                    { value: "comfortable", label: "Comfortable" },
                  ]}
                />
              </div>
            </SettingsSection>

            {/* Notification Preferences */}
            <SettingsSection
              title="Notification Preferences"
              subtitle="Choose what you want to hear about."
            >
              <div className="space-y-4">
                <ToggleSwitch
                  checked={!!profileSettings.notifications?.email}
                  onChange={(v) =>
                    setProfileSettings((p) => ({
                      ...p,
                      notifications: { ...(p.notifications || {}), email: v },
                    }))
                  }
                  label="Email notifications"
                  description="Send important account updates"
                />
                <ToggleSwitch
                  checked={!!profileSettings.notifications?.itineraryAlerts}
                  onChange={(v) =>
                    setProfileSettings((p) => ({
                      ...p,
                      notifications: { ...(p.notifications || {}), itineraryAlerts: v },
                    }))
                  }
                  label="Itinerary alerts"
                  description="Remind you when itinerary changes"
                />
                <ToggleSwitch
                  checked={!!profileSettings.notifications?.uploadCompletion}
                  onChange={(v) =>
                    setProfileSettings((p) => ({
                      ...p,
                      notifications: { ...(p.notifications || {}), uploadCompletion: v },
                    }))
                  }
                  label="Upload completion alerts"
                  description="Get notified when documents are processed"
                />
                <ToggleSwitch
                  checked={!!profileSettings.notifications?.aiGeneration}
                  onChange={(v) =>
                    setProfileSettings((p) => ({
                      ...p,
                      notifications: { ...(p.notifications || {}), aiGeneration: v },
                    }))
                  }
                  label="AI generation notifications"
                  description="When your itinerary is ready"
                />
              </div>
            </SettingsSection>

            {/* AI Preferences */}
            <SettingsSection
              title="AI Preferences"
              subtitle="Tune how VoyageAI generates itineraries."
            >
              <div className="space-y-4">
                <PreferenceSelect
                  label="Detail level"
                  value={profileSettings.aiPreferences?.verbosity || "detailed"}
                  onChange={(v) =>
                    setProfileSettings((p) => ({
                      ...p,
                      aiPreferences: { ...(p.aiPreferences || {}), verbosity: v },
                    }))
                  }
                  options={[
                    { value: "concise", label: "Concise" },
                    { value: "detailed", label: "Detailed" },
                  ]}
                />

                <PreferenceSelect
                  label="Preferred style"
                  value={profileSettings.aiPreferences?.style || "balanced"}
                  onChange={(v) =>
                    setProfileSettings((p) => ({
                      ...p,
                      aiPreferences: { ...(p.aiPreferences || {}), style: v },
                    }))
                  }
                  options={[
                    { value: "balanced", label: "Balanced" },
                    { value: "adventurous", label: "Adventurous" },
                    { value: "cultural", label: "Cultural" },
                  ]}
                />

                <PreferenceSelect
                  label="Response length"
                  value={String(profileSettings.aiPreferences?.responseLength || 800)}
                  onChange={(v) =>
                    setProfileSettings((p) => ({
                      ...p,
                      aiPreferences: {
                        ...(p.aiPreferences || {}),
                        responseLength: Number(v),
                      },
                    }))
                  }
                  options={[
                    { value: "500", label: "Short" },
                    { value: "800", label: "Balanced" },
                    { value: "1200", label: "Long" },
                  ]}
                />
              </div>
            </SettingsSection>

            {/* Privacy Settings */}
            <SettingsSection
              title="Privacy Settings"
              subtitle="Control visibility and sharing."
            >
              <div className="space-y-4">
                <ToggleSwitch
                  checked={!!profileSettings.privacy?.publicItineraries}
                  onChange={(v) =>
                    setProfileSettings((p) => ({
                      ...p,
                      privacy: { ...(p.privacy || {}), publicItineraries: v },
                    }))
                  }
                  label="Public itineraries"
                  description="Allow others to view your itineraries"
                />

                <ToggleSwitch
                  checked={!!profileSettings.privacy?.allowSharing}
                  onChange={(v) =>
                    setProfileSettings((p) => ({
                      ...p,
                      privacy: { ...(p.privacy || {}), allowSharing: v },
                    }))
                  }
                  label="Allow sharing"
                  description="Enable share links for generated trips"
                />
              </div>
            </SettingsSection>

            {/* Danger Zone */}
            <SettingsSection title="Danger Zone" subtitle="Irreversible account actions." >
              <DangerZone
                onLogoutDevices={() => {
                  toast.success("Logged out from other devices (demo)" );
                }}
                onDelete={() => {
                  // best-effort delete
                  if (!confirm("Delete your account? This cannot be undone.")) return;
                  userService
                    .deleteAccount()
                    .then(() => {
                      toast.success("Account deleted");
                      logout();
                    })
                    .catch((e) => toast.error(e.message));
                }}
                loggingOutDevices={loggingOutDevices}
                deleting={deleting}
              />
            </SettingsSection>

            {error ? (
              <div className="rounded-3xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-100">
                {error}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Settings;

