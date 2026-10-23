import React, { useState } from 'react';
import { SofaModelType, WoodFinish, FabricMaterial } from '../types/furniture';
import { SOFA_MODELS } from '../data/furnitureData';
import { X, Crown, CheckCircle2, ShieldCheck, Clock, Phone, MapPin, User, FileText } from 'lucide-react';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  modelType: SofaModelType;
  wood: WoodFinish;
  fabric: FabricMaterial;
  customTextureUrl?: string;
  totalPrice: number;
  onConfirmOrder: () => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  modelType,
  wood,
  fabric,
  customTextureUrl,
  totalPrice,
  onConfirmOrder,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const currentModel = SOFA_MODELS.find((m) => m.id === modelType) || SOFA_MODELS[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      onConfirmOrder();
    }, 1200);
  };

  const handleFinish = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-xl bg-[#12141a] border border-[#d4af37]/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/90 text-slate-100 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center text-center py-6">
            <div className="w-16 h-16 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#d4af37] flex items-center justify-center mb-4">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <h3 className="text-2xl font-bold font-serif-royal text-white mb-1">
              سفارش سلطنتی شما با موفقیت ثبت شد
            </h3>
            <p className="text-xs text-amber-200/80 font-serif-royal uppercase tracking-wider mb-4">
              Bespoke Order Request Confirmed
            </p>

            <div className="w-full p-4 rounded-2xl bg-black/50 border border-white/10 text-left text-xs space-y-2 mb-6">
              <div className="flex justify-between">
                <span className="text-slate-400">Order Reference:</span>
                <span className="text-[#d4af37] font-bold font-mono">ARK-ROYAL-9842</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Configured Piece:</span>
                <span className="text-white font-medium">{currentModel.nameEn}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Carving Wood:</span>
                <span className="text-white font-medium">{wood.nameEn}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Fabric Finish:</span>
                <span className="text-white font-medium">
                  {customTextureUrl ? 'Custom Pattern Upload' : fabric.nameEn}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/10 font-bold">
                <span className="text-slate-300">Estimated Total:</span>
                <span className="text-[#d4af37] font-serif-royal text-sm">${totalPrice.toLocaleString()}</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 font-farsi mb-6 leading-relaxed max-w-md">
              کارشناس ارشد گالری آریكان جهت تایید نهایی ابعاد، چیدمان پارچه و ارسال نمونه سمپل رنگ با شماره شما تماس خواهد گرفت.
            </p>

            <button
              onClick={handleFinish}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-black font-extrabold text-sm font-serif-royal shadow-lg shadow-[#d4af37]/20"
            >
              بازگشت به گالری سه بعدی (Return to Configurator)
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-[#d4af37] text-xs font-bold uppercase tracking-wider font-serif-royal">
                <Crown className="w-4 h-4" />
                <span>Bespoke Commission Order</span>
              </div>
              <h2 className="text-2xl font-bold font-serif-royal text-white">
                ثبت سفارش سفارشی مبلمان سلطنتی
              </h2>
              <p className="text-xs text-slate-400">
                Submit your bespoke order directly to the master carvers atelier.
              </p>
            </div>

            {/* Selected Configuration Summary Box */}
            <div className="p-4 rounded-2xl bg-black/40 border border-[#d4af37]/30 flex flex-col gap-2.5 text-xs">
              <div className="flex justify-between items-center text-sm font-bold text-white border-b border-white/10 pb-2">
                <span>{currentModel.nameEn}</span>
                <span className="text-[#d4af37] font-serif-royal">${totalPrice.toLocaleString()}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-slate-300">
                <div>
                  <span className="text-slate-500">Wood Finish: </span>
                  <span className="text-white font-medium">{wood.nameEn}</span>
                </div>
                <div>
                  <span className="text-slate-500">Upholstery: </span>
                  <span className="text-white font-medium">
                    {customTextureUrl ? 'Custom Pattern Upload' : fabric.nameEn}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Dimensions: </span>
                  <span className="text-white font-medium">{currentModel.dimensions}</span>
                </div>
                <div className="flex items-center gap-1 text-amber-200">
                  <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>25-30 Business Days</span>
                </div>
              </div>
            </div>

            {/* Client Details Form */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Full Name / نام و نام خانوادگی
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Master Alexander / مهندس رادمنش"
                    className="w-full pl-9 pr-3 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-600 focus:border-[#d4af37] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Phone Number / شماره تماس
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+98 912 ... / +1 ..."
                      className="w-full pl-9 pr-3 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-600 focus:border-[#d4af37] outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    City / Destination / شهر و کشور
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Tehran, Dubai, Paris..."
                      className="w-full pl-9 pr-3 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-600 focus:border-[#d4af37] outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Custom Carving or Sizing Notes / توضیحات اختصاصی منبت یا ابعاد
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any custom gold leaf leafing requests, custom embroidery initials, or room specifications..."
                  className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-600 focus:border-[#d4af37] outline-none"
                />
              </div>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa7c11] hover:from-[#f3e5ab] hover:to-[#d4af37] text-black font-bold text-sm font-serif-royal shadow-xl shadow-[#d4af37]/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {isSubmitting ? (
                <span>Generating Order Dossier...</span>
              ) : (
                <span>ثبت نهایی سفارش اختصاصی (Confirm Bespoke Order)</span>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
              <span>Complimentary On-Site White Glove Delivery & 10-Year Guarantee</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
