import React from 'react';
import { Crown, Bookmark, ShoppingBag, PhoneCall, Sparkles } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onSaveConfig: () => void;
}

export const Header: React.FC<HeaderProps> = ({ cartCount, onOpenCart, onSaveConfig }) => {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-[#d4af37]/20 bg-[#0d0e12]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo & Royal Title */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#d4af37] via-[#f3e5ab] to-[#8c6512] flex items-center justify-center shadow-lg shadow-[#d4af37]/20 border border-[#f3e5ab]/40">
            <Crown className="w-6 h-6 text-black" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg sm:text-xl font-black tracking-wider text-white font-serif-royal flex items-center gap-2">
              ARIKAN <span className="text-[#d4af37] font-normal">Royal Wood</span>
            </span>
            <span className="text-[11px] text-amber-200/70 font-farsi tracking-normal">
              گالری منبت و مبلمان اشرافی سلطنتی آریكان
            </span>
          </div>
        </div>

        {/* Center Craftsmanship Badge */}
        <div className="hidden lg:flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 border border-[#d4af37]/30 text-xs text-amber-200">
          <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>Haute Ébénisterie • Master Hand-Carved Baroque Furniture</span>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Save Configuration Button */}
          <button
            onClick={onSaveConfig}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-[#d4af37]/30 text-amber-200 text-xs font-semibold transition-all hover:border-[#d4af37]"
            title="Save your current bespoke configuration"
          >
            <Bookmark className="w-4 h-4 text-[#d4af37]" />
            <span className="hidden sm:inline">Save Configuration</span>
          </button>

          {/* Shopping Cart / Order Bag */}
          <button
            onClick={onOpenCart}
            className="relative p-2.5 rounded-xl bg-[#d4af37]/10 hover:bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#d4af37] transition-all flex items-center justify-center group"
            aria-label="View Order Bag"
          >
            <ShoppingBag className="w-5 h-5 group-hover:scale-105 transition-transform" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-[#d4af37] text-black text-[11px] font-bold flex items-center justify-center shadow-md shadow-[#d4af37]/40">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
