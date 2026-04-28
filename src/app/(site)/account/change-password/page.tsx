"use client";

import AccountLayout from "@/features/account/components/account-layout";
import ChangePassword from "@/features/account/components/change-password";

const ChangePasswordPage = () => {
  return (
    <AccountLayout title="My Account">
      <ChangePassword />
    </AccountLayout>
  );
};

export default ChangePasswordPage;
