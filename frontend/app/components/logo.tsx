import Link from "next/link";
import { Ticket } from "lucide-react";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
        <Ticket className="h-5 w-5 text-accent-foreground" />
      </div>
      <span className="text-lg font-bold tracking-tight">LivePass</span>
    </Link>
  );
}
