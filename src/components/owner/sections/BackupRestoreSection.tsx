/**
 * Indie Sign — BackupRestoreSection Component
 * JSON Backup export, atomic restore with metadata preview, and storage warnings.
 */

import React, { useState, useRef } from "react";
import {
  Download,
  Upload,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  FileCheck,
  ShieldCheck,
} from "lucide-react";
import { useOwnerSettings } from "@/context/OwnerSettingsContext";
import { formatDateISO } from "@/lib/documentNumbering";
import type { BackupPayload } from "@/types/ownerSettings";
import { validateBackupJson } from "@/lib/settingsStorage";
import { Button } from "@/components/ui/button";

export const BackupRestoreSection: React.FC = () => {
  const { settings, exportBackup, restoreBackup, resetToDefaults } = useOwnerSettings();

  const [previewPayload, setPreviewPayload] = useState<BackupPayload | null>(null);
  const [selectedFileContent, setSelectedFileContent] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [errorLao, setErrorLao] = useState<string>("");
  const [successLao, setSuccessLao] = useState<string>("");
  const [showConfirmRestore, setShowConfirmRestore] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ─── 1. Export JSON ───
  const handleExport = () => {
    try {
      const json = exportBackup();
      const blob = new Blob([json], { type: "application/json;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const today = formatDateISO(new Date());
      const filename = `indie-sign-backup-${today}.json`;

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setSuccessLao(`ສົ່ງອອກໄຟລ໌ ${filename} ສຳເລັດແລ້ວ!`);
      setTimeout(() => setSuccessLao(""), 4000);
    } catch {
      setErrorLao("ເກີດຂໍ້ຜິດພາດໃນການສົ່ງອອກໄຟລ໌ສຳຮອງ");
    }
  };

  // ─── 2. Handle File Selection & Preview ───
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorLao("");
    setSuccessLao("");
    setPreviewPayload(null);
    setShowConfirmRestore(false);

    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setSelectedFileContent(text);

      const val = validateBackupJson(text);
      if (!val.isValid || !val.payload) {
        setErrorLao(val.errorLao || "ໄຟລ໌ສຳຮອງບໍ່ຖືກຕ້ອງ");
      } else {
        setPreviewPayload(val.payload);
      }
    };
    reader.onerror = () => {
      setErrorLao("ບໍ່ສາມາດອ່ານໄຟລ໌ທີ່ເລືອກໄດ້");
    };
    reader.readAsText(file);
  };

  // ─── 3. Atomic Restore Execution ───
  const handleExecuteRestore = () => {
    if (!selectedFileContent) return;

    const res = restoreBackup(selectedFileContent);
    if (res.success) {
      setSuccessLao("ກູ້ຄືນຂໍ້ມູນສຳເລັດສົມບູນແລ້ວ! ຂໍ້ມູນທັງໝົດໄດ້ຮັບການອັບເດດແລ້ວ.");
      setPreviewPayload(null);
      setSelectedFileContent("");
      setFileName("");
      setShowConfirmRestore(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } else {
      setErrorLao(res.errorLao || "ເກີດຂໍ້ຜິດພາດໃນການກູ້ຄືນຂໍ້ມູນ");
      setShowConfirmRestore(false);
    }
  };

  // ─── 4. Reset to Factory Defaults ───
  const handleExecuteReset = () => {
    resetToDefaults();
    setShowConfirmReset(false);
    setSuccessLao("ລ້າງຂໍ້ມູນ ແລະ ຕັ້ງຄ່າເລີ່ມຕົ້ນຂອງໂຄງການສຳເລັດແລ້ວ!");
    setTimeout(() => setSuccessLao(""), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-border">
        <h2 className="text-lg font-bold text-foreground">
          ສຳຮອງ ແລະ ກູ້ຄືນຂໍ້ມູນ (JSON Backup & Restore)
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          ສົ່ງອອກຂໍ້ມູນການຕັ້ງຄ່າ ແລະ ສິນຄ້າເປັນໄຟລ໌ JSON ສຳລັບເກັບຮັກສາ ຫຼື ຍ້າຍໄປໃຊ້ໃນ Browser ອື່ນ
        </p>
      </div>

      {/* Messages */}
      {errorLao && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 text-destructive text-xs font-semibold">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorLao}</span>
        </div>
      )}

      {successLao && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successLao}</span>
        </div>
      )}

      {/* Storage Warning Banner (Section 13 Requirement) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-300 space-y-2 text-xs">
        <div className="flex items-center gap-2 font-bold text-amber-950 dark:text-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <span>ຄຳເຕືອນສຳຄັນກ່ຽວກັບການຈັດເກັບຂໍ້ມູນ (Local Storage Warning)</span>
        </div>
        <p className="leading-relaxed">
          ຂໍ້ມູນທັງໝົດຂອງຮ້ານ (ລາຍການສິນຄ້າ, ລາຄາ, ແລະ ການຕັ້ງຄ່າ) ຖືກບັນທຶກຢູ່ໃນ <strong>Browser ນີ້ເທົ່ານັ້ນ</strong>. ຖ້າຫາກທ່ານລ້າງປະຫວັດການທ່ອງເວັບ (Clear Browser Cache/Data) ຫຼື ປ່ຽນເຄື່ອງຄອມພິວເຕີໃໝ່ ຂໍ້ມູນເຫຼົ່ານີ້ອາດຈະສູນຫາຍໄດ້. <strong>ກະລຸນາກົດສົ່ງອອກໄຟລ໌ JSON ສຳຮອງ (Export Backup) ໄວ້ເປັນປະຈຳ!</strong>
        </p>
        <p className="text-[11px] text-amber-800 dark:text-amber-400/90 pt-1 border-t border-amber-500/20">
          * ໝາຍເຫດ: ໄຟລ໌ຮູບພາບຜົນງານຕົວຈິງ (Portfolio Images) ຢູ່ໃນໂຟນເດີ <code>public/images/portfolio/</code> ຂອງໂຄງການ ບໍ່ໄດ້ຮວມຢູ່ໃນໄຟລ໌ JSON ນີ້. ທ່ານຕ້ອງສຳຮອງໂຟນເດີໂຄງການແຍກຕ່າງຫາກ.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Export Box */}
        <div className="p-5 rounded-2xl border border-border bg-card space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Download className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                1. ສົ່ງອອກໄຟລ໌ສຳຮອງ (Export JSON)
              </h3>
              <p className="text-[11px] text-muted-foreground">
                ດາວໂຫລດໄຟລ໌ .json ເກັບໄວ້ໃນຄອມພິວເຕີ
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-muted/30 text-xs space-y-1.5 text-muted-foreground">
            <p>• ຈຳນວນສິນຄ້າ: <strong>{settings.products.length}</strong> ລາຍການ</p>
            <p>• ຈຳນວນວັດສະດຸ: <strong>{settings.materials.length}</strong> ລາຍການ</p>
            <p>• ໃບປະເມີນທີ່ບັນທຶກ: <strong>{(settings.quoteHistory ?? []).length}</strong> ລາຍການ</p>
            <p>• ລະຫັດ PIN: <em>ບໍ່ມີການສົ່ງອອກ PIN ເພື່ອຄວາມປອດໄພ</em></p>
          </div>

          <Button
            type="button"
            onClick={handleExport}
            className="w-full text-xs font-bold h-10"
          >
            <Download className="h-4 w-4 mr-2" />
            ດາວໂຫລດໄຟລ໌ສຳຮອງ (Export Backup)
          </Button>
        </div>

        {/* 2. Restore Box */}
        <div className="p-5 rounded-2xl border border-border bg-card space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
              <Upload className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                2. ກູ້ຄືນຂໍ້ມູນ (Restore from JSON)
              </h3>
              <p className="text-[11px] text-muted-foreground">
                ເລືອກໄຟລ໌ .json ທີ່ເຄີຍສຳຮອງໄວ້ເພື່ອນຳເຂົ້າ
              </p>
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            accept=".json,application/json"
            onChange={handleFileChange}
            className="w-full text-xs text-muted-foreground file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-muted file:text-foreground hover:file:bg-muted/80 cursor-pointer"
          />

          {/* Backup Preview Card */}
          {previewPayload && (
            <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
                <FileCheck className="h-4 w-4" />
                <span>ກວດສອບໄຟລ໌ສຳຮອງ: ຖືກຕ້ອງສົມບູນ</span>
              </div>
              <div className="text-[11px] text-muted-foreground space-y-0.5">
                <p>ໄຟລ໌: <strong>{fileName}</strong></p>
                <p>ແອັບພລິເຄຊັນ: <strong>{previewPayload.appId}</strong> (v{previewPayload.backupVersion})</p>
                <p>ວັນທີສົ່ງອອກ: <strong>{new Date(previewPayload.exportedAt).toLocaleString()}</strong></p>
                <p>ສິນຄ້າໃນໄຟລ໌: <strong>{previewPayload.settings.products.length}</strong> ລາຍການ</p>
              </div>

              {/* Confirmation Step */}
              {showConfirmRestore ? (
                <div className="pt-2 border-t border-emerald-500/20 space-y-2">
                  <p className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold leading-tight">
                    ⚠ ຄຳເຕືອນ: ການກູ້ຄືນຈະຂຽນທັບຂໍ້ມູນສິນຄ້າ ແລະ ການຕັ້ງຄ່າທັງໝົດໃນ Browser ນີ້. ທ່ານແນ່ໃຈບໍ່?
                  </p>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleExecuteRestore}
                      className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-8"
                    >
                      ຢືນຢັນກູ້ຄືນ (Confirm Restore)
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowConfirmRestore(false)}
                      className="text-xs h-8"
                    >
                      ຍົກເລີກ
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setShowConfirmRestore(true)}
                  className="w-full text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white h-9 mt-1"
                >
                  <ShieldCheck className="h-4 w-4 mr-1.5" />
                  ດຳເນີນການກູ້ຄືນຂໍ້ມູນ (Restore Data)
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 3. Factory Reset Section */}
      <div className="p-5 rounded-2xl border border-destructive/30 bg-destructive/5 space-y-3">
        <h3 className="text-xs font-bold text-destructive uppercase tracking-wider flex items-center gap-2">
          <RotateCcw className="h-4 w-4" />
          ລ້າງຂໍ້ມູນ ແລະ ຕັ້ງຄ່າເລີ່ມຕົ້ນ (Reset to Defaults)
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          ຫາກທ່ານຕ້ອງການລ້າງຂໍ້ມູນທັງໝົດ ແລະ ກັບຄືນສູ່ຄ່າເລີ່ມຕົ້ນຂອງ Indie Sign (ສິນຄ້າ ແລະ ລາຄາມາດຕະຖານ).
        </p>

        {showConfirmReset ? (
          <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 space-y-2">
            <span className="text-xs text-destructive font-bold block">
              ທ່ານແນ່ໃຈແທ້ໆ ບໍ່ວ່າຕ້ອງການລ້າງຂໍ້ມູນທັງໝົດ? (ການຕັ້ງຄ່າທີ່ເຄີຍປັບຈະສູນຫາຍ)
            </span>
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={handleExecuteReset}
                className="text-xs font-bold h-8"
              >
                ແມ່ນ, ລ້າງຂໍ້ມູນດຽວນີ້
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowConfirmReset(false)}
                className="text-xs h-8"
              >
                ຍົກເລີກ
              </Button>
            </div>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowConfirmReset(true)}
            className="text-xs text-destructive border-destructive/30 hover:bg-destructive/10"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1" />
            ກັບຄືນສູ່ຄ່າເລີ່ມຕົ້ນຂອງໂຮງງານ (Factory Reset)
          </Button>
        )}
      </div>
    </div>
  );
};
