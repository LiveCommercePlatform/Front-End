"use client";

import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { useSidebar, SidebarProvider } from "@/context/SidebarContext";
import { vazir } from "@/lib/fonts";
import { Toaster } from "react-hot-toast";
import { Footer } from "@/components/ui/footer";
import { footerData } from "@/constant/footer-data";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { CartProvider } from "@/context/CartContext";
import { ProductsProvider } from "@/context/ProductContext";
import { DashboardProvider } from "@/context/DashboardContext";
import { LiveRoomProvider } from "@/context/LiveRoomContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <CartProvider>
            <SidebarProvider>
              <ProductsProvider>
              <LiveRoomProvider>
                <DashboardProvider> 
                <LayoutContent>{children}</LayoutContent>
                </DashboardProvider> 
              </LiveRoomProvider>
              </ProductsProvider>
            </SidebarProvider>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar();
  const pathname = usePathname();
  const isAuthPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forget_password";

  return (
    <div
      data-sidebar={collapsed ? "collapsed" : "expanded"}
      className="flex flex-col min-h-screen"
    >
      {!isAuthPage && <Navbar />}

      <div className="flex flex-1">
        {!isAuthPage && <Sidebar />}

        <main
          className={clsx(
            "flex-1 pt-12 md:pt-14 overflow-auto",
            !isAuthPage && "md:pr-[var(--sidebar-width)]",
          )}
        >
          {children}
        </main>
      </div>

      {!isAuthPage && <Footer {...footerData} />}
    </div>
  );
}
