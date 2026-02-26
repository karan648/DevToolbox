"use client";

import { Copy, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCopy } from "@/hooks/use-copy";

export function CopyButton({
  text,
  label = "Copy",
  className,
}: {
  text: string;
  label?: string;
  className?: string;
}) {
  const { copied, copy } = useCopy();

  return (
    <Button
      size="sm"
      variant="white"
      className={className}
      onClick={() => copy(text)}
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      {copied ? "Copied" : label}
    </Button>
  );
}
