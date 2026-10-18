/**
 * Indie Sign — useCalculator hook
 * Manages the full calculator state, step navigation, and calculations.
 */

import { useState, useCallback, useMemo } from "react";
import type { CalculationInput, CalculationResult } from "@/types/signage";
import type { CustomerInfo, DocumentRecord, DocumentItem } from "@/types/quote";
import { DEFAULT_PRODUCTS, DEFAULT_MATERIALS } from "@/data/defaultProducts";
import { calculateSignagePrice } from "@/lib/calculator";
import { printQuotationAsPDF } from "@/services/pdfService";

export type CalcStep = 1 | 2 | 3 | 4 | 5;

export interface CalculatorState {
  // Step tracking
  currentStep: CalcStep;

  // Step 1: Product selection
  selectedProductId: string;

  // Step 2: Dimensions
  widthCm: number;
  heightCm: number;
  quantity: number;

  // Step 3: Material & options
  selectedMaterialId: string;
  hasLedLighting: boolean;
  ledType: string;
  installationRequired: boolean;
  notes: string;

  // Step 4: Results (computed)
  result: CalculationResult | null;

  // Step 5: Customer info for quotation
  customer: CustomerInfo;
}

const INITIAL_CUSTOMER: CustomerInfo = {
  name: "",
  company: "",
  phone: "",
  email: "",
  address: "",
};

const DEFAULT_STATE: CalculatorState = {
  currentStep: 1,
  selectedProductId: DEFAULT_PRODUCTS[0].id,
  widthCm: 100,
  heightCm: 50,
  quantity: 1,
  selectedMaterialId: "",
  hasLedLighting: false,
  ledType: "standard",
  installationRequired: false,
  notes: "",
  result: null,
  customer: INITIAL_CUSTOMER,
};

export function useCalculator() {
  const [state, setState] = useState<CalculatorState>(DEFAULT_STATE);

  const products = DEFAULT_PRODUCTS;
  const materials = DEFAULT_MATERIALS;

  // Derived: selected product and material objects
  const selectedProduct = useMemo(
    () => products.find((p) => p.id === state.selectedProductId) ?? products[0],
    [state.selectedProductId, products]
  );

  const selectedMaterial = useMemo(
    () =>
      state.selectedMaterialId
        ? materials.find((m) => m.id === state.selectedMaterialId)
        : undefined,
    [state.selectedMaterialId, materials]
  );

  // Filtered materials relevant to selected product category
  const compatibleMaterials = useMemo(() => {
    // Show materials that match the product category or all materials for generic
    return materials;
  }, [materials]);

  // --- State updaters ---
  const setStep = useCallback((step: CalcStep) => {
    setState((prev) => ({ ...prev, currentStep: step }));
  }, []);

  const setProductId = useCallback((id: string) => {
    setState((prev) => ({ ...prev, selectedProductId: id, selectedMaterialId: "" }));
  }, []);

  const setDimensions = useCallback(
    (widthCm: number, heightCm: number, quantity: number) => {
      setState((prev) => ({ ...prev, widthCm, heightCm, quantity }));
    },
    []
  );

  const setOptions = useCallback(
    (opts: {
      materialId: string;
      hasLedLighting: boolean;
      ledType: string;
      installationRequired: boolean;
      notes: string;
    }) => {
      setState((prev) => ({ ...prev, ...opts, selectedMaterialId: opts.materialId }));
    },
    []
  );

  const setCustomer = useCallback((customer: CustomerInfo) => {
    setState((prev) => ({ ...prev, customer }));
  }, []);

  // --- Navigation ---
  const goToStep = useCallback(
    (step: CalcStep) => {
      // Compute result when moving to step 4
      if (step === 4) {
        const input: CalculationInput = {
          widthCm: state.widthCm,
          heightCm: state.heightCm,
          quantity: state.quantity,
          materialId: state.selectedMaterialId,
          hasLedLighting: state.hasLedLighting,
          ledType: state.ledType,
          installationRequired: state.installationRequired,
          notes: state.notes,
        };
        const result = calculateSignagePrice(input, selectedProduct, selectedMaterial);
        setState((prev) => ({ ...prev, currentStep: step, result }));
      } else {
        setStep(step);
      }
    },
    [state, selectedProduct, selectedMaterial, setStep]
  );

  const nextStep = useCallback(() => {
    const next = Math.min(5, state.currentStep + 1) as CalcStep;
    goToStep(next);
  }, [state.currentStep, goToStep]);

  const prevStep = useCallback(() => {
    const prev = Math.max(1, state.currentStep - 1) as CalcStep;
    setStep(prev);
  }, [state.currentStep, setStep]);

  // --- Reset ---
  const reset = useCallback(() => {
    setState(DEFAULT_STATE);
  }, []);

  // --- Generate quotation document ---
  const generateQuotation = useCallback((): DocumentRecord | null => {
    if (!state.result) return null;

    const now = new Date();
    const validUntil = new Date(now);
    validUntil.setDate(validUntil.getDate() + 14);

    const items: DocumentItem[] = [
      {
        id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
        description: selectedProduct.title,
        descriptionLao: selectedProduct.titleLao,
        dimension: `${state.widthCm} × ${state.heightCm} ຊມ (${state.result.areaM2.toFixed(2)} m²)`,
        quantity: state.quantity,
        unitPrice: state.result.materialCost / state.quantity,
        total: state.result.materialCost,
      },
    ];

    if (state.result.lightingCost > 0) {
      items.push({
        id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + 1),
        description: `LED Lighting System (${state.ledType})`,
        descriptionLao: `ລະບົບໄຟ LED (${
          state.ledType === "standard"
            ? "ມາດຕະຖານ"
            : state.ledType === "highbright"
            ? "ຄວາມສະຫວ່າງສູງ"
            : state.ledType === "rgb"
            ? "RGB ປ່ຽນສີໄດ້"
            : "Neon Flex"
        })`,
        quantity: state.quantity,
        unitPrice: state.result.lightingCost / state.quantity,
        total: state.result.lightingCost,
      });
    }

    if (state.result.installationCost > 0) {
      items.push({
        id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + 2),
        description: "Installation Service",
        descriptionLao: "ຄ່າຕິດຕັ້ງໜ້າວຽກ",
        quantity: 1,
        unitPrice: state.result.installationCost,
        total: state.result.installationCost,
      });
    }

    const docNumber = `QT-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;

    return {
      id: docNumber,
      documentNumber: docNumber,
      type: "quotation",
      status: "draft",
      issueDate: now.toISOString(),
      validUntil: validUntil.toISOString(),
      customer: state.customer,
      items,
      subtotal: state.result.subtotal,
      discount: state.result.discount > 0 ? state.result.discount : undefined,
      total: state.result.total,
      notes: state.notes || "ໃບສະເໜີລາຄານີ້ເປັນການປະເມີນເບື້ອງຕົ້ນ ລາຄາສຸດທ້າຍອາດມີການປ່ຽນແປງຕາມຂໍ້ກຳນົດໜ້າວຽກ.",
      terms: "ການຊຳລະ 50% ລ່ວງໜ້າ ໂດຍຫຼັງຈາກຢືນຢັນການສັ່ງ. ສ່ວນທີ່ເຫຼືອຊຳລະເມື່ອຮັບສິນຄ້າ.",
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };
  }, [state, selectedProduct]);

  // --- Print PDF ---
  const printPDF = useCallback(() => {
    const doc = generateQuotation();
    if (doc) {
      printQuotationAsPDF(doc);
    }
  }, [generateQuotation]);

  return {
    state,
    products,
    materials: compatibleMaterials,
    selectedProduct,
    selectedMaterial,
    // Actions
    setProductId,
    setDimensions,
    setOptions,
    setCustomer,
    goToStep,
    nextStep,
    prevStep,
    reset,
    generateQuotation,
    printPDF,
  };
}
