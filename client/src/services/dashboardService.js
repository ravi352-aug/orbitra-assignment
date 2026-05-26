import api from "./authService";

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message ||
  error.response?.data?.error ||
  error.message ||
  fallback;

export const dashboardService = {
  async getStats() {
    try {
      const response = await api.get("/dashboard/stats");
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Unable to load dashboard stats"));
    }
  },

  async getRecentUploads() {
    try {
      const response = await api.get("/dashboard/recent-uploads");
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Unable to load recent uploads"));
    }
  },

  async getRecentItineraries() {
    try {
      const response = await api.get("/dashboard/recent-itineraries");
      return response.data;
    } catch (error) {
      throw new Error(
        getErrorMessage(error, "Unable to load recent itineraries"),
      );
    }
  },
};

export const fetchDashboardStats = () => dashboardService.getStats();
export const fetchRecentUploads = () => dashboardService.getRecentUploads();
export const fetchRecentItineraries = () =>
  dashboardService.getRecentItineraries();
