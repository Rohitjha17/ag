"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  QrCode,
  Gift,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/store/useStore";

const steps = [
  {
    icon: ShoppingBag,
    title: "Buy a Product",
    titleHi: "उत्पाद खरीदें",
    description: "Purchase any of our trusted Agrio India crop science products from a nearby store.",
    descriptionHi: "पास की दुकान से हमारे किसी भी विश्वसनीय एग्रियो इंडिया क्रॉप साइंस उत्पाद को खरीदें।",
  },
  {
    icon: QrCode,
    title: "Scratch & Scan Code",
    titleHi: "खुरचें और कोड स्कैन करें",
    description: "Find the unique scratch code on the product packaging and easily scan it with your phone.",
    descriptionHi: "उत्पाद पैकेजिंग पर अद्वितीय स्क्रैच कोड खोजें और आसानी से अपने फोन से स्कैन करें।",
  },
  {
    icon: Gift,
    title: "Win Exciting Rewards",
    titleHi: "रोमांचक पुरस्कार जीतें",
    description: "Instantly win amazing rewards, from cashback to valuable farming tools.",
    descriptionHi: "तुरंत अद्भुत पुरस्कार जीतें, कैशबैक से लेकर मूल्यवान कृषि उपकरण तक।",
  },
];

const rewards = [
  { name: "Cashback ₹500", nameHi: "कैशबैक ₹500" },
  { name: "10% Discount", nameHi: "10% छूट" },
  { name: "Cashback ₹250", nameHi: "कैशबैक ₹250" },
  { name: "Free Products", nameHi: "मुफ्त उत्पाद" },
  { name: "Gift Vouchers", nameHi: "गिफ्ट वाउचर" },
  { name: "Farming Tools", nameHi: "कृषि उपकरण" },
];

export default function ScanWinPage() {
  const { language, isAuthenticated } = useStore();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary-dark to-green-800 py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 h-64 w-64 rounded-full bg-accent blur-3xl" />
          <div className="absolute bottom-10 right-10 h-96 w-96 rounded-full bg-white blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div
              
              
              className="text-white"
            >
              <Badge className="bg-accent text-white mb-4 px-4 py-1.5">
                <Sparkles className="h-4 w-4 mr-2" />
                {language === "en" ? "Win Exciting Rewards" : "रोमांचक पुरस्कार जीतें"}
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                {language === "en" ? (
                  <>Grow Your Crops,<br /><span className="text-accent">Grow Your Rewards</span></>
                ) : (
                  <>अपनी फसल बढ़ाएं,<br /><span className="text-accent">अपने पुरस्कार बढ़ाएं</span></>
                )}
              </h1>
              <p className="text-lg opacity-90 mb-8 max-w-lg">
                {language === "en"
                  ? "Purchase authentic Agrio India products, scan the code, and win exciting rewards. Join thousands of farmers benefiting from our program."
                  : "प्रामाणिक एग्रियो इंडिया उत्पाद खरीदें, कोड स्कैन करें और रोमांचक पुरस्कार जीतें। हमारे कार्यक्रम से लाभान्वित हजारों किसानों से जुड़ें।"}
              </p>
              <Button
                asChild
                size="xl"
                className="bg-accent hover:bg-accent/90 text-white"
              >
                <Link href={isAuthenticated ? "/dashboard/scan" : "/auth"}>
                  {isAuthenticated
                    ? language === "en"
                      ? "Scan Code Now"
                      : "अभी कोड स्कैन करें"
                    : language === "en"
                    ? "Login to Scan Code"
                    : "स्कैन कोड के लिए लॉगिन"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            <div
              
              
              
              className="hidden lg:block"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-transparent rounded-2xl transform rotate-3" />
                <div className="relative w-[500px] h-[400px] rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="/landscape-green-field.jpg"
                    alt="Beautiful green agricultural landscape"
                    fill
                    className="object-cover"
                    sizes="500px"
                  />
                </div>
                {/* Floating Prize Card */}
                <div
                  
                  
                  
                  className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                      <Gift className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-primary">₹25L+</p>
                      <p className="text-xs text-gray-600">
                        {language === "en" ? "Rewards Given" : "पुरस्कार दिए गए"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div
            
            
            
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {language === "en" ? "Simple Steps to Your Rewards" : "आपके पुरस्कारों के लिए सरल कदम"}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {language === "en"
                ? "Follow these three easy steps to start winning. It's simple, quick, and rewarding."
                : "जीतना शुरू करने के लिए इन तीन आसान चरणों का पालन करें। यह सरल, त्वरित और फायदेमंद है।"}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                
                
                
                
                className="relative"
              >
                <Card className={`h-full ${index === 2 ? "bg-accent text-white" : ""}`}>
                  <CardContent className="p-8 text-center">
                    <div className={`inline-flex items-center justify-center h-20 w-20 rounded-full mb-6 ${
                      index === 2 ? "bg-white/20" : "bg-secondary"
                    }`}>
                      <step.icon className={`h-10 w-10 ${index === 2 ? "text-white" : "text-primary"}`} />
                    </div>
                    <div className={`inline-flex items-center justify-center h-8 w-8 rounded-full text-sm font-bold mb-4 ${
                      index === 2 ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
                    }`}>
                      {index + 1}
                    </div>
                    <h3 className="font-semibold text-xl mb-3">
                      {language === "en" ? step.title : step.titleHi}
                    </h3>
                    <p className={`text-sm ${index === 2 ? "text-white/90" : "text-gray-600"}`}>
                      {language === "en" ? step.description : step.descriptionHi}
                    </p>
                  </CardContent>
                </Card>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="h-8 w-8 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rewards Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div
            
            
            
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {language === "en" ? "Exciting Rewards Await" : "रोमांचक पुरस्कार आपका इंतजार कर रहे हैं"}
            </h2>
            <p className="text-gray-600">
              {language === "en"
                ? "Win from a variety of amazing prizes with every scan"
                : "हर स्कैन के साथ विभिन्न अद्भुत पुरस्कार जीतें"}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {rewards.map((reward, index) => (
              <div
                key={index}
                
                
                
                
              >
                <Card className="text-center card-hover">
                  <CardContent className="p-4">
                    <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
                      <Star className="h-6 w-6 text-accent" />
                    </div>
                    <p className="font-medium text-sm">
                      {language === "en" ? reward.name : reward.nameHi}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div
              
              
              
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {language === "en" ? "Why Join Our Rewards Program?" : "हमारे रिवार्ड्स प्रोग्राम में क्यों शामिल हों?"}
              </h2>
              <div className="space-y-4">
                {[
                  { en: "100% Genuine rewards with every scan", hi: "हर स्कैन के साथ 100% असली पुरस्कार" },
                  { en: "Instant prize revelation", hi: "तुरंत पुरस्कार का खुलासा" },
                  { en: "Easy redemption process", hi: "आसान रिडेम्पशन प्रक्रिया" },
                  { en: "Digital certificate for every win", hi: "हर जीत के लिए डिजिटल प्रमाणपत्र" },
                  { en: "Track all your rewards in one place", hi: "एक जगह अपने सभी पुरस्कार ट्रैक करें" },
                ].map((benefit, index) => (
                  <div
                    key={index}
                    
                    
                    
                    
                    className="flex items-center gap-3"
                  >
                    <CheckCircle className="h-6 w-6 text-primary shrink-0" />
                    <span className="text-gray-700">
                      {language === "en" ? benefit.en : benefit.hi}
                    </span>
                  </div>
                ))}
              </div>
              <Button asChild size="lg" className="mt-8">
                <Link href={isAuthenticated ? "/dashboard/scan" : "/auth"}>
                  {language === "en" ? "Start Winning Now" : "अभी जीतना शुरू करें"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            <div
              
              
              
              className="relative h-96 rounded-2xl overflow-hidden"
            >
              <Image
                src="/green-rice-fields.jpg"
                alt="Lush green rice fields"
                fill
                className="object-cover rounded-2xl"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/mesmerizing-shot-scenic-cloudy-sky-field.jpg"
            alt="Beautiful field with cloudy sky"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-primary/85" />
        </div>
        <div className="container mx-auto px-4 lg:px-8 text-center relative">
          <div
            
            
            
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {language === "en" ? "Ready to Win?" : "जीतने के लिए तैयार?"}
            </h2>
            <p className="text-white/80 mb-8 max-w-xl mx-auto">
              {language === "en"
                ? "Don't miss out on exciting rewards. Start scanning your product codes today!"
                : "रोमांचक पुरस्कारों से न चूकें। आज ही अपने उत्पाद कोड स्कैन करना शुरू करें!"}
            </p>
            <Button
              asChild
              size="xl"
              variant="secondary"
              className="text-primary"
            >
              <Link href={isAuthenticated ? "/dashboard/scan" : "/auth"}>
                <QrCode className="mr-2 h-6 w-6" />
                {language === "en" ? "Scan Your Code" : "अपना कोड स्कैन करें"}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

