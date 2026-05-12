import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Star Gadgets",
  description:
    "Read the Star Gadgets Privacy Policy to understand how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <main>
      {/* Hero */}
      <div className="bg-[#181a24] text-white py-14">
        <div className="container">
          <div className="flex items-center gap-2 text-sm text-white/50 mb-4">
            <Link href="/" className="hover:text-white transition">
              Home
            </Link>
            <span>/</span>
            <span className="text-white/80">Privacy Policy</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">Privacy Policy</h1>
          <p className="text-white/60 mt-2 text-sm">Last updated: April 2025</p>
        </div>
      </div>

      {/* Content */}
      <section className="py-14">
        <div className="container max-w-3xl">
          <div className="prose prose-sm max-w-none text-muted-foreground flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-bold text-foreground">1. Introduction</h2>
              <p>
                Star Gadgets (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to protecting your
                personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your
                information when you visit our website or make a purchase from us. Please read this policy carefully.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-bold text-foreground">2. Information We Collect</h2>
              <p>We may collect the following categories of information:</p>
              <ul className="list-disc list-inside space-y-1.5">
                <li>
                  <strong>Personal Identification:</strong> Name, email address, phone number.
                </li>
                <li>
                  <strong>Address Information:</strong> Billing and shipping addresses for order processing.
                </li>
                <li>
                  <strong>Account Credentials:</strong> Encrypted passwords for registered accounts.
                </li>
                <li>
                  <strong>Transaction Data:</strong> Order history, payment references (not full card details).
                </li>
                <li>
                  <strong>Usage Data:</strong> Pages visited, browser type, IP address, and device information.
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-bold text-foreground">3. How We Use Your Information</h2>
              <ul className="list-disc list-inside space-y-1.5">
                <li>To process and fulfill your orders.</li>
                <li>To manage and secure your account.</li>
                <li>To send order confirmations and shipping updates.</li>
                <li>To respond to your customer service requests.</li>
                <li>To improve our website, products, and services.</li>
                <li>To comply with legal obligations.</li>
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-bold text-foreground">4. Information Sharing</h2>
              <p>
                We do not sell, trade, or rent your personal information to third parties. We may share your information
                with trusted service providers who assist in operating our website and conducting our business, subject
                to confidentiality agreements. These include:
              </p>
              <ul className="list-disc list-inside space-y-1.5">
                <li>Payment gateway providers (e.g. SSLCommerz) for secure transaction processing.</li>
                <li>Delivery and logistics partners for order fulfilment.</li>
                <li>Cloud service providers for data storage and hosting.</li>
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-bold text-foreground">5. Data Security</h2>
              <p>
                We implement industry-standard security measures including SSL encryption, bcrypt password hashing, and
                secure HTTP-only cookies to protect your personal data. While we strive to protect your information, no
                method of transmission over the Internet is 100% secure.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-bold text-foreground">6. Cookies</h2>
              <p>
                We use cookies to enhance your experience, maintain your session, and analyse site usage. Please refer
                to our{" "}
                <Link href="/cookie-policy" className="text-primary hover:underline">
                  Cookie Policy
                </Link>{" "}
                for full details.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-bold text-foreground">7. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc list-inside space-y-1.5">
                <li>Access the personal data we hold about you.</li>
                <li>Request correction of inaccurate data.</li>
                <li>Request deletion of your data (subject to legal obligations).</li>
                <li>Withdraw consent for data processing where consent is the legal basis.</li>
              </ul>
              <p>
                To exercise these rights, please contact us at{" "}
                <a href="mailto:info@stargadgets.com" className="text-primary hover:underline">
                  info@stargadgets.com
                </a>
                .
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-bold text-foreground">8. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated
                revision date. Continued use of our website after changes constitutes acceptance of the updated policy.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-bold text-foreground">9. Contact</h2>
              <p>
                For any questions regarding this Privacy Policy, please{" "}
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
