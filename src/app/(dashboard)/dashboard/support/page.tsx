"use client";

import React from "react";
import Link from "next/link";
import {
  Phone,
  Mail,
  MessageCircle,
  HelpCircle,
  FileQuestion,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useStore } from "@/store/useStore";

const faqs = [
  {
    question: "How do I scan a coupon code?",
    questionHi: "मैं कूपन कोड कैसे स्कैन करूं?",
    answer: "Go to the Scan & Win section in your dashboard. You can either scan the QR code on your product or enter the 12-character code manually.",
    answerHi: "अपने डैशबोर्ड में स्कैन और जीतें सेक्शन पर जाएं। आप या तो अपने उत्पाद पर QR कोड स्कैन कर सकते हैं या 12-अक्षर का कोड मैन्युअल रूप से दर्ज कर सकते हैं।",
  },
  {
    question: "How do I redeem my rewards?",
    questionHi: "मैं अपने पुरस्कार कैसे भुनाऊं?",
    answer: "Visit the My Rewards section to see all your earned rewards. You can download the reward certificate and redeem it at any authorized Agrio India distributor.",
    answerHi: "अपने सभी अर्जित पुरस्कार देखने के लिए मेरे पुरस्कार सेक्शन पर जाएं। आप पुरस्कार प्रमाणपत्र डाउनलोड कर सकते हैं और किसी भी अधिकृत एग्रियो इंडिया वितरक पर इसे भुना सकते हैं।",
  },
  {
    question: "What if my coupon code is invalid?",
    questionHi: "अगर मेरा कूपन कोड अमान्य है तो क्या होगा?",
    answer: "Make sure you are entering the code correctly. If the code is still invalid, please contact our support team with a photo of the coupon.",
    answerHi: "सुनिश्चित करें कि आप कोड सही ढंग से दर्ज कर रहे हैं। यदि कोड अभी भी अमान्य है, तो कृपया कूपन की फोटो के साथ हमारी सहायता टीम से संपर्क करें।",
  },
  {
    question: "How do I find a distributor near me?",
    questionHi: "मैं अपने पास वितरक कैसे खोजूं?",
    answer: "Use the Buy Nearby feature in your dashboard. Enter your pincode or use your current location to find authorized distributors in your area.",
    answerHi: "अपने डैशबोर्ड में पास में खरीदें सुविधा का उपयोग करें। अपने क्षेत्र में अधिकृत वितरकों को खोजने के लिए अपना पिनकोड दर्ज करें या अपने वर्तमान स्थान का उपयोग करें।",
  },
  {
    question: "Can I change my registered mobile number?",
    questionHi: "क्या मैं अपना पंजीकृत मोबाइल नंबर बदल सकता हूं?",
    answer: "For security reasons, mobile number cannot be changed directly. Please contact our support team to request a mobile number change.",
    answerHi: "सुरक्षा कारणों से, मोबाइल नंबर सीधे नहीं बदला जा सकता। कृपया मोबाइल नंबर बदलने के अनुरोध के लिए हमारी सहायता टीम से संपर्क करें।",
  },
];

const contactOptions = [
  {
    icon: Phone,
    title: "Call Us",
    titleHi: "हमें कॉल करें",
    description: "Mon-Sat, 9AM-6PM",
    descriptionHi: "सोम-शनि, 9AM-6PM",
    action: "tel:+919520609999",
    actionLabel: "+91 95206 09999",
    color: "bg-blue-500",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    titleHi: "व्हाट्सएप",
    description: "Quick responses",
    descriptionHi: "त्वरित जवाब",
    action: "https://wa.me/919429693729",
    actionLabel: "Chat Now",
    actionLabelHi: "अभी चैट करें",
    color: "bg-green-500",
  },
  {
    icon: Mail,
    title: "Email",
    titleHi: "ईमेल",
    description: "We'll respond within 24h",
    descriptionHi: "24 घंटे में जवाब",
    action: "mailto:agrioindiacropsciences@gmail.com",
    actionLabel: "agrioindiacropsciences@gmail.com",
    color: "bg-purple-500",
  },
];

export default function SupportPage() {
  const { language } = useStore();

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-2">
          {language === "en" ? "Help & Support" : "सहायता और समर्थन"}
        </h1>
        <p className="text-muted-foreground">
          {language === "en"
            ? "Get help with your account, rewards, and more."
            : "अपने खाते, पुरस्कारों और अधिक के साथ सहायता प्राप्त करें।"}
        </p>
      </div>

      {/* Contact Options */}
      <div className="grid sm:grid-cols-3 gap-4">
        {contactOptions.map((option, index) => (
          <div
            key={index}
            
            
            
          >
            <a href={option.action} target={option.action.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
              <Card className="h-full card-hover cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className={`h-12 w-12 rounded-xl ${option.color} flex items-center justify-center mx-auto mb-4`}>
                    <option.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-1">
                    {language === "en" ? option.title : option.titleHi}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {language === "en" ? option.description : option.descriptionHi}
                  </p>
                  <p className="text-sm text-primary font-medium">
                    {language === "en" ? option.actionLabel : (option.actionLabelHi || option.actionLabel)}
                  </p>
                </CardContent>
              </Card>
            </a>
          </div>
        ))}
      </div>

      {/* FAQs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileQuestion className="h-5 w-5 text-primary" />
            {language === "en" ? "Frequently Asked Questions" : "अक्सर पूछे जाने वाले प्रश्न"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {language === "en" ? faq.question : faq.questionHi}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {language === "en" ? faq.answer : faq.answerHi}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Contact Form Link */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <HelpCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">
                  {language === "en" ? "Still need help?" : "अभी भी सहायता चाहिए?"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {language === "en"
                    ? "Send us a detailed message through our contact form."
                    : "हमारे संपर्क फॉर्म के माध्यम से हमें एक विस्तृत संदेश भेजें।"}
                </p>
              </div>
            </div>
            <Button asChild>
              <Link href="/contact">
                {language === "en" ? "Contact Us" : "संपर्क करें"}
                <ExternalLink className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

