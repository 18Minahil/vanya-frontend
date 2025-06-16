"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Minus, Plus, Heart, Share2, Star, Truck, Shield, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react"

type Product = {
  id: number
  name: string
  slug: string
  price: number
  originalPrice?: number
  description: any[]
  category: string
  inStock: boolean
  sizes?: string[]
  colors?: string[]
  material?: string
  care?: string[]
  images: Array<{
    formats?: {
      thumbnail?: { url: string }
      small?: { url: string }
      medium?: { url: string }
      large?: { url: string }
    }
    url: string
  }>
  reviews?: {
    average: number
    count: number
  }
}

export default function ProductPage() {
  const router = useRouter()
  const params = useParams<{ slug: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [recommended, setRecommended] = useState<Product[]>([])
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [selectedColor, setSelectedColor] = useState<string>("")
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [activeTab, setActiveTab] = useState("description")

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const res = await fetch(
          `https://mindful-fireworks-e94e8b5d87.strapiapp.com/api/products?filters[slug][$eq]=${params.slug}&populate=*`,
        )

        if (!res.ok) throw new Error("Failed to fetch product")
        const { data } = await res.json()

        if (!data || data.length === 0) {
          router.push("/404")
          return
        }

        const productData = data[0]
        if (!productData?.slug) {
          router.push("/404")
          return
        }

        setProduct(productData)

        if (productData.sizes?.length > 0) {
          setSelectedSize(productData.sizes[0])
        }
        if (productData.colors?.length > 0) {
          setSelectedColor(productData.colors[0])
        }

        const recRes = await fetch("https://mindful-fireworks-e94e8b5d87.strapiapp.com/api/products?populate=*")
        const { data: recData } = await recRes.json()
        setRecommended(recData.filter((p: Product) => p.slug !== productData.slug).slice(0, 4))
      } catch (error) {
        console.error("Fetch error:", error)
        router.push("/500")
      } finally {
        setLoading(false)
      }
    }

    if (params.slug) fetchProduct()
  }, [params.slug, router])

  const handleAddToCart = () => {
    if (!product) return

    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      alert("Please select a size")
      return
    }

    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    const selectedImage = product.images?.[selectedImageIndex]
    const imageUrl =
      selectedImage?.formats?.medium?.url ||
      selectedImage?.formats?.small?.url ||
      selectedImage?.url ||
      "/placeholder.svg?height=300&width=300"

    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      slug: product.slug,
      quantity,
      size: selectedSize,
      color: selectedColor,
      image: imageUrl,
    }

    const existingIndex = cart.findIndex(
      (item: any) => item.id === cartItem.id && item.size === cartItem.size && item.color === cartItem.color,
    )

    if (existingIndex >= 0) {
      cart[existingIndex].quantity += quantity
    } else {
      cart.push(cartItem)
    }

    localStorage.setItem("cart", JSON.stringify(cart))
    alert("Added to cart!")
  }

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: `Check out this ${product?.name}`,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  const incrementQuantity = () => setQuantity((prev) => prev + 1)
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1))

  const nextImage = () => {
    if (product?.images) {
      setSelectedImageIndex((prev) => (prev + 1) % product.images.length)
    }
  }

  const prevImage = () => {
    if (product?.images) {
      setSelectedImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="border-b border-gray-100">
          <div className="h-16 bg-gray-50 animate-pulse"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-4">
              <div className="aspect-[3/4] bg-gray-100 rounded animate-pulse"></div>
              <div className="flex gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-square w-20 bg-gray-100 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-8 bg-gray-100 rounded w-3/4 animate-pulse"></div>
              <div className="h-6 bg-gray-100 rounded w-1/4 animate-pulse"></div>
              <div className="h-20 bg-gray-100 rounded animate-pulse"></div>
              <div className="h-12 bg-gray-100 rounded w-1/2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) return null

  const currentImage = product.images?.[selectedImageIndex]
  const mainImage =
    currentImage?.formats?.large?.url ||
    currentImage?.formats?.medium?.url ||
    currentImage?.formats?.small?.url ||
    currentImage?.url ||
    "/placeholder.svg?height=800&width=600"

  return (
    <div className="bg-white min-h-screen">
      {/* Header - Simplified */}
      <header className="border-b border-gray-100 sticky top-0 bg-white z-50">
        <div className="px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left - Back Button */}
            <div className="flex items-center">
              <Link href="/products">
                <Button variant="outline" className="flex items-center gap-2 text-sm font-light">
                  <ChevronLeft size={16} />
                  Back to Products
                </Button>
              </Link>
            </div>

            {/* Center - Logo */}
            <div className="flex-1 flex justify-center">
              <Link href="/">
                <h1 className="text-2xl lg:text-3xl font-light tracking-[0.3em] text-black hover:text-gray-600 transition-colors">
                  VANYA
                </h1>
              </Link>
            </div>

            {/* Right - Empty space for balance */}
            <div className="flex items-center">
              <div className="w-32"></div> {/* Spacer to balance the back button */}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 py-6">
          <Link href="/" className="hover:text-black transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-black transition-colors">
            Products
          </Link>
          <span>/</span>
          <span className="text-black">{product.name}</span>
        </nav>

        {/* Remove this entire back button section */}

        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 pb-20">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden group">
              <Image
                src={mainImage || "/placeholder.svg"}
                alt={product.name || "Product image"}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />

              {/* Navigation Arrows */}
              {product.images && product.images.length > 1 && (
                <>
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronLeft size={20} />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight size={20} />
                  </Button>
                </>
              )}

              {/* Wishlist & Share */}
              <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={toggleWishlist}
                  className="bg-white/80 backdrop-blur-sm hover:bg-white"
                >
                  <Heart size={18} className={isWishlisted ? "fill-red-500 text-red-500" : ""} />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={handleShare}
                  className="bg-white/80 backdrop-blur-sm hover:bg-white"
                >
                  <Share2 size={18} />
                </Button>
              </div>

              {/* Image Counter */}
              {product.images && product.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {selectedImageIndex + 1} / {product.images.length}
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((image, index) => {
                  const thumbUrl =
                    image.formats?.small?.url ||
                    image.formats?.thumbnail?.url ||
                    image.url ||
                    "/placeholder.svg?height=150&width=150"

                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative aspect-[3/4] rounded overflow-hidden border-2 transition-all duration-200 ${
                        selectedImageIndex === index
                          ? "border-black shadow-lg"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      <Image
                        src={thumbUrl || "/placeholder.svg"}
                        alt={`${product.name} view ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="150px"
                      />
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-8">
            <div className="space-y-4">
              {product.category && (
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500">{product.category}</p>
              )}

              <h1 className="text-3xl lg:text-4xl font-light tracking-wide text-black leading-tight">{product.name}</h1>

              {/* Reviews */}
              {product.reviews && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < Math.floor(product.reviews!.average) ? "fill-black text-black" : "text-gray-300"}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">({product.reviews.count} reviews)</span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-center gap-4">
                <p className="text-2xl font-light text-black">${product.price.toLocaleString()}</p>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <p className="text-lg text-gray-400 line-through">${product.originalPrice.toLocaleString()}</p>
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">SALE</span>
                  </>
                )}
              </div>

              {/* Stock Status */}
              <div>
                {product.inStock ? (
                  <span className="text-green-700 bg-green-50 border border-green-200 text-xs px-3 py-1 rounded-full">
                    In Stock
                  </span>
                ) : (
                  <span className="bg-red-50 text-red-700 border border-red-200 text-xs px-3 py-1 rounded-full">
                    Out of Stock
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="text-gray-600 leading-relaxed">
              {product.description?.[0]?.children?.[0]?.text || "No description available"}
            </div>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm uppercase tracking-[0.1em] font-medium text-black">
                    Size: {selectedSize && <span className="font-normal">{selectedSize}</span>}
                  </label>
                  <Button variant="ghost" className="text-xs underline p-0 h-auto">
                    Size Guide
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[3rem] h-12 ${
                        selectedSize === size
                          ? "bg-black text-white border-black"
                          : "border-gray-300 hover:border-black"
                      }`}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-4">
                <label className="text-sm uppercase tracking-[0.1em] font-medium text-black">
                  Color: {selectedColor && <span className="font-normal capitalize">{selectedColor}</span>}
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <Button
                      key={color}
                      variant={selectedColor === color ? "default" : "outline"}
                      onClick={() => setSelectedColor(color)}
                      className={`capitalize h-12 px-6 ${
                        selectedColor === color
                          ? "bg-black text-white border-black"
                          : "border-gray-300 hover:border-black"
                      }`}
                    >
                      {color}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="space-y-6 pt-4">
              <div className="flex items-center gap-6">
                <label className="text-sm uppercase tracking-[0.1em] font-medium text-black">Quantity:</label>
                <div className="flex items-center border border-gray-300 rounded">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={decrementQuantity}
                    className="h-12 w-12 rounded-none hover:bg-gray-50"
                  >
                    <Minus size={16} />
                  </Button>
                  <span className="w-16 text-center font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={incrementQuantity}
                    className="h-12 w-12 rounded-none hover:bg-gray-50"
                  >
                    <Plus size={16} />
                  </Button>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="w-full h-14 bg-black text-white hover:bg-gray-800 font-light tracking-[0.1em] uppercase text-sm transition-colors"
              >
                {product.inStock ? "Add to Cart" : "Out of Stock"}
              </Button>
            </div>

            {/* Features */}
            <div className="space-y-4 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <Truck size={18} />
                <span>Free shipping on orders over $150</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <RotateCcw size={18} />
                <span>30-day return policy</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <Shield size={18} />
                <span>Authentic products guaranteed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="border-t border-gray-100 pt-16 mb-20">
          <div className="flex justify-center mb-8">
            <div className="flex bg-gray-50 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab("description")}
                className={`px-6 py-2 rounded-md text-sm transition-colors ${
                  activeTab === "description" ? "bg-white shadow-sm" : "hover:bg-gray-100"
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab("details")}
                className={`px-6 py-2 rounded-md text-sm transition-colors ${
                  activeTab === "details" ? "bg-white shadow-sm" : "hover:bg-gray-100"
                }`}
              >
                Details
              </button>
              <button
                onClick={() => setActiveTab("care")}
                className={`px-6 py-2 rounded-md text-sm transition-colors ${
                  activeTab === "care" ? "bg-white shadow-sm" : "hover:bg-gray-100"
                }`}
              >
                Care Instructions
              </button>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            {activeTab === "description" && (
              <div className="text-gray-600 leading-relaxed">
                {product.description?.[0]?.children?.[0]?.text || "No description available"}
              </div>
            )}

            {activeTab === "details" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                <div className="space-y-4">
                  {product.material && (
                    <div className="flex">
                      <span className="font-medium w-32 text-black">Material:</span>
                      <span className="text-gray-600">{product.material}</span>
                    </div>
                  )}
                  <div className="flex">
                    <span className="font-medium w-32 text-black">Category:</span>
                    <span className="text-gray-600 capitalize">{product.category}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-32 text-black">SKU:</span>
                    <span className="text-gray-600">VY-{product.id}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "care" && (
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                {product.care && product.care.length > 0 ? (
                  <ul className="space-y-2">
                    {product.care.map((instruction, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                        {instruction}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                      Machine wash cold with like colors
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                      Do not bleach
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                      Tumble dry low heat
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                      Iron on low temperature if needed
                    </li>
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Recommended Section */}
        {recommended.length > 0 && (
          <div className="border-t border-gray-100 pt-16">
            <h2 className="text-2xl font-light tracking-wide text-center mb-12 text-black">YOU MAY ALSO LIKE</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {recommended.map((item) => {
                const itemImage = item.images?.[0]
                const recImage =
                  itemImage?.formats?.medium?.url ||
                  itemImage?.formats?.small?.url ||
                  itemImage?.url ||
                  "/placeholder.svg?height=500&width=400"

                return (
                  <div key={item.id} className="group">
                    <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden mb-4">
                      <Link href={`/products/${item.slug}`}>
                        <Image
                          src={recImage || "/placeholder.svg"}
                          alt={item.name || "Product image"}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        />
                      </Link>

                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>

                      <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Link href={`/products/${item.slug}`}>
                          <Button className="w-full bg-white text-black hover:bg-gray-100 font-light tracking-[0.1em] uppercase text-sm h-12">
                            Quick View
                          </Button>
                        </Link>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Link href={`/products/${item.slug}`}>
                        <h3 className="font-light text-black hover:text-gray-600 transition-colors leading-tight">
                          {item.name}
                        </h3>
                      </Link>

                      <div className="flex items-center gap-3">
                        <span className="font-light text-black">${item.price.toLocaleString()}</span>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <span className="text-sm text-gray-400 line-through">
                            ${item.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>

                      {item.category && (
                        <p className="text-xs text-gray-500 uppercase tracking-[0.1em]">{item.category}</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 mt-24 py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-2xl font-light tracking-[0.3em] text-black mb-6">VANYA</h2>
          <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
            Discover timeless elegance with our curated collection of premium fashion pieces.
          </p>
        </div>
      </footer>
    </div>
  )
}

