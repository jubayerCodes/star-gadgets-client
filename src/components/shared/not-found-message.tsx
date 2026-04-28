import { PackageSearch } from "lucide-react";
import Link from "next/link";

interface NotFoundMessageProps {
  title?: string;
  description?: string;
  backLabel?: string;
  backHref?: string;
}

export default function NotFoundMessage({
  title = "Not Found",
  description = "The item you are looking for could not be found. The link may be incorrect or it may no longer exist.",
  backLabel = "Go Back",
  backHref = "/",
}: NotFoundMessageProps) {
  return (
    <div className="container py-20 flex flex-col items-center justify-center text-center gap-4">
      <PackageSearch className="size-14 text-muted-foreground" />
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
      <Link
        href={backHref}
        className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
      >
        ← {backLabel}
      </Link>
    </div>
  );
}
