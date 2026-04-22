export type Category =
  | 'globos'
  | 'decoracion'
  | 'disfraces'
  | 'cotillon'
  | 'piñatas'
  | 'todos';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: Category;
  stock: number;
  badge?: 'nuevo' | 'oferta' | 'popular';
  discountPercent?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  dni: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
}

export type PaymentMethod = 'mercadopago' | 'card' | 'transfer';

export interface PaymentData {
  paymentMethod: PaymentMethod;
  cardNumber?: string;
  cardHolder?: string;
  expiry?: string;
  cvv?: string;
  installments?: number;
}

export type PaymentStatus = 'idle' | 'processing' | 'success' | 'error';

export interface OrderSummary {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
}
