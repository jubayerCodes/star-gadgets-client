"use client";

import ProtectedRoute from "@/components/shared/protected-route";
import WishlistContent from "@/features/account/components/wishlist-content";

const WishlistPage = () => {
  return (
    <ProtectedRoute>
      <WishlistContent />
    </ProtectedRoute>
  );
};

export default WishlistPage;
