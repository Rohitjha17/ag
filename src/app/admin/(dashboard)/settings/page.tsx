"use client";

import React from "react";
import {
  Building2,
  Users,
  Settings2,
  FileText,
  Shield,
  Wrench,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your application settings and preferences.</p>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="company" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 max-w-4xl">
          <TabsTrigger value="company">
            <Building2 className="h-4 w-4 mr-2" />
            Company
          </TabsTrigger>
          <TabsTrigger value="admins">
            <Users className="h-4 w-4 mr-2" />
            Admins
          </TabsTrigger>
          <TabsTrigger value="system">
            <Settings2 className="h-4 w-4 mr-2" />
            System
          </TabsTrigger>
          <TabsTrigger value="content">
            <FileText className="h-4 w-4 mr-2" />
            Content
          </TabsTrigger>
          <TabsTrigger value="maintenance">
            <Wrench className="h-4 w-4 mr-2" />
            Maintenance
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Company Information */}
        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>Update your company details and branding.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label>Company Name</Label>
                  <Input defaultValue="Agrio India Crop Science" className="mt-1" />
                </div>
                <div>
                  <Label>Tagline</Label>
                  <Input defaultValue="Agrio Sampan kisan" className="mt-1" />
                </div>
                <div>
                  <Label>Tagline 2</Label>
                  <Input defaultValue="भारतीय किसान की पहली पसंद" className="mt-1" />
                </div>
                <div className="md:col-span-2">
                  <Label>Address</Label>
                  <Textarea 
                    defaultValue="Agrio India Crop Science, E-31 Industrial Area, Sikandrabad, Bulandshahr - 203205" 
                    className="mt-1" 
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input defaultValue="agrioindiacropsciences@gmail.com" className="mt-1" />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input defaultValue="+91 95206 09999" className="mt-1" />
                </div>
                <div>
                  <Label>WhatsApp</Label>
                  <Input defaultValue="+91 94296 93729" className="mt-1" />
                </div>
                <div>
                  <Label>Website URL</Label>
                  <Input defaultValue="https://agrioindia.com" className="mt-1" />
                </div>
              </div>

              <Separator />

              <div>
                <Label>Logo</Label>
                <div className="mt-2 flex items-center gap-4">
                  <div className="h-20 w-20 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-2xl">
                    AI
                  </div>
                  <Button variant="outline">Change Logo</Button>
                </div>
              </div>

              <div className="flex justify-end">
                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Admin Users */}
        <TabsContent value="admins">
          <Card>
            <CardHeader>
              <CardTitle>Admin Users</CardTitle>
              <CardDescription>Manage admin accounts and permissions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Admin List */}
              {[
                { name: "Admin User", email: "admin@agrioindia.com", role: "Super Admin" },
                { name: "Manager", email: "manager@agrioindia.com", role: "Admin" },
                { name: "Support", email: "support@agrioindia.com", role: "Viewer" },
              ].map((admin, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{admin.name}</p>
                    <p className="text-sm text-muted-foreground">{admin.email}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">{admin.role}</span>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                + Add New Admin
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Configuration */}
        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
              <CardDescription>Configure system settings and integrations.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* OTP Service */}
              <div>
                <h4 className="font-medium mb-4">OTP Service Settings</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Provider</Label>
                    <Input defaultValue="MSG91" className="mt-1" />
                  </div>
                  <div>
                    <Label>API Key</Label>
                    <Input type="password" defaultValue="••••••••••" className="mt-1" />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Email Service */}
              <div>
                <h4 className="font-medium mb-4">Email Service Settings</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>SMTP Host</Label>
                    <Input defaultValue="smtp.gmail.com" className="mt-1" />
                  </div>
                  <div>
                    <Label>SMTP Port</Label>
                    <Input defaultValue="587" className="mt-1" />
                  </div>
                </div>
              </div>

              <Separator />

              {/* File Upload */}
              <div>
                <h4 className="font-medium mb-4">File Upload Settings</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Max File Size (MB)</Label>
                    <Input defaultValue="10" className="mt-1" />
                  </div>
                  <div>
                    <Label>Allowed Formats</Label>
                    <Input defaultValue="jpg, png, gif, pdf" className="mt-1" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Management */}
        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Content Management</CardTitle>
              <CardDescription>Manage website content and legal documents.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Terms & Conditions</Label>
                <Textarea 
                  className="mt-1 min-h-[200px]"
                  placeholder="Enter your terms and conditions..."
                />
              </div>
              <div>
                <Label>Privacy Policy</Label>
                <Textarea 
                  className="mt-1 min-h-[200px]"
                  placeholder="Enter your privacy policy..."
                />
              </div>
              <div className="flex justify-end">
                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Maintenance */}
        <TabsContent value="maintenance">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance</CardTitle>
              <CardDescription>System maintenance and utilities.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Clear Cache</p>
                  <p className="text-sm text-muted-foreground">Clear all cached data</p>
                </div>
                <Button variant="outline">Clear Cache</Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Database Backup</p>
                  <p className="text-sm text-muted-foreground">Download database backup</p>
                </div>
                <Button variant="outline">Download Backup</Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">View System Logs</p>
                  <p className="text-sm text-muted-foreground">View error and activity logs</p>
                </div>
                <Button variant="outline">View Logs</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage security and authentication settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div>
                <Label>Session Timeout (minutes)</Label>
                <Input defaultValue="30" className="mt-1 max-w-xs" />
              </div>
              <Separator />
              <div>
                <Label>IP Whitelist (one per line)</Label>
                <Textarea 
                  className="mt-1"
                  placeholder="192.168.1.1&#10;10.0.0.1"
                />
              </div>
              <div className="flex justify-end">
                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

