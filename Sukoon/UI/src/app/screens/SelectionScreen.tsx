import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { MarbleCard, LOGO_ASSET, LIGHT_MARBLE, DARK_MARBLE } from "../components/MarbleCard";
import { Zap, Leaf, Home, LayoutGrid, User, Wifi, Battery } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

interface SelectionScreenProps {
  isDark: boolean;
}

// Status bar mock
function StatusBar({ isDark }: { isDark: boolean }) {
  const textColor = isDark ? "#F5F5F5" : "#1a1a1a";
  return (
    <div
      className="flex items-center justify-between px-6 pt-4 pb-2"
      style={{ color: textColor }}
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

export function SelectionScreen({ isDark }: SelectionScreenProps) {
  const navigate = useNavigate();

  const handleSelect = (type: "super" | "eco") => {
    navigate(`/transition?type=${type}`);
  };

  const gold = "var(--color-gold)";
  const goldDeep = "var(--color-gold-deep)";
  const textMain = isDark ? "#F5F5F5" : "#2a1f0a";
  const textSub = isDark ? "rgba(245,245,245,0.7)" : "rgba(60,40,10,0.7)";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col"
      style={{
        height: "100dvh",
        backgroundImage: `url(${isDark ? DARK_MARBLE : LIGHT_MARBLE})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}
    >
      {/* Background overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: isDark
            ? "linear-gradient(180deg, rgba(10,10,10,0.82) 0%, rgba(15,12,8,0.88) 100%)"
            : "linear-gradient(180deg, rgba(255,253,248,0.88) 0%, rgba(248,245,238,0.92) 100%)",
        }}
      />

      {/* Status Bar */}
      <div className="relative z-10">
        <StatusBar isDark={isDark} />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col flex-1 px-5 pb-2">

        {/* Logo Section */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="flex flex-col items-center pt-6 pb-8"
        >
          <ImageWithFallback
            src={LOGO_ASSET}
            alt="Sukoon Logo"
            style={{ height: "72px", width: "auto", objectFit: "contain" }}
          />
        </motion.div>

        {/* Divider line */}
        <div
          style={{
            height: "1px",
            background: `linear-gradient(90deg, transparent, ${gold}, transparent)`,
            marginBottom: "32px",
            opacity: 0.5,
          }}
        />

        {/* Cards */}
        <div className="flex flex-col gap-4 flex-1">

          {/* DC Superfast Card */}
          <motion.div
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <MarbleCard isDark={isDark} onClick={() => handleSelect("super")} className="h-24">
              {/* Icon */}
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "50%",
                  border: `2px solid ${gold}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: isDark ? "rgba(197,160,89,0.15)" : "rgba(197,160,89,0.12)",
                  flexShrink: 0,
                }}
              >
                <Zap size={24} style={{ color: gold }} />
              </div>

              {/* Text block - right aligned for Arabic */}
              <div style={{ flex: 1, textAlign: "right" }}>
                <div
                  style={{
                    fontSize: "19px",
                    fontWeight: 700,
                    color: isDark ? gold : goldDeep,
                    lineHeight: 1.3,
                    fontFamily: "'Cairo', sans-serif",
                  }}
                >
                  الشحن الفائق DC
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: isDark ? "rgba(197,160,89,0.75)" : "rgba(100,70,20,0.8)",
                    fontFamily: "'Montserrat', sans-serif",
                    marginTop: "2px",
                  }}
                >
                  Superfast Charge
                </div>
              </div>
            </MarbleCard>
          </motion.div>

          {/* Eco Sustainable Card */}
          <motion.div
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.42, duration: 0.5 }}
          >
            <MarbleCard isDark={isDark} onClick={() => handleSelect("eco")} className="h-24">
              {/* Icon */}
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "50%",
                  border: `2px solid ${gold}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: isDark ? "rgba(197,160,89,0.15)" : "rgba(197,160,89,0.12)",
                  flexShrink: 0,
                }}
              >
                <Leaf size={24} style={{ color: gold }} />
              </div>

              {/* Text block */}
              <div style={{ flex: 1, textAlign: "right" }}>
                <div
                  style={{
                    fontSize: "19px",
                    fontWeight: 700,
                    color: isDark ? gold : goldDeep,
                    lineHeight: 1.3,
                    fontFamily: "'Cairo', sans-serif",
                  }}
                >
                  الشحن المستدام
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: isDark ? "rgba(197,160,89,0.75)" : "rgba(100,70,20,0.8)",
                    fontFamily: "'Montserrat', sans-serif",
                    marginTop: "2px",
                  }}
                >
                  (Eco charge) Sustainable Eco Charge
                </div>
              </div>
            </MarbleCard>
          </motion.div>

          {/* Gold quote text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-col items-center"
            style={{ marginTop: "auto", paddingBottom: "12px" }}
          >
            <div
              style={{
                fontSize: "13px",
                color: isDark ? "rgba(197,160,89,0.5)" : "rgba(140,109,49,0.6)",
                fontFamily: "'Cairo', sans-serif",
                textAlign: "center",
              }}
            >
              اختر نوع الشحن المناسب لك
            </div>
            <div
              style={{
                fontSize: "11px",
                color: isDark ? "rgba(197,160,89,0.35)" : "rgba(140,109,49,0.45)",
                fontFamily: "'Montserrat', sans-serif",
                textAlign: "center",
                marginTop: "2px",
                letterSpacing: "0.05em",
              }}
            >
              Select your charging type
            </div>
          </motion.div>
        </div>

        {/* Bottom Navigation */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.4 }}
        >
          <div
            style={{
              borderTop: `1px solid ${isDark ? "rgba(197,160,89,0.2)" : "rgba(197,160,89,0.3)"}`,
              background: isDark ? "rgba(15,12,8,0.85)" : "rgba(255,252,245,0.85)",
              backdropFilter: "blur(12px)",
              paddingTop: "12px",
              paddingBottom: "20px",
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            {/* Home (active) */}
            <div className="flex flex-col items-center gap-1" style={{ cursor: "pointer" }}>
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "8px",
                  background: `rgba(197,160,89,0.15)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Home size={16} style={{ color: gold }} />
              </div>
              <span style={{ fontSize: "10px", color: gold, fontFamily: "'Montserrat', sans-serif" }}>
                Home
              </span>
            </div>

            {/* Amenities */}
            <div
              className="flex flex-col items-center gap-1"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/amenities")}
            >
              <LayoutGrid
                size={20}
                style={{ color: isDark ? "rgba(245,245,245,0.4)" : "rgba(60,40,10,0.4)" }}
              />
              <span
                style={{
                  fontSize: "10px",
                  color: isDark ? "rgba(245,245,245,0.4)" : "rgba(60,40,10,0.4)",
                  fontFamily: "'Montserrat', sans-serif",
                }}
              >
                Amenities
              </span>
            </div>

            {/* Account */}
            <div className="flex flex-col items-center gap-1" style={{ cursor: "pointer" }}>
              <User
                size={20}
                style={{ color: isDark ? "rgba(245,245,245,0.4)" : "rgba(60,40,10,0.4)" }}
              />
              <span
                style={{
                  fontSize: "10px",
                  color: isDark ? "rgba(245,245,245,0.4)" : "rgba(60,40,10,0.4)",
                  fontFamily: "'Montserrat', sans-serif",
                }}
              >
                Account
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
