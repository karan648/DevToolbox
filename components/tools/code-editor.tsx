"use client";

import dynamic from "next/dynamic";
import { useTheme } from "next-themes";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

export function CodeEditor({
  value,
  onChange,
  language,
  height = "300px",
}: {
  value: string;
  onChange: (value: string) => void;
  language: string;
  height?: string;
}) {
  const { resolvedTheme } = useTheme();

  return (
    <MonacoEditor
      value={value}
      onChange={(newValue) => onChange(newValue || "")}
      language={language}
      height={height}
      theme={resolvedTheme === "light" ? "vs-light" : "vs-dark"}
      options={{
        minimap: { enabled: false },
        fontSize: 13,
        roundedSelection: false,
        scrollBeyondLastLine: false,
      }}
    />
  );
}
