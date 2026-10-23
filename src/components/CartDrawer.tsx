import React from 'react';
import { SofaModelType, WoodFinish, FabricMaterial } from '../types/furniture';
import { X, Trash2, ShoppingBag, Crown, ArrowRight, ShieldCheck } from 'lucide-react';

export interface CartCommissionItem {
  id: string;
  modelType: SofaModelType;
  modelName: string;
  wood: WoodFinish;
  fabric: FabricMaterial;
  customTextureUrl?: string;
  price: number;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartCommissionItem[];
  onRemoveItem: (id: string) => void;
  onProceedToOrder: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onProceedToOrder,
}) => {
  if (!isOpen) return null;

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <div className="relative z-10 w-full max-w-md bg-[#101217] border-l border-[#d4af37]/30 h-full flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#151720]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#d4af37]" />
            <h3 className="text-base font-bold font-serif-royal text-white">
              Bespoke Commission Bag
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#d4af37]/20 text-[#d4af37] font-bold">
              {items.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items List */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-3 text-slate-500">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1 font-serif-royal">
              No Pieces in Commission Bag
            </h4>
            <p className="text-xs text-slate-400 mb-5 max-w-xs">
              Configure your royal armchair or sofa with custom carved woods and fabrics.
            </p>
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/30 text-[#d4af37] text-xs font-bold font-serif-royal hover:bg-[#d4af37]/25 transition-all"
            >
              Continue Customizing
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col gap-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold font-serif-royal text-white">
                        {item.modelName}
                      </h4>
                      <div className="text-xs text-[#d4af37] font-serif-royal font-bold mt-0.5">
                        ${item.price.toLocaleString()}
                      </div>
                    </div>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                      title="Remove piece"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-xs text-slate-400 space-y-1 bg-black/30 p-2.5 rounded-lg border border-white/5">
                    <div>Wood: <span className="text-slate-200 font-medium">{item.wood.nameEn}</span></div>
                    <div>Fabric: <span className="text-slate-200 font-medium">{item.customTextureUrl ? 'Custom Fabric Pattern' : item.fabric.nameEn}</span></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Summary */}
            <div className="p-5 border-t border-white/10 bg-[#14161f] space-y-3">
              <div className="flex justify-between items-baseline text-white">
                <span className="text-sm font-medium text-slate-400">Total Investment</span>
                <span className="text-2xl font-bold font-serif-royal text-[#d4af37]">
                  ${total.toLocaleString()}
                </span>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onProceedToOrder();
                }}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa7c11] text-black font-extrabold text-sm font-serif-royal shadow-lg shadow-[#d4af37]/20 flex items-center justify-center gap-2"
              >
                <span>Proceed to Order Finalization</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>White-Glove Delivery & Installation Included</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
