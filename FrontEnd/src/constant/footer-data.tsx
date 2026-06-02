import { Facebook, Instagram, Twitter } from "lucide-react"
import { ReactNode } from "react"

interface FooterData {
  logo: ReactNode
  brandName: string
  socialLinks: Array<{ icon: ReactNode; href: string; label: string }>
  mainLinks: Array<{ href: string; label: string }>
  legalLinks: Array<{ href: string; label: string }>
  copyright: {
    text: string
    license?: string
  }
}

export const footerData: FooterData = {
  logo: <span className="text-2xl">📦</span>,
  brandName: "سایت من",
  socialLinks: [
    { icon: <Twitter className="w-4 h-4" />, href: "https://twitter.com", label: "توییتر" },
    { icon: <Facebook className="w-4 h-4" />, href: "https://facebook.com", label: "فیسبوک" },
    { icon: <Instagram className="w-4 h-4" />, href: "https://instagram.com", label: "اینستاگرام" },
  ],
  mainLinks: [
    { href: "/", label: "خانه" },
    { href: "/about", label: "درباره ما" },
    { href: "/contact", label: "تماس با ما" },
  ],
  legalLinks: [
    { href: "/terms", label: "قوانین" },
    { href: "/privacy", label: "حریم خصوصی" },
  ],
  copyright: {
    text: "© ۲۰۲۵ سایت من. همه حقوق محفوظ است.",
    license: "پروانه MIT",
  },
}
