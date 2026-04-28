import Link from "next/link";
import { MapPin, Phone, Mail, Clock, MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Contact Us | Star Gadgets",
  description:
    "Get in touch with Star Gadgets. We're here to help with product inquiries, orders, and support.",
};

const contactDetails = [
  {
    icon: MapPin,
    label: "Our Location",
    value: "Shop No-2, Level-7, Eastern Star Tech Park, Durgapur, Savar, Dhaka-1340",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+880 1762-278148",
    href: "tel:+8801762278148",
  },
  {
    icon: Mail,
    label: "Email",
    value: "info@stargadgets.com",
    href: "mailto:info@stargadgets.com",
  },
  {
    icon: Clock,
    label: "Business Hours",
    value: "Sat – Thu: 10:00 AM – 8:00 PM",
  },
];

export default function ContactPage() {
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
            <span className="text-white/80">Contact Us</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">Contact Us</h1>
          <p className="text-white/60 mt-3 max-w-xl">
            Have a question or need help? Reach out to our team and we&apos;ll get back to you as soon as
            possible.
          </p>
        </div>
      </div>

      {/* Content */}
      <section className="py-14">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="flex flex-col gap-8">
              <div>
                <h2 className="text-xl font-bold mb-2">Get In Touch</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  We mainly import goods from overseas. If anything crosses your mind feel free to knock
                  us — we&apos;d love to make you happy by serving your desired product.
                </p>
              </div>

              <div className="flex flex-col gap-5">
                {contactDetails.map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="size-10 bg-primary/10 flex items-center justify-center shrink-0">
                      <item.icon className="size-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-0.5">
                        {item.label}
                      </p>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="text-sm font-medium text-foreground hover:text-primary transition"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-sm font-medium text-foreground">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="border border-border bg-card p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-6">
                <MessageSquare className="size-5 text-primary" />
                <h2 className="text-lg font-semibold">Send a Message</h2>
              </div>
              <form className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium">Full Name</label>
                    <input
                      type="text"
                      placeholder="Your name"
                      className="h-10 px-3 border-2 border-input text-sm focus:outline-none focus:border-primary transition"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium">Email Address</label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      className="h-10 px-3 border-2 border-input text-sm focus:outline-none focus:border-primary transition"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">Subject</label>
                  <input
                    type="text"
                    placeholder="How can we help?"
                    className="h-10 px-3 border-2 border-input text-sm focus:outline-none focus:border-primary transition"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">Message</label>
                  <textarea
                    rows={5}
                    placeholder="Write your message here..."
                    className="px-3 py-2.5 border-2 border-input text-sm focus:outline-none focus:border-primary transition resize-none"
                  />
                </div>
                <Button type="submit" className="gap-2">
                  <Send className="size-3.5" />
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
