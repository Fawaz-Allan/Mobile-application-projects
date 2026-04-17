import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import { AMENITIES } from "../components/MarbleCard";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

interface AmenitiesLoopProps {
  isDark?: boolean;
}

// Each amenity displays for 3.5 seconds before transitioning to the next
const SLIDE_DURATION_MS = 3500;
const TICK_MS = 50;

export function AmenitiesLoop({ isDark }: AmenitiesLoopProps) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const elapsedRef = useRef(0);

  // Single ticker that handles both progress bar and slide advancement
  useEffect(() => {
    elapsedRef.current = 0;
    setProgress(0);

    tickRef.current = setInterval(() => {
      elapsedRef.current += TICK_MS;
      const pct = Math.min((elapsedRef.current / SLIDE_DURATION_MS) * 100, 100);
      setProgress(pct);

      if (elapsedRef.current >= SLIDE_DURATION_MS) {
        elapsedRef.current = 0;
        setProgress(0);
        setCurrentIndex((prev) => (prev + 1) % AMENITIES.length);
      }
    }, TICK_MS);

    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, []);

  // Tap anywhere → return to main (home/selection) page
  const handleTap = () => {
    navigate("/");
  };

  const amenity = AMENITIES[currentIndex];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      onClick={handleTap}
      style={{
        height: "100dvh",
        width: "100%",
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        background: "#0a0805",
      }}
    >
      {/* Full-screen background image — crossfade between slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
          }}
        >
          <ImageWithFallback
            src={amenity.image}
            alt={amenity.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Dark gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.58) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.08) 60%, rgba(0,0,0,0.88) 100%)",
          zIndex: 1,
        }}
      />

      {/* Gold frame border */}
      <div
        style={{
          position: "absolute",
          inset: "12px",
          border: "1.5px solid rgba(197,160,89,0.5)",
          borderRadius: "28px",
          zIndex: 2,
          pointerEvents: "none",
          boxShadow: "0 0 30px rgba(197,160,89,0.06) inset",
        }}
      />

      {/* Top "Tap to return" hint */}
      <motion.div
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        style={{
          position: "absolute",
          top: "30px",
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        <motion.div
          animate={{ opacity: [0.45, 0.9, 0.45] }}
          transition={{ duration: 2.2, repeat: Infinity }}
          style={{
            fontSize: "11px",
            fontFamily: "'Montserrat', sans-serif",
            color: "rgba(255,255,255,0.75)",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          Tap screen to return
        </motion.div>
        <div
          style={{
            fontSize: "12px",
            fontFamily: "'Cairo', sans-serif",
            color: "rgba(255,255,255,0.5)",
            marginTop: "3px",
          }}
        >
          اضغط للعودة
        </div>
      </motion.div>

      {/* Bottom: Amenity name + progress */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`text-${currentIndex}`}
          initial={{ y: 28, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -16, opacity: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            padding: "0 28px 32px",
            textAlign: "center",
          }}
        >
          {/* Arabic name — large & bold */}
          <div
            style={{
              fontSize: "50px",
              fontFamily: "'Cairo', sans-serif",
              fontWeight: 800,
              color: "var(--color-gold)",
              lineHeight: 1.1,
              textShadow: "0 2px 28px rgba(0,0,0,0.75)",
              marginBottom: "4px",
            }}
          >
            {amenity.nameAr}
          </div>

          {/* English name */}
          <div
            style={{
              fontSize: "15px",
              fontFamily: "'Montserrat', sans-serif",
              color: "rgba(197,160,89,0.75)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginBottom: "22px",
            }}
          >
            ({amenity.name})
          </div>

          {/* Progress bar — fills over 3.5 seconds */}
          <div
            style={{
              width: "100%",
              height: "2px",
              background: "rgba(255,255,255,0.12)",
              borderRadius: "2px",
              marginBottom: "16px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background:
                  "linear-gradient(90deg, var(--color-gold-deep), var(--color-gold))",
                borderRadius: "2px",
                transition: "width 0.05s linear",
              }}
            />
          </div>

          {/* Dot indicators */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {AMENITIES.map((_, idx) => (
              <div
                key={idx}
                style={{
                  height: "4px",
                  borderRadius: "4px",
                  background:
                    currentIndex === idx ? "var(--color-gold)" : "rgba(255,255,255,0.22)",
                  width: currentIndex === idx ? "28px" : "8px",
                  transition: "all 0.45s ease",
                }}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Side vertical progress markers */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          right: "22px",
          transform: "translateY(-50%)",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          pointerEvents: "none",
        }}
      >
        {AMENITIES.map((_, idx) => (
          <div
            key={idx}
            style={{
              width: "2.5px",
              height: currentIndex === idx ? "26px" : "9px",
              borderRadius: "3px",
              background:
                currentIndex === idx ? "var(--color-gold)" : "rgba(255,255,255,0.18)",
              transition: "all 0.45s ease",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
