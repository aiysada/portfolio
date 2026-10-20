import { Link } from "react-router-dom";
import { AlertCircle, Home, ArrowLeft, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
        <AlertCircle className="h-12 w-12" />
        <span className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-black text-white shadow-md">
          404
        </span>
      </div>

      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
        ບໍ່ພົບໜ້າທີ່ທ່ານຕ້ອງການ
      </h1>

      <p className="mt-3 max-w-md text-base text-muted-foreground leading-relaxed">
        ຂໍອະໄພ, ໜ້າເວັບທີ່ທ່ານກຳລັງຊອກຫາອາດຖືກຍ້າຍ, ລຶບອອກ, ຫຼື ຍັງບໍ່ທັນເປີດໃຫ້ບໍລິການໃນເວລານີ້.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button asChild variant="orangeGlow" size="lg" className="rounded-xl font-bold">
          <Link to="/" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            <span>ກັບຄືນສູ່ໜ້າຫຼັກ</span>
          </Link>
        </Button>

        <Button asChild variant="outline" size="lg" className="rounded-xl border-orange-500/40 text-orange-600 dark:text-orange-400 hover:bg-orange-500/10 font-bold">
          <Link to="/order" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            <span>ສັ່ງເຮັດປ້າຍ & ປະເມີນລາຄາ</span>
          </Link>
        </Button>

        <Button
          variant="ghost"
          size="lg"
          className="rounded-xl text-muted-foreground"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span>ຍ້ອນກັບ</span>
        </Button>
      </div>
    </div>
  );
}
