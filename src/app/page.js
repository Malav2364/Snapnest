"use client"

import { ModeToggle } from "@/components/themeSwitch";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-[-300px] right-[-300px] w-[600px] h-[600px] rounded-full bg-gradient-to-r from-[#6C5DD3] to-[#FF6B81] opacity-20 blur-[100px]"></div>
        <div className="absolute bottom-[-200px] left-[-200px] w-[500px] h-[500px] rounded-full bg-gradient-to-r from-[#00C2CB] to-[#FCE22A] opacity-10 blur-[100px]"></div>
      </div>
      
      {/* Navbar */}
      <nav className="container mx-auto py-6 px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6B81] to-[#6C5DD3] flex items-center justify-center">
            <span className="text-white text-xl font-bold">S</span>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#FF6B81] to-[#6C5DD3] inline-block text-transparent bg-clip-text">SnapNest</h1>
        </div>
        <div className="flex items-center gap-6">
            <ModeToggle/>
          <Link href="/app" className="px-5 py-2 rounded-full bg-gradient-to-r from-[#6C5DD3] to-[#FF6B81] text-white text-sm font-medium hover:shadow-lg hover:shadow-[#FF6B81]/20 transition-all">
            Try Now
          </Link>
        </div>
      </nav>
      
      {/* Hero Section */}
      <main className="container mx-auto px-4 pt-16 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-5xl font-bold leading-tight">
              Transform your photos with <span className="bg-gradient-to-r from-[#FF6B81] to-[#6C5DD3] inline-block text-transparent bg-clip-text">stunning filters</span> and <span className="bg-gradient-to-r from-[#00C2CB] to-[#FCE22A] inline-block text-transparent bg-clip-text">frames</span>
            </h2>
            <p className="mt-6 text-lg opacity-80 leading-relaxed">
              Upload, customize, and share – SnapNest makes photo editing simple and beautiful with instant filters, trendy frames, and one-click downloads.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/app" className="px-8 py-3 rounded-full bg-gradient-to-r from-[#6C5DD3] to-[#FF6B81] text-white font-medium hover:shadow-xl hover:shadow-[#FF6B81]/20 transition-all">
                Get Started
              </Link>
            </div>
          </div>
          <div className="relative">
            {/* App Preview Image Placeholder */}
            <div className="aspect-[1.7] rounded-3xl overflow-hidden border border-[#E0E0E0] shadow-2xl shadow-[#6C5DD3]/10 backdrop-blur-sm bg-white/5">
              {/* You'll want to replace this with an actual image */}
                <Image
                  src="/Image.png"
                  alt="App preview image"
                  height={900}
                  width={900}
                  className="object-fill"
                />
            </div>
            {/* Decorative Elements */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-2xl border border-[#E0E0E0] shadow-lg rotate-12 bg-gradient-to-tr from-[#FF6B81]/20 to-[#FF6B81]/5 backdrop-blur-md"></div>
            <div className="absolute -top-8 -left-8 w-24 h-24 rounded-full border border-[#E0E0E0] shadow-lg bg-gradient-to-bl from-[#00C2CB]/20 to-[#00C2CB]/5 backdrop-blur-md"></div>
          </div>
        </div>
      </main>
      
      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h3 className="text-3xl font-bold text-center mb-16">
          <span className="bg-gradient-to-r from-[#00C2CB] to-[#FCE22A] inline-block text-transparent bg-clip-text">Features</span> you'll love
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              title: "Easy Upload", 
              desc: "Drag & drop or use file picker to start editing instantly",
              icon: "📤"
            },
            { 
              title: "Trendy Filters", 
              desc: "Apply vintage, cinematic, neon, pastel and more with one click",
              icon: "🎨" 
            },
            { 
              title: "Stylish Frames", 
              desc: "Choose from polaroid, scrapbook, gradient borders and more",
              icon: "🖼️" 
            },
            { 
              title: "Live Preview", 
              desc: "See all your changes instantly as you customize your image",
              icon: "👀" 
            },
            { 
              title: "Quick Download", 
              desc: "Save your masterpiece with a single click in high quality",
              icon: "💾" 
            },
            { 
              title: "Collage Mode", 
              desc: "Create beautiful layouts with multiple photos effortlessly",
              icon: "✨" 
            },
          ].map((feature, i) => (
            <div key={i} className="p-6 rounded-2xl border border-[#E0E0E0] hover:border-[#6C5DD3]/30 transition-all backdrop-blur-sm bg-white/5 group hover:shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6C5DD3]/10 to-[#FF6B81]/10 flex items-center justify-center text-2xl mb-4 group-hover:from-[#6C5DD3]/20 group-hover:to-[#FF6B81]/20 transition-all">
                {feature.icon}
              </div>
              <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
              <p className="opacity-70">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="container mx-auto px-4 py-20">
        <div className="rounded-3xl p-12 bg-gradient-to-r from-[#6C5DD3]/10 to-[#FF6B81]/10 backdrop-blur-md border border-[#E0E0E0] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#6C5DD3]/5 to-[#FF6B81]/5 opacity-50"></div>
          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <h3 className="text-4xl font-bold mb-6">Ready to transform your photos?</h3>
            <p className="text-lg opacity-80 mb-10">
              Join thousands of creators who use SnapNest to add that perfect touch to their images. It's free and easy to use!
            </p>
            <Link href="/app" className="px-10 py-4 rounded-full bg-gradient-to-r from-[#6C5DD3] to-[#FF6B81] text-white font-medium text-lg hover:shadow-xl hover:shadow-[#FF6B81]/20 transition-all inline-block">
              Start Editing Now
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-[#E0E0E0]">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm opacity-70">© 2025 SnapNest. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/terms" className="text-sm opacity-70 hover:opacity-100 transition-opacity">Terms</Link>
            <Link href="/privacy" className="text-sm opacity-70 hover:opacity-100 transition-opacity">Privacy</Link>
            <Link href="/contact" className="text-sm opacity-70 hover:opacity-100 transition-opacity">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}