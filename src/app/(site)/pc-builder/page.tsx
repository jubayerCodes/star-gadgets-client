"use client";

import ComingSoon from "@/components/shared/coming-soon";

const PCBuilder = () => {
  const today = new Date();
  const targetDate = new Date(today.setDate(today.getDate() + 7));
  return (
    <ComingSoon
      title="PC Builder"
      description="Build your dream PC with our intelligent component compatibility checker and price optimizer. Coming soon!"
      showCountdown={true}
      targetDate={targetDate}
    />
  );
};

export default PCBuilder;
