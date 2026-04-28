"use client";

import AccountLayout from "@/features/account/components/account-layout";
import AddressForm from "@/features/account/components/address-form";

const ShippingAddressPage = () => {
  return (
    <AccountLayout title="My Account">
      <AddressForm
        type="shippingAddress"
        title="Shipping Address"
        description="This address will be used as your default delivery address."
      />
    </AccountLayout>
  );
};

export default ShippingAddressPage;
