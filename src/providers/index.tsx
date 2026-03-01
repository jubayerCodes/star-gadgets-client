"use client";

import { makeQueryClient } from "@/lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import AuthInitializer from "./AuthInitializer";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Providers({ children }: any) {
  const [queryClient] = useState(() => makeQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthInitializer>{children}</AuthInitializer>
      {/* <ReactQueryDevtools  initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
}
