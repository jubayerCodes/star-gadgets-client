"use client";

import AccountLayout from "@/features/account/components/account-layout";
import WishlistContent from "@/features/account/components/wishlist-content";

const WishlistPage = () => {
  return (
    <AccountLayout title="My Account">
      <WishlistContent />
    </AccountLayout>
  );
};

export default WishlistPage;
