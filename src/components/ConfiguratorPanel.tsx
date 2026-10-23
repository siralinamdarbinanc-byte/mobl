import React, { useState, useRef } from 'react';
import { SofaModelType, WoodFinish, FabricMaterial, ModelOption } from '../types/furniture';
import { SOFA_MODELS, WOOD_FINISHES, FABRIC_MATERIALS } from '../data/furnitureData';
import {
  Sparkles,
  Crown,
  Layers,
  Upload,
  Info,
  Check,
  ShieldCheck,
  HelpCircle,
  Clock,
  ArrowRight,
  Maximize2,
  Trash2,
} from 'lucide-react';

interface ConfiguratorPanelProps {
  modelType: SofaModelType;
  onSelectModel: (model: SofaModelType) => void;
  selectedWood: WoodFinish;
  onSelectWood: (wood: WoodFinish) => void;
  selectedFabric: FabricMaterial;
  onSelectFabric: (fabric: FabricMaterial) => void;
  customTextureUrl?: string;
  onUploadCustomTexture: (dataUrl: string | undefined) => void;
  totalPrice: number;
  onOpenOrderModal: () => void;
  onSaveConfig: () => void;
}

export const ConfiguratorPanel: React.FC<ConfiguratorPanelProps> = ({
  modelType,
  onSelectModel,
  selectedWood,
  onSelectWood,
  selectedFabric,
  onSelectFabric,
  customTextureUrl,
  onUploadCustomTexture,
  totalPrice,
  onOpenOrderModal,
  onSaveConfig,
}) => {
  const [activeTab, setActiveTab] = useState<'model' | 'wood' | 'fabric'>('model');
  const [hoveredMaterial, setHoveredMaterial] = useState<{
    nameEn: string;
    nameFa: string;
    origin: string;
    care: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentModel = SOFA_MODELS.find((m) => m.id === modelType) || SOFA_MODELS[0];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onUploadCustomTexture(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeCustomTexture = () => {
    onUploadCustomTexture(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full bg-[#12141a]/95 border border-[#d4af37]/20 rounded-2xl p-5 sm:p-6 flex flex-col gap-6 shadow-2xl backdrop-blur-md">
      {/* Header with Title & Price */}
      <div className="flex flex-col gap-2 pb-5 border-b border-white/10">
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-1 text-[11px] font-bold tracking-widest uppercase rounded-md bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30 flex items-center gap-1.5 font-serif-royal">
            <Crown className="w-3.5 h-3.5" />
            ARIKAN ATELIER
          </span>
          <span className="text-xs text-amber-200/70 font-farsi">
            دست‌ساز اصیل با منبت‌کاری دست
          </span>
        </div>

        <div className="flex items-baseline justify-between mt-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-serif-royal">
            {currentModel.nameEn}
          </h1>
          <div className="text-right">
            <div className="text-2xl sm:text-3xl font-black text-[#d4af37] font-serif-royal">
              ${totalPrice.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400">Custom Made to Order</div>
          </div>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed font-farsi">
          {currentModel.nameFa} • ابعاد: {currentModel.dimensions}
        </p>
      </div>

      {/* Tabs Switcher */}
      <div className="grid grid-cols-3 gap-1 p-1 bg-black/40 rounded-xl border border-white/5">
        <button
          onClick={() => setActiveTab('model')}
          className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'model'
              ? 'bg-[#d4af37] text-black shadow-md font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Crown className="w-3.5 h-3.5" />
          <span>1. Model</span>
        </button>

        <button
          onClick={() => setActiveTab('wood')}
          className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'wood'
              ? 'bg-[#d4af37] text-black shadow-md font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>2. Wood Finish</span>
        </button>

        <button
          onClick={() => setActiveTab('fabric')}
          className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'fabric'
              ? 'bg-[#d4af37] text-black shadow-md font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>3. Fabric & Tuft</span>
        </button>
      </div>

      {/* TAB 1: MODEL SWITCHER */}
      {activeTab === 'model' && (
        <div className="flex flex-col gap-3">
          <label className="text-xs font-bold text-amber-200/80 uppercase tracking-wider flex items-center justify-between">
            <span>Select Model Architecture</span>
            <span className="font-farsi font-normal text-slate-400">انتخاب مدل کاناپه</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SOFA_MODELS.map((model) => {
              const isSelected = modelType === model.id;
              return (
                <button
                  key={model.id}
                  onClick={() => onSelectModel(model.id)}
                  className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between gap-3 ${
                    isSelected
                      ? 'bg-[#d4af37]/10 border-[#d4af37] text-white shadow-lg shadow-[#d4af37]/10'
                      : 'bg-white/[0.03] border-white/10 text-slate-300 hover:border-white/20 hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="flex items-start justify-between w-full">
                    <div>
                      <div className="text-sm font-bold font-serif-royal">{model.nameEn}</div>
                      <div className="text-xs text-[#d4af37] font-farsi mt-0.5">{model.nameFa}</div>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-[#d4af37] text-black flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  <div className="text-[11px] text-slate-400 space-y-1">
                    <div>{model.dimensions}</div>
                    <div className="font-semibold text-white">${model.basePrice.toLocaleString()} Base</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: WOOD FINISHES & CARVINGS */}
      {activeTab === 'wood' && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-amber-200/80 uppercase tracking-wider">
              Wood & Carving Finish (منبت و چوب)
            </label>
            <span className="text-xs text-[#d4af37] font-serif-royal font-bold">
              {selectedWood.nameEn}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {WOOD_FINISHES.map((wood) => {
              const isSelected = selectedWood.id === wood.id;
              return (
                <button
                  key={wood.id}
                  onClick={() => onSelectWood(wood)}
                  onMouseEnter={() =>
                    setHoveredMaterial({
                      nameEn: wood.nameEn,
                      nameFa: wood.nameFa,
                      origin: wood.origin,
                      care: wood.care,
                    })
                  }
                  onMouseLeave={() => setHoveredMaterial(null)}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 relative overflow-hidden ${
                    isSelected
                      ? 'bg-[#d4af37]/15 border-[#d4af37] text-white shadow-md'
                      : 'bg-white/[0.02] border-white/10 text-slate-300 hover:border-white/20 hover:bg-white/[0.05]'
                  }`}
                >
                  {/* Color Swatch */}
                  <div
                    className="w-10 h-10 rounded-lg border border-white/20 shadow-inner shrink-0 relative flex items-center justify-center"
                    style={{ backgroundColor: wood.previewColor }}
                  >
                    {isSelected && (
                      <Check
                        className={`w-4 h-4 ${
                          wood.id === 'pearl-white-patina' ? 'text-black' : 'text-amber-300'
                        }`}
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold truncate text-white">{wood.nameEn}</div>
                    <div className="text-[11px] text-[#d4af37] font-farsi truncate">{wood.nameFa}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {wood.priceOffset === 0 ? 'Included' : `+$${wood.priceOffset}`}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: FABRIC & UPHOLSTERY */}
      {activeTab === 'fabric' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-amber-200/80 uppercase tracking-wider">
              Upholstery & Diamond Tufting (روکش و لمسه)
            </label>
            <span className="text-xs text-[#d4af37] font-serif-royal font-bold">
              {customTextureUrl ? 'Custom Fabric Pattern' : selectedFabric.nameEn}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {FABRIC_MATERIALS.map((fabric) => {
              const isSelected = selectedFabric.id === fabric.id && !customTextureUrl;
              return (
                <button
                  key={fabric.id}
                  onClick={() => {
                    onSelectFabric(fabric);
                    onUploadCustomTexture(undefined);
                  }}
                  onMouseEnter={() =>
                    setHoveredMaterial({
                      nameEn: fabric.nameEn,
                      nameFa: fabric.nameFa,
                      origin: fabric.origin,
                      care: fabric.care,
                    })
                  }
                  onMouseLeave={() => setHoveredMaterial(null)}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
                    isSelected
                      ? 'bg-[#d4af37]/15 border-[#d4af37] text-white shadow-md'
                      : 'bg-white/[0.02] border-white/10 text-slate-300 hover:border-white/20 hover:bg-white/[0.05]'
                  }`}
                >
                  {/* Fabric Swatch */}
                  <div
                    className="w-10 h-10 rounded-lg border border-white/20 shadow-md shrink-0 flex items-center justify-center"
                    style={{ background: fabric.previewGradient }}
                  >
                    {isSelected && <Check className="w-4 h-4 text-white" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold truncate text-white">{fabric.nameEn}</div>
                    <div className="text-[11px] text-[#d4af37] font-farsi truncate">{fabric.nameFa}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">+${fabric.priceOffset}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Custom Fabric Texture Upload Feature */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-[#d4af37]/30 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-[#d4af37]" />
                Upload Custom Fabric Texture
              </span>
              <span className="text-[10px] text-[#d4af37] font-farsi">طرح پارچه اختصاصی</span>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Upload your own textile image (floral, jacquard, or custom pattern) to render directly onto the 3D tufted cushions.
            </p>

            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="custom-fabric-input"
              />
              <label
                htmlFor="custom-fabric-input"
                className="flex-1 py-2 px-3 rounded-lg bg-gradient-to-r from-[#d4af37]/20 to-[#aa7c11]/30 hover:from-[#d4af37]/30 hover:to-[#aa7c11]/40 border border-[#d4af37]/40 text-amber-200 text-xs font-semibold text-center cursor-pointer transition-all flex items-center justify-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Choose Image (PNG/JPG)</span>
              </label>

              {customTextureUrl && (
                <button
                  onClick={removeCustomTexture}
                  className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-colors"
                  title="Remove custom texture"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {customTextureUrl && (
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                <Check className="w-3.5 h-3.5" />
                <span>Custom fabric active on 3D cushion</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Material Info Tooltip Card */}
      {hoveredMaterial && (
        <div className="p-3.5 rounded-xl bg-black/80 border border-[#d4af37]/40 text-xs space-y-1 animate-fade-in shadow-xl">
          <div className="flex items-center justify-between text-[#d4af37] font-bold">
            <span>{hoveredMaterial.nameEn}</span>
            <span className="font-farsi">{hoveredMaterial.nameFa}</span>
          </div>
          <div className="text-slate-300">
            <span className="text-slate-500 font-medium">Origin: </span>
            {hoveredMaterial.origin}
          </div>
          <div className="text-slate-400 text-[11px]">
            <span className="text-slate-500 font-medium">Care: </span>
            {hoveredMaterial.care}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-2.5 pt-2 border-t border-white/10">
        {/* Order Custom Configuration Button */}
        <button
          onClick={onOpenOrderModal}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa7c11] hover:from-[#f3e5ab] hover:to-[#d4af37] text-black font-extrabold text-sm sm:text-base font-serif-royal shadow-xl shadow-[#d4af37]/20 transition-all transform active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
        >
          <Crown className="w-4 h-4" />
          <span>ثبت سفارش سفارشی (Order Custom Build)</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Save Configuration & Share */}
        <button
          onClick={onSaveConfig}
          className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold transition-all flex items-center justify-center gap-2"
        >
          <span>Save & Download Configuration Sheet</span>
        </button>
      </div>

      {/* Trust & Craftsmanship Guarantees */}
      <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>10-Year Frame Warranty</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>Handcrafted in 25-30 Days</span>
        </div>
      </div>
    </div>
  );
};
