import { Separator } from "@/components/ui/separator";

interface SeparatorTextProps {
  text: string;
}

const SeparatorText = ({ text }: SeparatorTextProps) => {
  return (
    <div className="w-full">
      <div className="flex items-center gap-4">
        <Separator className="flex-1" />
        <span className="text-sm text-muted-foreground">{text}</span>
        <Separator className="flex-1" />
      </div>
    </div>
  );
};

export default SeparatorText;
