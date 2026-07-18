export type OrderStatus =
  | "Draft"
  | "Awaiting confirmation"
  | "Confirmed"
  | "On hold"
  | "Completed"
  | "Cancelled";

export type ProductionStatus =
  | "Not started"
  | "Cutting"
  | "Stitching"
  | "Finishing"
  | "Quality check"
  | "Ready for photography"
  | "Completed";

export type PaymentStatus =
  | "Unpaid"
  | "Advance paid"
  | "Partially paid"
  | "Paid"
  | "COD pending"
  | "Refunded";

export type MediaStatus =
  | "Not required"
  | "Photography pending"
  | "Images uploaded"
  | "AI processing"
  | "Internal review"
  | "Customer approval"
  | "Approved"
  | "Published";

export interface OrderSummary {
  id: string;
  customer: string;
  phone: string;
  article: string;
  source: string;
  total: number;
  dueDate: string;
  orderStatus: OrderStatus;
  productionStatus: ProductionStatus;
  paymentStatus: PaymentStatus;
  mediaStatus: MediaStatus;
}
