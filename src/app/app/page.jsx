"use client";
import React, { useState, useRef, useEffect } from 'react';
import { ModeToggle } from "@/components/themeSwitch";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// Placeholder arrays for filters and frames
const FILTERS = [
  { id: "original", name: "Original", class: "", icon: "✨" },
  { id: "vintage", name: "Vintage", class: "sepia brightness-90", icon: "🕰️" },
  { id: "neon", name: "Neon", class: "brightness-110 contrast-110 saturate-150", icon: "💜" },
  { id: "cinematic", name: "Cinematic", class: "contrast-125 saturate-75", icon: "🎬" },
  { id: "pastel", name: "Pastel", class: "brightness-110 saturate-75", icon: "🌸" },
  { id: "noir", name: "Noir", class: "grayscale contrast-125", icon: "🖤" },
];

const FRAMES = [
  { id: "none", name: "None", style: {}, icon: "⬜" },
  { 
    id: "polaroid", 
    name: "Polaroid", 
    style: { padding: "40px 40px 80px 40px", backgroundColor: "white", boxShadow: "0 10px 30px rgba(0,0,0,0.15)" },
    icon: "📷" 
  },
  { 
    id: "gradient", 
    name: "Gradient", 
    style: { padding: "12px", background: "linear-gradient(45deg, #FF6B81, #6C5DD3)" },
    icon: "🌈" 
  },
  { 
    id: "scrapbook", 
    name: "Scrapbook", 
    style: { padding: "15px", backgroundColor: "#F8F8F8", transform: "rotate(-2deg)", boxShadow: "0 5px 15px rgba(0,0,0,0.1)" },
    icon: "📒" 
  },
  { 
    id: "minimal", 
    name: "Minimal", 
    style: { padding: "2px", border: "1px solid #E0E0E0" },
    icon: "➖" 
  },
  { 
    id: "neon", 
    name: "Neon Glow", 
    style: { padding: "15px", boxShadow: "0 0 20px #6C5DD3, 0 0 40px rgba(108, 93, 211, 0.3)" },
    icon: "💫" 
  },
];

// Placeholder image for demonstration
const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1518791841217-8f162f1e1131";

export default function AppPage() {
  const [image, setImage] = useState(PLACEHOLDER_IMAGE);
  const [selectedFilter, setSelectedFilter] = useState("original");
  const [selectedFrame, setSelectedFrame] = useState("none");
  const [isCollageMode, setIsCollageMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState("filters");
  const [borderSize, setBorderSize] = useState(10);
  const [opacity, setOpacity] = useState(100);
  const fileInputRef = useRef(null);
  const imageRef = useRef(null);
  const frameRef = useRef(null);
  
  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.match('image.*')) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };
  
  // Handle drag events
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.match('image.*')) {
        const reader = new FileReader();
        reader.onload = (e) => setImage(e.target.result);
        reader.readAsDataURL(file);
      }
    }
  };
  
  // Handle image download with all applied effects
  const handleDownload = () => {
    // Create a canvas to draw the edited image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Load the image
    const img = new Image();
    img.crossOrigin = "Anonymous";  // To handle CORS issues with some images
    
    img.onload = () => {
      // Calculate dimensions considering the frame
      const frameStyle = getFrameStyle();
      const framePadding = frameStyle.padding ? 
        typeof frameStyle.padding === 'string' ? 
          parseInt(frameStyle.padding.split('px')[0]) : frameStyle.padding 
        : 0;
      
      // Add padding for the frame
      const totalPadding = framePadding * 2; // Padding on all sides
      
      // Set canvas dimensions including frame
      canvas.width = img.width + totalPadding;
      canvas.height = img.height + totalPadding;
      
      // Apply frame background if any
      if (frameStyle.backgroundColor) {
        ctx.fillStyle = frameStyle.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      if (frameStyle.background) {
        // For gradient background
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, "#FF6B81");
        gradient.addColorStop(1, "#6C5DD3");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      // Apply frame opacity
      if (frameStyle.opacity) {
        ctx.globalAlpha = frameStyle.opacity;
      }
      
      // Draw the image with frame padding
      ctx.drawImage(img, framePadding, framePadding, img.width, img.height);
      
      // Reset global alpha
      ctx.globalAlpha = 1.0;
      
      // Apply filter effects
      const filterClass = getFilterClass();
      if (filterClass) {
        try {
          // Initialize filter string
          let filterString = "";
          
          // Apply CSS filters manually to canvas
          if (filterClass.includes('sepia')) filterString += " sepia(100%)";
          if (filterClass.includes('brightness-90')) filterString += " brightness(90%)";
          if (filterClass.includes('brightness-110')) filterString += " brightness(110%)";
          if (filterClass.includes('contrast-110')) filterString += " contrast(110%)";
          if (filterClass.includes('contrast-125')) filterString += " contrast(125%)";
          if (filterClass.includes('saturate-75')) filterString += " saturate(75%)";
          if (filterClass.includes('saturate-150')) filterString += " saturate(150%)";
          if (filterClass.includes('grayscale')) filterString += " grayscale(100%)";
          
          // Apply the combined filter
          if (filterString) {
            ctx.filter = filterString.trim();
            
            // Draw the image again with filters
            ctx.drawImage(img, framePadding, framePadding, img.width, img.height);
            
            // Reset filter
            ctx.filter = "none";
          }
        } catch (error) {
          console.error("Error applying filters:", error);
          // Continue without filters if there's an error
        }
      }
      
      try {
        // Convert canvas to data URL
        const dataUrl = canvas.toDataURL('image/png');
        
        // Create download link
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'snapnest-edited-image.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Error creating download:", error);
        alert("There was an error creating your download. Please try again with a different image.");
      }
    };
    
    img.onerror = () => {
      console.error("Error loading image");
      alert("There was an error processing your image. It might be due to CORS restrictions.");
    };
    
    img.src = image;
  };
  
  const getFilterClass = () => {
    return FILTERS.find(filter => filter.id === selectedFilter)?.class || "";
  };
  
  const getFrameStyle = () => {
    const baseStyle = FRAMES.find(frame => frame.id === selectedFrame)?.style || {};
    
    // Apply custom border size and opacity if frame is not "none"
    if (selectedFrame !== "none") {
      const style = { ...baseStyle };
      
      if (borderSize !== 10 && style.padding) {
        // Adjust padding based on border size
        const paddingScale = borderSize / 10;
        if (selectedFrame === "polaroid") {
          style.padding = `${40 * paddingScale}px ${40 * paddingScale}px ${80 * paddingScale}px ${40 * paddingScale}px`;
        } else {
          const currentPadding = parseInt(style.padding);
          style.padding = `${currentPadding * paddingScale}px`;
        }
      }
      
      // Apply opacity
      style.opacity = opacity / 100;
      
      return style;
    }
    
    return baseStyle;
  };
  
  return (
    <div className="min-h-screen relative overflow-hidden bg-[#F8F8F8] dark:bg-[#1C1C28] text-[#1C1C28] dark:text-white">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 1.5 }}
          className="absolute top-[-300px] right-[-300px] w-[600px] h-[600px] rounded-full bg-gradient-to-r from-[#6C5DD3] to-[#FF6B81] opacity-10 dark:opacity-20 blur-[120px]"
        ></motion.div>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="absolute bottom-[-200px] left-[-200px] w-[500px] h-[500px] rounded-full bg-gradient-to-r from-[#00C2CB] to-[#FCE22A] opacity-5 dark:opacity-10 blur-[120px]"
        ></motion.div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-[10%] right-[5%] w-24 h-24 rounded-full border border-[#E0E0E0]/30 backdrop-blur-sm hidden lg:block"></div>
      <div className="absolute bottom-[15%] left-[7%] w-32 h-32 rounded-xl border border-[#E0E0E0]/30 backdrop-blur-sm rotate-12 hidden lg:block"></div>
      
      {/* Navbar */}
      <nav className="container mx-auto py-4 px-6 flex justify-between items-center border-b border-[#E0E0E0]/50 dark:border-gray-800/50 backdrop-blur-md z-10">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FF6B81] to-[#6C5DD3] flex items-center justify-center group-hover:shadow-lg group-hover:shadow-[#FF6B81]/20 transition-shadow"
            >
              <span className="text-white text-sm font-bold">S</span>
            </motion.div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-[#FF6B81] to-[#6C5DD3] inline-block text-transparent bg-clip-text">SnapNest</h1>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*"
            onChange={handleImageUpload}
          />
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => fileInputRef.current.click()}
            className="px-3 py-1.5 rounded-full bg-gradient-to-r from-[#6C5DD3] to-[#FF6B81] text-white text-sm font-medium shadow-md hover:shadow-lg hover:shadow-[#FF6B81]/20 transition-all flex items-center gap-1.5"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Upload</span>
          </motion.button>
          <ModeToggle />
        </div>
      </nav>
      
      <main className="container mx-auto px-6 py-10">
        {/* Upload Indicator - Visible only when dragging */}
        {isDragging && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
          >
            <div className="bg-white/90 dark:bg-[#13131f]/90 p-8 rounded-3xl shadow-2xl border-2 border-dashed border-[#6C5DD3] flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-[#6C5DD3]/10 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-[#6C5DD3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="text-lg font-bold">Drop your image here!</p>
            </div>
          </motion.div>
        )}
        
        {/* Main Editing Area */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Sidebar - Tools Panel */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            {/* Tabs */}
            <div className="flex rounded-full bg-white/50 dark:bg-[#13131f]/50 backdrop-blur-md border border-[#E0E0E0]/50 dark:border-gray-800/50 p-1 mb-5">
              {["filters", "frames", "advanced"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
                    activeTab === tab
                      ? "bg-gradient-to-r from-[#6C5DD3] to-[#FF6B81] text-white shadow-lg"
                      : "hover:bg-white/20 dark:hover:bg-[#13131f]/70"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            
            <AnimatePresence mode="wait">
              {activeTab === "filters" && (
                <motion.div 
                  key="filters"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-3xl backdrop-blur-md bg-white/80 dark:bg-[#13131f]/80 border border-[#E0E0E0]/50 dark:border-gray-800/50 p-6 shadow-lg"
                >
                  <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-[#FF6B81] to-[#6C5DD3] inline-block text-transparent bg-clip-text">Filters</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {FILTERS.map((filter) => (
                      <motion.div 
                        key={filter.id}
                        whileHover={{ 
                          scale: 1.03,
                          boxShadow: `0 10px 30px rgba(${filter.id === "neon" ? "108, 93, 211" : filter.id === "vintage" ? "255, 107, 129" : "0, 0, 0"}, 0.1)`
                        }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedFilter(filter.id)}
                        className={`cursor-pointer rounded-2xl overflow-hidden transition-all ${
                          selectedFilter === filter.id 
                            ? "ring-2 ring-[#6C5DD3] ring-offset-2 ring-offset-white dark:ring-offset-[#13131f]" 
                            : "hover:bg-white/50 dark:hover:bg-[#13131f]/50"
                        }`}
                      >
                        <div className="aspect-video rounded-xl overflow-hidden">
                          <div className={`w-full h-full bg-cover bg-center ${filter.class}`} 
                               style={{backgroundImage: `url(${PLACEHOLDER_IMAGE})`}}>
                          </div>
                        </div>
                        <div className="p-3 flex items-center justify-between">
                          <p className="font-medium">{filter.name}</p>
                          <span className="text-xl">{filter.icon}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
              
              {activeTab === "frames" && (
                <motion.div 
                  key="frames"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-3xl backdrop-blur-md bg-white/80 dark:bg-[#13131f]/80 border border-[#E0E0E0]/50 dark:border-gray-800/50 p-6 shadow-lg"
                >
                  <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-[#00C2CB] to-[#FCE22A] inline-block text-transparent bg-clip-text">Frames</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {FRAMES.map((frame) => (
                      <motion.div 
                        key={frame.id}
                        whileHover={{ 
                          scale: 1.03,
                          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)" 
                        }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedFrame(frame.id)}
                        className={`cursor-pointer rounded-2xl overflow-hidden transition-all ${
                          selectedFrame === frame.id 
                            ? "ring-2 ring-[#00C2CB] ring-offset-2 ring-offset-white dark:ring-offset-[#13131f]" 
                            : "hover:bg-white/50 dark:hover:bg-[#13131f]/50"
                        }`}
                      >
                        <div className="aspect-video rounded-xl overflow-hidden flex items-center justify-center bg-gradient-to-br from-white/50 to-gray-100/50 dark:from-[#13131f]/50 dark:to-black/20">
                          <div className="w-[80%] h-[80%] relative" style={frame.style}>
                            <div className="w-full h-full bg-gray-200 dark:bg-gray-700"></div>
                          </div>
                        </div>
                        <div className="p-3 flex items-center justify-between">
                          <p className="font-medium">{frame.name}</p>
                          <span className="text-xl">{frame.icon}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
              
              {activeTab === "advanced" && (
                <motion.div 
                  key="advanced"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-3xl backdrop-blur-md bg-white/80 dark:bg-[#13131f]/80 border border-[#E0E0E0]/50 dark:border-gray-800/50 p-6 shadow-lg"
                >
                  <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-[#6C5DD3] to-[#00C2CB] inline-block text-transparent bg-clip-text">Advanced Settings</h3>
                  
                  {/* Frame Customization */}
                  <div className="mb-8">
                    <h4 className="text-lg font-medium mb-4 flex items-center">
                      <span className="mr-2">🖼️</span> Frame Customization
                    </h4>
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between mb-2">
                          <label className="text-sm font-medium">Border Size</label>
                          <span className="text-sm opacity-70">{borderSize}px</span>
                        </div>
                        <input 
                          type="range" 
                          className="w-full h-2 rounded-full appearance-none bg-gradient-to-r from-[#6C5DD3]/20 to-[#FF6B81]/20 accent-[#6C5DD3]" 
                          min="0" 
                          max="30" 
                          step="1" 
                          value={borderSize}
                          onChange={(e) => setBorderSize(parseInt(e.target.value))}
                        />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <label className="text-sm font-medium">Opacity</label>
                          <span className="text-sm opacity-70">{opacity}%</span>
                        </div>
                        <input 
                          type="range" 
                          className="w-full h-2 rounded-full appearance-none bg-gradient-to-r from-[#6C5DD3]/20 to-[#FF6B81]/20 accent-[#6C5DD3]" 
                          min="30" 
                          max="100" 
                          step="1" 
                          value={opacity}
                          onChange={(e) => setOpacity(parseInt(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Collage Settings */}
                  {isCollageMode && (
                    <div>
                      <h4 className="text-lg font-medium mb-4 flex items-center">
                        <span className="mr-2">✨</span> Collage Layout
                      </h4>
                      <div className="space-y-6">
                        <div>
                          <label className="text-sm font-medium block mb-2">Layout Style</label>
                          <div className="grid grid-cols-3 gap-2">
                            {["Grid 2×2", "Grid 3×3", "Horizontal", "Vertical", "Polaroid Stack", "Masonry"].map((layout) => (
                              <button 
                                key={layout}
                                className="p-2 rounded-xl border border-[#E0E0E0] dark:border-gray-700 text-xs font-medium hover:bg-[#6C5DD3]/10 hover:border-[#6C5DD3]/50 transition-all"
                              >
                                {layout}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium">Spacing</label>
                            <span className="text-sm opacity-70">10px</span>
                          </div>
                          <input 
                            type="range" 
                            className="w-full h-2 rounded-full appearance-none bg-gradient-to-r from-[#6C5DD3]/20 to-[#FF6B81]/20 accent-[#6C5DD3]" 
                            min="0" 
                            max="50" 
                            step="1" 
                            defaultValue="10" 
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          
          {/* Main Content - Preview */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-3 flex flex-col gap-6"
          >
            {/* Preview Canvas */}
            <div className="rounded-3xl backdrop-blur-sm bg-[#f0f0f0]/30 dark:bg-[#13131f]/30 border border-[#E0E0E0]/50 dark:border-gray-800/50 p-8 shadow-lg flex-grow flex items-center justify-center min-h-[500px] overflow-hidden">
              <motion.div 
                ref={frameRef}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative max-w-full max-h-[500px]" 
                style={getFrameStyle()}
              >
                <motion.img 
                  ref={imageRef}
                  key={image + selectedFilter}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  src={image} 
                  alt="Preview" 
                  className={`max-w-full max-h-[500px] ${getFilterClass()}`}
                />
              </motion.div>
            </div>
            
            {/* Download Button */}
            <div className="flex justify-center mt-4">
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: "0 15px 30px rgba(255, 107, 129, 0.2)" }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDownload}
                className="px-10 py-4 rounded-full bg-gradient-to-r from-[#6C5DD3] to-[#FF6B81] text-white font-medium shadow-lg shadow-[#FF6B81]/10 transition-all"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Download Masterpiece</span>
                </div>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="container mx-auto px-6 py-6 mt-12 border-t border-[#E0E0E0]/50 dark:border-gray-800/50 text-center text-sm opacity-70">
         Made with 💜 by Malav Patel for creating beautiful memories
      </footer>
    </div>
  );
}