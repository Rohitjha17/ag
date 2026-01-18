"use client";

import React, { useEffect, useState } from "react";
import {
  Users,
  Ticket,
  IndianRupee,
  UserPlus,
  TrendingUp,
  TrendingDown,
  Package,
  MapPin,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import * as api from "@/lib/api";
import type { DashboardStats, AdminUser } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";

function StatCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-12 w-12 rounded-lg" />
          <Skeleton className="h-4 w-4" />
        </div>
        <Skeleton className="h-8 w-24 mb-1" />
        <Skeleton className="h-4 w-20 mb-1" />
        <Skeleton className="h-3 w-16" />
      </CardContent>
    </Card>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [statsRes, usersRes] = await Promise.all([
          api.getDashboardStats(),
          api.getAdminUsers({ page: 1, limit: 5 }),
        ]);

        if (statsRes.success && statsRes.data) {
          setStats(statsRes.data);
        }

        if (usersRes.success && usersRes.data) {
          setRecentUsers(usersRes.data.users || []);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  // Stats cards data
  const statsCards = [
    {
      title: "Total Users",
      value: stats?.total_users?.toLocaleString() || "0",
      change: "+0% this month",
      trend: "up",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Coupons Scanned",
      value: stats?.total_coupons_scanned?.toLocaleString() || "0",
      change: "+0% this month",
      trend: "up",
      icon: Ticket,
      color: "text-amber-600",
      bg: "bg-amber-100",
    },
    {
      title: "Total Revenue",
      value: formatCurrency(stats?.total_revenue || 0),
      change: "+0% this month",
      trend: "up",
      icon: IndianRupee,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: "Total Products",
      value: stats?.total_products?.toLocaleString() || "0",
      change: "+0% vs last month",
      trend: "up",
      icon: Package,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
  ];

  const secondaryStats = [
    {
      title: "Total Coupons",
      value: stats?.total_coupons_scanned?.toLocaleString() || "0",
      change: "+0.8%",
      trend: "up",
    },
    {
      title: "Total Products",
      value: stats?.total_products?.toLocaleString() || "0",
      change: "+0.5%",
      trend: "up",
    },
    {
      title: "Total Orders",
      value: stats?.total_orders?.toLocaleString() || "0",
      change: "+1.0%",
      trend: "up",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back to the admin panel.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          <>
            {Array.from({ length: 4 }).map((_, index) => (
              <StatCardSkeleton key={index} />
            ))}
          </>
        ) : (
          statsCards.map((stat, index) => (
            <div
              key={index}
              
              
              
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`h-12 w-12 rounded-lg ${stat.bg} flex items-center justify-center`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <div className={`flex items-center gap-1 text-sm ${
                      stat.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}>
                      {stat.trend === "up" ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                    </div>
                  </div>
                  <p className="text-3xl font-bold mb-1">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-xs text-green-600 mt-1">{stat.change}</p>
                </CardContent>
              </Card>
            </div>
          ))
        )}
      </div>

      {/* Secondary Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        {isLoading ? (
          <>
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <Skeleton className="h-6 w-16 mb-1" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-6 w-12" />
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          secondaryStats.map((stat, index) => (
            <div
              key={index}
              
              
              
            >
              <Card>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                  </div>
                  <Badge variant={stat.trend === "up" ? "success" : "destructive"} className="text-xs">
                    {stat.change}
                  </Badge>
                </CardContent>
              </Card>
            </div>
          ))
        )}
      </div>

      {/* Recent Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Users</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center gap-4">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
              ))}
            </div>
          ) : recentUsers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>NAME</TableHead>
                  <TableHead>PHONE</TableHead>
                  <TableHead>SIGNUP DATE</TableHead>
                  <TableHead>STATUS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentUsers.map((user, index) => (
                  <TableRow key={user.id || index}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {user.name?.split(" ").map((n) => n[0]).join("") || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.name || "Unknown"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-primary">{user.phone_number}</TableCell>
                    <TableCell>{user.created_at ? formatDate(user.created_at) : "-"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={user.role === "ADMIN" ? "success" : "secondary"}
                      >
                        {user.role || "USER"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No users found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
