// app/(client)/layout.tsx
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
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
    <div className="min-h-screen flex flex-col pb-16 lg:pb-0">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
