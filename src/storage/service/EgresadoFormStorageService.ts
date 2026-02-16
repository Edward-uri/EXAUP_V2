import type { FormData } from "../../types";

const EGRESADO_STATE_STORAGE_KEY = "actualizarEgresadoState";

export interface EgresadoFormPersistedState {
  currentStep?: number;
  curpValidated?: boolean;
  formData?: Partial<FormData>;
}

export const EgresadoFormStorageService = {
  loadState(): EgresadoFormPersistedState | null {
    try {
      if (typeof window === "undefined") return null;
      const saved = localStorage.getItem(EGRESADO_STATE_STORAGE_KEY);
      if (!saved) return null;
      return JSON.parse(saved) as EgresadoFormPersistedState;
    } catch (error) {
      console.error("[EgresadoFormStorageService] Error al cargar estado", error);
      return null;
    }
  },

  saveState(state: EgresadoFormPersistedState): void {
    try {
      if (typeof window === "undefined") return;
      localStorage.setItem(EGRESADO_STATE_STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error("[EgresadoFormStorageService] Error al guardar estado", error);
    }
  },

  clearState(): void {
    try {
      if (typeof window === "undefined") return;
      localStorage.removeItem(EGRESADO_STATE_STORAGE_KEY);
    } catch (error) {
      console.error("[EgresadoFormStorageService] Error al limpiar estado", error);
    }
  },
};
