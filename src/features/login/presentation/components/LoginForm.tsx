import { useState } from "react";
import type { FormEvent } from "react";
import {
  EnvelopeIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";

interface LoginFormProps {
  loading: boolean;
  onSubmit: (email: string, password: string) => void;
  error?: string | null;
}

export function LoginForm({ loading, onSubmit, error }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl border border-white/10 p-8 w-full max-w-md">
      <div className="mb-6 text-center">
        <p className="text-xs font-semibold tracking-wide text-blue-600 uppercase">
          Acceso administrativo
        </p>
        <h1 className="mt-2 text-2xl font-bold text-gray-900 font-display">
          Inicia sesión en Seguimiento UP
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Gestiona encuestas, formularios y analítica desde un solo lugar.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Correo institucional
          </label>
          <div className="relative">
            <EnvelopeIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 bg-white px-10 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              placeholder="tucuenta@up.edu.mx"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña
          </label>
          <div className="relative">
            <LockClosedIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 bg-white px-10 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-blue-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-800 hover:shadow-md hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:bg-blue-400"
        >
          {loading ? "Iniciando sesión..." : "Entrar"}
        </button>
      </form>

      <p className="mt-4 text-center text-xs text-gray-400">
        Uso exclusivo para personal autorizado de Seguimiento UP.
      </p>
    </div>
  );
}
