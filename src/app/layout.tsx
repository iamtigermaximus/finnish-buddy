// src/app/layout.tsx (updated with ThemeProvider)
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import StyledComponentsRegistry from "../lib/registry";
import { Providers } from "./provider";
import { ThemeProvider } from "../styles/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Finnish Buddy - Learn Finnish with a Friend",
  description:
    "Learn Finnish from A1 to C2 with AI-powered lessons and a friendly bear buddy!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StyledComponentsRegistry>
          <ThemeProvider>
            <Providers>{children}</Providers>
          </ThemeProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
