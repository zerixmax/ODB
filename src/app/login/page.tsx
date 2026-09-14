import type { Metadata } from "next";
import Image from "next/image";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Prijava | OleaD Board (ODB)",
  description: "Prijava u osobni cockpit OleaD Board.",
};

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#f6f8f5]">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <div className="relative w-32 h-24 rounded-xl overflow-hidden border border-[#cfded0] shadow-sm flex items-center justify-center bg-white p-1">
            <Image
              src="/olead_logo.jpg"
              alt="OleaD Logo"
              width={128}
              height={96}
              className="w-full h-full object-contain rounded-lg"
              priority
            />
          </div>
        </div>

        <div className="cockpit-card rounded-2xl p-6 bg-white border border-[#d2dfd0] shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-40 h-10 bg-[#527a29]/10 blur-2xl pointer-events-none" />

          <h1 className="text-center font-black text-[#162418] text-lg tracking-tight">
            OleaD Board
          </h1>
          <p className="text-center text-xs font-mono text-[#6d8270] mt-1">
            CODEX NON VERBA • Zaštićeni cockpit
          </p>

          <LoginForm />
        </div>

        <p className="text-center text-[11px] font-mono text-[#7a8e7d] mt-4">
          OleaD Board (ODB) v2.4 • code by olead.hr
        </p>
      </div>
    </div>
  );
}