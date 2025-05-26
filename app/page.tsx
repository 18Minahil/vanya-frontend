"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  const [showTopBanner, setShowTopBanner] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)

  const heroImages = ["/banner1.webp", "/banner2.webp", "/banner3.webp"]

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [heroImages.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length)
  }

  return (
    <>
      {/* Top Banner */}
      {showTopBanner && (
        <div className="bg-black text-white text-center py-2 px-4 text-sm relative">
          <span className="tracking-wider">NEW COLLECTION EID DIARIES | LIVE NOW</span>
          <button
            onClick={() => setShowTopBanner(false)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
          >
            <X className="w-4 h-4" />
            <span className="ml-1 text-xs">close</span>
          </button>
        </div>
      )}

      {/* Header */}
      <header className="bg-black text-white py-4 px-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Left - Menu */}
          <div className="flex items-center">
            <Menu className="w-6 h-6 cursor-pointer" />
          </div>

          {/* Center - Logo */}
          <div className="flex-1 text-center">
            <Link href="/" className="text-2xl font-light tracking-[0.3em]">
              VANYA
            </Link>
          </div>

          {/* Right - Icons */}
          <div className="flex items-center space-x-4">
            {/* <Search className="w-5 h-5 cursor-pointer" />
            <User className="w-5 h-5 cursor-pointer" />
            <div className="relative">
              <Heart className="w-5 h-5 cursor-pointer" />
              <span className="absolute -top-2 -right-2 bg-white text-black text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium">
                0
              </span>
            </div>
            <div className="relative">
              <ShoppingBag className="w-5 h-5 cursor-pointer" />
              <span className="absolute -top-2 -right-2 bg-white text-black text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium">
                0
              </span>
            </div> */}
          </div>
        </div>
      </header>

      {/* Hero Section with Slider */}
      <section className="relative w-full h-screen bg-[#f5f3f0] overflow-hidden">
        <div className="relative w-full h-full">
          {/* Image Slider */}
          <div className="relative w-full h-full">
            {heroImages.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="flex items-center justify-center h-full max-w-7xl mx-auto px-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
                    {/* Left - Image */}
                    <div className="relative h-[600px] lg:h-[700px] flex justify-center">
                      <div className="relative w-[400px] h-full">
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`Hero Banner ${index + 1}`}
                          fill
                          className="object-cover object-center rounded-lg"
                          priority={index === 0}
                        />
                      </div>
                    </div>

                    {/* Right - Text Content */}
                    <div className="text-center lg:text-left space-y-8">
                      <div className="space-y-4">
                        <h1 className="text-6xl lg:text-7xl xl:text-8xl font-light tracking-[0.2em] text-gray-800">
                          SHADES
                          <span className="block italic font-light text-gray-600">of YOU</span>
                        </h1>
                        <div className="space-y-2">
                          <p className="text-xl lg:text-2xl tracking-[0.3em] font-light text-gray-700">LIVE NOW</p>
                        </div>
                      </div>

                      {/* CTA Button */}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-black p-2 rounded-full transition-all duration-200 z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-black p-2 rounded-full transition-all duration-200 z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentSlide ? "bg-black" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Trendsetters Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-light tracking-[0.2em] text-gray-800 mb-4">TRENDSETTERS</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Trendsetter Cards */}
            {[1, 2, 3].map((item) => (
              <div key={item} className="group cursor-pointer">
                <div className="relative aspect-[2/3] mb-4 overflow-hidden rounded-lg">
                  <Image
                    src={`/trend${item}.webp`}
                    alt={`Trendsetter ${item}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-light tracking-wide text-gray-800">SIGNATURE PIECE {item}</h3>
                  <p className="text-gray-600 font-light">$125</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Collection Section */}
      <section className="py-16 bg-[#f9f8f6]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left - Content */}
            <div className="space-y-8">
              <div>
                <span className="text-sm tracking-[0.3em] text-gray-600 font-light">NEW ARRIVALS</span>
                <h2 className="text-5xl lg:text-6xl font-light tracking-[0.1em] text-gray-800 mt-4">
                  EID
                  <span className="block">COLLECTION</span>
                </h2>
              </div>
              <p className="text-lg text-gray-600 font-light leading-relaxed max-w-md">
                Discover our latest Eid collection featuring contemporary designs with traditional craftsmanship.
              </p>
              <Link href="/eid-collection">
                <Button
                  className="bg-black text-white hover:bg-gray-800 px-8 py-3 text-sm tracking-[0.2em] font-light"
                  size="lg"
                >
                  EXPLORE COLLECTION
                </Button>
              </Link>
            </div>

            {/* Right - Image */}
            <div className="flex justify-center">
              <div className="relative w-[400px] aspect-[2/3]">
                <Image
                  src="/trend1.webp"
                  alt="Eid Collection Featured Piece"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Section - 3 Images Only */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-light tracking-[0.2em] text-gray-800 mb-4">#VANYAGIRL</h2>
            <p className="text-gray-600 font-light">Share your VANYA moments with us</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[1, 2, 3].map((item) => (
              <div key={item} className="group cursor-pointer">
                <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
                  <Image
                    src={`/spot${item}.webp`}
                    alt={`VANYA Girl ${item}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Brand */}
            <div className="space-y-4">
              <h3 className="text-2xl font-light tracking-[0.3em]">VANYA</h3>
              <p className="text-gray-400 font-light text-sm leading-relaxed">
                Contemporary Pakistani fashion brand creating timeless pieces for the modern woman.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-light tracking-wide">SHOP</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/new-arrivals" className="hover:text-white transition-colors">
                    New Arrivals
                  </Link>
                </li>
                <li>
                  <Link href="/ready-to-wear" className="hover:text-white transition-colors">
                    Ready to Wear
                  </Link>
                </li>
                <li>
                  <Link href="/formal" className="hover:text-white transition-colors">
                    Formal
                  </Link>
                </li>
                <li>
                  <Link href="/accessories" className="hover:text-white transition-colors">
                    Accessories
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Care */}
            {/* <div className="space-y-4">
              <h4 className="text-lg font-light tracking-wide">SUPPORT</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/size-guide" className="hover:text-white transition-colors">
                    Size Guide
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className="hover:text-white transition-colors">
                    Shipping
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="hover:text-white transition-colors">
                    Returns
                  </Link>
                </li>
              </ul>
            </div> */}

            {/* Newsletter */}
            {/* <div className="space-y-4">
              <h4 className="text-lg font-light tracking-wide">NEWSLETTER</h4>
              <p className="text-gray-400 text-sm">
                Subscribe to receive updates on new collections and exclusive offers.
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-transparent border border-gray-600 px-4 py-2 text-sm focus:border-white focus:outline-none"
                />
                <Button className="w-full bg-white text-black hover:bg-gray-200 text-sm tracking-wide">
                  SUBSCRIBE
                </Button>
              </div>
            </div> */}
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400 text-sm">© 2025 VANYA. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  )
}
