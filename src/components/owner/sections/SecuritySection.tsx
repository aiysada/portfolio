/**
 * Indie Sign — SecuritySection Component
 * Change owner PIN, view lockout settings, and understand frontend security scope.
 */

import React, { useState } from "react";
import { KeyRound, Eye, EyeOff, Check, AlertCircle, ShieldAlert, Lock } from "lucide-react";
import { useOwnerSettings } from "@/context/OwnerSettingsContext";
import { Button } from "@/components/ui/button";

export const SecuritySection: React.FC = () => {
  const { settings, changePin } = useOwnerSettings();

  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [showPins, setShowPins] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChangePin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!currentPin.trim()) {
      setErrorMsg("ກະລຸນາໃສ່ລະຫັດ PIN ປັດຈຸບັນ");
      return;
    }
    if (newPin.length < 4 || newPin.length > 8) {
      setErrorMsg("ລະຫັດ PIN ໃໝ່ຕ້ອງມີ 4 ຫາ 8 ຕົວເລກ");
      return;
    }
    if (newPin !== confirmPin) {
      setErrorMsg("ລະຫັດ PIN ໃໝ່ ແລະ ຢືນຢັນລະຫັດ ບໍ່ຕົງກັນ");
      return;
    }

    setIsLoading(true);
    try {
      const res = await changePin(currentPin.trim(), newPin.trim());
      if (res.success) {
        setSuccessMsg("ປ່ຽນລະຫັດ PIN ສຳເລັດແລ້ວ! ກະລຸນາຈົດຈຳລະຫັດໃໝ່ນີ້ໄວ້.");
        setCurrentPin("");
        setNewPin("");
        setConfirmPin("");
      } else {
        setErrorMsg(res.errorLao || "ເກີດຂໍ້ຜິດພາດໃນການປ່ຽນລະຫັດ PIN");
      }
    } catch {
      setErrorMsg("ເກີດຂໍ້ຜິດພາດໃນການປະມວນຜົນ");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-border">
        <h2 className="text-lg font-bold text-foreground">
          ຄວາມປອດໄພ ແລະ ລະຫັດ PIN (Security & PIN)
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          ປ່ຽນລະຫັດ PIN ສຳລັບເຂົ້າສູ່ລະບົບຈັດການ ແລະ ກວດເບິ່ງການຕັ້ງຄ່າຄວາມປອດໄພ
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Change PIN Form */}
        <div className="p-5 rounded-2xl border border-border bg-card space-y-4">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-primary" />
            ປ່ຽນລະຫັດ PIN ໃໝ່
          </h3>

          <form onSubmit={handleChangePin} className="space-y-3">
            <div>
              <label className="text-[11px] font-semibold text-foreground block mb-1">
                ລະຫັດ PIN ປັດຈຸບັນ *
              </label>
              <div className="relative">
                <input
                  type={showPins ? "text" : "password"}
                  maxLength={8}
                  inputMode="numeric"
                  required
                  value={currentPin}
                  onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, ""))}
                  placeholder="• • • •"
                  className="w-full text-xs bg-background border border-border rounded-lg p-2 font-mono font-bold"
                />
                <button
                  type="button"
                  onClick={() => setShowPins(!showPins)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPins ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-foreground block mb-1">
                ລະຫັດ PIN ໃໝ່ (4-8 ຕົວເລກ) *
              </label>
              <input
                type={showPins ? "text" : "password"}
                maxLength={8}
                inputMode="numeric"
                required
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ""))}
                placeholder="• • • •"
                className="w-full text-xs bg-background border border-border rounded-lg p-2 font-mono font-bold"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-foreground block mb-1">
                ຢືນຢັນລະຫັດ PIN ໃໝ່ *
              </label>
              <input
                type={showPins ? "text" : "password"}
                maxLength={8}
                inputMode="numeric"
                required
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ""))}
                placeholder="• • • •"
                className="w-full text-xs bg-background border border-border rounded-lg p-2 font-mono font-bold"
              />
            </div>

            {errorMsg && (
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-destructive/10 text-destructive text-xs font-medium">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-medium">
                <Check className="h-3.5 w-3.5 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading || !currentPin || newPin.length < 4}
              className="w-full text-xs font-bold"
            >
              {isLoading ? "ກຳລັງບັນທຶກ..." : "ຢືນຢັນການປ່ຽນລະຫັດ PIN"}
            </Button>
          </form>
        </div>

        {/* Lockout & Security Notice */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl border border-border bg-card space-y-3">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-amber-500" />
              ລະບົບປ້ອງກັນການສຸ່ມລະຫັດ (Brute-Force Protection)
            </h3>
            <ul className="text-xs text-muted-foreground space-y-2 list-disc pl-4 leading-relaxed">
              <li>
                <strong>ຈຳນວນຄັ້ງທີ່ອະນຸຍາດ:</strong> {settings.security.lockoutThreshold} ຄັ້ງ
              </li>
              <li>
                <strong>ໄລຍະລັອກຊົ່ວຄາວ:</strong> {settings.security.lockoutDurationSec} ວິນາທີ ເມື່ອໃສ່ຜິດເກີນກຳນົດ
              </li>
              <li>
                <strong>ການເຂົ້າລະຫັດ PIN:</strong> ລະຫັດ PIN ຈະຖືກ Hash ດ້ວຍລະບົບຄວາມປອດໄພກ່ອນບັນທຶກລົງ Browser (ບໍ່ມີການບັນທຶກເປັນ Plaintext).
              </li>
            </ul>
          </div>

          {/* Security Limitation Disclaimer (Mandatory Requirement) */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-200">
              <Lock className="h-4 w-4" />
              <span>ຂໍ້ຈຳກັດດ້ານຄວາມປອດໄພ (Security Disclosure)</span>
            </div>
            <p className="leading-relaxed">
              ລະບົບນີ້ເຮັດວຽກເທິງ Client-side (Local Browser) ໂດຍບໍ່ມີ Server ຖານຂໍ້ມູນກາງ. ລະຫັດ PIN ນີ້ມີຈຸດປະສົງພຽງເພື່ອເປັນ <strong>"ສິ່ງກີດຂວາງເບື້ອງຕົ້ນ"</strong> ປ້ອງກັນບໍ່ໃຫ້ບຸກຄົນທົ່ວໄປເປີດເບິ່ງ ຫຼື ແກ້ໄຂລາຄາໂດຍບັງເອີນເທົ່ານັ້ນ. ຜູ້ທີ່ມີຄວາມຮູ້ດ້ານໄອທີ ຫຼື ເຂົ້າເຖິງ Browser Developer Tools ໄດ້ ອາດຈະສາມາດກວດເບິ່ງ ຫຼື ຂ້າມລະຫັດຜ່ານນີ້ໄດ້.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
