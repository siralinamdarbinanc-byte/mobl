import React, { useState } from 'react';
import { SofaModelType, WoodFinish, FabricMaterial } from '../types/furniture';
import { SOFA_MODELS } from '../data/furnitureData';
import { X, Bookmark, Copy, Check, Download, Share2, Sparkles } from 'lucide-react';

interface SaveConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  modelType: SofaModelType;
  wood: WoodFinish;
  fabric: FabricMaterial;
  customTextureUrl?: string;
  totalPrice: number;
}

export const SaveConfigModal: React.FC<SaveConfigModalProps> = ({
  isOpen,
  onClose,
  modelType,
  wood,
  fabric,
  customTextureUrl,
  totalPrice,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentModel = SOFA_MODELS.find((m) => m.id === modelType) || SOFA_MODELS[0];
  const configId = `ARK-${modelType === '1-seater' ? '1S' : '3S'}-${wood.id.substring(0, 3).toUpperCase()}-${fabric.id.substring(0, 3).toUpperCase()}`;
  const shareableUrl = `${window.location.origin}?config=${configId}&m=${modelType}&w=${wood.id}&f=${fabric.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadSpec = () => {
    const specContent = `=====================================================
ARIKAN ROYAL WOOD GALLERY - BESPOKE CONFIGURATION
=====================================================
Configuration Code: ${configId}
Date: ${new Date().toLocaleDateString()}
Piece: ${currentModel.nameEn} (${currentModel.nameFa})
Dimensions: ${currentModel.dimensions}

WOOD FINISH:
- Selection: ${wood.nameEn} (${wood.nameFa})
- Origin: ${wood.origin}
- Care: ${wood.care}

FABRIC & UPHOLSTERY:
- Selection: ${customTextureUrl ? 'Custom User Upload' : fabric.nameEn} (${fabric.nameFa})
- Origin: ${fabric.origin}
- Care: ${fabric.care}

INVESTMENT TOTAL: $${totalPrice.toLocaleString()} USD
ATELIER DELIVERY ESTIMATE: 25-30 Business Days
WARRANTY: 10-Year Master Frame Guarantee
=====================================================`;

    const blob = new Blob([specContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ARIKAN-Royal-Furniture-${configId}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-md bg-[#12141a] border border-[#d4af37]/40 rounded-3xl p-6 shadow-2xl text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-[#d4af37] text-xs font-bold uppercase tracking-wider font-serif-royal mb-2">
          <Bookmark className="w-4 h-4" />
          <span>Save & Export Design</span>
        </div>

        <h3 className="text-xl font-bold font-serif-royal text-white mb-4">
          ذخیره پیش‌طرح سلطنتی
        </h3>

        {/* Spec Overview */}
        <div className="p-4 rounded-xl bg-black/50 border border-white/10 space-y-2 text-xs mb-5">
          <div className="flex justify-between">
            <span className="text-slate-400">Config Code:</span>
            <span className="text-[#d4af37] font-mono font-bold">{configId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Model:</span>
            <span className="text-white font-medium">{currentModel.nameEn}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Wood Finish:</span>
            <span className="text-white font-medium">{wood.nameEn}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Fabric:</span>
            <span className="text-white font-medium">
              {customTextureUrl ? 'Custom Pattern Upload' : fabric.nameEn}
            </span>
          </div>
          <div className="flex justify-between pt-2 border-t border-white/10 font-bold">
            <span className="text-slate-400">Total Price:</span>
            <span className="text-[#d4af37] text-sm">${totalPrice.toLocaleString()}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleCopyLink}
            className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-[#d4af37]/40 text-[#d4af37] text-xs font-bold font-serif-royal transition-all flex items-center justify-center gap-2"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Link Copied to Clipboard!' : 'Copy Shareable Configuration Link'}</span>
          </button>

          <button
            onClick={handleDownloadSpec}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-black font-extrabold text-xs font-serif-royal shadow-lg shadow-[#d4af37]/20 transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download Official Spec Dossier (.txt)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
