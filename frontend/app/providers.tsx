"use client";

import { ThemeProvider } from "@/app/components/theme-provider";
import { AuthProvider } from "@/app/contexts/authContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  );
}