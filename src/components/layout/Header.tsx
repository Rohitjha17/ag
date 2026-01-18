"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  Globe,
  User,
  ChevronDown,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useStore } from "@/store/useStore";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", labelHi: "होम" },
  { href: "/products", label: "Products", labelHi: "उत्पाद" },
  { href: "/best-selling", label: "Best Selling", labelHi: "बेस्ट सेलिंग" },
  { href: "/scan-win", label: "Scan & Win", labelHi: "स्कैन और जीतें", highlight: true },
  { href: "/buy-nearby", label: "Buy Nearby", labelHi: "पास में खरीदें" },
  { href: "/contact", label: "Contact", labelHi: "संपर्क" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage, isAuthenticated, user, logout } = useStore();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "hi" : "en");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <nav className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.svg"
              alt="Agrio India Logo"
              width={44}
              height={44}
              className="h-11 w-11 object-contain"
              priority
            />
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-primary">Agrio India</h1>
              <p className="text-xs text-muted-foreground">Crop Science</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium transition-colors rounded-lg hover:bg-secondary",
                  pathname === item.href
                    ? "text-primary"
                    : "text-gray-600 hover:text-primary",
                  item.highlight && "text-accent"
                )}
              >
                {language === "en" ? item.label : item.labelHi}
                {item.highlight && (
                  <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                  </span>
                )}
                {pathname === item.href && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="hidden sm:flex items-center gap-1.5 text-sm"
            >
              <Globe className="h-4 w-4" />
              <span className="font-medium">
                {language === "en" ? "हिंदी" : "EN"}
              </span>
            </Button>

            {/* Auth Button / User Menu */}
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-sm font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden md:inline-block">{user.name.split(" ")[0]}</span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center gap-2">
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-destructive focus:text-destructive"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild size="sm" className="hidden sm:inline-flex">
                <Link href="/auth">Login</Link>
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0">
                <div className="flex flex-col h-full">
                  {/* Mobile Header */}
                  <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-2">
                      <Image
                        src="/logo.svg"
                        alt="Agrio India Logo"
                        width={32}
                        height={32}
                        className="h-8 w-8 object-contain"
                      />
                      <span className="font-bold text-primary">Agrio India</span>
                    </div>
                  </div>

                  {/* Mobile Navigation */}
                  <nav className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-1">
                      {navItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            "flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                            pathname === item.href
                              ? "bg-primary text-white"
                              : "text-gray-700 hover:bg-secondary"
                          )}
                        >
                          <span>{language === "en" ? item.label : item.labelHi}</span>
                          {item.highlight && (
                            <span className="flex h-2 w-2 rounded-full bg-accent"></span>
                          )}
                        </Link>
                      ))}
                    </div>
                  </nav>

                  {/* Mobile Footer */}
                  <div className="border-t p-4 space-y-3">
                    <Button
                      variant="outline"
                      onClick={toggleLanguage}
                      className="w-full justify-start gap-2"
                    >
                      <Globe className="h-4 w-4" />
                      {language === "en" ? "हिंदी में बदलें" : "Switch to English"}
                    </Button>
                    {isAuthenticated ? (
                      <Button
                        variant="destructive"
                        onClick={() => {
                          logout();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    ) : (
                      <Button asChild className="w-full">
                        <Link href="/auth" onClick={() => setMobileMenuOpen(false)}>
                          Login / Register
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}

