import { ColorFinish } from '../types/product';

export const COLOR_FINISHES: ColorFinish[] = [
  {
    id: 'midnight',
    name: 'Midnight Black',
    hex: '#18181b',
    caseColor: '#1e2025',
    strapColor: '#131418',
    buckleColor: '#2b2d35',
    bezelColor: '#121315',
    metalness: 0.85,
    roughness: 0.25,
    description: 'Deep diamond-like carbon coating with stealth obsidian fluoroelastomer band.',
  },
  {
    id: 'rose-gold',
    name: 'Rose Gold',
    hex: '#d49b84',
    caseColor: '#c8806a',
    strapColor: '#cb8e7e',
    buckleColor: '#df9c87',
    bezelColor: '#ae6552',
    metalness: 0.9,
    roughness: 0.2,
    description: '18K warm rose gold aerospace aluminum with soft champagne sand strap.',
  },
  {
    id: 'silver',
    name: 'Silver Starlight',
    hex: '#e2e8f0',
    caseColor: '#d6dbe2',
    strapColor: '#b0b8c4',
    buckleColor: '#e2e8f0',
    bezelColor: '#c4cad3',
    metalness: 0.92,
    roughness: 0.18,
    description: 'Ultra-pure satin brushed aluminum chassis with cloud fog performance band.',
  },
  {
    id: 'ocean-blue',
    name: 'Ocean Cobalt',
    hex: '#2563eb',
    caseColor: '#1e3a5f',
    strapColor: '#1e40af',
    buckleColor: '#3b82f6',
    bezelColor: '#172554',
    metalness: 0.88,
    roughness: 0.22,
    description: 'Anodized deep marine blue finish paired with waterproof abyss diver band.',
  },
  {
    id: 'titanium',
    name: 'Titanium Slate',
    hex: '#475569',
    caseColor: '#475569',
    strapColor: '#334155',
    buckleColor: '#64748b',
    bezelColor: '#1e293b',
    metalness: 0.95,
    roughness: 0.3,
    description: 'Grade 5 aerospace titanium alloy with blasted ceramic matte micro-texture.',
  },
];

export const PRODUCT_SIZES = [
  { id: '41mm', name: '41mm', dimension: 'Fits 130–200mm wrists', priceOffset: 0 },
  { id: '45mm', name: '45mm', dimension: 'Fits 140–220mm wrists (Larger Display)', priceOffset: 30 },
];

export const PRODUCT_BANDS = [
  { id: 'sport', name: 'Sport Fluoroelastomer', subtitle: 'Ultra-soft, sweat-proof & flexible', priceOffset: 0 },
  { id: 'milanese', name: 'Milanese Mesh Loop', subtitle: 'Woven stainless steel magnetic clasp', priceOffset: 35 },
  { id: 'alpine', name: 'Alpine Braided Solo', subtitle: 'Ultralight stretch yarn with titanium G-hook', priceOffset: 25 },
];

export const PRODUCT_SPECS = [
  { label: 'Display', value: '1.92" LTPO AMOLED 3,000 nits peak brightness, 396x484 px' },
  { label: 'Materials', value: 'Aerospace Grade 5 Titanium case, Sapphire crystal front cover' },
  { label: 'Processor', value: 'Aura Dual-Core S9 SiP with 64-bit 4-core Neural Engine' },
  { label: 'Sensors', value: 'Blood Oxygen, ECG generator, Optical Heart Rate Gen 3, Depth Gauge' },
  { label: 'Battery', value: 'Up to 36 hours regular use / 72 hours in Low Power Mode' },
  { label: 'Charging', value: 'Fast USB-C magnetic charge: 0 to 80% in 45 minutes' },
  { label: 'Water Resistance', value: '50m (WR50) ISO standard 22810:2010 & High-Speed Water Sports' },
  { label: 'Connectivity', value: 'Wi-Fi 6E, Bluetooth 5.3, Precision Find Ultra-Wideband Gen 2' },
];

export const PRODUCT_FEATURES = [
  {
    title: 'Always-On Retina AMOLED',
    desc: 'Up to 3,000 nits edge-to-edge curved screen that remains effortless to read even in direct midday sunlight.',
    icon: 'Sparkles',
  },
  {
    title: 'Precision Vitality Suite',
    desc: 'Medical-grade ECG rhythm generation, blood oxygen saturation, and real-time stress monitoring.',
    icon: 'Heart',
  },
  {
    title: 'Aerospace Grade Casing',
    desc: 'Machined from a single block of aerospace alloy, tested against extreme thermal shocks and impacts.',
    icon: 'ShieldCheck',
  },
  {
    title: 'Supercharged 72h Stamina',
    desc: 'Optimized energy silicon with magnetic fast charging gives you 80% charge in a quick 45-minute boost.',
    icon: 'Zap',
  },
];
