"use client";
import Register from "@/features/account/components/register";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function RegisterPage() {
  const router = useRouter();
  const { user, isLoading } = useAuthStore();

  useEffect(() => {
    if (user && !isLoading) {
      router.push("/account");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isLoading]);

  if (!user && !isLoading) {
    return <Register />;
  }

  return null;
}

export default RegisterPage;
