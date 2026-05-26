import api from "./authService";

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message ||
  error.response?.data?.error ||
  error.message ||
  fallback;

export const uploadService = {
  async uploadFile(file, onUploadProgress) {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const total = progressEvent.total || progressEvent.loaded || 1;
          const percent = Math.round((progressEvent.loaded * 100) / total);
          if (onUploadProgress) onUploadProgress(percent);
        },
      });
      return response.data;
    } catch (error) {
      error.message = getErrorMessage(error, "Upload failed");
      throw error;
    }
  },

  async testGemini() {
    try {
      const response = await api.get("/gemini/test");
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Gemini test failed"));
    }
  },
};

export const uploadFile = (file, onUploadProgress) =>
  uploadService.uploadFile(file, onUploadProgress);

export const testGemini = () => uploadService.testGemini();
