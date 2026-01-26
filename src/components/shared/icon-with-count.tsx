"use client";

import { IconType } from "react-icons";
import { Badge } from "../ui/badge";

interface IconWithCountProps {
  icon: IconType;
  count: number;
}

const IconWithCount = ({ icon: Icon, count }: IconWithCountProps) => {
  return (
    <span className="relative group">
      <Icon className="size-5.5 group-hover:text-primary/50 transition" />
      <Badge className="absolute -top-1 -right-2 size-4! text-[8px] p-0">
        {count}
      </Badge>
    </span>
  );
};

export default IconWithCount;
