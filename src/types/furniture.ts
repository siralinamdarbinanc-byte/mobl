export type SofaModelType = '1-seater' | '3-seater';

export interface WoodFinish {
  id: string;
  nameEn: string;
  nameFa: string;
  color: string;
  secondaryColor?: string;
  metalness: number;
  roughness: number;
  clearcoat?: number;
  clearcoatRoughness?: number;
  priceOffset: number;
  origin: string;
  care: string;
  textureType: 'walnut' | 'gold_leaf' | 'pearl_patina' | 'beechwood';
  previewColor: string;
}

export interface FabricMaterial {
  id: string;
  nameEn: string;
  nameFa: string;
  color: string;
  sheenColor?: string;
  sheen?: number;
  roughness: number;
  metalness: number;
  priceOffset: number;
  origin: string;
  care: string;
  patternType: 'velvet' | 'damask' | 'silk' | 'leather' | 'custom';
  customTextureUrl?: string;
  previewGradient: string;
}

export interface ModelOption {
  id: SofaModelType;
  nameEn: string;
  nameFa: string;
  dimensions: string;
  basePrice: number;
  descriptionFa: string;
  descriptionEn: string;
}

export interface SavedConfiguration {
  id: string;
  model: SofaModelType;
  woodId: string;
  fabricId: string;
  totalPrice: number;
  date: string;
  previewThumbnail?: string;
}
