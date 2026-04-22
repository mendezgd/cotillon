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

export type OrderStatus =
  | 'pendiente'             // esperando comprobante
  | 'comprobante_recibido'  // comprobante llegó, pago a verificar
  | 'confirmado'            // pago verificado, listo para despachar
  | 'enviado'               // en camino
  | 'cancelado';

export interface Order {
  id: string;           // = transactionId del backend simulado
  createdAt: string;    // ISO date string
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  shipping: ShippingAddress;
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  installments?: number;
  notes?: string;
}

export interface OrderSummary {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
}
