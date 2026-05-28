import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Suspense, lazy } from "react";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import PageLoader from "./components/common/PageLoader";

const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Profile = lazy(() => import("./pages/Profile"));
const Settings = lazy(() => import("./pages/Settings"));
const UploadPage = lazy(() => import("./pages/UploadPage"));
const ItineraryHistory = lazy(() => import("./pages/ItineraryHistory"));
const ItineraryDetails = lazy(() => import("./pages/ItineraryDetails"));
const SharedItinerary = lazy(() => import("./pages/SharedItinerary"));
const SharedTrips = lazy(() => import("./pages/SharedTrips"));

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
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
          <Suspense fallback={<PageLoader />}>
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
          </Suspense>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

