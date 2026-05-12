/* eslint-disable @next/next/no-img-element */
// components/GoogleLoginButton.tsx
"use client";

export default function GoogleLoginButton() {
  const handleGoogleLogin = () => {
    // Simply redirect to your backend — Passport handles the rest
    window.location.href = "http://localhost:5000/api/v1/auth/google";
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
    >
      <img src="/google-icon.svg" alt="Google" className="w-5 h-5" />
      Continue with Google
    </button>
  );
}
