// @ts-expect-error CSS side-effect imports are handled by Next.js.
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client";

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
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
