import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./Auth/firebase";
import { setAuthSession } from "./store/auth";
import { clearUser, getUserData } from "./store/user";
import { normalizeEmail } from "./store/firestoreUtils";
import Dashboard from "./pages/Dashboard";
import Alerts from "./pages/Alerts";
import AddPatient from "./pages/AddPatient";
import ExplainAi from "./pages/ExplainAi";
import PatientDetails from "./pages/PatientDetails";
import PredictedPage from "./pages/PredictedPage";
import Result from "./pages/Result";
import History from "./pages/History";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserDashboard from "./pages/UserDashboard";
import DoctorConsultant from "./pages/DoctorConsultant";
import ChatPage from "./pages/ChatPage";
import "./App.css";

const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const DoctorRoute = ({ user, role, children }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role !== "Doctor") {
    return <Navigate to="/userdashboard" replace />;
  }

  return children;
};

const UserRoute = ({ user, role, children }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role !== "User") {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const dispatch = useDispatch();
  const [authUser, setAuthUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setAuthUser(null);
        setRole(null);
        dispatch(setAuthSession(null));
        dispatch(clearUser());
        setLoading(false);
        return;
      }

      const result = await dispatch(getUserData({ userId: firebaseUser.uid }));

      if (getUserData.fulfilled.match(result)) {
        setAuthUser(firebaseUser);
        setRole(result.payload.role);
        dispatch(setAuthSession(result.payload));
      } else {
        const fallbackUser = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || "",
          email: normalizeEmail(firebaseUser.email || ""),
          role: "User",
          vitals: {},
          prediction: null,
          riskLevel: null,
          createdAt: new Date().toISOString(),
        };

        setAuthUser(firebaseUser);
        setRole("User");
        dispatch(clearUser());
        dispatch(setAuthSession(fallbackUser));
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-white bg-slate-900">
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={!authUser ? <Login /> : <Navigate to={role === "Doctor" ? "/" : "/userdashboard"} replace />}
        />
        <Route
          path="/signup"
          element={!authUser ? <Signup /> : <Navigate to={role === "Doctor" ? "/" : "/userdashboard"} replace />}
        />
        <Route path="/about" element={<About />} />
        <Route
          path="/userdashboard"
          element={
            <UserRoute user={authUser} role={role}>
              <UserDashboard />
            </UserRoute>
          }
        />
        <Route
          path="/doctor-consultant"
          element={
            <UserRoute user={authUser} role={role}>
              <DoctorConsultant />
            </UserRoute>
          }
        />
        <Route
          path="/"
          element={
            <DoctorRoute user={authUser} role={role}>
              <Dashboard />
            </DoctorRoute>
          }
        />
        <Route
          path="/alerts"
          element={
            <DoctorRoute user={authUser} role={role}>
              <Alerts />
            </DoctorRoute>
          }
        />
        <Route
          path="/add-patient"
          element={
            <ProtectedRoute user={authUser}>
              <AddPatient />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <DoctorRoute user={authUser} role={role}>
              <History />
            </DoctorRoute>
          }
        />
        <Route
          path="/patient/:id"
          element={
            <DoctorRoute user={authUser} role={role}>
              <PatientDetails />
            </DoctorRoute>
          }
        />
        <Route
          path="/predict"
          element={
            <ProtectedRoute user={authUser}>
              <PredictedPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/result"
          element={
            <ProtectedRoute user={authUser}>
              <Result />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute user={authUser}>
              <ChatPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/explain-ai"
          element={
            <ProtectedRoute user={authUser}>
              <ExplainAi />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to={authUser ? (role === "Doctor" ? "/" : "/userdashboard") : "/login"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
