export type ProductCategory =
  | 'formal-footwear'
  | 'luxury-sneakers'
  | 'premium-boots'
  | 'designer-clothing'
  | 'accessories';

export type PaymentMethod = 'ecocash' | 'card';
export type DeliveryOption = 'pickup' | 'delivery';
export type OrderStatus = 'idle' | 'processing' | 'success' | 'failed';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  shortDescription: string;
  fullDescription: string;
  features: string[];
  sizes: string[];
  colors: string[];
  colorHexMap: Record<string, string>;
  icon: string;
  badge?: string;
  inStock: boolean;
  stockCount: number;
  checkoutEnabled: boolean;
  origin: string;
  brand: string;
  mockImages: string[];
  rating: number;
  reviewCount: number;
  sku: string;
  tags: string[];
}

export interface CategoryInfo {
  id: ProductCategory;
  label: string;
  iconName: string;
  description: string;
  heroColor: string;
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

export interface CheckoutFormData {
  paymentMethod: PaymentMethod;
  ecocashPhone: string;
  ecocashName: string;
  cardNumber: string;
  cardExpiry: string;
  cardCVV: string;
  cardName: string;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
  deliveryOption: DeliveryOption;
  deliveryAddress: string;
  deliveryCity: string;
  customerName: string;
  customerPhone: string;
}

export interface CheckoutFormErrors {
  ecocashPhone?: string;
  ecocashName?: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCVV?: string;
  cardName?: string;
  selectedSize?: string;
  selectedColor?: string;
  deliveryAddress?: string;
  customerName?: string;
  customerPhone?: string;
}

export interface TrustPillar {
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  badge: string;
}

export interface StoreInfo {
  name: string;
  tagline: string;
  bannerHeadline: string;
  slogan: string;
  address: string;
  whatsappClean: string;
  whatsappDisplay: string;
  facebookUrl: string;
  googleMapsUrl: string;
  email: string;
  hours: string;
  copyrightYear: number;
  trustPillars: TrustPillar[];
  featuredBrands: string[];
}

export interface OrderSummary {
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
  totalUSD: number;
  paymentMethod: PaymentMethod;
  deliveryOption: DeliveryOption;
  deliveryAddress?: string;
  customerName: string;
  customerPhone: string;
  orderRef: string;
  timestamp: string;
}
