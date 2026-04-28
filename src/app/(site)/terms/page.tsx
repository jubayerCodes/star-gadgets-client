import Link from "next/link";

export const metadata = {
  title: "Terms & Conditions | Star Gadgets",
  description: "Read the Star Gadgets Terms and Conditions governing the use of our website and purchase of our products.",
};

export default function TermsPage() {
  return (
    <main>
      {/* Hero */}
      <div className="bg-[#181a24] text-white py-14">
        <div className="container">
          <div className="flex items-center gap-2 text-sm text-white/50 mb-4">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <span>/</span>
            <span className="text-white/80">Terms &amp; Conditions</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">Terms &amp; Conditions</h1>
          <p className="text-white/60 mt-2 text-sm">Last updated: April 2025</p>
        </div>
      </div>

      {/* Content */}
      <section className="py-14">
        <div className="container max-w-3xl">
          <div className="flex flex-col gap-8 text-muted-foreground text-sm leading-relaxed">

            <p>
              Welcome to Star Gadgets. By accessing or using our website and services, you agree to be
              bound by these Terms &amp; Conditions. Please read them carefully before proceeding.
            </p>

            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-bold text-foreground">1. Acceptance of Terms</h2>
              <p>
                By placing an order or creating an account on stargadgets.com, you confirm that you are at
                least 18 years old (or have parental consent), and that you accept these Terms &amp; Conditions
                in full. If you disagree with any part of these terms, you must not use our website.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-bold text-foreground">2. Products &amp; Pricing</h2>
              <ul className="list-disc list-inside space-y-1.5">
                <li>All product prices are displayed in Bangladeshi Taka (BDT).</li>
                <li>Prices are subject to change without notice.</li>
                <li>We reserve the right to cancel orders if a pricing error occurs.</li>
                <li>Product images are for illustrative purposes; minor variations may exist.</li>
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-bold text-foreground">3. Orders &amp; Payment</h2>
              <p>
                Orders are subject to availability and acceptance. We reserve the right to refuse or cancel
                any order at our discretion. Payment must be made in full at the time of purchase via our
                supported payment methods (Cash on Delivery or SSLCommerz online payment). Online paid orders
                cannot be cancelled once payment is confirmed.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-bold text-foreground">4. Shipping &amp; Delivery</h2>
              <p>
                Delivery times are estimates and may vary based on location and product availability. Star
                Gadgets is not liable for delays caused by third-party couriers, natural disasters, or other
                events beyond our control. Risk of loss passes to the customer upon delivery.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-bold text-foreground">5. Account Responsibility</h2>
              <p>
                You are responsible for maintaining the confidentiality of your account credentials and for
                all activities that occur under your account. Please notify us immediately of any unauthorised
                use of your account.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-bold text-foreground">6. Intellectual Property</h2>
              <p>
                All content on this website — including logos, images, text, and code — is the property of
                Star Gadgets and may not be reproduced, distributed, or used without prior written consent.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-bold text-foreground">7. Limitation of Liability</h2>
              <p>
                Star Gadgets shall not be liable for any indirect, incidental, or consequential damages
                arising from the use of our products or services, except as required by applicable law.
                Our liability is limited to the value of the order in question.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-bold text-foreground">8. Governing Law</h2>
              <p>
                These Terms &amp; Conditions are governed by the laws of Bangladesh. Any disputes shall be
                subject to the exclusive jurisdiction of the courts of Dhaka.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-bold text-foreground">9. Changes to Terms</h2>
              <p>
                We may revise these Terms &amp; Conditions at any time without notice. Continued use of our
                website after changes constitutes your acceptance of the updated terms.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-bold text-foreground">10. Contact</h2>
              <p>
                For questions about these Terms, please{" "}
                <Link href="/contact" className="text-primary hover:underline">
                  contact us
                </Link>
                .
              </p>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
