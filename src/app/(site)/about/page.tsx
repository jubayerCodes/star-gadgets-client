import Link from "next/link";
import { Star, Shield, Zap, Users, Package, Globe } from "lucide-react";

export const metadata = {
  title: "About Us | Star Gadgets",
  description:
    "Learn about Star Gadgets — your trusted source for imported tech gadgets, electronics, and accessories.",
};

const stats = [
  { label: "Products Available", value: "500+" },
  { label: "Happy Customers", value: "10K+" },
  { label: "Years in Business", value: "5+" },
  { label: "Brands Partnered", value: "50+" },
];

const values = [
  {
    icon: Shield,
    title: "Authenticity Guaranteed",
    desc: "Every product we sell is genuine and sourced from certified international suppliers.",
  },
  {
    icon: Zap,
    title: "Latest Technology",
    desc: "We constantly update our inventory with the newest gadgets and electronics from around the world.",
  },
  {
    icon: Users,
    title: "Customer First",
    desc: "Our team is always available to guide you, resolve issues, and ensure your satisfaction.",
  },
  {
    icon: Package,
    title: "Safe Delivery",
    desc: "We use professional packaging to ensure your gadgets arrive in perfect condition.",
  },
  {
    icon: Globe,
    title: "Global Imports",
    desc: "We import directly from overseas markets, giving you access to products not available locally.",
  },
  {
    icon: Star,
    title: "Quality Standards",
    desc: "Our strict quality checks mean you only get the best-rated, most reliable products.",
  },
];

export default function AboutPage() {
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
            <span className="text-white/80">About Us</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">About Star Gadgets</h1>
          <p className="text-white/60 mt-3 max-w-2xl">
            Your trusted destination for premium imported gadgets and electronics in Bangladesh.
          </p>
        </div>
      </div>

      {/* Our Story */}
      <section className="py-14">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Our Story</p>
                <h2 className="text-2xl md:text-3xl font-bold leading-tight">
                  Bringing the World&apos;s Best Gadgets to Your Doorstep
                </h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Star Gadgets was founded with a simple mission: to make premium international gadgets accessible to
                everyone in Bangladesh. We noticed that many of the best tech products available globally were either
                unavailable locally or sold at inflated prices through unofficial channels.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We established direct import relationships with certified suppliers across Asia, Europe, and North
                America — enabling us to offer authentic products at fair prices. Today, we operate from our flagship
                location in Savar, Dhaka and serve customers across the entire country through our online platform.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We mainly import goods from overseas. If anything crosses your mind, feel free to knock us — we&apos;d
                love to make you happy by serving your desired product.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, i) => (
                <div key={i} className="border border-border bg-card p-6 text-center flex flex-col gap-1">
                  <p className="text-3xl font-bold text-primary">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-14 bg-muted/30 border-y border-border">
        <div className="container">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Why Choose Us</p>
            <h2 className="text-2xl font-bold">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((item, i) => (
              <div key={i} className="bg-card border border-border p-6 flex flex-col gap-3">
                <div className="size-10 bg-primary/10 flex items-center justify-center">
                  <item.icon className="size-5 text-primary" />
                </div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14">
        <div className="container text-center flex flex-col items-center gap-5">
          <h2 className="text-2xl font-bold">Ready to Explore?</h2>
          <p className="text-muted-foreground max-w-md">
            Browse our wide collection of imported gadgets and electronics. Find what you need at the best price.
          </p>
          <div className="flex gap-3">
            <Link
              href="/"
              className="inline-flex items-center px-6 py-2.5 bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition"
            >
              Shop Now
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center px-6 py-2.5 border border-border text-sm font-semibold hover:bg-muted transition"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
