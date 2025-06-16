"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { SlidersHorizontal } from "lucide-react"

interface Product {
  id: number
  name: string
  slug: string
  price: number
  originalPrice?: number
  description?: any[]
  images?: any[]
  category?: string
  isNew?: boolean
  isSale?: boolean
}

export default function VanyaProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("ALL")
  const [sortBy, setSortBy] = useState("featured")
  const [showFilters, setShowFilters] = useState(false)

  const filterOptions = ["ALL", "SUMMER COLLECTION", "WINTER COLLECTION", "SPRING COLLECTION"]
  const sortOptions = [
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
  ]

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const res = await axios.get("https://mindful-fireworks-e94e8b5d87.strapiapp.com/api/products?populate=*")
        setProducts(res.data.data)
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = selectedFilter === "ALL" || product.category === selectedFilter
    return matchesSearch && matchesFilter
  })

  const filteredAndSortedProducts = filteredProducts.sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      default:
        return 0
    }
  })

  const ProductCard = ({ product }: { product: Product }) => {
    const image = product.images?.[0]?.formats?.medium?.url || product.images?.[0]?.url
    const imageUrl = image || "/placeholder.svg?height=900&width=600"
    const hasDiscount = product.originalPrice && product.originalPrice > product.price

    return (
      <div className="group relative">
        <Card className="border-0 shadow-none bg-transparent overflow-hidden">
          <div className="relative aspect-[2/3] bg-gray-50 overflow-hidden rounded-lg">
            <Link href={`/products/${product.slug}`}>
              <Image
                src={imageUrl || "/placeholder.svg"}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 33vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                priority={false}
              />
            </Link>

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isNew && (
                <span className="bg-black text-white text-xs px-3 py-1.5 font-light rounded-full uppercase tracking-wide">
                  NEW
                </span>
              )}
              {product.isSale && (
                <span className="bg-red-600 text-white text-xs px-3 py-1.5 font-light rounded-full uppercase tracking-wide">
                  SALE
                </span>
              )}
            </div>

            {/* View Details Button */}
            <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Link href={`/products/${product.slug}`}>
                <Button className="w-full bg-black text-white hover:bg-gray-800 font-light tracking-wide py-3 rounded-lg">
                  VIEW DETAILS
                </Button>
              </Link>
            </div>
          </div>

          <div className="pt-5 space-y-3">
            <Link href={`/products/${product.slug}`}>
              <h3 className="text-base font-light text-gray-900 tracking-wide uppercase leading-tight hover:text-gray-600 transition-colors">
                {product.name}
              </h3>
            </Link>

            <div className="flex items-center gap-3">
              <span className="text-base font-medium text-black">${product.price.toLocaleString()}</span>
              {hasDiscount && (
                <span className="text-sm text-gray-500 line-through">${product.originalPrice?.toLocaleString()}</span>
              )}
            </div>

            {product.category && <p className="text-xs text-gray-500 uppercase tracking-wide">{product.category}</p>}
          </div>
        </Card>
      </div>
    )
  }

  const ProductSkeleton = () => (
    <div className="space-y-5">
      <Skeleton className="aspect-[2/3] w-full rounded-lg" />
      <div className="space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        {/* Top Banner */}
        <div className="bg-black text-white text-center py-3">
          <p className="text-xs tracking-wider uppercase">NEW COLLECTION EID DIARIES | LIVE NOW</p>
        </div>

        {/* Main Header */}
        <div className="px-6 py-6">
          <div className="flex items-center justify-center max-w-7xl mx-auto">
            <div className="flex-1 text-center">
              <Link href="/">
                <h1 className="text-3xl font-light tracking-[0.2em] text-black hover:text-gray-600 transition-colors cursor-pointer">
                  VANYA
                </h1>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-gray-200 py-5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center">
            <div className="text-base tracking-wide uppercase text-black font-medium border-b-2 border-black pb-2">
              ALL
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Filters and Sort */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                FILTER
              </Button>

              {/* Filter Dropdown */}
              {showFilters && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[220px]">
                  <div className="p-5">
                    <h3 className="text-sm font-medium text-gray-900 mb-4 uppercase tracking-wide">COLLECTION</h3>
                    <div className="space-y-3">
                      {filterOptions.map((option) => (
                        <label key={option} className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="collection"
                            value={option}
                            checked={selectedFilter === option}
                            onChange={(e) => setSelectedFilter(e.target.value)}
                            className="mr-3 w-4 h-4"
                          />
                          <span className="text-sm text-gray-700 uppercase tracking-wide">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="text-sm text-gray-600 font-medium">{filteredAndSortedProducts.length} PRODUCTS</div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 uppercase tracking-wide">SORT BY:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border-none bg-transparent focus:outline-none cursor-pointer uppercase tracking-wide"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filter Display */}
        {selectedFilter !== "ALL" && (
          <div className="mb-8 flex items-center gap-3">
            <span className="text-sm text-gray-600 uppercase tracking-wide">Filtered by:</span>
            <span className="inline-flex items-center px-3 py-2 rounded-lg text-xs font-medium bg-gray-100 text-gray-800 uppercase tracking-wide">
              {selectedFilter}
              <button
                onClick={() => setSelectedFilter("ALL")}
                className="ml-3 text-gray-500 hover:text-gray-700 text-lg"
              >
                ×
              </button>
            </span>
          </div>
        )}

        {/* Products Grid - 3 columns */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {[...Array(9)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : filteredAndSortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {filteredAndSortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <h3 className="text-xl font-light text-gray-900 mb-3 tracking-wide uppercase">NO PRODUCTS FOUND</h3>
            <p className="text-gray-600 text-sm">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </main>

      {/* Overlay to close filters */}
      {showFilters && <div className="fixed inset-0 z-5" onClick={() => setShowFilters(false)} />}

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-24 py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-xl font-light tracking-[0.2em] text-black mb-6">VANYA</h2>
          <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
            Discover timeless elegance with our curated collection of premium fashion pieces.
          </p>
        </div>
      </footer>
    </div>
  )
}
