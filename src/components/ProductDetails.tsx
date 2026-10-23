import React, { useState } from 'react';
import { ColorFinish } from '../types/product';
import { COLOR_FINISHES, PRODUCT_SIZES, PRODUCT_BANDS, PRODUCT_SPECS, PRODUCT_FEATURES } from '../data/productData';
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  ShoppingBag,
  Zap,
  Check,
  ChevronRight,
  Sparkles,
  Heart,
  Plus,
  Minus,
  Info,
} from 'lucide-react';

interface ProductDetailsProps {
  selectedFinish: ColorFinish;
  onSelectFinish: (finish: ColorFinish) => void;
  selectedSize: string;
  onSelectSize: (size: string) => void;
  selectedBand: string;
  onSelectBand: (band: string) => void;
  onAddToCart: (quantity: number) => void;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({
  selectedFinish,
  onSelectFinish,
  selectedSize,
  onSelectSize,
  selectedBand,
  onSelectBand,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'specs' | 'features' | 'box'>('specs');

  // Calculate dynamic price based on selections
  const basePrice = 299;
  const currentSizeObj = PRODUCT_SIZES.find((s) => s.id === selectedSize) || PRODUCT_SIZES[0];
  const currentBandObj = PRODUCT_BANDS.find((b) => b.id === selectedBand) || PRODUCT_BANDS[0];
  const totalPrice = (basePrice + currentSizeObj.priceOffset + currentBandObj.priceOffset) * quantity;
  const originalPrice = 349 * quantity;

  const handleAdd = () => {
    setIsAdding(true);
    onAddToCart(quantity);
    setTimeout(() => {
      setIsAdding(false);
    }, 600);
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-xl mx-auto lg:max-w-none">
      {/* Product Title, Rating, Badge */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase rounded-md bg-sky-500/10 text-sky-400 border border-sky-500/20">
            Series 5 • Next-Gen
          </span>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> In Stock
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
          Smart Aero Watch
        </h1>

        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400" />
            ))}
          </div>
          <span className="font-semibold text-white">4.9</span>
          <span className="text-slate-400 hover:text-slate-200 cursor-pointer underline underline-offset-4">
            (2,840 verified reviews)
          </span>
        </div>
      </div>

      {/* Price & Offer */}
      <div className="flex items-baseline gap-3 pb-6 border-b border-white/5">
        <span className="text-3xl sm:text-4xl font-extrabold text-white">
          ${totalPrice}
        </span>
        <span className="text-xl text-slate-500 line-through">
          ${originalPrice}
        </span>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Save ${originalPrice - totalPrice} (Limited Launch)
        </span>
      </div>

      {/* Short Description */}
      <p className="text-slate-300 text-base leading-relaxed">
        Aerospace-grade sculpted alloy casing with a 3,000-nit edge-to-edge Retina AMOLED display,
        medical-grade ECG rhythm generation, and all-day fast magnetic wireless charging.
      </p>

      {/* 1. Color Selector (Core requirement: updates 3D model real-time) */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-slate-200">
            Case Finish:{' '}
            <span className="text-sky-400 font-bold">{selectedFinish.name}</span>
          </label>
          <span className="text-xs text-slate-400">PVD Hardened Anodized</span>
        </div>

        {/* Color buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {COLOR_FINISHES.map((finish) => {
            const isSelected = selectedFinish.id === finish.id;
            return (
              <button
                key={finish.id}
                onClick={() => onSelectFinish(finish)}
                className={`relative group p-1 rounded-full transition-all duration-200 ${
                  isSelected
                    ? 'ring-2 ring-sky-400 ring-offset-2 ring-offset-[#0c0e12] scale-105'
                    : 'hover:ring-1 hover:ring-white/30'
                }`}
                title={finish.name}
                aria-label={`Select ${finish.name}`}
              >
                <div
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/20 shadow-inner flex items-center justify-center transition-transform group-hover:scale-105"
                  style={{ backgroundColor: finish.hex }}
                >
                  {isSelected && (
                    <Check
                      className={`w-4 h-4 ${
                        finish.id === 'silver' ? 'text-slate-900' : 'text-white'
                      }`}
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>
        <p className="text-xs text-slate-400 italic">
          {selectedFinish.description}
        </p>
      </div>

      {/* 2. Case Size Selector */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-slate-200">Case Size</label>
          <span className="text-xs text-slate-400">Compare sizing</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {PRODUCT_SIZES.map((size) => {
            const isSelected = selectedSize === size.id;
            return (
              <button
                key={size.id}
                onClick={() => onSelectSize(size.id)}
                className={`flex flex-col items-start p-3.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-sky-500/10 border-sky-500 text-white shadow-md shadow-sky-500/10'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20 hover:bg-white/[0.07]'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-base font-bold">{size.name}</span>
                  {size.priceOffset > 0 && (
                    <span className="text-xs font-semibold text-sky-400">+${size.priceOffset}</span>
                  )}
                </div>
                <span className="text-xs text-slate-400 mt-1">{size.dimension}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Band Style Selector */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-slate-200">Band Collection</label>
          <span className="text-xs text-slate-400">Interchangeable Quick-Release</span>
        </div>
        <div className="flex flex-col gap-2">
          {PRODUCT_BANDS.map((band) => {
            const isSelected = selectedBand === band.id;
            return (
              <button
                key={band.id}
                onClick={() => onSelectBand(band.id)}
                className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-sky-500/10 border-sky-500 text-white'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20'
                }`}
              >
                <div>
                  <div className="text-sm font-semibold">{band.name}</div>
                  <div className="text-xs text-slate-400">{band.subtitle}</div>
                </div>
                <div className="text-xs font-bold text-sky-400">
                  {band.priceOffset === 0 ? 'Included' : `+$${band.priceOffset}`}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Quantity & CTA Add To Cart Button */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        {/* Quantity Controls */}
        <div className="flex items-center justify-between w-full sm:w-auto bg-white/5 border border-white/10 rounded-xl p-1">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="p-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-40"
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="px-4 text-sm font-bold text-white min-w-8 text-center font-mono">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="p-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Add to Cart Primary Button */}
        <button
          onClick={handleAdd}
          disabled={isAdding}
          className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-sky-500 via-sky-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-base shadow-xl shadow-sky-500/25 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
        >
          {isAdding ? (
            <Check className="w-5 h-5 text-white animate-bounce" />
          ) : (
            <ShoppingBag className="w-5 h-5" />
          )}
          <span>{isAdding ? 'Adding to Bag...' : `Add to Cart • $${totalPrice}`}</span>
        </button>
      </div>

      {/* Trust & Shipping Badges */}
      <div className="grid grid-cols-3 gap-2 py-4 border-y border-white/5 text-center">
        <div className="flex flex-col items-center gap-1 text-slate-400">
          <Truck className="w-4 h-4 text-sky-400" />
          <span className="text-[11px] font-medium">Free Global Express</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-slate-400 border-x border-white/5">
          <RotateCcw className="w-4 h-4 text-sky-400" />
          <span className="text-[11px] font-medium">30-Day Free Returns</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-slate-400">
          <ShieldCheck className="w-4 h-4 text-sky-400" />
          <span className="text-[11px] font-medium">2-Year Aura Warranty</span>
        </div>
      </div>

      {/* Tabs: Specifications & Highlights */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4 border-b border-white/10 pb-2">
          <button
            onClick={() => setActiveTab('specs')}
            className={`text-sm font-semibold pb-1.5 transition-colors relative ${
              activeTab === 'specs' ? 'text-sky-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            Full Specifications
            {activeTab === 'specs' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-sky-400 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('features')}
            className={`text-sm font-semibold pb-1.5 transition-colors relative ${
              activeTab === 'features' ? 'text-sky-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            Engineering Highlights
            {activeTab === 'features' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-sky-400 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('box')}
            className={`text-sm font-semibold pb-1.5 transition-colors relative ${
              activeTab === 'box' ? 'text-sky-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            In the Box
            {activeTab === 'box' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-sky-400 rounded-full" />
            )}
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'specs' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {PRODUCT_SPECS.map((spec, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-white/[0.03] border border-white/5">
                <div className="text-slate-400 font-medium mb-0.5">{spec.label}</div>
                <div className="text-slate-200 font-semibold">{spec.value}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'features' && (
          <div className="grid grid-cols-1 gap-2.5">
            {PRODUCT_FEATURES.map((feat, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{feat.title}</h4>
                  <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'box' && (
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col gap-2.5 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Smart Aero Watch Case ({selectedSize}) in {selectedFinish.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{currentBandObj.name} (Quick-release pins)</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Braided Magnetic Fast-Charging USB-C Cable (1m)</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Quick Start Manual & 2-Year International Warranty Documentation</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
