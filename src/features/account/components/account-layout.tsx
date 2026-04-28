"use client";

import ProtectedRoute from "@/components/shared/protected-route";
import AccountSidebar from "./account-sidebar";

interface AccountLayoutProps {
  title: string;
  children: React.ReactNode;
}

const AccountLayout = ({ title, children }: AccountLayoutProps) => {
  return (
    <ProtectedRoute>
      <section className="py-10">
        <div className="container">
          <h1 className="text-2xl font-bold mb-8">{title}</h1>
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <AccountSidebar />
            <div className="flex-1 min-w-0">{children}</div>
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
};

export default AccountLayout;
