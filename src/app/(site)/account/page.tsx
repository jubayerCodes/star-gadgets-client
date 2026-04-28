"use client";

import AccountLayout from "@/features/account/components/account-layout";
import ProfileInfo from "@/features/account/components/profile-info";

const AccountPage = () => {
  return (
    <AccountLayout title="My Account">
      <ProfileInfo />
    </AccountLayout>
  );
};

export default AccountPage;
