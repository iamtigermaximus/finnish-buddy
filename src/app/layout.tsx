import type { Metadata } from "next";
import { Inter } from "next/font/google";
import StyledComponentsRegistry from "@/lib/registry";
import { Providers } from "./provider";
import { ThemeProvider } from "@/styles/ThemeProvider";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { ToastProvider } from "@/components/ui/ToastProvider";
import "./global.css";

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
        <ErrorBoundary>
          <StyledComponentsRegistry>
            <ThemeProvider>
              <Providers>
                <ToastProvider>{children}</ToastProvider>
              </Providers>
            </ThemeProvider>
          </StyledComponentsRegistry>
        </ErrorBoundary>
      </body>
    </html>
  );
}
