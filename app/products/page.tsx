'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]); // Use any[] to match raw Strapi format

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:1337/api/products?populate=*');
        setProducts(res.data.data); // Set data directly from Strapi
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-extrabold text-center mb-12 text-gray-800">Explore Our Products</h1>
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {products?.map((product: any) => {
          const image = product.images?.[0]?.formats?.medium?.url || product.images?.[0]?.url;
          const imageUrl = image ? `http://localhost:1337${image}` : '/placeholder.png';

          return (
            <Card
              key={product.id}
              className="flex flex-col justify-between rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 border border-gray-200"
            >
              <Link href={`/products/${product.slug}`} className="flex flex-col h-full">
                <div className="w-full h-[300px] bg-white flex items-center justify-center p-4">
                  <Image
                    src={imageUrl}
                    alt={product.name}
                    width={250}
                    height={250}
                    className="object-contain max-h-full w-auto"
                  />
                </div>
                <CardContent className="flex flex-col flex-1 justify-between p-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h2>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {product.description?.[0]?.children?.[0]?.text || 'No description available.'}
                    </p>
                    <div className="text-md font-bold text-indigo-600">${product.price}</div>
                  </div>
                  <Button className="mt-6 w-full bg-black text-white rounded-xl hover:bg-gray-800">
                    View Details
                  </Button>
                </CardContent>
              </Link>
            </Card>
          );
        })}
      </div>
    </main>
  );
}
