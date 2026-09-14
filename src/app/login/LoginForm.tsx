"use client";

import { useActionState } from "react";
import { LogIn, Lock } from "lucide-react";
import { login, type LoginState } from "@/lib/auth-actions";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="mt-5 space-y-3 text-[#162418]">
      <div>
        <label className="block text-xs font-mono font-bold text-[#4a5f4e] mb-1">
          Korisničko ime
        </label>
        <input
          name="username"
          type="text"
          required
          autoComplete="username"
          placeholder="olead"
          className="w-full bg-[#f8faf7] border border-[#d6e2d4] focus:border-[#527a29] focus:bg-white rounded-xl px-3 py-2 text-xs text-[#162418] font-bold outline-none font-mono"
        />
      </div>

      <div>
        <label className="block text-xs font-mono font-bold text-[#4a5f4e] mb-1">
          Lozinka
        </label>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
          className="w-full bg-[#f8faf7] border border-[#d6e2d4] focus:border-[#527a29] focus:bg-white rounded-xl px-3 py-2 text-xs text-[#162418] font-bold outline-none font-mono"
        />
      </div>

      {state.error && (
        <p className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#527a29] to-[#3f5f1f] hover:from-[#5e8c2f] hover:to-[#4a7024] text-white text-xs font-bold shadow-sm shadow-[#527a29]/30 transition-all cursor-pointer active:scale-95 glow-olive disabled:opacity-60"
      >
        {isPending ? (
          <>
            <Lock className="w-4 h-4" />
            <span>Provjera...</span>
          </>
        ) : (
          <>
            <LogIn className="w-4 h-4" />
            <span>Prijavi se</span>
          </>
        )}
      </button>
    </form>
  );
}