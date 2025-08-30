import "./globals.css";
import type { Metadata } from "next";
import Nav from "@/components/nav";
import AnimatedBackground from "@/components/animated-background";
import Spotlight from "@/components/spotlight";
import StickyCTA from "@/components/sticky-cta";
import { ThemeProvider } from "@/components/theme-provider";
import { Plus_Jakarta_Sans } from "next/font/google";

export const metadata: Metadata = {
  title: "Rohan Paul Potnuru · Software Engineer",
  description:
    "Software Engineer specializing in AI/ML, Cloud, and Full-Stack Development. I build scalable, production-ready apps.",
  openGraph: {
    type: "website",
    title: "Rohan Paul Potnuru",
    description:
      "Software Engineer specializing in AI/ML, Cloud, and Full-Stack Development.",
  },
  metadataBase: new URL("https://example.com"), // replace after you deploy with your real domain
};

const font = Plus_Jakarta_Sans({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${font.className} antialiased`}>
        <ThemeProvider>
          <Nav />
          <AnimatedBackground />
          <Spotlight />
          {children}
          <footer className="max-w-6xl mx-auto px-6 py-10 opacity-70 text-sm">
            © {new Date().getFullYear()} Rohan Paul Potnuru
          </footer>
          <StickyCTA />
        </ThemeProvider>
      </body>
    </html>
  );
}
