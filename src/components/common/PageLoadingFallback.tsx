/**
 * Indie Sign — PageLoadingFallback Component
 * Accessible, branded loading placeholder for lazy-loaded routes.
 */

import { Loader2 } from "lucide-react";

export function PageLoadingFallback() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[50vh] flex-col items-center justify-center p-8 text-center"
    >
      <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
      <p className="mt-4 text-xs font-semibold text-muted-foreground animate-pulse">
        ກຳລັງໂຫຼດຂໍ້ມູນ...
      </p>
      <span className="sr-only">ກຳລັງໂຫຼດໜ້າເວັບ</span>
    </div>
  );
}
