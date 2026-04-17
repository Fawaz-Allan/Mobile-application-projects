import { useState } from "react";
import { SelectionScreen } from "./screens/SelectionScreen";
import { TransitionScreen } from "./screens/TransitionScreen";
import { AmenitiesLoop } from "./screens/AmenitiesLoop";
import { CompletionScreen } from "./screens/CompletionScreen";
import { ThemeToggle } from "./components/MarbleCard";
import { AnimatePresence } from "motion/react";
import { useLocation, Routes, Route } from "react-router";

export function Root() {
  const [isDark, setIsDark] = useState(false);
  const location = useLocation();

  return (
    <div
      className="w-full min-h-screen flex items-center justify-center"
      style={{ background: "#1a1a1a" }}
    >
      {/* Phone Frame */}
      <div
        className="relative overflow-hidden flex flex-col"
        style={{
          width: "100%",
          maxWidth: "430px",
          height: "100dvh",
          fontFamily: "'Cairo', sans-serif",
        }}
      >
        {/* Theme toggle — top right corner */}
        <div
          style={{
            position: "absolute",
            top: "52px",
            right: "16px",
            zIndex: 300,
          }}
        >
          <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
        </div>

        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<SelectionScreen isDark={isDark} />} />
            <Route
              path="/transition"
              element={<TransitionScreen isDark={isDark} />}
            />
            <Route
              path="/amenities"
              element={<AmenitiesLoop isDark={isDark} />}
            />
            <Route
              path="/completion"
              element={<CompletionScreen isDark={isDark} />}
            />
          </Routes>
        </AnimatePresence>
      </div>
    </div>
  );
}
