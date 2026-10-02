import "./globals.css";
import { Toaster } from "sonner";

export const metadata = {
  title: "InterviewOS — AI Interview Platform",
  description: "Create, run and score structured AI interviews from one secure workspace.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
