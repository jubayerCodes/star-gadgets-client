"use client";

import AccountLayout from "@/features/account/components/account-layout";
import AddressForm from "@/features/account/components/address-form";

const BillingAddressPage = () => {
  return (
    <AccountLayout title="My Account">
      <AddressForm
        type="billingAddress"
        title="Billing Address"
        description="This address will be used for payment and invoicing purposes."
      />
    </AccountLayout>
  );
};

export default BillingAddressPage;
