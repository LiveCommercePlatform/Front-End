import localFont from "next/font/local";

export const vazir = localFont({
  src: [
    { path: "../fonts/vazir/Vazir-Thin.woff2", weight: "100", style: "normal" },
    {
      path: "../fonts/vazir/Vazir-Light.woff2",
      weight: "300",
      style: "normal",
    },
    { path: "../fonts/vazir/Vazir.woff2", weight: "400", style: "normal" },
    {
      path: "../fonts/vazir/Vazir-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    { path: "../fonts/vazir/Vazir-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-vazir",
  display: "swap",
});
