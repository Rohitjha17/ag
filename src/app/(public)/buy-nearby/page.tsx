"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  MapPin,
  Search,
  Navigation,
  Phone,
  Star,
  MapPinOff,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useStore } from "@/store/useStore";
import { useToast } from "@/hooks/use-toast";
import * as api from "@/lib/api";
import type { Distributor } from "@/lib/api";

function DistributorSkeleton() {
  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-4" />
        <Skeleton className="h-4 w-24 mb-4" />
        <Skeleton className="h-4 w-32 mb-4" />
        <div className="flex gap-3">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function BuyNearbyPage() {
  const { language, user } = useStore();
  const { toast } = useToast();
  const [pincode, setPincode] = useState("");
  const [searchedPincode, setSearchedPincode] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Search function that can be called with pincode parameter
  const handleSearchWithPincode = async (pincodeToSearch: string) => {
    if (!pincodeToSearch || pincodeToSearch.length !== 6) {
      return;
    }
    
    setIsSearching(true);
    setHasSearched(true);
    
    try {
      const response = await api.getDistributors({ pincode: pincodeToSearch });
      
      if (response.success && response.data) {
        setDistributors(response.data);
        setSearchedPincode(pincodeToSearch);
      } else {
        setDistributors([]);
        toast({
          title: language === "en" ? "Error" : "त्रुटि",
          description: response.error?.message || (language === "en"
            ? "Failed to search distributors"
            : "वितरकों की खोज विफल रही"),
          variant: "destructive",
        });
      }
    } catch (error) {
      setDistributors([]);
      toast({
        title: language === "en" ? "Error" : "त्रुटि",
        description: language === "en"
          ? "Something went wrong. Please try again."
          : "कुछ गलत हो गया। कृपया पुनः प्रयास करें।",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = async () => {
    if (!pincode || pincode.length !== 6) {
      toast({
        title: language === "en" ? "Invalid Pincode" : "अमान्य पिनकोड",
        description: language === "en" 
          ? "Please enter a valid 6-digit pincode"
          : "कृपया एक वैध 6 अंकों का पिनकोड दर्ज करें",
        variant: "destructive",
      });
      return;
    }
    
    setIsSearching(true);
    setHasSearched(true);
    
    try {
      const response = await api.getDistributors({ pincode });
      
      if (response.success && response.data) {
        setDistributors(response.data);
        setSearchedPincode(pincode);
      } else {
        setDistributors([]);
        toast({
          title: language === "en" ? "Error" : "त्रुटि",
          description: response.error?.message || (language === "en"
            ? "Failed to search distributors"
            : "वितरकों की खोज विफल रही"),
          variant: "destructive",
        });
      }
    } catch (error) {
      setDistributors([]);
      toast({
        title: language === "en" ? "Error" : "त्रुटि",
        description: language === "en"
          ? "Something went wrong. Please try again."
          : "कुछ गलत हो गया। कृपया पुनः प्रयास करें।",
        variant: "destructive",
      });
    }
    
    setIsSearching(false);
  };

  const handleUseLocation = async () => {
    setIsLocating(true);
    
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // Search with location
          try {
            const response = await api.getDistributors({
              pincode: "000000", // Placeholder, backend should use lat/lng
              lat: latitude,
              lng: longitude,
            });
            
            if (response.success && response.data) {
              setDistributors(response.data);
              setSearchedPincode("Your Location");
              setHasSearched(true);
            }
          } catch (error) {
            toast({
              title: language === "en" ? "Error" : "त्रुटि",
              description: language === "en"
                ? "Failed to search by location"
                : "स्थान द्वारा खोज विफल रही",
              variant: "destructive",
            });
          }
          
          setIsLocating(false);
        },
        (error) => {
          console.error(error);
          toast({
            title: language === "en" ? "Location Error" : "स्थान त्रुटि",
            description: language === "en"
              ? "Unable to get your location. Please enter pincode manually."
              : "आपका स्थान प्राप्त करने में असमर्थ। कृपया पिनकोड मैन्युअल रूप से दर्ज करें।",
            variant: "destructive",
          });
          setIsLocating(false);
        }
      );
    } else {
      toast({
        title: language === "en" ? "Not Supported" : "समर्थित नहीं",
        description: language === "en"
          ? "Geolocation is not supported by your browser"
          : "आपके ब्राउज़र द्वारा जियोलोकेशन समर्थित नहीं है",
        variant: "destructive",
      });
      setIsLocating(false);
    }
  };

  // Fetch user pincode and auto-search on mount if user is logged in
  useEffect(() => {
    const fetchUserPincodeAndSearch = async () => {
      if (user?.pincode && user.pincode.length === 6) {
        // User has pincode in store, use it
        setPincode(user.pincode);
        // Auto-search with user's pincode
        handleSearchWithPincode(user.pincode);
      } else if (user?.id) {
        // User is logged in but pincode not in store, fetch profile
        try {
          const response = await api.getProfile();
          if (response.success && response.data?.pin_code) {
            const userPincode = response.data.pin_code;
            if (userPincode && userPincode.length === 6) {
              setPincode(userPincode);
              // Auto-search with fetched pincode
              handleSearchWithPincode(userPincode);
            }
          }
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
        }
      }
    };

    fetchUserPincodeAndSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, user?.pincode]);

  return (
    <div className="min-h-screen bg-secondary/20">
      {/* Header Section */}
      <div className="relative overflow-hidden border-b">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/road-middle-sugar-cane-field-sunny-day-with-mountain-back.jpg"
            alt="Road through sugar cane fields with mountains"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/90 to-white/95" />
        </div>
        <div className="container mx-auto px-4 lg:px-8 py-12 relative">
          <div
            
            
            className="text-center max-w-2xl mx-auto"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {language === "en"
                ? "Find Our Distributor Near You"
                : "अपने पास वितरक खोजें"}
            </h1>
            <p className="text-gray-600 mb-8">
              {language === "en"
                ? "Enter your pincode or use your current location to find Agrio products available in your area."
                : "अपने क्षेत्र में उपलब्ध एग्रियो उत्पादों को खोजने के लिए अपना पिनकोड दर्ज करें या अपने वर्तमान स्थान का उपयोग करें।"}
            </p>

            {/* Search Box */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder={language === "en" ? "Enter Your Pincode" : "अपना पिनकोड दर्ज करें"}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-10 h-12"
                />
              </div>
              <span className="text-gray-500">
                {language === "en" ? "or" : "या"}
              </span>
              <Button
                variant="outline"
                size="lg"
                onClick={handleUseLocation}
                disabled={isLocating}
                className="w-full sm:w-auto"
              >
                {isLocating ? (
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <Navigation className="h-5 w-5 mr-2" />
                )}
                {language === "en" ? "Use My Location" : "मेरा स्थान उपयोग करें"}
              </Button>
            </div>

            <Button
              onClick={handleSearch}
              disabled={isSearching || pincode.length !== 6}
              className="mt-4"
            >
              {isSearching ? (
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              ) : (
                <Search className="h-5 w-5 mr-2" />
              )}
              {language === "en" ? "Search" : "खोजें"}
            </Button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="container mx-auto px-4 lg:px-8 py-8">
        {searchedPincode && (
          <div
            
            
            className="mb-6"
          >
            <p className="text-lg font-medium">
              {language === "en"
                ? `Showing Distributors for ${searchedPincode}`
                : `${searchedPincode} के लिए वितरक दिखा रहे हैं`}
            </p>
          </div>
        )}

        {isSearching ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <DistributorSkeleton key={index} />
            ))}
          </div>
        ) : distributors.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {distributors.map((distributor, index) => (
              <div
                key={distributor.id}
                
                
                
              >
                <Card className="h-full card-hover">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {distributor.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {distributor.address}, {distributor.city}
                        </p>
                      </div>
                      {distributor.is_active && (
                        <Badge variant="success" className="shrink-0">
                          {language === "en" ? "Active" : "सक्रिय"}
                        </Badge>
                      )}
                    </div>

                    {/* Distance */}
                    {distributor.distance_km && (
                      <div className="flex items-center gap-2 text-sm text-primary mb-4">
                        <MapPin className="h-4 w-4" />
                        <span>
                          {distributor.distance_km.toFixed(1)} {language === "en" ? "km away" : "किमी दूर"}
                        </span>
                      </div>
                    )}

                    {/* Phone */}
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                      <Phone className="h-4 w-4" />
                      <a href={`tel:${distributor.phone}`} className="hover:text-primary">
                        {distributor.phone}
                      </a>
                    </div>

                    {/* Owner */}
                    {distributor.owner_name && (
                      <div className="text-sm text-gray-600 mb-4">
                        <span className="font-medium">{language === "en" ? "Owner:" : "मालिक:"}</span>{" "}
                        {distributor.owner_name}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button asChild className="flex-1">
                        <a href={`tel:${distributor.phone}`}>
                          <Phone className="h-4 w-4 mr-2" />
                          {language === "en" ? "Call" : "कॉल"}
                        </a>
                      </Button>
                      {distributor.latitude && distributor.longitude && (
                        <Button variant="outline" asChild className="flex-1">
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${distributor.latitude},${distributor.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Navigation className="h-4 w-4 mr-2" />
                            {language === "en" ? "Navigate" : "नेविगेट"}
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        ) : hasSearched ? (
          <div
            
            
          >
            <Card className="p-12 text-center">
              <MapPinOff className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {language === "en" ? "No Distributors Found" : "कोई वितरक नहीं मिला"}
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {language === "en"
                  ? "We couldn't find any distributors in your area. Please try another pincode or contact our support for assistance."
                  : "हमें आपके क्षेत्र में कोई वितरक नहीं मिला। कृपया दूसरा पिनकोड आज़माएं या सहायता के लिए हमारे सपोर्ट से संपर्क करें।"}
              </p>
            </Card>
          </div>
        ) : null}
      </div>
    </div>
  );
}
