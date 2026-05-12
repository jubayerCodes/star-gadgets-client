import Link from "next/link";

export const metadata = {
  title: "Cookie Policy | Star Gadgets",
  description: "Learn how Star Gadgets uses cookies to improve your browsing experience.",
};

export default function CookiePolicyPage() {
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
            <span className="text-white/80">Cookie Policy</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">Cookie Policy</h1>
          <p className="text-white/60 mt-2 text-sm">Last updated: April 2025</p>
        </div>
      </div>

      {/* Content */}
      <section className="py-14">
        <div className="container max-w-3xl">
          <div className="flex flex-col gap-8 text-muted-foreground text-sm leading-relaxed">
            <p>
              This Cookie Policy explains how Star Gadgets uses cookies and similar technologies when you visit our
              website. By continuing to use our site, you consent to our use of cookies as described in this policy.
            </p>

            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-bold text-foreground">1. What Are Cookies?</h2>
              <p>
                Cookies are small text files placed on your device by a website when you visit. They are widely used to
                make websites work more efficiently, to remember your preferences, and to provide analytical information
                to website owners.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-bold text-foreground">2. How We Use Cookies</h2>
              <p>Star Gadgets uses the following types of cookies:</p>

              <div className="flex flex-col gap-4 mt-1">
                <div className="border border-border p-4 bg-card">
                  <p className="font-semibold text-foreground mb-1">Strictly Necessary Cookies</p>
                  <p>
                    These cookies are essential for you to use the website and cannot be disabled. They are used for
                    authentication (keeping you logged in), maintaining your shopping cart, and securing your session.
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Examples: <code>accessToken</code>, <code>refreshToken</code>
                  </p>
                </div>

                <div className="border border-border p-4 bg-card">
                  <p className="font-semibold text-foreground mb-1">Functional Cookies</p>
                  <p>
                    These cookies allow us to remember choices you make (such as saved cart items and wishlist) and
                    provide enhanced features. Disabling these may affect site functionality.
                  </p>
                </div>

                <div className="border border-border p-4 bg-card">
                  <p className="font-semibold text-foreground mb-1">Analytics Cookies</p>
                  <p>
                    We may use analytics tools to collect anonymised information about how visitors use our website.
                    This helps us understand which pages are most visited and how to improve the user experience. No
                    personally identifiable information is collected.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-bold text-foreground">3. Third-Party Cookies</h2>
              <p>
                When you make a payment via SSLCommerz, their payment pages may set their own cookies as part of the
                secure transaction process. We do not control these cookies. Please refer to SSLCommerz&apos;s privacy
                policy for details.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-bold text-foreground">4. Managing Cookies</h2>
              <p>
                You can control and delete cookies through your browser settings. Most browsers allow you to refuse new
                cookies, accept or reject specific cookies, and delete all cookies. Please note that disabling strictly
                necessary cookies may prevent you from logging in or using core features of the website.
              </p>
              <p>For more information on managing cookies, visit:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  <a
                    href="https://support.google.com/chrome/answer/95647"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Google Chrome
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.mozilla.org/en-US/kb/clear-cookies-and-site-data-firefox"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Mozilla Firefox
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.apple.com/guide/safari/manage-cookies-sfri11471"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Apple Safari
                  </a>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-bold text-foreground">5. Changes to This Policy</h2>
              <p>
                We may update this Cookie Policy from time to time. Updates will be posted on this page with a revised
                date.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-bold text-foreground">6. Contact</h2>
              <p>
                If you have questions about our use of cookies, please{" "}
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
