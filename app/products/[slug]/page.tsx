'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

type Product = {
  id: number;
  name: string;
  slug: string;
  price: number;
  description: any[];
  category: string;
  inStock: boolean;
  images: Array<{
    formats?: {
      thumbnail?: { url: string };
      small?: { url: string };
      medium?: { url: string };
    };
    url: string;
  }>;
};

export default function ProductPage() {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [recommended, setRecommended] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Add populate=* to get image relations
        const res = await fetch(
          `http://localhost:1337/api/products?filters[slug][$eq]=${params.slug}&populate=*`
        );
        
        if (!res.ok) throw new Error('Failed to fetch product');
        const { data } = await res.json();
        
        // Handle empty response
        if (!data || data.length === 0) {
          router.push('/404');
          return;
        }
        
        // Verify product data structure
        const productData = data[0];
        if (!productData?.slug) {
          router.push('/404');
          return;
        }

        setProduct(productData);

        // Fetch recommended with populated images
        const recRes = await fetch('http://localhost:1337/api/products?populate=*');
        const { data: recData } = await recRes.json();
        setRecommended(recData.filter((p: Product) => p.slug !== productData.slug));
      } catch (error) {
        console.error('Fetch error:', error);
        router.push('/500');
      }
    };

    if (params.slug) fetchProduct();
  }, [params.slug, router]);

  const handleAddToCart = () => {
    if (!product) return;
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Safer image handling with fallbacks
    const firstImage = product.images?.[0];
    const imageUrl = firstImage?.formats?.medium?.url 
      || firstImage?.formats?.small?.url 
      || firstImage?.url 
      || '/placeholder.jpg';

    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      slug: product.slug,
      quantity,
      image: `http://localhost:1337${imageUrl}`,
    };

    const existingIndex = cart.findIndex((item: any) => item.id === cartItem.id);
    if (existingIndex >= 0) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push(cartItem);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Added to cart!');
  };

  if (!product) return <div className="p-6">Loading...</div>;

  // Image handling with validation
  const firstImage = product.images?.[0];
  const mainImage = firstImage?.formats?.medium?.url 
    || firstImage?.formats?.small?.url 
    || firstImage?.url 
    || '/placeholder.jpg';

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      {/* Product Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
        <div className="relative w-full h-96 md:h-[500px]">
          <Image
            src={`http://localhost:1337${mainImage}`}
            alt={product.name || 'Product image'}
            fill
            className="object-contain rounded-xl"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-muted-foreground mb-4">
            {product.description?.[0]?.children?.[0]?.text || 'No description available'}
          </p>
          <p className="text-2xl font-semibold mb-4">${product.price}</p>

          <div className="flex items-center gap-4 mb-6">
            <label className="font-medium">Quantity:</label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
              className="w-20 p-2 border rounded-md"
            />
          </div>

          <button
            onClick={handleAddToCart}
            className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Recommended Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {recommended.map((item) => {
            const itemImage = item.images?.[0];
            const recImage = itemImage?.formats?.medium?.url 
              || itemImage?.formats?.small?.url 
              || itemImage?.url 
              || '/placeholder.jpg';

            return (
              <Link
                href={`/products/${item.slug}`}
                key={item.id}
                className="border rounded-xl p-3 hover:shadow transition block"
              >
                <div className="relative w-full h-48 mb-3">
                  <Image
                    src={`http://localhost:1337${recImage}`}
                    alt={item.name || 'Product image'}
                    fill
                    className="object-contain rounded-md"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                <p className="text-muted-foreground text-sm mb-1">
                  {item.description?.[0]?.children?.[0]?.text || 'No description'}
                </p>
                <p className="font-bold">${item.price}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}