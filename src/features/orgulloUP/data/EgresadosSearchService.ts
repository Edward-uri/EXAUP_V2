import { apiClient } from "../../../core/api.config";
import type { OrgulloUPRecord, OrgulloUPMeta } from "../domain/OrgulloUP";

const ENDPOINT = "/egresados";

interface BackendEgresadoItem {
  id_egresado: number;
  nombre: string;
  primer_apellido: string;
  segundo_apellido: string | null;
  matricula: string;
  curp: string;
  email: string | null;
  imagen_egresado: string | null;
  fecha_nacimiento: string | null;
  is_active: boolean;
  id_estado?: number | null;
  id_programa_educativo: number | null;
  programa_educativo?: string | null;
  id_periodo: number | null;
}

interface BackendMeta {
  total: number;
  page: number;
  limit: number;
}

interface SearchResponse {
  data: BackendEgresadoItem[];
  meta: BackendMeta;
}

export interface EgresadosSearchParams {
  page?: number;
  limit?: number;
  id_programa_educativo?: number;
  id_periodo_egreso?: number;
  cohorte?: number;
  prefijo_matricula?: string;
  busqueda?: string;
  id_estado?: 1 | 2 | 3;
}

export interface OrgulloUPListResponse {
  data: OrgulloUPRecord[];
  meta: OrgulloUPMeta;
}

const mapStatusFromBackend = (item: BackendEgresadoItem): "pendiente" | "rechazado" | "aprobado" => {
  const code = item.id_estado ?? null;

  if (code === 1) return "pendiente";
  if (code === 2) return "rechazado";
  if (code === 3) return "aprobado";

  // Fallback por si aún no viene id_estado: usamos is_active
  if (item.is_active === true) return "aprobado";
  if (item.is_active === false) return "rechazado";

  return "pendiente";
};

export const EgresadosSearchService = {
  search: async (params: EgresadosSearchParams): Promise<OrgulloUPListResponse> => {
    const page = params.page ?? 1;
    const limit = params.limit ?? 10;

    const { data } = await apiClient.get<SearchResponse>(ENDPOINT, {
      params: {
        page,
        limit,
        id_programa_educativo: params.id_programa_educativo,
        id_periodo_egreso: params.id_periodo_egreso,
        cohorte: params.cohorte,
        prefijo_matricula: params.prefijo_matricula,
        busqueda: params.busqueda,
        id_estado: params.id_estado,
      },
    });

    const records: OrgulloUPRecord[] = data.data.map((item) => ({
      type: "orgullo_up",
      id: String(item.id_egresado),
      attributes: {
        status: mapStatusFromBackend(item),
        egresado: {
          id_egresado: item.id_egresado,
          nombre: item.nombre,
          primer_apellido: item.primer_apellido,
          segundo_apellido: item.segundo_apellido,
          matricula: item.matricula,
          curp: item.curp,
          email: item.email,
          imagen_egresado: item.imagen_egresado,
          fecha_nacimiento: item.fecha_nacimiento,
          is_active: item.is_active,
          id_programa_educativo: item.id_programa_educativo,
          programa_educativo: item.programa_educativo ?? null,
          id_periodo: item.id_periodo,
        },
        logros_academicos: [],
        logros_laborales: [],
      },
    }));

    const meta: OrgulloUPMeta = {
      total_records: data.meta.total,
      page: data.meta.page,
      limit: data.meta.limit,
    };

    return { data: records, meta };
  },
};
