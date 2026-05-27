import api from "./authService";

// NOTE: Backend endpoints may not exist yet in your server.
// These methods are implemented with best-guess REST paths.
// If your backend uses different paths, update the URL strings only.

const withAuthHeader = (token) => {
  // axios instance already attaches token via interceptor,
  // but we keep this for explicitness/future safety.
  if (token) return { Authorization: `Bearer ${token}` };
  return {};
};

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message ||
  error.response?.data?.error ||
  error.message ||
  fallback;

export const userService = {
  async getProfile() {
    const { data } = await api.get("/user/profile");
    return data;
  },

  async updateProfile(payload) {
    const { data } = await api.put("/user/profile", payload);
    return data;
  },

  async updatePassword(payload) {
    const { data } = await api.put("/user/password", payload);
    return data;
  },

  async getSettings() {
    const { data } = await api.get("/user/settings");
    return data;
  },

  async updateSettings(payload) {
    const { data } = await api.put("/user/settings", payload);
    return data;
  },

  async deleteAccount() {
    const { data } = await api.delete("/user/account");
    return data;
  },

  // Avatar upload helper for AvatarUpload.jsx
  // payload: FormData
  async uploadAvatar(formData) {
    const { data } = await api.post("/user/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        ...withAuthHeader(),
      },
    });
    return data;
  },

  // If backend stores avatarUrl directly in user/profile response, no extra helper needed.
};

