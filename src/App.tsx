import "./App.css";
import { Routes, Route, NavLink, Navigate } from "react-router";
import { Suspense, lazy } from "react";
import ChangeColors from "./components/change-colors/change-colors";
import { LottieDataProvider } from "./context/lottie-data-provider";
import CreateRandomChar from "./components/create-random-char/create-random-char";

// Lazy load the animations page
const AnimationsPage = lazy(
  () => import("./components/animations/animations-page")
);

function App() {
  return (
    <div className="app-container">
      <nav className="flex w-full gap-x-6 mb-4">
        <NavLink
          to="/switch-parts"
          className={({ isActive }) =>
            `px-4 py-2 rounded border-4 transition-all text-white ${
              isActive
                ? "bg-indigo-400 border-white"
                : "bg-indigo-400 border-transparent hover:bg-indigo-600"
            }`
          }
        >
          Switch Parts
        </NavLink>
        <NavLink
          to="/change-colors"
          className={({ isActive }) =>
            `px-4 py-2 rounded border-4 transition-all text-white ${
              isActive
                ? "bg-indigo-400 border-white"
                : "bg-indigo-400 border-transparent hover:bg-indigo-600"
            }`
          }
        >
          Change Colors
        </NavLink>
        <NavLink
          to="/create-random-char"
          className={({ isActive }) =>
            `px-4 py-2 rounded border-4 transition-all text-white ${
              isActive
                ? "bg-indigo-400 border-white"
                : "bg-indigo-400 border-transparent hover:bg-indigo-600"
            }`
          }
        >
          Create Random Char
        </NavLink>
        <NavLink
          to="/animations"
          className={({ isActive }) =>
            `px-4 py-2 rounded border-4 transition-all text-white ${
              isActive
                ? "bg-indigo-400 border-white"
                : "bg-indigo-400 border-transparent hover:bg-indigo-600"
            }`
          }
        >
          Animations
        </NavLink>
      </nav>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/create-random-char" replace />}
        />
        <Route
          path="/switch-parts"
          element={
            <div className="w-full h-full py-12">
              <p>Switch Parts feature coming soon...</p>
            </div>
          }
        />
        <Route
          path="/change-colors"
          element={
            <LottieDataProvider>
              <ChangeColors />
            </LottieDataProvider>
          }
        />
        <Route
          path="/create-random-char"
          element={
            <LottieDataProvider>
              <CreateRandomChar />
            </LottieDataProvider>
          }
        />
        <Route
          path="/animations"
          element={
            <Suspense
              fallback={
                <div className="w-full h-full py-12 flex items-center justify-center">
                  <div className="text-lg">Loading animations...</div>
                </div>
              }
            >
              <AnimationsPage />
            </Suspense>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
