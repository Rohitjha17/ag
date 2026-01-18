"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  QrCode,
  Gift,
  MapPin,
  Package,
  ScanLine,
  Calendar,
  ArrowRight,
  Trophy,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useStore } from "@/store/useStore";
import * as api from "@/lib/api";
import type { UserStats, Reward, Crop } from "@/lib/api";

const quickActions = [
  {
    href: "/dashboard/rewards",
    icon: Gift,
    title: "My Rewards / Coupons",
    titleHi: "मेरे पुरस्कार / कूपन",
    description: "View your earned points and coupons.",
    descriptionHi: "अपने अर्जित अंक और कूपन देखें।",
    color: "bg-amber-500",
  },
  {
    href: "/dashboard/products",
    icon: Package,
    title: "Recommended Products",
    titleHi: "अनुशंसित उत्पाद",
    description: "Products suited for your crops.",
    descriptionHi: "आपकी फसलों के लिए उपयुक्त उत्पाद।",
    color: "bg-blue-500",
  },
  {
    href: "/dashboard/distributors",
    icon: MapPin,
    title: "Nearby Distributors",
    titleHi: "नजदीकी वितरक",
    description: "Find the closest official dealers.",
    descriptionHi: "निकटतम आधिकारिक डीलरों को खोजें।",
    color: "bg-purple-500",
  },
  {
    href: "/products",
    icon: Package,
    title: "Products Catalog",
    titleHi: "उत्पाद सूची",
    description: "Browse our full range of products.",
    descriptionHi: "हमारे उत्पादों की पूरी श्रृंखला देखें।",
    color: "bg-teal-500",
  },
];

export default function DashboardPage() {
  const { language, user } = useStore();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        const [statsRes, rewardsRes, cropsRes] = await Promise.all([
          api.getUserStats(),
          api.getUserRewards(),
          api.getCropPreferences(),
        ]);

        if (statsRes.success && statsRes.data) {
          setUserStats(statsRes.data);
        }

        if (rewardsRes.success && rewardsRes.data) {
          setRewards(rewardsRes.data);
        }

        if (cropsRes.success && cropsRes.data) {
          setCrops(cropsRes.data.crops || []);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
      
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const formatLastScan = (date: string | null) => {
    if (!date) return language === "en" ? "Never" : "कभी नहीं";
    const days = Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
    if (days === 0) return language === "en" ? "Today" : "आज";
    if (days === 1) return language === "en" ? "Yesterday" : "कल";
    return `${days} ${language === "en" ? "days ago" : "दिन पहले"}`;
  };

  const stats = [
    {
      title: language === "en" ? "Total Scans" : "कुल स्कैन",
      value: userStats?.total_scans?.toString() || "0",
      icon: ScanLine,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: language === "en" ? "Coupons Won" : "जीते हुए कूपन",
      value: userStats?.coupons_won?.toString() || "0",
      icon: Trophy,
      color: "text-amber-600",
      bg: "bg-amber-100",
    },
    {
      title: language === "en" ? "Rewards Claimed" : "प्राप्त पुरस्कार",
      value: userStats?.rewards_claimed?.toString() || "0",
      icon: Gift,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: language === "en" ? "Last Scan" : "अंतिम स्कैन",
      value: formatLastScan(userStats?.last_scan_date || null),
      icon: Calendar,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section - Mobile */}
      <div className="lg:hidden">
        <h1 className="text-2xl font-bold">
          {language === "en" ? `Namaste, ${user?.name?.split(" ")[0] || ""}!` : `नमस्ते, ${user?.name?.split(" ")[0] || ""}!`}
        </h1>
        <p className="text-muted-foreground">
          {language === "en" ? "Welcome to your Agrio India dashboard." : "आपके एग्रियो इंडिया डैशबोर्ड में आपका स्वागत है।"}
        </p>
      </div>

      {/* Scan & Win CTA */}
      <div
        
        
      >
        <Card className="bg-gradient-to-r from-primary to-primary-dark text-white overflow-hidden">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="h-20 w-20 rounded-2xl bg-white/20 flex items-center justify-center">
                <QrCode className="h-10 w-10" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">
                  {language === "en" ? "Scan & Win" : "स्कैन और जीतें"}
                </h3>
                <p className="text-white/80 text-sm">
                  {language === "en"
                    ? "Scan a product QR code to earn instant rewards and points."
                    : "तुरंत पुरस्कार और अंक अर्जित करने के लिए उत्पाद QR कोड स्कैन करें।"}
                </p>
              </div>
            </div>
            <Button asChild variant="secondary" size="lg" className="hidden md:flex text-primary">
              <Link href="/dashboard/scan">
                {language === "en" ? "Scan QR Code" : "QR कोड स्कैन करें"}
              </Link>
            </Button>
          </CardContent>
          {/* Mobile Button */}
          <div className="md:hidden px-6 pb-6">
            <Button asChild variant="secondary" className="w-full text-primary">
              <Link href="/dashboard/scan">
                {language === "en" ? "Scan QR Code" : "QR कोड स्कैन करें"}
              </Link>
            </Button>
          </div>
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            
            
            
          >
            <Card>
              <CardContent className="p-4">
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div>
                      <Skeleton className="h-6 w-12 mb-1" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.title}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <div
            key={index}
            
            
            
          >
            <Link href={action.href}>
              <Card className="h-full card-hover cursor-pointer group">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`h-10 w-10 rounded-lg ${action.color} flex items-center justify-center shrink-0`}>
                      <action.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-sm mb-1 group-hover:text-primary transition-colors">
                        {language === "en" ? action.title : action.titleHi}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {language === "en" ? action.description : action.descriptionHi}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        ))}
      </div>

      {/* Crop Recommendations */}
      {crops.length > 0 && (
        <div
          
          
          
        >
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">
                {language === "en" ? "Explore Solutions for Your Crops" : "अपनी फसलों के लिए समाधान खोजें"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {crops.slice(0, 3).map((crop, index) => (
                  <Link
                    key={crop.id}
                    href={`/products?crop=${crop.id}`}
                    className="group"
                  >
                    <div className="relative h-32 rounded-xl overflow-hidden bg-gradient-to-br from-green-100 to-green-200">
                      {crop.image_url ? (
                        <Image
                          src={crop.image_url}
                          alt={crop.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                          sizes="(max-width: 640px) 33vw, 200px"
                        />
                      ) : null}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3">
                        <p className="text-white font-medium text-sm">
                          {language === "en" ? `Explore ${crop.name}` : `${crop.name_hi} समाधान खोजें`}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Rewards */}
      <div
        
        
        
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg">
              {language === "en" ? "Recent Rewards" : "हाल के पुरस्कार"}
            </CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/rewards">
                {language === "en" ? "View All" : "सभी देखें"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-lg" />
                      <div>
                        <Skeleton className="h-4 w-24 mb-1" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                    <Skeleton className="h-6 w-16" />
                  </div>
                ))}
              </div>
            ) : rewards.length > 0 ? (
              <div className="space-y-3">
                {rewards.slice(0, 3).map((reward) => (
                  <div
                    key={reward.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Gift className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {reward.type} - ₹{reward.amount}
                        </p>
                        <p className="text-xs text-muted-foreground">{reward.product_name}</p>
                      </div>
                    </div>
                    <Badge variant={reward.status === "CLAIMED" ? "success" : "warning"}>
                      {reward.status === "CLAIMED"
                        ? language === "en"
                          ? "Claimed"
                          : "दावा किया"
                        : language === "en"
                        ? "Pending"
                        : "लंबित"}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Gift className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-muted-foreground">
                  {language === "en" ? "No rewards yet" : "अभी तक कोई पुरस्कार नहीं"}
                </p>
                <Button asChild variant="link" className="mt-2">
                  <Link href="/dashboard/scan">
                    {language === "en" ? "Scan to win rewards" : "पुरस्कार जीतने के लिए स्कैन करें"}
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
