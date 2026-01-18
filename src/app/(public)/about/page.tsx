"use client";

import React from "react";
import Image from "next/image";
import {
  Target,
  Eye,
  Heart,
  Award,
  Leaf,
  TrendingUp,
  Shield,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useStore } from "@/store/useStore";

const values = [
  {
    icon: Shield,
    title: "Quality",
    titleHi: "गुणवत्ता",
    description: "We are committed to providing the highest quality products that meet international standards.",
    descriptionHi: "हम अंतरराष्ट्रीय मानकों को पूरा करने वाले उच्चतम गुणवत्ता वाले उत्पाद प्रदान करने के लिए प्रतिबद्ध हैं।",
  },
  {
    icon: Heart,
    title: "Trust",
    titleHi: "विश्वास",
    description: "Building lasting relationships with farmers based on trust and reliability.",
    descriptionHi: "विश्वास और विश्वसनीयता के आधार पर किसानों के साथ स्थायी संबंध बनाना।",
  },
  {
    icon: Leaf,
    title: "Sustainability",
    titleHi: "स्थिरता",
    description: "Developing eco-friendly solutions that protect both crops and the environment.",
    descriptionHi: "पर्यावरण के अनुकूल समाधान विकसित करना जो फसलों और पर्यावरण दोनों की रक्षा करें।",
  },
  {
    icon: TrendingUp,
    title: "Innovation",
    titleHi: "नवाचार",
    description: "Continuously researching and developing new solutions for modern farming challenges.",
    descriptionHi: "आधुनिक कृषि चुनौतियों के लिए लगातार नए समाधानों का अनुसंधान और विकास करना।",
  },
];

const stats = [
  { value: "25+", label: "Years of Experience", labelHi: "वर्षों का अनुभव" },
  { value: "2L+", label: "Happy Farmers", labelHi: "खुश किसान" },
  { value: "150+", label: "Products", labelHi: "उत्पाद" },
  { value: "500+", label: "Distributors", labelHi: "वितरक" },
];

export default function AboutPage() {
  const { language } = useStore();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-dark to-primary py-20 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/landscape-green-field.jpg"
            alt="Beautiful green agricultural landscape"
            fill
            className="object-cover opacity-30"
            priority
          />
        </div>
        <div className="container mx-auto px-4 lg:px-8 relative">
          <div
            
            
            className="text-center text-white max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {language === "en" ? "About Agrio India" : "एग्रियो इंडिया के बारे में"}
            </h1>
            <p className="text-lg md:text-xl opacity-90">
              {language === "en"
                ? "Empowering Indian farmers with high-quality crop solutions for over 25 years."
                : "25 से अधिक वर्षों से उच्च गुणवत्ता वाले फसल समाधानों के साथ भारतीय किसानों को सशक्त बनाना।"}
            </p>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div
              
              
              
            >
              <h2 className="text-3xl font-bold mb-6">
                {language === "en" ? "Our Story" : "हमारी कहानी"}
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  {language === "en"
                    ? "Agrio India Crop Science was founded with a simple yet powerful mission: to empower Indian farmers with the best agrochemical solutions that ensure bountiful harvests and sustainable farming practices."
                    : "एग्रियो इंडिया क्रॉप साइंस की स्थापना एक सरल लेकिन शक्तिशाली मिशन के साथ की गई थी: भारतीय किसानों को सर्वोत्तम कृषि रसायन समाधान प्रदान करना जो भरपूर फसल और टिकाऊ कृषि प्रथाओं को सुनिश्चित करें।"}
                </p>
                <p>
                  {language === "en"
                    ? "Starting from a small manufacturing unit in Uttar Pradesh, we have grown to become one of the most trusted names in Indian agriculture. Our commitment to quality, innovation, and farmer welfare has remained unchanged throughout our journey."
                    : "उत्तर प्रदेश में एक छोटी विनिर्माण इकाई से शुरू होकर, हम भारतीय कृषि में सबसे विश्वसनीय नामों में से एक बन गए हैं। गुणवत्ता, नवाचार और किसान कल्याण के प्रति हमारी प्रतिबद्धता पूरी यात्रा में अपरिवर्तित रही है।"}
                </p>
                <p>
                  {language === "en"
                    ? "Today, our products are used by over 2 lakh farmers across India, helping them achieve better yields and improved livelihoods. We continue to invest in research and development to bring the latest agricultural solutions to Indian farmers."
                    : "आज, हमारे उत्पाद भारत भर में 2 लाख से अधिक किसानों द्वारा उपयोग किए जाते हैं, जिससे उन्हें बेहतर उपज और बेहतर आजीविका प्राप्त करने में मदद मिलती है। हम भारतीय किसानों को नवीनतम कृषि समाधान लाने के लिए अनुसंधान और विकास में निवेश जारी रखते हैं।"}
                </p>
              </div>
            </div>

            <div
              
              
              
              className="relative h-96 rounded-2xl overflow-hidden shadow-xl"
            >
              <Image
                src="/man-gardener-growing-green-spring-onion.jpg"
                alt="Indian farmer working in the field"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                
                
                
                
                className="text-center text-white"
              >
                <p className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</p>
                <p className="text-sm md:text-base opacity-80">
                  {language === "en" ? stat.label : stat.labelHi}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Mission */}
            <div
              
              
              
            >
              <Card className="h-full">
                <CardContent className="p-8">
                  <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                    <Target className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">
                    {language === "en" ? "Our Mission" : "हमारा मिशन"}
                  </h3>
                  <p className="text-gray-600">
                    {language === "en"
                      ? "To provide Indian farmers with innovative, high-quality, and affordable agrochemical solutions that maximize crop yields while promoting sustainable agricultural practices."
                      : "भारतीय किसानों को नवीन, उच्च गुणवत्ता वाले और किफायती कृषि रसायन समाधान प्रदान करना जो टिकाऊ कृषि प्रथाओं को बढ़ावा देते हुए फसल की पैदावार को अधिकतम करें।"}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Vision */}
            <div
              
              
              
              
            >
              <Card className="h-full">
                <CardContent className="p-8">
                  <div className="h-14 w-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
                    <Eye className="h-7 w-7 text-accent" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">
                    {language === "en" ? "Our Vision" : "हमारी दृष्टि"}
                  </h3>
                  <p className="text-gray-600">
                    {language === "en"
                      ? "To be the most trusted partner for Indian farmers, driving agricultural prosperity across the nation through cutting-edge crop science solutions and unwavering commitment to farmer welfare."
                      : "भारतीय किसानों के लिए सबसे विश्वसनीय भागीदार बनना, अत्याधुनिक फसल विज्ञान समाधानों और किसान कल्याण के प्रति अटूट प्रतिबद्धता के माध्यम से पूरे देश में कृषि समृद्धि को आगे बढ़ाना।"}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div
            
            
            
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {language === "en" ? "Our Values" : "हमारे मूल्य"}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {language === "en"
                ? "The principles that guide everything we do at Agrio India."
                : "एग्रियो इंडिया में हमारे हर काम का मार्गदर्शन करने वाले सिद्धांत।"}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                
                
                
                
              >
                <Card className="h-full text-center card-hover">
                  <CardContent className="p-6">
                    <div className="mx-auto h-14 w-14 rounded-xl bg-secondary flex items-center justify-center mb-4">
                      <value.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">
                      {language === "en" ? value.title : value.titleHi}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {language === "en" ? value.description : value.descriptionHi}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards Section */}
      <section className="py-16 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/green-rice-fields.jpg"
            alt="Lush green rice fields"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-white/90" />
        </div>
        <div className="container mx-auto px-4 lg:px-8 relative">
          <div
            
            
            
            className="text-center"
          >
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-accent/10 mb-6">
              <Award className="h-8 w-8 text-accent" />
            </div>
            <h2 className="text-3xl font-bold mb-4">
              {language === "en" ? "Awards & Certifications" : "पुरस्कार और प्रमाणन"}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              {language === "en"
                ? "Our commitment to quality and innovation has been recognized by leading industry bodies."
                : "गुणवत्ता और नवाचार के प्रति हमारी प्रतिबद्धता को प्रमुख उद्योग निकायों द्वारा मान्यता दी गई है।"}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {["ISO 9001:2015", "CIB Certified", "FICCI Award 2023", "Best Quality Award"].map(
                (award, index) => (
                  <div
                    key={index}
                    
                    
                    
                    
                  >
                    <Card className="px-6 py-3">
                      <span className="font-medium text-primary">{award}</span>
                    </Card>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

