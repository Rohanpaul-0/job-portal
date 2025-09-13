import "./globals.css";
import type { Metadata } from "next";
import Nav from "@/components/nav";
import AnimatedBackground from "@/components/animated-background";
import Spotlight from "@/components/spotlight";
import StickyCTA from "@/components/sticky-cta";
import { ThemeProvider } from "@/components/theme-provider";
import { Plus_Jakarta_Sans } from "next/font/google";
import ChatMount from "@/components/chat-mount"; // ⬅️ use the client wrapper

export const metadata: Metadata = {
  title: "Rohan Paul Potnuru · Software Engineer",
  description:
    "Software Engineer specializing in AI/ML, Cloud, and Full-Stack Development. I build scalable, production-ready apps.",
  metadataBase: new URL("https://rohanpaul.org"),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "https://rohanpaul.org",
    siteName: "Rohan Paul Potnuru",
    title: "Rohan Paul Potnuru · Software Engineer",
    description:
      "Software Engineer specializing in AI/ML, Cloud, and Full-Stack Development.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rohan Paul Potnuru · Software Engineer",
    description:
      "Software Engineer specializing in AI/ML, Cloud, and Full-Stack Development.",
  },
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

          {/* Floating AI chatbot on every page */}
          <ChatMount />
        </ThemeProvider>
      </body>
    </html>
  );
}
