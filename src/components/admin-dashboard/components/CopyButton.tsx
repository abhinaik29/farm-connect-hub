import { useState } from "react";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard?.writeText(text).catch(() => {});
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="shrink-0 rounded-lg border border-border px-2.5 py-1 text-[11px] hover:bg-muted"
    >
      {copied ? "Copied ✓" : "Copy"}
    </button>
  );
}
