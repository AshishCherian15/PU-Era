import type { Metadata } from "next";
import "./globals.css";
import ShellWrapper from "./components/common/ShellWrapper";

export const metadata: Metadata = {
  title: "PU Era — Free Karnataka PUC & NCERT Study Resources",
  description:
    "Free, syllabus-aligned notes, lab guides, and worked examples for Karnataka PUC 1st & 2nd Year and NCERT Class 11 & 12. Available in English and Kannada.",
  keywords: ["PUC", "NCERT", "Karnataka", "study materials", "notes", "lab guides", "2nd PUC", "1st PUC"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Noto+Sans+Kannada:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#FAF7F0]">
        <ShellWrapper>{children}</ShellWrapper>
      </body>
    </html>
  );
}
