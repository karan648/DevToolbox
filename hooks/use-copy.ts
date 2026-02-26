"use client";

import { useState } from "react";
import { toast } from "sonner";

export function useCopy() {
  const [copied, setCopied] = useState(false);

  const copy = async (text: string, message = "Copied to clipboard") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success(message);
      setTimeout(() => setCopied(false), 1400);
      return true;
    } catch {
      toast.error("Clipboard write failed");
      return false;
    }
  };

  return { copied, copy };
}
