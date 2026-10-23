import React, { useState } from 'react';
import { Header } from './components/Header';
import { FurnitureViewer } from './components/ThreeCanvas/FurnitureViewer';
import { ConfiguratorPanel } from './components/ConfiguratorPanel';
import { OrderModal } from './components/OrderModal';
import { SaveConfigModal } from './components/SaveConfigModal';
import { CartDrawer, CartCommissionItem } from './components/CartDrawer';
import { SofaModelType, WoodFinish, FabricMaterial } from './types/furniture';
import { SOFA_MODELS, WOOD_FINISHES, FABRIC_MATERIALS } from './data/furnitureData';
import {
  Crown,
  Sparkles,
  ShieldCheck,
  CheckCircle,
  Clock,
  Layers,
  Award,
  ChevronRight,
  Gem,
  Compass,
} from 'lucide-react';

export default function App() {
  // Configurator state
  const [modelType, setModelType] = useState<SofaModelType>('1-seater');
  const [selectedWood, setSelectedWood] = useState<WoodFinish>(WOOD_FINISHES[0]);
  const [selectedFabric, setSelectedFabric] = useState<FabricMaterial>(FABRIC_MATERIALS[0]);
  const [customTextureUrl, setCustomTextureUrl] = useState<string | undefined>(undefined);

  // Cart & Modals
  const [cartItems, setCartItems] = useState<CartCommissionItem[]>([]);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Current calculated price
  const currentModel = SOFA_MODELS.find((m) => m.id === modelType) || SOFA_MODELS[0];
  const totalPrice = currentModel.basePrice + selectedWood.priceOffset + selectedFabric.priceOffset;

  const handleAddToCart = () => {
    const newItem: CartCommissionItem = {
      id: `${modelType}-${selectedWood.id}-${selectedFabric.id}-${Date.now()}`,
      modelType,
      modelName: currentModel.nameEn,
      wood: selectedWood,
      fabric: selectedFabric,
      customTextureUrl,
      price: totalPrice,
      quantity: 1,
    };

    setCartItems((prev) => [...prev, newItem]);
    setToastMessage(`Added "${currentModel.nameEn}" to Commission Bag`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleOrderConfirmed = () => {
    handleAddToCart();
    setToastMessage('Bespoke Commission Dossier Submitted Successfully');
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="min-h-screen bg-[#0d0e12] text-slate-100 flex flex-col selection:bg-[#d4af37] selection:text-black">
      {/* 1. Luxury Header */}
      <Header
        cartCount={cartItems.length}
        onOpenCart={() => setIsCartOpen(true)}
        onSaveConfig={() => setIsSaveModalOpen(true)}
      />

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#141620]/95 border border-[#d4af37]/40 text-white shadow-2xl shadow-[#d4af37]/20 backdrop-blur-md animate-fade-in font-serif-royal">
          <CheckCircle className="w-5 h-5 text-[#d4af37] shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Main Studio Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 flex flex-col gap-12">
        {/* Main Split Screen Area */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: 3D Furniture Viewport (Col span 7) */}
          <div className="lg:col-span-7 w-full h-[520px] sm:h-[620px] lg:h-[720px] lg:sticky lg:top-24">
            <FurnitureViewer
              modelType={modelType}
              wood={selectedWood}
              fabric={selectedFabric}
              customTextureUrl={customTextureUrl}
            />
          </div>

          {/* Right Column: Interactive Configurator Panel (Col span 5) */}
          <div className="lg:col-span-5 w-full">
            <ConfiguratorPanel
              modelType={modelType}
              onSelectModel={setModelType}
              selectedWood={selectedWood}
              onSelectWood={setSelectedWood}
              selectedFabric={selectedFabric}
              onSelectFabric={setSelectedFabric}
              customTextureUrl={customTextureUrl}
              onUploadCustomTexture={setCustomTextureUrl}
              totalPrice={totalPrice}
              onOpenOrderModal={() => setIsOrderModalOpen(true)}
              onSaveConfig={() => setIsSaveModalOpen(true)}
            />
          </div>
        </section>

        {/* Heritage & Handcrafted Artistry Section */}
        <section className="pt-10 border-t border-[#d4af37]/20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold tracking-widest text-[#d4af37] uppercase font-serif-royal">
              Imperial Heritage & Master Monabbat
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 font-serif-royal">
              هنر منبت‌کاری اصیل و درودگری اشرافی
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2.5 font-farsi leading-relaxed">
              هر قطعه از مبلمان سلطنتی آریكان با بهره‌گیری از چوب‌های کهنسال جنگلی، منبت‌کاری دست‌ساز استادکاران برجسته و روکش‌های زریبافت کاخ‌های شاهی خلق می‌شود.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-gradient-to-b from-white/[0.04] to-transparent border border-white/5 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#d4af37]/15 text-[#d4af37] flex items-center justify-center">
                <Crown className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold font-serif-royal text-white">
                Hand-Carved Baroque Crests
              </h3>
              <p className="text-xs text-slate-300 font-farsi leading-relaxed">
                تاج‌های منبت‌کاری برجسته با نقوش اسلیمی، برگ کنگری و صدف‌های روکوکو که ساعت‌ها با هنر دست کنده کاری می‌شوند.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-b from-white/[0.04] to-transparent border border-white/5 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#d4af37]/15 text-[#d4af37] flex items-center justify-center">
                <Gem className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold font-serif-royal text-white">
                24K Florentine Gold Leaf
              </h3>
              <p className="text-xs text-slate-300 font-farsi leading-relaxed">
                ورق طلای عیار بالا با پتینه‌کاری آنتیک دستی که درخششی ماندگار و بافتی اعیانی به بدنه چوب می‌بخشد.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-b from-white/[0.04] to-transparent border border-white/5 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#d4af37]/15 text-[#d4af37] flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold font-serif-royal text-white">
                Deep Diamond Tufting
              </h3>
              <p className="text-xs text-slate-300 font-farsi leading-relaxed">
                لمسه‌کوبی الماس سنتی با دکمه‌های فلزی مخفی، فوم سرد قالبی با انعطاف بالا و دوخت دست‌دوز نوار لبه‌دوزی.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Modals & Drawers */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        modelType={modelType}
        wood={selectedWood}
        fabric={selectedFabric}
        customTextureUrl={customTextureUrl}
        totalPrice={totalPrice}
        onConfirmOrder={handleOrderConfirmed}
      />

      <SaveConfigModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        modelType={modelType}
        wood={selectedWood}
        fabric={selectedFabric}
        customTextureUrl={customTextureUrl}
        totalPrice={totalPrice}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemoveItem={handleRemoveCartItem}
        onProceedToOrder={() => setIsOrderModalOpen(true)}
      />

      {/* Luxury Footer */}
      <footer className="w-full border-t border-[#d4af37]/20 bg-[#090a0d] py-10 mt-12 text-xs text-slate-500 font-serif-royal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="font-bold text-[#d4af37]">ARIKAN Royal Wood Gallery</span>
            <span>• Atelier Ébénisterie Royale © 2026</span>
          </div>
          <div className="flex items-center gap-6 text-slate-400 text-[11px]">
            <span>Tehran • Florence • Paris</span>
            <span className="font-farsi">تلفن سفارشات VIP: ۰۲۱-۸۸۸۸۰۹۰۹</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
