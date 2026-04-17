import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { LOGO_ASSET, DARK_MARBLE, LIGHT_MARBLE } from "../components/MarbleCard";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Wifi, Battery } from "lucide-react";

interface TransitionScreenProps {
  isDark: boolean;
}

function StatusBar({ isDark }: { isDark: boolean }) {
  const c = isDark ? "rgba(245,245,245,0.8)" : "rgba(30,20,5,0.8)";
  return (
    <div className="flex items-center justify-between px-6 pt-4 pb-1" style={{ color: c }}>
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

export function TransitionScreen({ isDark }: TransitionScreenProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "super";

  // Fixed bay and serial for the session
  const [bay] = useState(Math.floor(Math.random() * 12) + 1);
  const [queueNum] = useState(Math.floor(Math.random() * 50) + 1);
  const queueStr = String(queueNum).padStart(3, "0");

  const [showNotification, setShowNotification] = useState(false);
  const [notificationDismissed, setNotificationDismissed] = useState(false);
  const inactivityRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const gold = "var(--color-gold)";

  // 7-second inactivity timer → amenities
  const resetInactivityTimer = useCallback(() => {
    if (inactivityRef.current) clearTimeout(inactivityRef.current);
    inactivityRef.current = setTimeout(() => {
      navigate("/amenities");
    }, 7000);
  }, [navigate]);

  useEffect(() => {
    // Show notification popup after 1.5 seconds
    const notifTimer = setTimeout(() => setShowNotification(true), 1500);

    // Auto-dismiss notification after 6 seconds
    const dismissTimer = setTimeout(() => {
      setShowNotification(false);
      setNotificationDismissed(true);
    }, 7000);

    // Start inactivity timer
    resetInactivityTimer();

    const handleActivity = () => resetInactivityTimer();
    window.addEventListener("click", handleActivity);
    window.addEventListener("touchstart", handleActivity);

    return () => {
      clearTimeout(notifTimer);
      clearTimeout(dismissTimer);
      if (inactivityRef.current) clearTimeout(inactivityRef.current);
      window.removeEventListener("click", handleActivity);
      window.removeEventListener("touchstart", handleActivity);
    };
  }, [resetInactivityTimer]);

  const marbleBg = isDark ? DARK_MARBLE : LIGHT_MARBLE;
  const overlayBg = isDark
    ? "linear-gradient(180deg, rgba(8,6,3,0.88) 0%, rgba(15,12,5,0.92) 60%, rgba(8,6,2,0.95) 100%)"
    : "linear-gradient(180deg, rgba(248,244,236,0.85) 0%, rgba(240,235,225,0.9) 100%)";

  const textGold = { color: "var(--color-gold)" };
  const textGoldLight = { color: "rgba(197,160,89,0.75)" };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ duration: 0.45 }}
      style={{
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        backgroundImage: `url(${marbleBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        overflow: "hidden",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0" style={{ background: overlayBg }} />

      {/* Gold pulse glow */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ zIndex: 1 }}
      >
        <motion.div
          animate={{ scale: [1, 1.6, 1], opacity: [0.04, 0.12, 0.04] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "var(--color-gold)",
            filter: "blur(80px)",
          }}
        />
      </motion.div>

      {/* Status Bar */}
      <div style={{ position: "relative", zIndex: 10 }}>
        <StatusBar isDark={isDark} />
      </div>

      {/* Main Content */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingLeft: "20px",
          paddingRight: "20px",
          overflowY: "auto",
        }}
      >
        {/* Logo with pulsing glow */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          style={{ marginTop: "8px", marginBottom: "4px" }}
        >
          <motion.div
            animate={{
              filter: [
                "drop-shadow(0 0 0px rgba(197,160,89,0))",
                "drop-shadow(0 0 28px rgba(197,160,89,0.9))",
                "drop-shadow(0 0 0px rgba(197,160,89,0))",
              ],
            }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ImageWithFallback
              src={LOGO_ASSET}
              alt="Sukoon"
              style={{ height: "80px", width: "auto", objectFit: "contain" }}
            />
          </motion.div>
        </motion.div>

        {/* Welcome heading */}
        <motion.div
          initial={{ y: 18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          style={{ textAlign: "center", marginBottom: "10px" }}
        >
          <div
            style={{
              fontSize: "27px",
              fontWeight: 700,
              fontFamily: "'Cairo', sans-serif",
              ...textGold,
              lineHeight: 1.3,
            }}
          >
            وجهتك تضيء لك
          </div>
          <div
            style={{
              fontSize: "14px",
              fontFamily: "'Montserrat', sans-serif",
              ...textGoldLight,
              letterSpacing: "0.04em",
              marginTop: "3px",
            }}
          >
            Your path shines for you
          </div>
        </motion.div>

        {/* Bay & Queue Info Box */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          style={{
            width: "100%",
            background: isDark
              ? "rgba(197,160,89,0.07)"
              : "rgba(197,160,89,0.06)",
            border: "1px solid rgba(197,160,89,0.3)",
            borderRadius: "20px",
            padding: "18px 20px",
            marginBottom: "10px",
            backdropFilter: "blur(8px)",
          }}
        >
          {/* Bay line */}
          <div style={{ textAlign: "center", marginBottom: "10px" }}>
            <div
              style={{
                fontSize: "16px",
                fontFamily: "'Cairo', sans-serif",
                ...textGoldLight,
                lineHeight: 1.4,
              }}
            >
              يرجى التوجه للموقف رقم{" "}
              <span
                style={{ ...textGold, fontWeight: 800, fontSize: "20px" }}
              >
                [{bay}]
              </span>
            </div>
            <div
              style={{
                fontSize: "12px",
                fontFamily: "'Montserrat', sans-serif",
                color: "rgba(197,160,89,0.55)",
                marginTop: "2px",
              }}
            >
              Please proceed to Bay [{bay}]
            </div>
          </div>

          {/* Divider */}
          <div
            style={{
              height: "1px",
              background: "rgba(197,160,89,0.2)",
              marginBottom: "10px",
            }}
          />

          {/* Queue number — large and prominent */}
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "13px",
                fontFamily: "'Cairo', sans-serif",
                ...textGoldLight,
              }}
            >
              دورك
            </div>
            <div
              style={{
                fontSize: "62px",
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 800,
                ...textGold,
                lineHeight: 1,
                letterSpacing: "0.05em",
              }}
            >
              {queueStr}
            </div>
            <div
              style={{
                fontSize: "12px",
                fontFamily: "'Montserrat', sans-serif",
                color: "rgba(197,160,89,0.5)",
                marginTop: "4px",
              }}
            >
              Your queue: {queueStr}
            </div>
          </div>
        </motion.div>

        {/* "Car is charging" subtitle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: "12px" }}
        >
          <div style={{ fontSize: "13px", fontFamily: "'Cairo', sans-serif", color: "rgba(197,160,89,0.5)" }}>
            سيارتك تشحن بهدوء...
          </div>
          <div
            style={{
              fontSize: "11px",
              fontFamily: "'Montserrat', sans-serif",
              color: "rgba(197,160,89,0.35)",
              letterSpacing: "0.04em",
            }}
          >
            Your car is charging quietly...
          </div>
        </motion.div>

        {/* Complete Charge button (demo) */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          whileTap={{ scale: 0.96 }}
          onClick={(e) => {
            e.stopPropagation();
            navigate("/completion");
          }}
          style={{
            padding: "10px 28px",
            borderRadius: "40px",
            border: "1.5px solid var(--color-gold)",
            background: "transparent",
            color: "var(--color-gold)",
            fontFamily: "'Cairo', sans-serif",
            fontSize: "14px",
            cursor: "pointer",
            marginBottom: "8px",
          }}
        >
          اكتمل الشحن / Charge Complete
        </motion.button>
      </div>

      {/* Inactivity hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        style={{
          position: "relative",
          zIndex: 10,
          textAlign: "center",
          paddingBottom: "20px",
          paddingTop: "4px",
        }}
      >
        <motion.div
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          style={{
            fontSize: "10px",
            fontFamily: "'Montserrat', sans-serif",
            color: "rgba(197,160,89,0.45)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          Explore amenities in 7 seconds...
        </motion.div>
      </motion.div>

      {/* Welcome Notification Popup */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ type: "spring", damping: 22, stiffness: 220 }}
            style={{
              position: "fixed",
              bottom: "30px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "calc(100% - 40px)",
              maxWidth: "390px",
              background: isDark
                ? "rgba(20,16,8,0.93)"
                : "rgba(255,252,245,0.96)",
              border: "1.5px solid rgba(197,160,89,0.5)",
              borderRadius: "22px",
              padding: "16px 18px",
              zIndex: 100,
              backdropFilter: "blur(20px)",
              boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
            onClick={(e) => {
              e.stopPropagation();
              setShowNotification(false);
              setNotificationDismissed(true);
            }}
          >
            {/* Logo icon */}
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                border: "1.5px solid rgba(197,160,89,0.4)",
                background: "rgba(197,160,89,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <ImageWithFallback
                src={LOGO_ASSET}
                alt="Sukoon"
                style={{ width: "28px", height: "28px", objectFit: "contain" }}
              />
            </div>

            {/* Text */}
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: "14px",
                  fontFamily: "'Cairo', sans-serif",
                  fontWeight: 700,
                  color: "var(--color-gold)",
                  lineHeight: 1.4,
                  textAlign: "right",
                  direction: "rtl",
                }}
              >
                أهلاً بك، شاحنك رقم {bay} وبرقم تسلسلي {queueStr} يضيء لك
              </div>
              <div
                style={{
                  fontSize: "11px",
                  fontFamily: "'Montserrat', sans-serif",
                  color: "rgba(197,160,89,0.65)",
                  lineHeight: 1.4,
                  marginTop: "4px",
                }}
              >
                Welcome, your charger Bay {bay} with serial number {queueStr} shines for you.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
