"use client";

import React from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useStore } from "@/store/useStore";
import * as api from "@/lib/api";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  mobile: z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number"),
  email: z.string().email("Please enter a valid email").optional().or(z.literal("")),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const { language } = useStore();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      const response = await api.submitContactForm({
        name: data.name,
        mobile: data.mobile,
        email: data.email || undefined,
        subject: data.subject,
        message: data.message,
      });
      
      if (response.success) {
        toast({
          title: language === "en" ? "Message Sent!" : "संदेश भेजा गया!",
          description: response.data?.message || (language === "en"
            ? "We'll get back to you as soon as possible."
            : "हम जल्द से जल्द आपसे संपर्क करेंगे।"),
          variant: "success",
        });
        
        reset();
      } else {
        toast({
          title: language === "en" ? "Error" : "त्रुटि",
          description: response.error?.message || (language === "en"
            ? "Failed to send message. Please try again."
            : "संदेश भेजने में विफल। कृपया पुनः प्रयास करें।"),
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: language === "en" ? "Error" : "त्रुटि",
        description: language === "en"
          ? "Something went wrong. Please try again."
          : "कुछ गलत हो गया। कृपया पुनः प्रयास करें।",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-secondary/20">
      {/* Header */}
      <div className="relative overflow-hidden border-b">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/mesmerizing-shot-scenic-cloudy-sky-field.jpg"
            alt="Beautiful field with scenic cloudy sky"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/85 to-white/95" />
        </div>
        <div className="container mx-auto px-4 lg:px-8 py-16 relative">
          <div
            
            
            className="text-center"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {language === "en" ? "Contact Us" : "संपर्क करें"}
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {language === "en"
                ? "We'd love to hear from you. Send us a message and we'll respond as soon as possible."
                : "हमें आपसे सुनना अच्छा लगेगा। हमें एक संदेश भेजें और हम जल्द से जल्द जवाब देंगे।"}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div
            
            
            
            className="space-y-6"
          >
            {/* Address Card */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">
                    {language === "en" ? "Address" : "पता"}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  123 Kisan Marg,<br />
                  Sikandrabad Industrial Area,<br />
                  Bulandshahr, Uttar Pradesh - 203205
                </p>
              </CardContent>
            </Card>

            {/* Email Card */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">
                    {language === "en" ? "Email" : "ईमेल"}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <a
                  href="mailto:info@agrioindia.com"
                  className="text-sm text-primary hover:underline"
                >
                  info@agrioindia.com
                </a>
              </CardContent>
            </Card>

            {/* Phone Card */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">
                    {language === "en" ? "Phone" : "फ़ोन"}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-1">
                <a
                  href="tel:+911800123456"
                  className="block text-sm text-primary hover:underline"
                >
                  +91 1800 123 4567
                </a>
                <a
                  href="https://wa.me/919123456789"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-green-600 hover:underline"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
              </CardContent>
            </Card>

            {/* Working Hours Card */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">
                    {language === "en" ? "Working Hours" : "कार्य समय"}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">
                      {language === "en" ? "Mon - Sat:" : "सोम - शनि:"}
                    </span>{" "}
                    9:00 AM - 6:00 PM
                  </p>
                  <p>
                    <span className="font-medium">
                      {language === "en" ? "Sunday:" : "रविवार:"}
                    </span>{" "}
                    <span className="text-red-600">
                      {language === "en" ? "Closed" : "बंद"}
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div
            
            
            
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === "en" ? "Send us a Message" : "हमें संदेश भेजें"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        {language === "en" ? "Name" : "नाम"} *
                      </Label>
                      <Input
                        id="name"
                        placeholder={language === "en" ? "Your full name" : "आपका पूरा नाम"}
                        {...register("name")}
                        error={!!errors.name}
                      />
                      {errors.name && (
                        <p className="text-sm text-destructive">{errors.name.message}</p>
                      )}
                    </div>

                    {/* Mobile */}
                    <div className="space-y-2">
                      <Label htmlFor="mobile">
                        {language === "en" ? "Mobile Number" : "मोबाइल नंबर"} *
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                          +91
                        </span>
                        <Input
                          id="mobile"
                          placeholder="9876543210"
                          className="pl-12"
                          {...register("mobile")}
                          error={!!errors.mobile}
                        />
                      </div>
                      {errors.mobile && (
                        <p className="text-sm text-destructive">{errors.mobile.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      {language === "en" ? "Email (Optional)" : "ईमेल (वैकल्पिक)"}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      {...register("email")}
                      error={!!errors.email}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Subject */}
                  <div className="space-y-2">
                    <Label htmlFor="subject">
                      {language === "en" ? "Subject" : "विषय"} *
                    </Label>
                    <Input
                      id="subject"
                      placeholder={language === "en" ? "What is this about?" : "यह किस बारे में है?"}
                      {...register("subject")}
                      error={!!errors.subject}
                    />
                    {errors.subject && (
                      <p className="text-sm text-destructive">{errors.subject.message}</p>
                    )}
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message">
                      {language === "en" ? "Message" : "संदेश"} *
                    </Label>
                    <Textarea
                      id="message"
                      placeholder={language === "en" ? "Your message..." : "आपका संदेश..."}
                      rows={5}
                      {...register("message")}
                      error={!!errors.message}
                    />
                    {errors.message && (
                      <p className="text-sm text-destructive">{errors.message.message}</p>
                    )}
                  </div>

                  <Button type="submit" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        {language === "en" ? "Sending..." : "भेज रहे हैं..."}
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        {language === "en" ? "Send Message" : "संदेश भेजें"}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map Section */}
        <div
          
          
          
          className="mt-12"
        >
          <Card>
            <CardHeader>
              <CardTitle>
                {language === "en" ? "Our Location" : "हमारा स्थान"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-80 bg-gray-200 rounded-b-xl overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3505.8686775474!2d77.2090212!3d28.5355169!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce38cd4e1b4e9%3A0x7c0c23c9b8a8d8a8!2sNew%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1629999999999!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

