import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata = {
  title: "Mini Kanban",
  description: "A minimal Kanban board",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-surface-0 text-text-primary font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
