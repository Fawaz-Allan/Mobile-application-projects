import { motion } from "motion/react";
import { Sun, Moon } from "lucide-react";

// Marble textures
export const LIGHT_MARBLE = "https://images.unsplash.com/photo-1630756377422-7cfae60dd550?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";
export const DARK_MARBLE = "https://images.unsplash.com/photo-1582035100994-9ddfc34b1dae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";

// Logo asset (from Figma)
export const LOGO_ASSET = "figma:asset/10d6cd75fdd6fa1533831d697f9147cf0e2c3e43.png";

// Amenities data
export const AMENITIES = [
  {
    name: "Café",
    nameAr: "المقهى",
    image: "https://images.unsplash.com/photo-1696871390892-235fedbb2c92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    name: "Masjid",
    nameAr: "المسجد",
    image: "https://images.unsplash.com/photo-1761639935344-e08947c61551?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    name: "Restroom",
    nameAr: "دورات المياه",
    image: "https://images.unsplash.com/photo-1638799869566-b17fa794c4de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    name: "Mechanic",
    nameAr: "الميكانيكي",
    image: "https://images.unsplash.com/photo-1675034743126-0f250a5fee51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    name: "Supermarket",
    nameAr: "السوبر ماركت",
    image: "https://images.unsplash.com/photo-1771703063283-8d7c86fadef6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
];

// Marble Card component for Selection Screen
export function MarbleCard({
  children,
  onClick,
  className = "",
  isDark = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  isDark?: boolean;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl border border-[var(--color-gold)] w-full ${className}`}
      style={{
        backgroundImage: `url(${isDark ? DARK_MARBLE : LIGHT_MARBLE})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        boxShadow: isDark
          ? "0 4px 24px rgba(197,160,89,0.15), inset 0 0 0 1px rgba(197,160,89,0.1)"
          : "0 4px 24px rgba(0,0,0,0.1), inset 0 0 0 1px rgba(197,160,89,0.2)",
      }}
    >
      <div
        className={`absolute inset-0 ${isDark ? "bg-black/55" : "bg-white/30"}`}
      />
      <div className="relative z-10 flex items-center gap-4 px-5 py-5">
        {children}
      </div>
    </motion.button>
  );
}

// Theme toggle button
export function ThemeToggle({
  isDark,
  onToggle,
}: {
  isDark: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="w-9 h-9 rounded-full backdrop-blur-md border border-[var(--color-gold)]/50 text-[var(--color-gold)] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.25)" }}
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
