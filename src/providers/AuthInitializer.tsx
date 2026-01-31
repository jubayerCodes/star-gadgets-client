"use client";

import Loading from "@/components/layout/loading";
import { useCurrentUser } from "@/features/account/hooks/useAccount";
import { useGetConfig } from "@/features/config/hooks/useConfig";
import { useAuthStore } from "@/store/authStore";
import { useConfigStore } from "@/store/configStore";
import { useEffect } from "react";

export default function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { data, isLoading, isError } = useCurrentUser();

  const { setError, setIsLoading, setUser } = useAuthStore();

  const { data: config, isLoading: configLoading, isError: configError } = useGetConfig();
  const { setConfig, setIsLoading: setConfigLoading, setError: setConfigError } = useConfigStore();

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

  useEffect(() => {
    if (configLoading) {
      setConfigLoading(true);
      return;
    }

    if (config) {
      setConfig(config.data);
      setConfigError(null);
    }

    if (configError) {
      setConfig(null);
      setConfigError(config?.message as string);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config, configLoading, configError]);

  if (isLoading || configLoading) {
    return <Loading />;
  }

  return children;
}
