"use client";

import Link from "next/link";
import { Home, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-5 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden>
        <div className="absolute top-1/4 -left-20 w-72 h-72 rounded-full bg-foreground/3 blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-tartiary/6 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-lg">
        {/* 404 Number */}
        <div className="relative mb-6 select-none">
          <span
            className="text-[160px] sm:text-[200px] font-black leading-none tracking-tighter text-foreground/6"
            aria-hidden
          >
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl sm:text-7xl font-black tracking-tight text-foreground">
              4<span className="text-tartiary">0</span>4
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="w-12 h-1 bg-tartiary mb-6" />

        {/* Text */}
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 leading-tight">
          Page Not Found
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-8 max-w-sm">
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get
          you back on track.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Button asChild className="w-full sm:w-auto rounded-none gap-2 px-6 h-11">
            <Link href="/">
              <Home size={15} />
              Go Home
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="w-full sm:w-auto rounded-none gap-2 px-6 h-11 border-foreground hover:bg-foreground hover:text-background transition-colors"
          >
            <Link href="/categories">
              <Search size={15} />
              Browse Products
            </Link>
          </Button>
        </div>

        {/* Back link */}
        <button
          onClick={() => history.back()}
          className="mt-6 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={12} />
          Go back to previous page
        </button>
      </div>

      {/* Bottom brand tag */}
      <p className="absolute bottom-6 text-xs text-muted-foreground/50 select-none">
        Star Gadgets © {new Date().getFullYear()}
      </p>
    </div>
  );
}
