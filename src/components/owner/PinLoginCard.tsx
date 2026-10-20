/**
 * Indie Sign — PinLoginCard Component
 * Secure PIN entry for Owner Settings with show/hide, lockout handling, and security disclosure.
 */

import React, { useState } from "react";
import { Lock, Eye, EyeOff, ShieldAlert, KeyRound, AlertCircle } from "lucide-react";
import { useOwnerSettings } from "@/context/OwnerSettingsContext";
import { Button } from "@/components/ui/button";

export const PinLoginCard: React.FC = () => {
  const { loginWithPin, isLockedOut, lockoutRemainingSec } = useOwnerSettings();
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [errorLao, setErrorLao] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) return;

    setIsLoading(true);
    setErrorLao("");
    try {
      const result = await loginWithPin(pin.trim());
      if (!result.success) {
        setErrorLao(result.errorLao || "ລະຫັດ PIN ບໍ່ຖືກຕ້ອງ");
        setPin("");
      }
    } catch {
      setErrorLao("ເກີດຂໍ້ຜິດພາດໃນການເຂົ້າສູ່ລະບົບ");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-6 sm:p-8 rounded-3xl border border-border bg-card shadow-xl shadow-black/5 font-lao">
      <div className="text-center mb-6">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-3">
          <KeyRound className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-bold text-foreground">
          ລະບົບຈັດການເຈົ້າຂອງຮ້ານ (Owner Administration)
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          ກະລຸນາໃສ່ລະຫັດ PIN ເພື່ອເຂົ້າເຖິງການຕັ້ງຄ່າທຸລະກິດ ແລະ ລາຄາສິນຄ້າ
        </p>
      </div>

      {/* Lockout Warning */}
      {isLockedOut ? (
        <div className="mb-5 p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-center space-y-2">
          <ShieldAlert className="h-6 w-6 text-destructive mx-auto" />
          <h3 className="text-xs font-bold text-destructive">
            ລະບົບຖືກລັອກຊົ່ວຄາວ (Temporary Lockout)
          </h3>
          <p className="text-xs text-muted-foreground">
            ໃສ່ລະຫັດຜິດເກີນກຳນົດ, ກະລຸນາລໍຖ້າອີກ{" "}
            <span className="font-bold text-destructive text-sm">
              {lockoutRemainingSec}
            </span>{" "}
            ວິນາທີ
          </p>
        </div>
      ) : (
        /* PIN Entry Form */
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              ລະຫັດ PIN 4-8 ຕົວເລກ:
            </label>
            <div className="relative">
              <input
                type={showPin ? "text" : "password"}
                maxLength={8}
                inputMode="numeric"
                autoFocus
                placeholder="• • • •"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                className="w-full h-12 bg-background border border-border rounded-xl px-4 text-center text-xl tracking-widest text-foreground font-mono font-bold focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                title={showPin ? "ເຊື່ອງລະຫັດ" : "ສະແດງລະຫັດ"}
              >
                {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1.5 text-center">
              ລະຫັດເລີ່ມຕົ້ນຂອງໂຄງການ: <code className="font-mono font-bold text-primary">1234</code>
            </p>
          </div>

          {errorLao && (
            <div className="flex items-center gap-1.5 p-2.5 rounded-xl bg-destructive/10 text-destructive text-xs font-medium">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorLao}</span>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading || pin.length < 4}
            className="w-full h-11 text-xs font-bold rounded-xl"
          >
            {isLoading ? "ກຳລັງກວດສອບ..." : "ເຂົ້າສູ່ລະບົບ (Unlock)"}
          </Button>
        </form>
      )}

      {/* Security Disclaimer (Section 3 Requirement) */}
      <div className="mt-6 pt-5 border-t border-border/60 text-[11px] text-muted-foreground leading-relaxed">
        <div className="flex items-start gap-1.5 text-amber-700 dark:text-amber-400 bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
          <Lock className="h-3.5 w-3.5 shrink-0 mt-0.5" />
          <p>
            <strong>ແຈ້ງເຕືອນຄວາມປອດໄພ:</strong> ແອັບພລິເຄຊັນນີ້ເຮັດວຽກເທິງ Browser ໂດຍບໍ່ມີ Backend Server. ລະຫັດ PIN ເປັນພຽງການປ້ອງກັນເບື້ອງຕົ້ນເທົ່ານັ້ນ (Casual access barrier) ບໍ່ຄວນໃຊ້ເກັບຮັກສາຂໍ້ມູນລັບສຸດຍອດ.
          </p>
        </div>
      </div>
    </div>
  );
};
