"use client";

import Loading from "@/components/layout/loading";
import { useCurrentUser } from "@/features/account/hooks/useAccount";
import { useGetConfig } from "@/features/config/hooks/useConfig";
import { useAuthStore } from "@/store/authStore";
import { useConfigStore } from "@/store/configStore";
import { useEffect, useState } from "react";

export default function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { data, isLoading, isError } = useCurrentUser();
  const { setError, setUser } = useAuthStore();

  const { data: config, isLoading: configLoading, isError: configError } = useGetConfig();
  const { setConfig, setIsLoading: setConfigLoading, setError: setConfigError } = useConfigStore();

  // Controls the fade-out animation (true = fading) and whether overlay is in DOM
  const [hiding, setHiding] = useState(false);
  const [overlayMounted, setOverlayMounted] = useState(true);

  const isReady = !isLoading && !configLoading;

  // Kick off the fade-out as soon as both requests settle
  useEffect(() => {
    if (isReady && overlayMounted) {
      setHiding(true);
      // Remove from DOM after the 500ms CSS transition finishes
      const timer = setTimeout(() => setOverlayMounted(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isReady, overlayMounted]);

  useEffect(() => {
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

  return (
    <>
      {/* Always render children — per-section skeletons handle their own loading states */}
      {children}

      {/* Overlay sits on top and fades out when ready, then unmounts */}
      {overlayMounted && <Loading hiding={hiding} />}
    </>
  );
}
