import { Link } from "react-router-dom";
import { FileText, ArrowLeft, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function DocumentsPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-600">
          <FileText className="h-8 w-8" />
        </div>

        <Badge variant="orange" className="px-3 py-1 text-xs">
          <Clock className="h-3.5 w-3.5 mr-1" />
          ພວມພັດທະນາ (Coming Soon)
        </Badge>

        <h1 className="text-3xl font-extrabold sm:text-4xl text-foreground">
          ລະບົບອອກເອກະສານ & ໃບສະເໜີລາຄາ PDF
        </h1>

        <p className="max-w-xl mx-auto text-muted-foreground text-sm sm:text-base leading-relaxed">
          ລະບົບສ້າງໃບສະເໜີລາຄາ (Quotation), ໃບແຈ້ງໜີ້ (Invoice), ແລະ ໃບຮັບເງິນ (Receipt)
          ໃນຮູບແບບ PDF ທີ່ເປັນມືອາຊີບ ພ້ອມໂລໂກ້ ແລະ ລາຍເຊັນຂອງຮ້ານ.
        </p>

        <div className="pt-6">
          <Button asChild variant="outline" className="rounded-xl">
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>ກັບຄືນໜ້າຫຼັກ</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
