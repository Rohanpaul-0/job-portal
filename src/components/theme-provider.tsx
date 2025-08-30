"use client";

import dynamic from "next/dynamic";
import * as React from "react";

// Load ThemeProvider only on the client to avoid SSR hook issues
const NextThemesProvider = dynamic(
  () => import("next-themes").then(m => m.ThemeProvider),
  { ssr: false }
);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
