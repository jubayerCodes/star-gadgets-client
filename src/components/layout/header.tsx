"use client";

import Link from "next/link";
import { Separator } from "../ui/separator";
import { FaEnvelopeOpen, FaFacebookF, FaInstagram, FaLinkedin, FaPhoneSquare } from "react-icons/fa";
import Image from "next/image";
import logo from "@/assets/logo.png";
import SearchInput from "../form/site/search-input";
import { useAuthStore } from "@/store/authStore";
import { Heart, ShoppingCart } from "lucide-react";
import IconWithCount from "../shared/icon-with-count";
import { Button } from "../ui/button";

const Header = () => {
  const { user } = useAuthStore();

  const contactInfo = [
    {
      icon: FaPhoneSquare,
      text: "+8801762278148",
      link: "#",
    },
    {
      icon: FaEnvelopeOpen,
      text: "info@star-gadgets.com",
      link: "#",
    },
  ];

  const socialLinks = [
    {
      name: "Facebook",
      icon: FaFacebookF,
      link: "#",
    },
    {
      name: "Instagram",
      icon: FaInstagram,
      link: "#",
    },
    {
      name: "Linkedin",
      icon: FaLinkedin,
      link: "#",
    },
  ];

  return (
    <header>
      <div className="bg-primary text-primary-foreground">
        <div className="container flex items-center justify-between">
          <div className="flex items-stretch">
            {contactInfo.map((item, index) => (
              <div key={index} className="flex items-center">
                <Link
                  href={item.link}
                  className="flex items-center gap-1.5 text-xs hover:text-primary-foreground/80 transition"
                >
                  <item.icon className="size-3.5" />
                  <span>{item.text}</span>
                </Link>
                {index !== contactInfo.length - 1 && (
                  <Separator orientation="vertical" className="h-10! bg-primary-foreground/30! mx-3" />
                )}
              </div>
            ))}
          </div>
          <div className="flex items-stretch">
            <div className="flex items-stretch gap-2">
              {socialLinks.map((item, index) => (
                <Link
                  key={index}
                  href={item.link}
                  className="flex items-center gap-1.5 text-xs hover:text-primary-foreground/80 transition"
                >
                  <item.icon className="size-4" />
                </Link>
              ))}
            </div>
            <Separator orientation="vertical" className="h-10! bg-primary-foreground/30! mx-3" />
            <Link href="/contact-us" className="text-xs hover:text-primary-foreground/80 transition flex items-center">
              Contact
            </Link>
            <Separator orientation="vertical" className="h-10! bg-primary-foreground/30! mx-3" />
            <Link
              href="/privacy-policy"
              className="text-xs hover:text-primary-foreground/80 transition flex items-center"
            >
              Privacy Policy
            </Link>
            <Separator orientation="vertical" className="h-10! bg-primary-foreground/30! ml-3" />
          </div>
        </div>
      </div>
      <div className="py-4 border-b">
        <div className="container flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-1">
            <Link href="/">
              <Image src={logo} alt="Star Gadgets" width={200} height={100} />
            </Link>
            <SearchInput />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {user ? (
                <Link href={"/account"} className="font-semibold text-sm hover:text-foreground/80 transition">
                  My Account
                </Link>
              ) : (
                <>
                  <Link href={"/account/login"} className="font-semibold text-sm hover:text-foreground/80 transition">
                    Login
                  </Link>{" "}
                  /{" "}
                  <Link
                    href={"/account/register"}
                    className="font-semibold text-sm hover:text-foreground/80 transition"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
            <div className="flex items-center gap-4">
              <Link href="/wishlist">
                <IconWithCount icon={Heart} count={0} />
              </Link>
              <Link href="/cart">
                <IconWithCount icon={ShoppingCart} count={0} />
              </Link>
            </div>
            <Link href="/pc-builder">
              <Button variant={"outline"} className="ml-2">PC Builder</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
