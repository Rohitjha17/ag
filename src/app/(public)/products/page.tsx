"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Package,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useStore } from "@/store/useStore";
import * as api from "@/lib/api";
import type { Product, Category, Crop } from "@/lib/api";

function ProductSkeleton() {
  return (
    <Card className="overflow-hidden h-full">
      <Skeleton className="h-48 w-full" />
      <CardContent className="p-5">
        <Skeleton className="h-4 w-20 mb-2" />
        <Skeleton className="h-6 w-3/4 mb-1" />
        <Skeleton className="h-4 w-full mb-4" />
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
}

export default function ProductsPage() {
  const { language } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("name");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        const [productsRes, categoriesRes, cropsRes] = await Promise.all([
          api.getProducts({ limit: 100 }),
          api.getCategories(),
          api.getCrops(),
        ]);

        if (productsRes.success && productsRes.data) {
          setProducts(productsRes.data.products || []);
        }

        if (categoriesRes.success && categoriesRes.data) {
          setCategories(categoriesRes.data);
        }

        if (cropsRes.success && cropsRes.data) {
          setCrops(cropsRes.data);
        }
      } catch (error) {
        console.error("Failed to fetch products data:", error);
      }
      
      setIsLoading(false);
    };

    fetchData();
  }, []);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.name_hi.includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category?.id === selectedCategory);
    }

    // Filter by crops
    if (selectedCrops.length > 0) {
      filtered = filtered.filter((p) =>
        p.suitable_crops?.some((crop) =>
          selectedCrops.some((sc) => crop.toLowerCase().includes(sc.toLowerCase()))
        )
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "nameDesc":
          return b.name.localeCompare(a.name);
        case "popular":
          return (b.is_best_seller ? 1 : 0) - (a.is_best_seller ? 1 : 0);
        case "newest":
          return (b.sales_count || 0) - (a.sales_count || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, searchQuery, selectedCategory, selectedCrops, sortBy]);

  const handleCropToggle = (cropId: string) => {
    setSelectedCrops((prev) =>
      prev.includes(cropId)
        ? prev.filter((c) => c !== cropId)
        : [...prev, cropId]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedCrops([]);
    setSortBy("name");
  };

  const hasActiveFilters =
    searchQuery || selectedCategory !== "all" || selectedCrops.length > 0;

  const categoryFilters = [
    { id: "all", name: "All", name_hi: "सभी" },
    ...categories,
  ];

  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Category Filter */}
      <div>
        <h3 className="font-semibold mb-3">
          {language === "en" ? "Category" : "श्रेणी"}
        </h3>
        <div className="space-y-2">
          {categoryFilters.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedCategory === cat.id
                  ? "bg-primary text-white"
                  : "hover:bg-secondary"
              }`}
            >
              {language === "en" ? cat.name : cat.name_hi}
            </button>
          ))}
        </div>
      </div>

      {/* Crop Filter */}
      <div>
        <h3 className="font-semibold mb-3">
          {language === "en" ? "Suitable for Crop" : "फसल के लिए उपयुक्त"}
        </h3>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {crops.slice(0, 12).map((crop) => (
            <div key={crop.id} className="flex items-center space-x-2">
              <Checkbox
                id={crop.id}
                checked={selectedCrops.includes(crop.id)}
                onCheckedChange={() => handleCropToggle(crop.id)}
              />
              <Label htmlFor={crop.id} className="text-sm cursor-pointer">
                {language === "en" ? crop.name : crop.name_hi}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button variant="outline" onClick={clearFilters} className="w-full">
          <X className="h-4 w-4 mr-2" />
          {language === "en" ? "Clear Filters" : "फ़िल्टर साफ़ करें"}
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-secondary/20">
      {/* Header */}
      <div className="relative overflow-hidden border-b">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/landscape-green-field.jpg"
            alt="Beautiful agricultural landscape"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/90 to-white/70" />
        </div>
        <div className="container mx-auto px-4 lg:px-8 py-12 relative">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {language === "en" ? "Our Products" : "हमारे उत्पाद"}
          </h1>
          <p className="text-gray-600 max-w-xl">
            {language === "en"
              ? "High-quality solutions for every crop. Browse our comprehensive range of agrochemicals designed for the modern Indian farmer."
              : "हर फसल के लिए उच्च गुणवत्ता वाले समाधान। आधुनिक भारतीय किसान के लिए डिज़ाइन किए गए हमारे व्यापक कृषि रसायनों को ब्राउज़ करें।"}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-8">
        {/* Category Tabs */}
        <div className="mb-6 overflow-x-auto hide-scrollbar">
          <div className="flex gap-2 min-w-max">
            {categoryFilters.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat.id)}
                className="rounded-full"
              >
                {language === "en" ? cat.name : cat.name_hi}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <Card>
              <CardContent className="p-4">
                <FilterSidebar />
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Sort Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder={
                    language === "en"
                      ? "Search products..."
                      : "उत्पाद खोजें..."
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                {/* Mobile Filter Button */}
                <Sheet
                  open={mobileFilterOpen}
                  onOpenChange={setMobileFilterOpen}
                >
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden">
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      {language === "en" ? "Filters" : "फ़िल्टर"}
                      {hasActiveFilters && (
                        <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                          !
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left">
                    <SheetHeader>
                      <SheetTitle>
                        {language === "en" ? "Filters" : "फ़िल्टर"}
                      </SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterSidebar />
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Sort Dropdown */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue
                      placeholder={language === "en" ? "Sort by" : "क्रमबद्ध करें"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">
                      {language === "en" ? "Name (A-Z)" : "नाम (A-Z)"}
                    </SelectItem>
                    <SelectItem value="nameDesc">
                      {language === "en" ? "Name (Z-A)" : "नाम (Z-A)"}
                    </SelectItem>
                    <SelectItem value="popular">
                      {language === "en" ? "Most Popular" : "सबसे लोकप्रिय"}
                    </SelectItem>
                    <SelectItem value="newest">
                      {language === "en" ? "Newest" : "नवीनतम"}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results Count */}
            <p className="text-sm text-gray-600 mb-4">
              {isLoading ? (
                <Skeleton className="h-4 w-32" />
              ) : (
                language === "en"
                  ? `Showing ${filteredProducts.length} products`
                  : `${filteredProducts.length} उत्पाद दिखा रहे हैं`
              )}
            </p>

            {/* Products Grid */}
            {isLoading ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <ProductSkeleton key={index} />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => (
                  <div
                    key={product.id}
                    
                    
                    
                  >
                    <Card className="group overflow-hidden card-hover h-full">
                      <div className="relative h-48 bg-gradient-to-br from-green-100 to-green-50 overflow-hidden">
                        {product.images && product.images.length > 0 ? (
                          <Image
                            src={product.images[0]}
                            alt={language === "en" ? product.name : product.name_hi}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="h-32 w-32 rounded-full bg-primary/10 flex items-center justify-center">
                              <Package className="h-16 w-16 text-primary/40" />
                            </div>
                          </div>
                        )}
                        {product.is_best_seller && (
                          <Badge className="absolute top-3 left-3 bg-accent text-white">
                            {language === "en" ? "Best Seller" : "बेस्ट सेलर"}
                          </Badge>
                        )}
                        <Badge
                          variant="secondary"
                          className="absolute top-3 right-3 capitalize"
                        >
                          {product.category?.name || "Product"}
                        </Badge>
                      </div>
                      <CardContent className="p-5">
                        <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                          {language === "en" ? product.name : product.name_hi}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {language === "en"
                            ? product.description
                            : product.description_hi}
                        </p>
                        <div className="flex gap-2">
                          <Button
                            asChild
                            className="flex-1"
                          >
                            <Link href={`/products/${product.slug}`}>
                              {language === "en" ? "View Details" : "विवरण देखें"}
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {language === "en"
                    ? "No products found"
                    : "कोई उत्पाद नहीं मिला"}
                </h3>
                <p className="text-gray-600 mb-4">
                  {language === "en"
                    ? "Try adjusting your filters or search query"
                    : "अपने फ़िल्टर या खोज क्वेरी को समायोजित करने का प्रयास करें"}
                </p>
                <Button variant="outline" onClick={clearFilters}>
                  {language === "en" ? "Clear Filters" : "फ़िल्टर साफ़ करें"}
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
