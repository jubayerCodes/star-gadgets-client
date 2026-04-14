"use client";

import { useAuthStore } from "@/store/authStore";
import { usePathname } from "next/navigation";
import { Home, User, ShoppingCart, Wrench } from "lucide-react";
import Link from "next/link";
import Marquee from "react-fast-marquee";
import Image from "next/image";
import logo from "@/assets/logo-dark.svg"; // Fallback, since dark implies logo on dark bg or logo with dark color. If the image has white text, logo.svg might be it. I'll test logo.svg since the header uses logo.png. But let's use the SVG variants for sharper display. Actually I'll use logo.svg which is standard and has white variants for dark themes usually, or let's use logo-dark.svg if that's the transparent white one. If not, we can adjust.
import { MapPin, Smartphone, Mail, FileText } from "lucide-react";

// For payment icons, since we don't have an exact image, we'll use placeholder text or icons.
// Assuming "react-icons/fa" can be used if they need exactly those later.
import {
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaCcPaypal,
  FaCcDiscover,
} from "react-icons/fa";
import { IconCircleFilled } from "@tabler/icons-react";

const Footer = () => {
  const { user } = useAuthStore();
  const pathname = usePathname();

  const menuFooterItems = [
    { label: "Home", href: "/", icon: Home },
    {
      label: user ? "Account" : "Login",
      href: user ? "/account" : "/account/login",
      icon: User,
    },
    { label: "Cart", href: "/cart", icon: ShoppingCart },
    { label: "Builder", href: "/pc-builder", icon: Wrench },
  ];

  const marqueeItems = [
    "Thank You For Visiting The Site!!",
    "Happy Shopping",
  ];

  return (
    <footer className="mt-auto">
      {/* Marquee Strip */}
      <div className="bg-[#0f1019] border-b border-white/5 py-3.5 overflow-hidden">
        <Marquee speed={50} gradient={false} autoFill>
          {marqueeItems.map((text, idx) => (
            <span key={idx} className="inline-flex items-center">
              <span className="text-sm font-semibold uppercase tracking-[0.12em] text-white/80 whitespace-nowrap px-10">
                {text}
              </span>
              <span className="text-white leading-none select-none">
                <IconCircleFilled size={10} />
              </span>
            </span>
          ))}
        </Marquee>
      </div>

      {/* Main Desktop & Tablet Footer */}
      <div className="bg-[#181a24] text-white/80 py-12 pb-24 lg:pb-12 text-sm z-40 relative">
        <div className="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Column 1 - Logo & About */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="inline-block no-underline">
              {/* In lack of knowing exactly which logo is the "white" one, we try logo.svg which might be the white one since logo.png is used in the light header */}
              <Image 
                src={logo} 
                alt="Tech Diversity" className="w-[180px] h-auto invert brightness-0" 
                // "invert brightness-0" forces the logo to be white if it's currently dark. 
                // This ensures it matches the screenshot visually even if we picked the dark logo.
              />
            </Link>
            <p className="text-white/70 leading-relaxed text-[13px] mt-2 max-w-[90%]">
              We mainly import goods from overseas. If anything crosses your mind feel free to knock us and allow us to make you happy by serving your desired product
            </p>
          </div>

          {/* Column 2 - Useful Links */}
          <div className="flex flex-col gap-5">
            <h3 className="font-bold text-white tracking-wider text-[13px] uppercase">USEFUL LINKS</h3>
            <div className="flex flex-col gap-3.5 text-[13px]">
              <Link href="/privacy-policy" className="text-white/70 hover:text-white transition">Privacy Policy</Link>
              <Link href="/warranty-policy" className="text-white/70 hover:text-white transition">Warranty Policy</Link>
              <Link href="/refund-returns" className="text-white/70 hover:text-white transition">Refund and Returns Policy</Link>
              <Link href="/after-sales" className="text-white/70 hover:text-white transition">After Sales Policy</Link>
              <Link href="/cookie-policy" className="text-white/70 hover:text-white transition">Cookie Policy</Link>
            </div>
          </div>

          {/* Column 3 - Support */}
          <div className="flex flex-col gap-5">
            <h3 className="font-bold text-white tracking-wider text-[13px] uppercase">SUPPORT</h3>
            <div className="flex flex-col gap-3.5 text-[13px]">
              <Link href="/track-order" className="text-white/70 hover:text-white transition">Track Your Order</Link>
              <Link href="/request-product" className="text-white/70 hover:text-white transition">Request Product</Link>
              <Link href="/affiliated-brands" className="text-white/70 hover:text-white transition">Affiliated Brands</Link>
              <Link href="/about-us" className="text-white/70 hover:text-white transition">About Us</Link>
              <Link href="/delivery" className="text-white/70 hover:text-white transition">Delivery</Link>
              <Link href="/terms-conditions" className="text-white/70 hover:text-white transition">Terms and Conditions</Link>
            </div>
          </div>

          {/* Column 4 - Contact Information */}
          <div className="flex flex-col gap-5">
            <h3 className="font-bold text-white tracking-wider text-[13px] uppercase">CONTACT INFORMATION</h3>
            <div className="flex flex-col gap-4 text-[13px] text-white/70">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="shrink-0 mt-0.5 text-white/50" />
                <span className="leading-snug">Address: Bari / DAG-1142, Road-5/a Dollpara, Turag, Dhaka-1230</span>
              </div>
              <div className="flex items-start gap-3">
                <Smartphone size={18} className="shrink-0 mt-0 text-white/50" />
                <span>Phone: (880) 1830267638</span>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={18} className="shrink-0 mt-0 text-white/50" />
                <span>Email: info@techdiversitybd.com</span>
              </div>
              <div className="flex items-start gap-3">
                <FileText size={18} className="shrink-0 mt-0 text-white/50" />
                <span>Tin Certificate Number: 472722415210</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar Section */}
        <div className="container mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-white/60">
          <p className="uppercase tracking-wide text-center md:text-left">
            ALL RIGHTS RESERVED. <span className="font-bold text-white">TECH DIVERSITY</span> © 2025 CREATED BY <span className="font-bold text-white">DDN</span>.
          </p>
          <div className="flex items-center gap-2">
             {/* Payment Icons Alternative */}
             <FaCcVisa className="size-8" />
             <FaCcMastercard className="size-8" />
             <FaCcAmex className="size-8" />
             <FaCcPaypal className="size-8" />
             <FaCcDiscover className="size-8" />
          </div>
        </div>
      </div>

      {/* Mobile Sticky Footer Nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 border-t border-foreground/10 bg-accent z-50">
        <div className="flex items-center justify-between">
          {menuFooterItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[10px] font-medium transition rounded ${
                pathname === item.href ? "bg-white/10 text-white" : "text-white/60 hover:text-white"
              }`}
            >
              <item.icon className="size-4" />
              <span className="leading-none">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
