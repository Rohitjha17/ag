"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Package, ArrowRight, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useStore } from "@/store/useStore";
import * as api from "@/lib/api";
import type { Product } from "@/lib/api";

function ProductSkeleton() {
  return (
    <Card className="overflow-hidden h-full">
      <Skeleton className="h-52 w-full" />
      <CardContent className="p-5">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-2" />
        <Skeleton className="h-4 w-full mb-4" />
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
}

export default function BestSellingPage() {
  const { language } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await api.getBestSellers(20);
        if (response.success && response.data) {
          setProducts(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch best sellers:", error);
      }
      setIsLoading(false);
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-dark to-primary py-20 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/green-field-with-clouds.jpg"
            alt="Beautiful green field with clouds"
            fill
            className="object-cover opacity-30"
            priority
          />
        </div>
        <div className="container mx-auto px-4 lg:px-8 relative">
          <div
            
            
            className="text-center text-white"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {language === "en" ? "Best Selling Products" : "बेस्ट सेलिंग उत्पाद"}
            </h1>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
              {language === "en"
                ? "Trusted solutions for a bountiful harvest, chosen by farmers across India."
                : "भारत भर के किसानों द्वारा चुने गए, भरपूर फसल के लिए विश्वसनीय समाधान।"}
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 bg-secondary/20">
        <div className="container mx-auto px-4 lg:px-8">
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <ProductSkeleton key={index} />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <div
                  key={product.id}
                  
                  
                  
                >
                  <Card className="group overflow-hidden card-hover h-full">
                    <div className="relative h-52 bg-gradient-to-br from-green-100 to-green-50 overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <Image
                          src={product.images[0]}
                          alt={language === "en" ? product.name : product.name_hi}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="h-32 w-32 rounded-full bg-primary/10 flex items-center justify-center">
                            <Package className="h-16 w-16 text-primary/40" />
                          </div>
                        </div>
                      )}
                      <Badge className="absolute top-3 left-3 bg-accent text-white flex items-center gap-1">
                        <Star className="h-3 w-3 fill-current" />
                        {language === "en" ? "Best Seller" : "बेस्ट सेलर"}
                      </Badge>
                      <Badge variant="secondary" className="absolute top-3 right-3 capitalize">
                        {product.category?.name || "Product"}
                      </Badge>
                    </div>
                    <CardContent className="p-5">
                      <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                        {language === "en" ? product.name : product.name_hi}
                      </h3>
                      <p className="text-xs text-gray-500 mb-2">
                        {product.suitable_crops && product.suitable_crops.length > 0
                          ? `${language === "en" ? "For" : ""} ${product.suitable_crops.slice(0, 2).join(" & ")}`
                          : ""}
                      </p>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {language === "en" ? product.description : product.description_hi}
                      </p>
                      <Button asChild className="w-full group-hover:bg-primary-dark">
                        <Link href={`/products/${product.slug}`}>
                          {language === "en" ? "Know More" : "और जानें"}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {language === "en" ? "No products available" : "कोई उत्पाद उपलब्ध नहीं"}
              </h3>
              <p className="text-gray-600">
                {language === "en"
                  ? "Please check back later."
                  : "कृपया बाद में पुनः जांचें।"}
              </p>
            </div>
          )}

          {/* View All Products CTA */}
          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg">
              <Link href="/products">
                {language === "en" ? "View All Products" : "सभी उत्पाद देखें"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
