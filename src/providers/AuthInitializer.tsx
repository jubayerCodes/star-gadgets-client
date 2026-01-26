"use client";

import Loading from "@/components/layout/loading";
import { useCurrentUser } from "@/features/account/hooks/useAccount";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";

export default function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { data, isLoading, isError } = useCurrentUser();

  const { setError, setIsLoading, setUser } = useAuthStore();

  useEffect(() => {
    if (isLoading) {
      setIsLoading(true);
      return;
    }

    if (data) {
      setUser(data.data);
      setError(null);
    }

    if (isError) {
      setUser(null);
      setError(data?.message as string);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isLoading, isError]);

  if (isLoading) {
    return <Loading />;
  }

  return children;
}
