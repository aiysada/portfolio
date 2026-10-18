export type DocumentType = "quotation" | "invoice" | "receipt";

export type DocumentStatus = "draft" | "pending" | "approved" | "paid" | "cancelled";

export interface CustomerInfo {
  name: string;
  company?: string;
  phone: string;
  email?: string;
  address?: string;
}

export interface DocumentItem {
  id: string;
  description: string;
  descriptionLao: string;
  dimension?: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface DocumentRecord {
  id: string;
  documentNumber: string;
  type: DocumentType;
  status: DocumentStatus;
  issueDate: string;
  validUntil?: string;
  customer: CustomerInfo;
  items: DocumentItem[];
  subtotal: number;
  taxRate?: number;
  taxAmount?: number;
  discount?: number;
  total: number;
  notes?: string;
  terms?: string;
  createdAt: string;
  updatedAt: string;
}
