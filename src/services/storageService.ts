import { storage } from "@/lib/storage";
import { DEFAULT_PRODUCTS } from "@/data/defaultProducts";
import { DEFAULT_BUSINESS_INFO } from "@/data/businessInfo";
import type { SignageProduct } from "@/types/signage";
import type { BusinessInfo, DocumentSettings } from "@/types/settings";
import type { DocumentRecord } from "@/types/quote";

const STORAGE_KEYS = {
  PRODUCTS: "indie_sign_products",
  BUSINESS_INFO: "indie_sign_business_info",
  DOC_SETTINGS: "indie_sign_document_settings",
  DOCUMENTS: "indie_sign_documents",
} as const;

const DEFAULT_DOC_SETTINGS: DocumentSettings = {
  quotationPrefix: "QT-",
  invoicePrefix: "INV-",
  receiptPrefix: "REC-",
  defaultValidityDays: 15,
  defaultTerms: "1. ກຳນົດເວລາສົ່ງມອບ 7-14 ວັນລັດຖະການຫຼັງຢືນຢັນແບບ.\n2. ຈ່າຍມັດຈຳ 50% ເມື່ອສັ່ງຜະລິດ, ອີກ 50% ເມື່ອຕິດຕັ້ງສຳເລັດ.",
  defaultNotes: "ຂອບໃຈທີ່ເລືອກໃຊ້ບໍລິການຂອງ Indie Sign.",
};

export const storageService = {
  getProducts(): SignageProduct[] {
    return storage.get<SignageProduct[]>(STORAGE_KEYS.PRODUCTS, DEFAULT_PRODUCTS);
  },

  saveProducts(products: SignageProduct[]): void {
    storage.set(STORAGE_KEYS.PRODUCTS, products);
  },

  getBusinessInfo(): BusinessInfo {
    return storage.get<BusinessInfo>(STORAGE_KEYS.BUSINESS_INFO, DEFAULT_BUSINESS_INFO);
  },

  saveBusinessInfo(info: BusinessInfo): void {
    storage.set(STORAGE_KEYS.BUSINESS_INFO, info);
  },

  getDocumentSettings(): DocumentSettings {
    return storage.get<DocumentSettings>(STORAGE_KEYS.DOC_SETTINGS, DEFAULT_DOC_SETTINGS);
  },

  saveDocumentSettings(settings: DocumentSettings): void {
    storage.set(STORAGE_KEYS.DOC_SETTINGS, settings);
  },

  getDocuments(): DocumentRecord[] {
    return storage.get<DocumentRecord[]>(STORAGE_KEYS.DOCUMENTS, []);
  },

  saveDocuments(docs: DocumentRecord[]): void {
    storage.set(STORAGE_KEYS.DOCUMENTS, docs);
  },

  exportFullBackup(): void {
    const backupData = {
      version: "0.1.0",
      timestamp: new Date().toISOString(),
      businessInfo: this.getBusinessInfo(),
      documentSettings: this.getDocumentSettings(),
      products: this.getProducts(),
      documents: this.getDocuments(),
    };
    const dateStr = new Date().toISOString().slice(0, 10);
    storage.exportToJsonFile(backupData, `indie-sign-backup-${dateStr}.json`);
  },
};
