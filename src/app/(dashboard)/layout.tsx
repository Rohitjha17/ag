"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  QrCode,
  Gift,
  MapPin,
  Package,
  User,
  HelpCircle,
  LogOut,
  Menu,
  X,
  Globe,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useStore } from "@/store/useStore";
import { cn } from "@/lib/utils";
import * as api from "@/lib/api";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard", labelHi: "डैशबोर्ड" },
  { href: "/dashboard/scan", icon: QrCode, label: "Scan & Win", labelHi: "स्कैन और जीतें", highlight: true },
  { href: "/dashboard/rewards", icon: Gift, label: "My Rewards", labelHi: "मेरे पुरस्कार" },
  { href: "/dashboard/products", icon: Package, label: "Products", labelHi: "उत्पाद" },
  { href: "/dashboard/distributors", icon: MapPin, label: "Distributors", labelHi: "वितरक" },
  { href: "/dashboard/support", icon: HelpCircle, label: "Support", labelHi: "सहायता" },
];

const bottomNavItems = [
  { href: "/dashboard/profile", icon: User, label: "My Profile", labelHi: "मेरी प्रोफाइल" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, language, setLanguage, logout, setUser, setAuthenticated } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check authentication on mount/refresh
  useEffect(() => {
    const checkAuth = async () => {
      const token = api.getAccessToken();
      
      if (!token) {
        // No token - redirect to auth
        setAuthenticated(false);
        setIsCheckingAuth(false);
        router.push("/auth");
        return;
      }

      // Token exists - validate it by fetching profile
      try {
        const response = await api.getProfile();
        if (response.success && response.data) {
          const userData = response.data;
          setUser({
            id: userData.id,
            name: userData.full_name || "",
            mobile: userData.phone_number,
            pincode: userData.pin_code || "",
            state: userData.state || "",
            district: userData.district || "",
            cropPreferences: userData.crop_preferences?.map(c => c.id) || [],
            language: userData.language || language,
            isActive: userData.is_active,
            createdAt: userData.created_at,
            lastLogin: userData.last_login || new Date().toISOString(),
          });
          setAuthenticated(true);
        } else {
          // Token invalid - clear and redirect
          api.clearTokens();
          setAuthenticated(false);
          router.push("/auth");
        }
      } catch (error) {
        // Error validating token - clear and redirect
        api.clearTokens();
        setAuthenticated(false);
        router.push("/auth");
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [router, setUser, setAuthenticated, language]);

  // Show loading while checking auth
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated after check
  if (!isAuthenticated || !user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "hi" : "en");
  };

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={cn("flex flex-col h-full", mobile ? "p-4" : "p-6")}>
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <Image
          src="/logo.svg"
          alt="Agrio India Logo"
          width={40}
          height={40}
          className="h-10 w-10 object-contain"
        />
        <div>
          <h1 className="font-bold text-primary">Agrio India</h1>
          <p className="text-xs text-muted-foreground">Crop Science</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => mobile && setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                isActive
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:bg-secondary hover:text-primary"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{language === "en" ? item.label : item.labelHi}</span>
              {item.highlight && !isActive && (
                <span className="ml-auto flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <Separator className="my-4" />

      {/* Bottom Navigation */}
      <div className="space-y-1">
        {bottomNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => mobile && setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                isActive
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:bg-secondary hover:text-primary"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{language === "en" ? item.label : item.labelHi}</span>
            </Link>
          );
        })}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 w-full transition-all"
        >
          <LogOut className="h-5 w-5" />
          <span>{language === "en" ? "Logout" : "लॉगआउट"}</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-64 lg:flex-col bg-white border-r">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-white border-b">
          <div className="flex items-center justify-between px-4 lg:px-8 h-16">
            {/* Mobile Menu Button */}
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72">
                <Sidebar mobile />
              </SheetContent>
            </Sheet>

            {/* Page Title - Mobile */}
            <div className="lg:hidden">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/logo.svg"
                  alt="Agrio India Logo"
                  width={32}
                  height={32}
                  className="h-8 w-8 object-contain"
                />
              </Link>
            </div>

            {/* Welcome Text - Desktop */}
            <div className="hidden lg:block">
              <h2 className="text-lg font-semibold">
                {language === "en" ? `Namaste, ${user.name.split(" ")[0]}!` : `नमस्ते, ${user.name.split(" ")[0]}!`}
              </h2>
              <p className="text-sm text-muted-foreground">
                {language === "en" ? "Welcome to your Agrio India dashboard." : "आपके एग्रियो इंडिया डैशबोर्ड में आपका स्वागत है।"}
              </p>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Language Toggle */}
              <Button variant="outline" size="sm" onClick={toggleLanguage} className="rounded-full">
                {language === "en" ? "हिंदी" : "English"}
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary text-white">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">+91 {user.mobile}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      {language === "en" ? "My Profile" : "मेरी प्रोफाइल"}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/rewards" className="cursor-pointer">
                      <Gift className="mr-2 h-4 w-4" />
                      {language === "en" ? "My Rewards" : "मेरे पुरस्कार"}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    {language === "en" ? "Logout" : "लॉगआउट"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

