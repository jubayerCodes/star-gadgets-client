import ComingSoon from "@/components/shared/coming-soon";

export default function Home() {
  return (
    <ComingSoon
      title="Star Gadgets"
      description="Star Gadgets is a leading online store for electronics and gadgets."
      showCountdown={true}
      targetDate={new Date(new Date().setDate(new Date().getDate() + 7))}
    />
  );
}
