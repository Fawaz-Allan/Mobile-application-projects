import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { LOGO_ASSET, DARK_MARBLE } from "../components/MarbleCard";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Home, Wifi, Battery } from "lucide-react";

interface CompletionScreenProps {
  isDark: boolean;
}

function StatusBar() {
  return (
    <div
      className="flex items-center justify-between px-6 pt-4 pb-1"
      style={{ color: "rgba(245,245,245,0.75)" }}
    >
      <span style={{ fontSize: "14px", fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}>
        9:41
      </span>
      <div className="flex items-center gap-1.5">
        <Wifi size={14} />
        <Battery size={16} />
      </div>
    </div>
  );
}

// 4-pointed star decoration
function GoldStar({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2L13.5 10.5L22 12L13.5 13.5L12 22L10.5 13.5L2 12L10.5 10.5L12 2Z"
        fill="var(--color-gold)"
        opacity="0.9"
      />
    </svg>
  );
}

export function CompletionScreen({ isDark }: CompletionScreenProps) {
  const navigate = useNavigate();
  const [barProgress, setBarProgress] = useState(0);

  // Animate the progress bar to 100%
  useEffect(() => {
    const timer = setTimeout(() => {
      setBarProgress(100);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        backgroundImage: `url(${DARK_MARBLE})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        overflow: "hidden",
      }}
    >
      {/* Rich dark overlay with warm gold tints */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, rgba(30,22,5,0.92) 0%, rgba(12,9,2,0.95) 50%, rgba(25,18,4,0.93) 100%)",
        }}
      />

      {/* Outer gold frame */}
      <div
        style={{
          position: "absolute",
          inset: "10px",
          border: "1.5px solid rgba(197,160,89,0.45)",
          borderRadius: "30px",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {/* Inner gold frame (double border luxury effect) */}
      <div
        style={{
          position: "absolute",
          inset: "16px",
          border: "0.5px solid rgba(197,160,89,0.2)",
          borderRadius: "26px",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {/* Corner stars */}
      <div style={{ position: "absolute", top: "30px", left: "30px", zIndex: 3 }}>
        <GoldStar size={16} />
      </div>
      <div style={{ position: "absolute", top: "30px", right: "30px", zIndex: 3 }}>
        <GoldStar size={16} />
      </div>
      <div style={{ position: "absolute", bottom: "30px", left: "30px", zIndex: 3 }}>
        <GoldStar size={12} />
      </div>
      <div style={{ position: "absolute", bottom: "30px", right: "30px", zIndex: 3 }}>
        <GoldStar size={12} />
      </div>

      {/* Ambient gold glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 1 }}
      >
        <motion.div
          animate={{ opacity: [0.05, 0.14, 0.05] }}
          transition={{ duration: 4, repeat: Infinity }}
          style={{
            position: "absolute",
            bottom: "-100px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "360px",
            height: "360px",
            borderRadius: "50%",
            background: "var(--color-gold)",
            filter: "blur(80px)",
          }}
        />
      </motion.div>

      {/* Status bar */}
      <div style={{ position: "relative", zIndex: 10 }}>
        <StatusBar />
      </div>

      {/* Main content */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 28px",
          textAlign: "center",
        }}
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6, type: "spring", damping: 14 }}
          style={{ marginBottom: "20px" }}
        >
          <motion.div
            animate={{
              filter: [
                "drop-shadow(0 0 0px rgba(197,160,89,0))",
                "drop-shadow(0 0 24px rgba(197,160,89,0.8))",
                "drop-shadow(0 0 0px rgba(197,160,89,0))",
              ],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <ImageWithFallback
              src={LOGO_ASSET}
              alt="Sukoon"
              style={{ height: "70px", width: "auto", objectFit: "contain" }}
            />
          </motion.div>
        </motion.div>

        {/* Horizontal divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.7 }}
          style={{
            width: "120px",
            height: "1px",
            background: "linear-gradient(90deg, transparent, var(--color-gold), transparent)",
            marginBottom: "22px",
          }}
        />

        {/* Main heading */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.55 }}
        >
          <div
            style={{
              fontSize: "34px",
              fontFamily: "'Cairo', sans-serif",
              fontWeight: 800,
              color: "var(--color-gold)",
              lineHeight: 1.2,
              marginBottom: "6px",
            }}
          >
            شحنت... وتجددت
          </div>
          <div
            style={{
              fontSize: "18px",
              fontFamily: "'Montserrat', sans-serif",
              color: "rgba(197,160,89,0.75)",
              letterSpacing: "0.06em",
              marginBottom: "24px",
            }}
          >
            Charged... and Renewed
          </div>
        </motion.div>

        {/* Farewell text */}
        <motion.div
          initial={{ y: 18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.65, duration: 0.55 }}
          style={{
            background: "rgba(197,160,89,0.06)",
            border: "1px solid rgba(197,160,89,0.18)",
            borderRadius: "18px",
            padding: "20px 22px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              fontSize: "16px",
              fontFamily: "'Cairo', sans-serif",
              color: "rgba(245,245,245,0.85)",
              lineHeight: 1.7,
              direction: "rtl",
              textAlign: "right",
              marginBottom: "12px",
            }}
          >
            شحنت سيارتك بالكامل … نتمنى أن تكون قد استعدت سكونك، نراك قريبًا
          </div>
          <div
            style={{
              height: "0.5px",
              background: "rgba(197,160,89,0.2)",
              marginBottom: "12px",
            }}
          />
          <div
            style={{
              fontSize: "13px",
              fontFamily: "'Montserrat', sans-serif",
              color: "rgba(245,245,245,0.5)",
              lineHeight: 1.6,
              textAlign: "left",
            }}
          >
            Your car is fully charged. We hope you have found your peace, see you soon.
          </div>
        </motion.div>

        {/* 100% Progress Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={{ width: "100%", marginBottom: "28px" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <span
              style={{
                fontSize: "11px",
                fontFamily: "'Montserrat', sans-serif",
                color: "rgba(197,160,89,0.5)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Charge Level
            </span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.5 }}
              style={{
                fontSize: "18px",
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 700,
                color: "var(--color-gold)",
              }}
            >
              100%
            </motion.span>
          </div>
          {/* Progress bar track */}
          <div
            style={{
              width: "100%",
              height: "8px",
              background: "rgba(255,255,255,0.08)",
              borderRadius: "8px",
              overflow: "hidden",
              border: "0.5px solid rgba(197,160,89,0.15)",
            }}
          >
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: `${barProgress}%` }}
              transition={{ delay: 0.9, duration: 1.8, ease: "easeOut" }}
              style={{
                height: "100%",
                background:
                  "linear-gradient(90deg, var(--color-gold-deep), var(--color-gold), #EAD4A2)",
                borderRadius: "8px",
                boxShadow: "0 0 12px rgba(197,160,89,0.5)",
              }}
            />
          </div>
        </motion.div>

        {/* Return home button */}
        <motion.button
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.0 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate("/")}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            width: "100%",
            padding: "14px 24px",
            borderRadius: "16px",
            border: "1.5px solid var(--color-gold)",
            background: "rgba(197,160,89,0.1)",
            color: "var(--color-gold)",
            fontFamily: "'Cairo', sans-serif",
            fontSize: "16px",
            fontWeight: 700,
            cursor: "pointer",
            backdropFilter: "blur(8px)",
          }}
        >
          <Home size={20} />
          <span>العودة للرئيسية</span>
          <span
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "13px",
              opacity: 0.7,
            }}
          >
            / Home
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
}
