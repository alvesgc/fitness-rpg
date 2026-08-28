import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { Register } from "./pages/Register/Register";

import { Login } from "./pages/Login/Login";

import { Dashboard } from "./pages/Dashborad/Dashboard";

import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { WorkoutSessionPage } from "./pages/Workout/WorkoutSessionPage";
import { WorkoutsPage } from "./pages/Workout/WorkoutsPage";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/treino" element={<WorkoutSessionPage />} />
          <Route path="/treinos" element={<WorkoutsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
