// app/(client)/layout.tsx
import Header from "@/components/layout/header";
import { QUERY_KEYS } from "@/constants";
import { getConfigApi } from "@/features/config/api";
import { getCurrentUserApi } from "@/features/account/api";
import { makeQueryClient } from "@/lib/queryClient";

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const queryClient = makeQueryClient();

  await queryClient.prefetchQuery({
    queryKey: [QUERY_KEYS.CONFIG],
    queryFn: getConfigApi,
  });

  await queryClient.prefetchQuery({
    queryKey: [QUERY_KEYS.PROFILE],
    queryFn: getCurrentUserApi,
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
    </div>
  );
}
