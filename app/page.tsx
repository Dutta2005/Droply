import { Button } from "@heroui/button";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { Card, CardBody } from "@heroui/card";
import {
  CloudUpload,
  Shield,
  Folder,
  Image as ImageIcon,
  ArrowRight,
  Zap,
  Users,
  Globe,
  Star,
  CheckCircle,
  Upload,
  Eye,
  Lock,
} from "lucide-react";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-default-50 to-primary-50/30">
      {/* Use the unified Navbar component */}
      <Navbar />

      {/* Main content */}
      <main className="flex-1">
        {/* Hero section */}
        <section className="py-16 md:py-24 px-4 md:px-6 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/3 rounded-full blur-3xl"></div>
          </div>
          
          <div className="container mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
              <div className="space-y-8 text-center lg:text-left">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                    <Star className="h-4 w-4" />
                    Trusted by thousands
                  </div>
                  
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-default-900 leading-tight">
                    Store your{" "}
                    <span className="text-primary bg-gradient-to-r from-primary to-primary-600 bg-clip-text text-transparent">
                      images
                    </span>{" "}
                    with ease
                  </h1>
                  
                  <p className="text-xl md:text-2xl text-default-600 max-w-2xl">
                    Simple. Secure. Fast.
                  </p>
                  
                  <p className="text-lg text-default-500 max-w-xl">
                    Experience the future of image storage. Upload, organize, and access your photos 
                    from anywhere with military-grade security.
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 pt-6 justify-center lg:justify-start">
                  <SignedOut>
                    <Link href="/sign-up">
                      <Button 
                        size="lg" 
                        variant="solid" 
                        color="primary"
                        className="bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                        endContent={<ArrowRight className="h-4 w-4" />}
                      >
                        Get Started Free
                      </Button>
                    </Link>
                    <Link href="/sign-in">
                      <Button 
                        size="lg" 
                        variant="bordered" 
                        color="primary"
                        className="border-2 hover:bg-primary/5 transform hover:scale-105 transition-all duration-200"
                      >
                        Sign In
                      </Button>
                    </Link>
                  </SignedOut>
                  <SignedIn>
                    <Link href="/dashboard">
                      <Button
                        size="lg"
                        variant="solid"
                        color="primary"
                        className="bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                        endContent={<ArrowRight className="h-4 w-4" />}
                      >
                        Go to Dashboard
                      </Button>
                    </Link>
                  </SignedIn>
                </div>

                {/* Trust indicators */}
                <div className="flex items-center gap-6 pt-6 justify-center lg:justify-start text-sm text-default-500">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span>Free tier available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span>No credit card required</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center order-first lg:order-last">
                <div className="relative w-80 h-80 md:w-96 md:h-96">
                  {/* Main glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full blur-3xl animate-pulse"></div>
                  
                  {/* Floating elements */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <div className="absolute -top-8 -left-8 w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center animate-bounce">
                        <Upload className="h-8 w-8 text-primary" />
                      </div>
                      <div className="absolute -top-8 -right-8 w-16 h-16 bg-success/10 rounded-2xl flex items-center justify-center animate-bounce" style={{animationDelay: '0.5s'}}>
                        <Eye className="h-8 w-8 text-success" />
                      </div>
                      <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-warning/10 rounded-2xl flex items-center justify-center animate-bounce" style={{animationDelay: '1s'}}>
                        <Lock className="h-8 w-8 text-warning" />
                      </div>
                      <div className="absolute -bottom-8 -right-8 w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center animate-bounce" style={{animationDelay: '1.5s'}}>
                        <Folder className="h-8 w-8 text-secondary" />
                      </div>
                      
                      {/* Central icon */}
                      <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-primary/10 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-primary/20 shadow-2xl">
                        <ImageIcon className="h-16 w-16 text-primary" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features section */}
        <section className="py-16 md:py-24 px-4 md:px-6 bg-default-50/50">
          <div className="container mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Zap className="h-4 w-4" />
                Powerful Features
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-default-900">
                Everything you need for{" "}
                <span className="text-primary">image management</span>
              </h2>
              <p className="text-lg text-default-600 max-w-2xl mx-auto">
                Built for photographers, designers, and anyone who values their visual content
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="border border-default-200/50 bg-default-50/80 backdrop-blur-sm shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                <CardBody className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <CloudUpload className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-default-900">
                    Lightning Fast Uploads
                  </h3>
                  <p className="text-default-600 leading-relaxed">
                    Drag, drop, and watch your images upload in seconds. 
                    Batch upload support for maximum efficiency.
                  </p>
                </CardBody>
              </Card>

              <Card className="border border-default-200/50 bg-default-50/80 backdrop-blur-sm shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                <CardBody className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-success/20 to-success/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Folder className="h-8 w-8 text-success" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-default-900">
                    Smart Organization
                  </h3>
                  <p className="text-default-600 leading-relaxed">
                    Auto-tagging, smart folders, and powerful search. 
                    Find any image in seconds, not minutes.
                  </p>
                </CardBody>
              </Card>

              <Card className="border border-default-200/50 bg-default-50/80 backdrop-blur-sm shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group md:col-span-2 lg:col-span-1">
                <CardBody className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-warning/20 to-warning/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Shield className="h-8 w-8 text-warning" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-default-900">
                    Bank-Grade Security
                  </h3>
                  <p className="text-default-600 leading-relaxed">
                    End-to-end encryption, secure sharing, and privacy controls. 
                    Your images are safe with us.
                  </p>
                </CardBody>
              </Card>
            </div>

            {/* Additional features row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <Card className="border border-default-200/50 bg-default-50/80 backdrop-blur-sm shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                <CardBody className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Globe className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-default-900">
                    Access Anywhere
                  </h3>
                  <p className="text-default-600 leading-relaxed">
                    Web, mobile, and desktop apps. Your images follow you wherever you go.
                  </p>
                </CardBody>
              </Card>

              <Card className="border border-default-200/50 bg-default-50/80 backdrop-blur-sm shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                <CardBody className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-500/20 to-pink-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Users className="h-8 w-8 text-pink-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-default-900">
                    Team Collaboration
                  </h3>
                  <p className="text-default-600 leading-relaxed">
                    Share albums, collaborate on projects, and manage team permissions effortlessly.
                  </p>
                </CardBody>
              </Card>
            </div>
          </div>
        </section>

        {/* Stats section */}
        <section className="py-16 md:py-20 px-4 md:px-6 bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="container mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">1k+</div>
                <div className="text-default-600">Images Stored</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">700+</div>
                <div className="text-default-600">Happy Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">99.9%</div>
                <div className="text-default-600">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">24/7</div>
                <div className="text-default-600">Support</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA section */}
        <section className="py-16 md:py-24 px-4 md:px-6 bg-gradient-to-br from-primary/5 to-default-50">
          <div className="container mx-auto text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-default-900">
                Ready to transform your{" "}
                <span className="text-primary">image storage</span>?
              </h2>
              <p className="text-lg text-default-600 mb-8 max-w-2xl mx-auto">
                Join thousands of users who trust Droply with their precious memories and important visual content.
              </p>
              
              <SignedOut>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link href="/sign-up">
                    <Button
                      size="lg"
                      variant="solid"
                      color="primary"
                      className="bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl text-lg px-8 py-6"
                      endContent={<ArrowRight className="h-5 w-5" />}
                    >
                      Start Free Today
                    </Button>
                  </Link>
                  <Link href="/sign-in">
                    <Button
                      size="lg"
                      variant="bordered"
                      color="primary"
                      className="border-2 hover:bg-primary/5 transform hover:scale-105 transition-all duration-200 text-lg px-8 py-6"
                    >
                      I have an account
                    </Button>
                  </Link>
                </div>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    variant="solid"
                    color="primary"
                    className="bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl text-lg px-8 py-6"
                    endContent={<ArrowRight className="h-5 w-5" />}
                  >
                    Go to Dashboard
                  </Button>
                </Link>
              </SignedIn>
              
              <div className="flex items-center justify-center gap-4 mt-8 text-sm text-default-500">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>Free forever plan</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>Cancel anytime</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>30-day money back</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Enhanced footer */}
        {/* Simple footer */}
      <footer className="bg-default-50 border-t border-default-200 py-6 md:py-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-primary to-primary-600 rounded-lg flex items-center justify-center">
                <CloudUpload className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-lg font-bold text-default-900">Droply</h2>
              <span className="text-default-500 text-sm hidden sm:inline">• Store your images with ease</span>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center">
              <p className="text-default-500 text-sm">
                &copy; {new Date().getFullYear()} Droply. All rights reserved.
              </p>
              <span className="text-default-500 text-sm">Made with ❤️ for creators</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}