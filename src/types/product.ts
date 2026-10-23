export interface ColorFinish {
  id: string;
  name: string;
  hex: string;
  caseColor: string;
  strapColor: string;
  buckleColor: string;
  bezelColor: string;
  metalness: number;
  roughness: number;
  description: string;
}

export interface ProductOption {
  colors: ColorFinish[];
  sizes: { id: string; name: string; dimension: string; priceOffset: number }[];
  bands: { id: string; name: string; subtitle: string; priceOffset: number }[];
}

export interface CartItem {
  id: string;
  productName: string;
  color: ColorFinish;
  size: string;
  band: string;
  price: number;
  quantity: number;
  addedAt: number;
}
