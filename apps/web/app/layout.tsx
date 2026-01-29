import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import '@repo/ui/globals.css';
import { Layout } from "@/app/components/Layout";
import { ToastContainer } from "react-toastify";
import { EnsureSession } from "@/app/components/session-provider";
import { cookies } from "next/headers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hostel Tracker",
  description: "Track and manage hostel issues with ease.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const theme = (await cookies()).get('theme')?.value ?? 'dark';

  return (
    <html
      lang="en"
      className={theme === 'dark' ? 'dark' : undefined}
      style={{
        colorScheme: theme,
        backgroundColor: theme === 'dark' ? '#0a0d14' : '#f8fafc',
      }}
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ToastContainer />
        <EnsureSession>
          <Layout mode={'ADMIN'} >
            {children}
          </Layout>
        </EnsureSession>
      </body>
    </html>
  );
}
