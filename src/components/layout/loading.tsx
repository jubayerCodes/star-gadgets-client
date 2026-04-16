"use client";

interface LoadingOverlayProps {
  hiding?: boolean;
}

const Loading = ({ hiding = false }: LoadingOverlayProps) => {
  return (
    <div
      className={`fixed inset-0 z-9999 flex flex-col items-center justify-center bg-background transition-opacity duration-500 ${
        hiding ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Logo pulse ring */}
      <div className="relative flex items-center justify-center">
        <span className="absolute inline-flex h-16 w-16 rounded-full bg-primary/20 animate-ping" />
        <span className="relative inline-flex h-10 w-10 rounded-full bg-primary/80" />
      </div>

      <style>{`
        @keyframes loading-bar {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(280%); }
        }
      `}</style>
    </div>
  );
};

export default Loading;
