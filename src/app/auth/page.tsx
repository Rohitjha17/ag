"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Phone,
  ArrowLeft,
  ArrowRight,
  Loader2,
  MapPin,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useStore } from "@/store/useStore";
import * as api from "@/lib/api";

// Schemas
const mobileSchema = z.object({
  mobile: z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number"),
});

const otpSchema = z.object({
  otp: z.string().length(4, "OTP must be 4 digits"),
});

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  pincode: z.string().regex(/^[1-9][0-9]{5}$/, "Please enter a valid 6-digit pincode"),
  email: z.string().email().optional().or(z.literal("")),
});

type Step = "mobile" | "otp" | "profile" | "crops";

export default function AuthPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { language, setLanguage, setUser, setAuthenticated } = useStore();

  const [step, setStep] = useState<Step>("mobile");
  const [isNewUser, setIsNewUser] = useState(false);
  const [mobile, setMobile] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);
  const [profileData, setProfileData] = useState({ name: "", pincode: "", email: "", state: "", district: "" });
  const [crops, setCrops] = useState<{ id: string; name: string; name_hi: string }[]>([]);

  // Forms
  const mobileForm = useForm({
    resolver: zodResolver(mobileSchema),
    defaultValues: { mobile: "" },
  });

  const otpForm = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "", pincode: "", email: "" },
  });

  // Fetch crops from API on mount
  useEffect(() => {
    const fetchCrops = async () => {
      const response = await api.getCrops();
      if (response.success && response.data) {
        setCrops(response.data.map(c => ({
          id: c.id,
          name: c.name,
          name_hi: c.name_hi,
        })));
      }
    };
    fetchCrops();
  }, []);

  // Handle mobile submission - Send OTP via Twilio
  const onMobileSubmit = async (data: { mobile: string }) => {
    setIsLoading(true);
    setMobile(data.mobile);
    
    try {
      // Send OTP via Twilio
      const response = await api.sendOtp(data.mobile);
      
      if (response.success) {
        setStep("otp");
        startResendTimer();
        
        toast({
          title: language === "en" ? "OTP Sent!" : "OTP भेजा गया!",
          description: language === "en" 
            ? `We've sent a 4-digit OTP to +91 ${data.mobile}` 
            : `हमने +91 ${data.mobile} पर 4 अंकों का OTP भेजा है`,
          variant: "success",
        });
      } else {
        toast({
          title: language === "en" ? "Error" : "त्रुटि",
          description: response.error?.message || (language === "en" ? "Failed to send OTP" : "OTP भेजने में विफल"),
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: language === "en" ? "Error" : "त्रुटि",
        description: language === "en" ? "Something went wrong. Please try again." : "कुछ गलत हो गया। कृपया पुनः प्रयास करें।",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  // Handle OTP submission - Verify via Twilio
  const onOTPSubmit = async (data: { otp: string }) => {
    setIsLoading(true);
    
    try {
      const response = await api.verifyOtp(mobile, data.otp);
      
      if (response.success && response.data) {
        const userData = response.data.user;
        
        // Store user data
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
        
        if (response.data.is_new_user || !userData.full_name) {
          setIsNewUser(true);
          setStep("profile");
        } else {
          toast({
            title: language === "en" ? "Welcome back!" : "वापसी पर स्वागत है!",
            description: language === "en" ? "Logged in successfully" : "सफलतापूर्वक लॉग इन किया गया",
            variant: "success",
          });
          router.push("/dashboard");
        }
      } else {
        // Handle specific Twilio error cases
        const errorMessage = response.error?.message?.toLowerCase() || '';
        
        if (errorMessage.includes('expired') || errorMessage.includes('timeout')) {
          toast({
            title: language === "en" ? "OTP Expired" : "OTP समाप्त हो गया",
            description: language === "en" 
              ? "Your OTP has expired. Please request a new one." 
              : "आपका OTP समाप्त हो गया है। कृपया नया OTP मांगें।",
            variant: "destructive",
          });
        } else if (errorMessage.includes('invalid') || errorMessage.includes('incorrect')) {
          toast({
            title: language === "en" ? "Invalid OTP" : "अमान्य OTP",
            description: language === "en" 
              ? "The OTP you entered is incorrect. Please try again." 
              : "आपने जो OTP दर्ज किया है वह गलत है। कृपया पुनः प्रयास करें।",
            variant: "destructive",
          });
        } else if (errorMessage.includes('too many') || errorMessage.includes('limit')) {
          toast({
            title: language === "en" ? "Too Many Attempts" : "बहुत अधिक प्रयास",
            description: language === "en" 
              ? "You've made too many attempts. Please wait and try again." 
              : "आपने बहुत अधिक प्रयास किए हैं। कृपया प्रतीक्षा करें और पुनः प्रयास करें।",
            variant: "destructive",
          });
        } else {
          toast({
            title: language === "en" ? "Invalid OTP" : "अमान्य OTP",
            description: response.error?.message || (language === "en" ? "Please enter the correct OTP" : "कृपया सही OTP दर्ज करें"),
            variant: "destructive",
          });
        }
        // Clear the OTP input for retry
        otpForm.reset();
      }
    } catch (error) {
      toast({
        title: language === "en" ? "Error" : "त्रुटि",
        description: language === "en" ? "Something went wrong. Please try again." : "कुछ गलत हो गया। कृपया पुनः प्रयास करें।",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  // Handle profile submission
  const onProfileSubmit = async (data: { name: string; pincode: string; email?: string }) => {
    setIsLoading(true);
    
    setProfileData({
      name: data.name,
      pincode: data.pincode,
      email: data.email || "",
      state: "", // Will be auto-filled by backend based on pincode
      district: "",
    });
    
    setStep("crops");
    setIsLoading(false);
  };

  // Handle crop selection
  const handleCropToggle = (cropId: string) => {
    setSelectedCrops((prev) =>
      prev.includes(cropId) ? prev.filter((c) => c !== cropId) : [...prev, cropId]
    );
  };

  // Complete registration
  const completeRegistration = async () => {
    if (selectedCrops.length === 0) {
      toast({
        title: language === "en" ? "Select at least one crop" : "कम से कम एक फसल चुनें",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create/update profile
      const profileResponse = await api.createProfile({
        full_name: profileData.name,
        pin_code: profileData.pincode,
        email: profileData.email || undefined,
      });
      
      if (!profileResponse.success) {
        toast({
          title: language === "en" ? "Error" : "त्रुटि",
          description: profileResponse.error?.message || "Failed to create profile",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      // Sync crop preferences
      const cropsResponse = await api.syncCropPreferences(selectedCrops);
      
      if (!cropsResponse.success) {
        console.warn("Failed to sync crop preferences:", cropsResponse.error);
      }
      
      // Update local state
      const userData = profileResponse.data;
      if (userData) {
        setUser({
          id: userData.id,
          name: userData.full_name || profileData.name,
          mobile: userData.phone_number,
          pincode: userData.pin_code || profileData.pincode,
          state: userData.state || "",
          district: userData.district || "",
          cropPreferences: selectedCrops,
          language: userData.language || language,
          isActive: userData.is_active,
          createdAt: userData.created_at,
          lastLogin: userData.last_login || new Date().toISOString(),
        });
      }
      
      toast({
        title: language === "en" ? "Welcome to Agrio India!" : "एग्रियो इंडिया में आपका स्वागत है!",
        variant: "success",
      });
      
      router.push("/dashboard");
    } catch (error) {
      toast({
        title: language === "en" ? "Error" : "त्रुटि",
        description: language === "en" ? "Something went wrong" : "कुछ गलत हो गया",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  // Resend OTP timer
  const startResendTimer = () => {
    setResendTimer(60);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const resendOTP = async () => {
    setIsLoading(true);
    
    try {
      const response = await api.sendOtp(mobile);
      
      if (response.success) {
        startResendTimer();
        // Clear the OTP input for new entry
        otpForm.reset();
        toast({
          title: language === "en" ? "OTP Resent!" : "OTP फिर से भेजा गया!",
          description: language === "en" 
            ? `A new OTP has been sent to +91 ${mobile}` 
            : `नया OTP +91 ${mobile} पर भेजा गया`,
          variant: "success",
        });
      } else {
        // Handle Twilio rate limiting
        const errorMessage = response.error?.message?.toLowerCase() || '';
        if (errorMessage.includes('rate') || errorMessage.includes('limit') || errorMessage.includes('too many')) {
          toast({
            title: language === "en" ? "Please Wait" : "कृपया प्रतीक्षा करें",
            description: language === "en" 
              ? "Too many OTP requests. Please wait before trying again." 
              : "बहुत अधिक OTP अनुरोध। कृपया पुनः प्रयास करने से पहले प्रतीक्षा करें।",
            variant: "destructive",
          });
        } else {
          toast({
            title: language === "en" ? "Error" : "त्रुटि",
            description: response.error?.message || (language === "en" ? "Failed to resend OTP" : "OTP फिर से भेजने में विफल"),
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: language === "en" ? "Error" : "त्रुटि",
        description: language === "en" ? "Something went wrong. Please try again." : "कुछ गलत हो गया। कृपया पुनः प्रयास करें।",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "hi" : "en");
  };

  const getProgress = () => {
    if (!isNewUser) return step === "mobile" ? 50 : 100;
    switch (step) {
      case "mobile": return 25;
      case "otp": return 50;
      case "profile": return 75;
      case "crops": return 100;
      default: return 0;
    }
  };

  return (
    <div className="min-h-screen bg-secondary/30 flex flex-col">
      {/* Language Toggle */}
      <div className="absolute top-4 right-4 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleLanguage}
          className="rounded-full"
        >
          {language === "en" ? "हिंदी" : "English"}
        </Button>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div
          
          
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2">
              <Image
                src="/logo.svg"
                alt="Agrio India Logo"
                width={48}
                height={48}
                className="h-12 w-12 object-contain"
              />
              <span className="text-2xl font-bold text-primary">Agrio India</span>
            </Link>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Progress */}
            {isNewUser && step !== "mobile" && (
              <div className="mb-6">
                <p className="text-xs text-gray-500 mb-2">
                  {language === "en"
                    ? `Step ${step === "otp" ? 2 : step === "profile" ? 3 : 4} of 4`
                    : `चरण ${step === "otp" ? 2 : step === "profile" ? 3 : 4} में से 4`}
                </p>
                <Progress value={getProgress()} className="h-2" />
              </div>
            )}

            <>
              {/* Step: Mobile */}
              {step === "mobile" && (
                <div
                  key="mobile"
                  
                  
                  
                >
                  <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold mb-2">
                      {language === "en" ? "Welcome to Agrio India" : "एग्रियो इंडिया में आपका स्वागत है"}
                    </h1>
                    <p className="text-gray-600 text-sm">
                      {language === "en"
                        ? "Enter your mobile number to log in or sign up"
                        : "लॉग इन या साइन अप करने के लिए अपना मोबाइल नंबर दर्ज करें"}
                    </p>
                  </div>

                  <form onSubmit={mobileForm.handleSubmit(onMobileSubmit)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="mobile">
                        {language === "en" ? "Mobile Number" : "मोबाइल नंबर"}
                      </Label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 text-gray-500">
                          <Phone className="h-4 w-4" />
                          <span className="text-sm font-medium">+91</span>
                          <span className="h-5 w-px bg-gray-300" />
                        </div>
                        <Input
                          id="mobile"
                          placeholder={language === "en" ? "Enter your 10-digit mobile number" : "अपना 10 अंकों का मोबाइल नंबर दर्ज करें"}
                          className="pl-24 h-12"
                          {...mobileForm.register("mobile")}
                          maxLength={10}
                        />
                      </div>
                      {mobileForm.formState.errors.mobile && (
                        <p className="text-sm text-destructive">
                          {mobileForm.formState.errors.mobile.message}
                        </p>
                      )}
                    </div>

                    <Button type="submit" className="w-full h-12" disabled={isLoading}>
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          {language === "en" ? "Continue" : "जारी रखें"}
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </form>

                  <p className="text-xs text-center text-gray-500 mt-6">
                    {language === "en" ? "By continuing, you agree to our " : "जारी रखकर, आप हमारी "}
                    <Link href="/terms" className="text-primary hover:underline">
                      {language === "en" ? "Terms of Service" : "सेवा की शर्तें"}
                    </Link>
                    {language === "en" ? " and " : " और "}
                    <Link href="/privacy-policy" className="text-primary hover:underline">
                      {language === "en" ? "Privacy Policy" : "गोपनीयता नीति"}
                    </Link>
                  </p>
                </div>
              )}

              {/* Step: OTP */}
              {step === "otp" && (
                <div
                  key="otp"
                  
                  
                  
                >
                  <button
                    onClick={() => setStep("mobile")}
                    className="flex items-center text-sm text-gray-600 hover:text-primary mb-4"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    {language === "en" ? "Back" : "वापस"}
                  </button>

                  <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold mb-2">
                      {language === "en" ? "Enter OTP" : "OTP दर्ज करें"}
                    </h1>
                    <p className="text-gray-600 text-sm">
                      {language === "en"
                        ? `We've sent a 4-digit OTP to +91 ${mobile}`
                        : `हमने +91 ${mobile} पर 4 अंकों का OTP भेजा है`}
                    </p>
                  </div>

                  <form onSubmit={otpForm.handleSubmit(onOTPSubmit)} className="space-y-4">
                    <div className="space-y-2">
                      <Input
                        placeholder="0000"
                        className="h-14 text-center text-2xl tracking-[0.5em] font-semibold"
                        maxLength={4}
                        {...otpForm.register("otp")}
                      />
                      {otpForm.formState.errors.otp && (
                        <p className="text-sm text-destructive text-center">
                          {otpForm.formState.errors.otp.message}
                        </p>
                      )}
                    </div>

                    <Button type="submit" className="w-full h-12" disabled={isLoading}>
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        language === "en" ? "Verify & Login" : "सत्यापित करें और लॉगिन करें"
                      )}
                    </Button>
                  </form>

                  <div className="text-center mt-4">
                    {resendTimer > 0 ? (
                      <p className="text-sm text-gray-500">
                        {language === "en" ? "Resend in " : "पुनः भेजें "}
                        <span className="font-medium text-primary">{resendTimer}s</span>
                      </p>
                    ) : (
                      <button
                        onClick={resendOTP}
                        disabled={isLoading}
                        className="text-sm text-primary hover:underline font-medium"
                      >
                        {language === "en" ? "Resend OTP" : "OTP पुनः भेजें"}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Step: Profile */}
              {step === "profile" && (
                <div
                  key="profile"
                  
                  
                  
                >
                  <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold mb-2">
                      {language === "en" ? "Welcome to Agrio!" : "एग्रियो में आपका स्वागत है!"}
                    </h1>
                    <p className="text-gray-600 text-sm">
                      {language === "en"
                        ? "Let's set up your profile to get started."
                        : "आइए शुरू करने के लिए अपनी प्रोफाइल सेट करें।"}
                    </p>
                  </div>

                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        {language === "en" ? "Full Name" : "पूरा नाम"}
                      </Label>
                      <Input
                        id="name"
                        placeholder={language === "en" ? "Enter your full name" : "अपना पूरा नाम दर्ज करें"}
                        className="h-12"
                        {...profileForm.register("name")}
                      />
                      {profileForm.formState.errors.name && (
                        <p className="text-sm text-destructive">
                          {profileForm.formState.errors.name.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mobile-display">
                        {language === "en" ? "Mobile Number" : "मोबाइल नंबर"}
                      </Label>
                      <Input
                        id="mobile-display"
                        value={`+91 ${mobile}`}
                        disabled
                        className="h-12 bg-gray-50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">
                        {language === "en" ? "Email (Optional)" : "ईमेल (वैकल्पिक)"}
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder={language === "en" ? "Enter your email" : "अपना ईमेल दर्ज करें"}
                        className="h-12"
                        {...profileForm.register("email")}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pincode">
                        {language === "en" ? "Pincode" : "पिनकोड"}
                      </Label>
                      <div className="relative">
                        <Input
                          id="pincode"
                          placeholder={language === "en" ? "Enter your 6-digit pincode" : "अपना 6 अंकों का पिनकोड दर्ज करें"}
                          className="h-12 pr-28"
                          maxLength={6}
                          {...profileForm.register("pincode")}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-primary"
                        >
                          <MapPin className="h-4 w-4 mr-1" />
                          {language === "en" ? "Auto-detect" : "स्वतः पता"}
                        </Button>
                      </div>
                      {profileForm.formState.errors.pincode && (
                        <p className="text-sm text-destructive">
                          {profileForm.formState.errors.pincode.message}
                        </p>
                      )}
                    </div>

                    <Button type="submit" className="w-full h-12" disabled={isLoading}>
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          {language === "en" ? "Continue" : "जारी रखें"}
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              )}

              {/* Step: Crops */}
              {step === "crops" && (
                <div
                  key="crops"
                  
                  
                  
                >
                  <button
                    onClick={() => setStep("profile")}
                    className="flex items-center text-sm text-gray-600 hover:text-primary mb-4"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    {language === "en" ? "Back" : "वापस"}
                  </button>

                  <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold mb-2">
                      {language === "en" ? "Select Your Crops" : "अपनी फसलें चुनें"}
                    </h1>
                    <p className="text-gray-600 text-sm">
                      {language === "en"
                        ? "Select crops you cultivate to get personalized recommendations"
                        : "व्यक्तिगत सिफारिशें पाने के लिए अपनी उगाई जाने वाली फसलें चुनें"}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-6 max-h-72 overflow-y-auto">
                    {crops.map((crop) => (
                      <label
                        key={crop.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedCrops.includes(crop.id)
                            ? "border-primary bg-primary/5"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <Checkbox
                          checked={selectedCrops.includes(crop.id)}
                          onCheckedChange={() => handleCropToggle(crop.id)}
                        />
                        <span className="text-sm">
                          {language === "en" ? crop.name : crop.name_hi}
                        </span>
                      </label>
                    ))}
                  </div>

                  <Button
                    onClick={completeRegistration}
                    className="w-full h-12"
                    disabled={isLoading || selectedCrops.length === 0}
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        {language === "en" ? "Complete Registration" : "पंजीकरण पूरा करें"}
                      </>
                    )}
                  </Button>
                </div>
              )}
            </>
          </div>
        </div>
      </div>
    </div>
  );
}
