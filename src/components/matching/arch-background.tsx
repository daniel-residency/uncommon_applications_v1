"use client";

interface ArchBackgroundProps {
  children: React.ReactNode;
}

export default function ArchBackground({ children }: ArchBackgroundProps) {
  return (
    <div className="h-screen relative overflow-hidden" style={{ background: "#FFFFFF" }}>
      {/* arch background image — 30% opacity with warm color grading per Figma */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "url(/arch-background.png)",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
          opacity: 0.3,
          filter: "brightness(1.15) contrast(0.83) saturate(1.0) sepia(0.08)",
        }}
      />

      {/* content layer */}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
}
