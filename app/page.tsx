'use client';
import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';

export default function HomePage() {
  const [sliderRef, slider] = useKeenSlider({
    loop: true,
    slides: { perView: 1 },
  });

  // Auto-slide with cleanup
  useEffect(() => {
    if (!slider) return;
    const interval = setInterval(() => {
      slider.current?.next();
    }, 4000);
    return () => clearInterval(interval);
  }, [slider]);

  return (
    <>
      {/* Hero Banner */}
      <section className="w-full">
        <div className="relative w-full h-[80vh] max-h-[800px] bg-black overflow-hidden">
          <div ref={sliderRef} className="keen-slider w-full h-full">
            {["/trend1.webp", "/trend2.webp", "/trend3.webp"].map((img, idx) => (
              <div
                key={idx}
                className="keen-slider__slide flex items-center justify-center w-full h-full relative"
              >
                <div className="relative w-full h-full">
                  <Image
                    src={img}
                    alt={`Hero Banner ${idx + 1}`}
                    fill
                    className="object-contain"
                    priority
                    sizes="100vw"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">

        {/* Trendsetters */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Trendsetters</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {["/trend1.webp", "/trend2.webp", "/trend3.webp"].map((img, idx) => (
              <div
                key={idx}
                className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition"
              >
                <Image
                  src={img}
                  alt={`Trendsetter ${idx + 1}`}
                  width={600}
                  height={900}
                  className="w-full h-[450px] object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">Product Name</h3>
                  <p className="text-gray-600">Rs. 9,950.00</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* New In Collection */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">New In Collection</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {["new1.jpg", "new2.jpg", "new3.jpg", "new4.jpg"].map((img, idx) => (
              <div
                key={idx}
                className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition"
              >
                <Image
                  src={`/images/${img}`}
                  alt={`New Arrival ${idx + 1}`}
                  width={600}
                  height={900}
                  className="w-full h-[450px] object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">Collection Name</h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* #VANYAspotted */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">#VANYAspotted</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {["/spot1.webp", "/spot2.webp", "/spot3.webp", "/images/spot4.jpg"].map((img, idx) => (
              <div key={idx} className="overflow-hidden rounded-lg">
                <Image
                  src={img}
                  alt={`Spotted ${idx + 1}`}
                  width={400}
                  height={600}
                  className="w-full h-[300px] object-cover"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t pt-8 mt-12 text-center text-sm text-gray-500">
          <p>© 2025 Vanya.pk Clone. Built with ❤️ by Minahil.</p>
          <p className="mt-2">
            <Link href="/about" className="hover:underline">About Us</Link>{' '}|{' '}
            <Link href="/contact" className="hover:underline">Contact</Link>{' '}|{' '}
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
          </p>
        </footer>
      </main>
    </>
  );
}