"use client";

import ProtectedRoute from "@/components/shared/protected-route";

const Account = () => {
  return (
    <ProtectedRoute>
      <div>Account</div>
    </ProtectedRoute>
  );
};

export default Account;
