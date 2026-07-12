import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import Landing from "./pages/Landing";
import Resume from "./pages/Resume";
import InterviewSetup from "./pages/InterviewSetup";
import MockInterview from "./pages/MockInterview";
import InterviewResult from "./pages/InterviewResult";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Landing />} />

        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/interview/setup" element={<InterviewSetup />} />
          <Route path="/interview/:id" element={<MockInterview />} />
          <Route path="/interview/:id/result" element={<InterviewResult />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
