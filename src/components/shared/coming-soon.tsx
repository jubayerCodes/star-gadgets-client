"use client";

import { Clock, Rocket, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

interface ComingSoonProps {
  title?: string;
  description?: string;
  showCountdown?: boolean;
  targetDate?: Date;
}

const ComingSoon = ({
  title = "Coming Soon",
  description = "We're working hard to bring you something amazing. Stay tuned!",
  showCountdown = false,
  targetDate,
}: ComingSoonProps) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!showCountdown || !targetDate) return;

    const calculateTimeLeft = () => {
      const difference = +targetDate - +new Date();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [showCountdown, targetDate]);

  return (
    <div className="relative flex w-full items-center justify-center overflow-hidden bg-linear-to-br from-background via-background to-muted/20 py-10">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-4 top-1/4 size-72 animate-pulse rounded-full bg-tartiary/20 blur-3xl z-10" />
        <div className="absolute -right-4 bottom-1/4 size-96 animate-pulse rounded-full bg-tartiary/20 blur-3xl delay-1000 z-0" />
        <div className="absolute left-1/2 top-1/2 size-64 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-tartiary/20 blur-3xl delay-500 z-0" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-primary/20 blur-xl" />
            <div className="relative flex size-24 items-center justify-center rounded-full bg-linear-to-br from-primary/10 to-accent/10 backdrop-blur-sm ring-1 ring-primary/20">
              <Rocket className="size-12 animate-bounce text-primary" />
            </div>
          </div>
        </div>

        <h1 className="mb-4 bg-linear-to-r from-primary via-accent to-primary bg-clip-text text-5xl font-bold text-transparent animate-in fade-in slide-in-from-bottom-4 duration-700 md:text-7xl">
          {title}
        </h1>

        <p className="mx-auto mb-12 max-w-2xl text-lg text-muted-foreground animate-in fade-in slide-in-from-bottom-4 delay-150 duration-700 md:text-xl">
          {description}
        </p>

        {showCountdown && targetDate && (
          <div className="mb-12 grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 delay-300 duration-700 md:grid-cols-4">
            {Object.entries(timeLeft).map(([unit, value]) => (
              <div
                key={unit}
                className="group relative overflow-hidden rounded-lg border border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative">
                  <div className="text-4xl font-bold text-primary md:text-5xl">{value.toString().padStart(2, "0")}</div>
                  <div className="mt-2 text-sm uppercase tracking-wider text-muted-foreground">{unit}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-4 delay-500 duration-700 md:grid-cols-3">
          <div className="group rounded-lg border border-border/50 bg-card/30 p-6 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-primary/10 p-3 transition-transform group-hover:scale-110">
                <Sparkles className="size-6 text-primary" />
              </div>
            </div>
            <h3 className="mb-2 font-semibold text-foreground">Innovative Features</h3>
            <p className="text-sm text-muted-foreground">Cutting-edge technology designed for the future</p>
          </div>

          <div className="group rounded-lg border border-border/50 bg-card/30 p-6 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-accent/10 p-3 transition-transform group-hover:scale-110">
                <Clock className="size-6 text-accent" />
              </div>
            </div>
            <h3 className="mb-2 font-semibold text-foreground">Worth the Wait</h3>
            <p className="text-sm text-muted-foreground">Quality takes time, excellence takes dedication</p>
          </div>

          <div className="group rounded-lg border border-border/50 bg-card/30 p-6 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-tartiary/10 p-3 transition-transform group-hover:scale-110">
                <Rocket className="size-6 text-tartiary" />
              </div>
            </div>
            <h3 className="mb-2 font-semibold text-foreground">Launching Soon</h3>
            <p className="text-sm text-muted-foreground">Get ready for an extraordinary experience</p>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-center gap-2 opacity-50">
          <div className="size-2 animate-pulse rounded-full bg-primary" />
          <div className="size-2 animate-pulse rounded-full bg-accent delay-150" />
          <div className="size-2 animate-pulse rounded-full bg-tartiary delay-300" />
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
