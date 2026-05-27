import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import UploadPage from "./pages/UploadPage";
import ItineraryHistory from "./pages/ItineraryHistory";
import ItineraryDetails from "./pages/ItineraryDetails";
import SharedItinerary from "./pages/SharedItinerary";
import SharedTrips from "./pages/SharedTrips";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "rgba(10, 15, 30, 0.95)",
              color: "#e2e8f0",
              border: "1px solid rgba(99, 211, 219, 0.2)",
              backdropFilter: "blur(12px)",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "14px",
              borderRadius: "12px",
              padding: "12px 16px",
            },
            success: {
              iconTheme: { primary: "#63d3db", secondary: "#0a0f1e" },
              duration: 3000,
            },
            error: {
              iconTheme: { primary: "#f87171", secondary: "#0a0f1e" },
              duration: 4000,
            },
          }}
        />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <UploadPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/itineraries"
            element={
              <ProtectedRoute>
                <ItineraryHistory />
              </ProtectedRoute>
            }
          />

          <Route
            path="/itinerary/:id"
            element={
              <ProtectedRoute>
                <ItineraryDetails />
              </ProtectedRoute>
            }
          />

          <Route path="/share/:shareId" element={<SharedItinerary />} />

          <Route
            path="/shared"
            element={
              <ProtectedRoute>
                <SharedTrips />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

