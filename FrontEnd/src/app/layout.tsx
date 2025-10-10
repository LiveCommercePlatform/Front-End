"use client";

import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar, SidebarMobile } from "@/components/layout/sidebar";
import { vazir } from "@/lib/fonts";
import { Toaster } from "react-hot-toast";
import { Footer } from "@/components/ui/footer";
import { footerData } from "@/constant/footer-data";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { CartProvider } from "@/context/CartContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";

  return (
    <html
      lang="fa"
      dir="rtl"
      className={vazir.variable}
      suppressHydrationWarning
    >
      <body className="font-sans">
        <Toaster
          position="bottom-left"
          toastOptions={{
            style: {
              direction: "rtl",
              background: "var(--toast-bg)",
              color: "var(--toast-text)",
              fontFamily: "inherit",
            },
          }}
        />
        
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem><CartProvider>
          <div className="flex flex-col min-h-screen">
            
            {!isAuthPage && (
              <div className="flex items-center justify-between px-4 border-b h-14">
                <SidebarMobile />
                <Navbar />
              </div>
            )}

            <div className="flex flex-1">
              {!isAuthPage && <Sidebar />}

              <main
                className={clsx("flex-1", {
                  "": isAuthPage,
                  "p-4 overflow-auto": !isAuthPage,
                })}
              >
                {children}
              </main>
            </div>

            {!isAuthPage && <Footer {...footerData} />}
          </div>
        </CartProvider></ThemeProvider>
      </body>
    </html>
  );
}
