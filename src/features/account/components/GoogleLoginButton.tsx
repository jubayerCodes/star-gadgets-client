
"use client";

import { Button } from "@/components/ui/button";
import { FaGoogle } from "react-icons/fa";

export default function GoogleLoginButton() {
  const handleGoogleLogin = () => {
    // Simply redirect to your backend — Passport handles the rest
    window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/google`;
  };

  return (
    <Button onClick={handleGoogleLogin}>
      <FaGoogle />
      Continue with Google
    </Button>
  );
}
