export interface BusinessInfo {
  name: string;
  nameLao: string;
  tagline: string;
  taglineLao: string;
  phone: string;
  secondaryPhone?: string;
  email: string;
  address: string;
  addressLao: string;
  taxId?: string;
  bankName?: string;
  bankAccountName?: string;
  bankAccountNumber?: string;
  qrCodeUrl?: string;
  logoUrl?: string;
}

export interface DocumentSettings {
  quotationPrefix: string;
  invoicePrefix: string;
  receiptPrefix: string;
  defaultValidityDays: number;
  defaultTerms: string;
  defaultNotes: string;
}

export interface AppSettings {
  businessInfo: BusinessInfo;
  documentSettings: DocumentSettings;
  currency: string;
  currencySymbol: string;
  language: "lo" | "en";
}
