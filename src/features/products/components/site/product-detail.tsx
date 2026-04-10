"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Heart, Minus, Plus, ShoppingCart, Zap, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RichTextRenderer } from "@/components/ui/rich-text-editor";
import { IProduct, ProductStatus } from "../../types/product.types";
import { useCartStore } from "@/store/cartStore";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

interface ProductDetailProps {
  product: IProduct;
}

const statusConfig: Record<ProductStatus, { label: string; className: string }> = {
  [ProductStatus.IN_STOCK]: { label: "In Stock", className: "bg-green-100 text-green-700 border-green-200" },
  [ProductStatus.OUT_OF_STOCK]: { label: "Out of Stock", className: "bg-red-100 text-red-700 border-red-200" },
  [ProductStatus.PRE_ORDER]: { label: "Pre Order", className: "bg-blue-100 text-blue-700 border-blue-200" },
  [ProductStatus.COMING_SOON]: { label: "Coming Soon", className: "bg-amber-100 text-amber-700 border-amber-200" },
};

function MagnifierImage({ src, alt, priority }: { src: string; alt: string; priority?: boolean }) {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setPosition({ x, y });
  };

  return (
    <div
      className="w-full h-full relative cursor-crosshair overflow-hidden bg-white"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={handleMouseMove}
    >
      <div
        className="w-full h-full"
        style={{
          transformOrigin: `${position.x}% ${position.y}%`,
          transform: isHovering ? "scale(2.5)" : "scale(1)",
          transition: "transform 0.2s ease-out",
        }}
      >
        <Image src={src} alt={alt} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-contain pointer-events-none" priority={priority} />
      </div>
    </div>
  );
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const {
    _id: productId,
    title,
    slug,
    badges,
    categoryId,
    subCategoryId,
    brandId,
    variants,
    keyFeatures,
    description,
    specifications,
    featuredImage: productFeaturedImage,
  } = product;

  const addItem = useCartStore((s) => s.addItem);

  // ── Initial variant (prefer featured, fallback to first) ──
  const initialVariant = useMemo(() => variants.find((v) => v.featured) ?? variants[0], [variants]);

  // ── State ──
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>(
    Object.fromEntries(initialVariant?.attributes?.map((a) => [a.name, a.value]) ?? []),
  );
  const [quantity, setQuantity] = useState(1);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState<"specifications" | "description">("specifications");

  // ── Derive selected variant from attribute state ──
  const selectedVariant = useMemo(() => {
    const requiredKeysCount = variants[0]?.attributes?.length ?? 0;
    if (Object.keys(selectedAttributes).length !== requiredKeysCount) return null;
    return variants.find((v) => v.attributes.every((a) => selectedAttributes[a.name] === a.value)) ?? null;
  }, [selectedAttributes, variants]);

  // ── Gallery images from selected variant (or fallback to initial if none fully selected) ──
  const displayVariant = selectedVariant ?? initialVariant;
  const galleryImages = useMemo(() => {
    const variantImages = displayVariant?.images ?? [];
    const featured = displayVariant?.featuredImage ?? productFeaturedImage ?? "";
    const unique = [featured, ...variantImages.filter((img) => img !== featured)].filter(Boolean);
    return unique;
  }, [displayVariant, productFeaturedImage]);

  // ── Attribute groups across all variants ──
  const attributeGroups = useMemo(() => {
    const groups: Record<string, string[]> = {};
    variants.forEach((v) => {
      v.attributes.forEach((a) => {
        if (!groups[a.name]) groups[a.name] = [];
        if (!groups[a.name].includes(a.value)) groups[a.name].push(a.value);
      });
    });
    return Object.entries(groups).map(([name, values]) => ({ name, values }));
  }, [variants]);

  // ── Price range across all variants ──
  const priceRange = useMemo(() => {
    const prices = variants.map((v) => v.price ?? v.regularPrice);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [variants]);

  const actualPrice = selectedVariant?.price ?? selectedVariant?.regularPrice ?? 0;
  const regularPrice = selectedVariant?.regularPrice ?? 0;
  const hasDiscount = selectedVariant?.price !== undefined && selectedVariant.price < selectedVariant.regularPrice;
  const status = selectedVariant?.status ?? ProductStatus.IN_STOCK;

  const handleAttributeSelect = (name: string, value: string) => {
    const next = { ...selectedAttributes };
    if (next[name] === value) {
      delete next[name];
    } else {
      next[name] = value;
    }
    setSelectedAttributes(next);
  };

  const handleAddToCart = () => {
    if (!selectedVariant || !productId) return;
    for (let i = 0; i < quantity; i++) {
      addItem({
        productId,
        slug,
        title,
        image: selectedVariant.featuredImage ?? productFeaturedImage ?? "",
        variantId: selectedVariant._id ?? selectedVariant.sku,
        sku: selectedVariant.sku,
        price: actualPrice,
        regularPrice,
        attributes: selectedVariant.attributes,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Main Product Section */}
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12">
          {/* ── Left: Image Gallery ── */}
          <div className="flex flex-col gap-3 min-w-0">
            {/* Main Image */}
            <div className="relative aspect-square border border-border bg-white overflow-hidden group">
              <Swiper
                spaceBetween={0}
                navigation={true}
                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                modules={[FreeMode, Navigation, Thumbs]}
                className="w-full h-full product-swiper [&_.swiper-button-next]:opacity-0 [&_.swiper-button-prev]:opacity-0 hover:[&_.swiper-button-next]:opacity-100 hover:[&_.swiper-button-prev]:opacity-100 transition-opacity"
              >
                {galleryImages.map((img, i) => (
                  <SwiperSlide key={i}>
                    <MagnifierImage 
                      src={img || productFeaturedImage || ""} 
                      alt={`${title} - view ${i + 1}`} 
                      priority={i === 0} 
                    />
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Badges overlay */}
              {badges && badges.length > 0 && (
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none text-left">
                  {badges.map((badge, i) => (
                    <span
                      key={i}
                      className="bg-foreground text-background text-[10px] font-bold px-2 py-1 uppercase tracking-wider leading-none self-start"
                    >
                      {badge.title}
                      {badge.value ? ` ${badge.value}` : ""}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {galleryImages.length > 1 && (
              <div className="w-full overflow-hidden pb-1">
                <Swiper
                  onSwiper={setThumbsSwiper}
                  spaceBetween={8}
                  slidesPerView="auto"
                  watchSlidesProgress={true}
                  modules={[FreeMode, Navigation, Thumbs]}
                  className="w-full h-[72px]"
                >
                  {galleryImages.map((img, i) => (
                    <SwiperSlide 
                      key={i} 
                      className="w-[72px]! h-[72px]! cursor-pointer border-2 border-border opacity-70 transition-all duration-200 hover:opacity-100 hover:border-foreground/50 [&.swiper-slide-thumb-active]:border-foreground [&.swiper-slide-thumb-active]:opacity-100 bg-white box-border"
                    >
                      <div className="w-full h-full relative">
                        <Image
                          src={img}
                          alt={`${title} view ${i + 1}`}
                          fill
                          className="object-contain p-1 box-border"
                          sizes="72px"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}
          </div>

          {/* ── Right: Product Info ── */}
          <div className="flex flex-col gap-5">
            <nav className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap">
              <Link href="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
              <ChevronRight size={12} className="shrink-0" />
              {categoryId && (
                <>
                  <Link href={`/categories/${categoryId.slug}`} className="hover:text-foreground transition-colors">
                    {categoryId.title}
                  </Link>
                  <ChevronRight size={12} className="shrink-0" />
                </>
              )}
              {subCategoryId && (
                <>
                  <Link
                    href={`/sub-categories/${subCategoryId.slug}`}
                    className="hover:text-foreground transition-colors"
                  >
                    {subCategoryId.title}
                  </Link>
                </>
              )}
            </nav>
            {/* Title */}
            <div>
              <h1 className="text-2xl font-bold leading-tight text-foreground mb-3">{title}</h1>

              {/* Price */}
              <div className="flex items-baseline gap-2.5 flex-wrap">
                {selectedVariant ? (
                  <>
                    <span className="text-2xl font-bold text-primary">৳{actualPrice.toLocaleString("en-BD")}</span>
                    {hasDiscount && (
                      <span className="text-base text-muted-foreground line-through">
                        ৳{regularPrice.toLocaleString("en-BD")}
                      </span>
                    )}
                    {hasDiscount && (
                      <span className="text-xs font-bold bg-primary text-white px-1.5 py-0.5">
                        {Math.round(((regularPrice - actualPrice) / regularPrice) * 100)}% OFF
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-2xl font-bold text-tartiary">
                    ৳{priceRange.min.toLocaleString("en-BD")} – ৳{priceRange.max.toLocaleString("en-BD")}
                  </span>
                )}
              </div>
            </div>

            {/* Key Features */}
            {keyFeatures && (
              <div className="text-base text-foreground/75 leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1 [&_li]:leading-snug [&_a]:text-tartiary [&_a]:underline [&_a:hover]:text-tartiary/80">
                <RichTextRenderer value={keyFeatures} />
              </div>
            )}

            <hr className="border-border" />

            {/* Variant Selectors */}
            {attributeGroups.map(({ name, values }) => (
              <div key={name}>
                <p className="text-sm font-semibold mb-2.5">
                  {name}: <span className="font-normal text-muted-foreground">{selectedAttributes[name]}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {values.map((value) => {
                    const isSelected = selectedAttributes[name] === value;
                    const isAvailable = variants.some((v) =>
                      v.attributes.some((a) => a.name === name && a.value === value),
                    );
                    return (
                      <button
                        key={value}
                        onClick={() => handleAttributeSelect(name, value)}
                        disabled={!isAvailable}
                        className={`px-3.5 py-1.5 text-xs font-medium border transition-all duration-150 cursor-pointer ${
                          isSelected
                            ? "border-foreground bg-foreground text-background"
                            : "border-border bg-background text-foreground hover:border-foreground/60"
                        } disabled:opacity-35 disabled:cursor-not-allowed`}
                      >
                        {value}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Stock + SKU */}
            <div className="flex items-center gap-3 flex-wrap">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider border ${statusConfig[status].className}`}
              >
                <Package size={12} />
                {statusConfig[status].label}
              </span>
              {selectedVariant?.sku && (
                <span className="text-xs text-muted-foreground">
                  SKU: <span className="font-medium text-foreground">{selectedVariant.sku}</span>
                </span>
              )}
              {brandId?.title && (
                <span className="text-xs text-muted-foreground">
                  Brand:{" "}
                  <Link
                    href={`/brands/${brandId.slug}`}
                    className="font-medium text-foreground hover:text-tartiary transition-colors"
                  >
                    {brandId.title}
                  </Link>
                </span>
              )}
            </div>

            {/* Missing Variant Warning */}
            {!selectedVariant && attributeGroups.length > 0 && (
              <p className="text-sm font-medium text-destructive mt-1">
                {Object.keys(selectedAttributes).length !== attributeGroups.length
                  ? "Please select all attributes to choose a valid product variant."
                  : "This combination is currently unavailable."}
              </p>
            )}

            {/* Quantity + Actions */}
            <div className="flex items-stretch gap-2.5 flex-wrap">
              {/* Quantity */}
              <div className="flex items-stretch border border-border">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 flex items-center justify-center hover:bg-muted transition-colors text-foreground"
                  aria-label="Decrease quantity"
                >
                  <Minus size={13} />
                </button>
                <span className="w-12 flex items-center justify-center text-sm font-semibold border-x border-border select-none">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-10 flex items-center justify-center hover:bg-muted transition-colors text-foreground"
                  aria-label="Increase quantity"
                >
                  <Plus size={13} />
                </button>
              </div>

              {/* Add to Cart */}
              <Button
                onClick={handleAddToCart}
                disabled={!selectedVariant || status === ProductStatus.OUT_OF_STOCK}
                className="flex-1 min-w-[130px] rounded-none gap-2 h-10"
              >
                <ShoppingCart size={15} />
                Add to Cart
              </Button>

              {/* Buy Now */}
              <Button
                variant="outline"
                disabled={!selectedVariant || status === ProductStatus.OUT_OF_STOCK}
                className="flex-1 min-w-[100px] rounded-none gap-2 h-10 border-foreground font-semibold hover:bg-foreground hover:text-background transition-colors"
              >
                <Zap size={15} />
                Buy Now
              </Button>
            </div>

            {/* Wishlist */}
            <button
              onClick={() => setIsWishlisted((w) => !w)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit group cursor-pointer"
            >
              <Heart
                size={16}
                className={`transition-colors ${
                  isWishlisted ? "fill-accent text-accent" : "group-hover:text-accent"
                }`}
              />
              {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Description / Specifications Tabs ── */}
      <div>
        <div className="container py-8">
          {/* Tab Header */}
          <div className="flex border-b border-border mb-8">
            {(["specifications", "description"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-semibold -mb-px border-b-2 capitalize transition-colors ${
                  activeTab === tab
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Description */}
          {activeTab === "description" && (
            <div className="prose prose-sm max-w-none text-foreground/80 [&_a]:text-tartiary [&_a:hover]:underline [&_img]:rounded-md [&_table]:w-full [&_table]:text-sm [&_th]:bg-muted [&_th]:p-2 [&_td]:p-2 [&_td]:border [&_td]:border-border [&_th]:border [&_th]:border-border">
              {description ? (
                <RichTextRenderer value={description} />
              ) : (
                <p>No description available.</p>
              )}
            </div>
          )}

          {/* Specifications */}
          {activeTab === "specifications" && (
            <div className="flex flex-col gap-8">
              {specifications && specifications.length > 0 ? (
                specifications.map((spec, i) => (
                  <div key={i}>
                    <h3 className="px-5 py-3 text-sm font-semibold text-tartiary bg-tartiary/5 rounded-md mb-2">
                      {spec.heading}
                    </h3>
                    <table className="w-full text-sm">
                      <tbody>
                        {spec.specifications.map((item, j) => (
                          <tr key={j} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                            <td className="py-3 px-5 font-medium text-muted-foreground w-1/3 align-top">
                              {item.name}
                            </td>
                            <td className="py-3 px-5 text-foreground align-top">{item.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No specifications available.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
