import { apiClient } from "../../../../core/api.config";
import type { UploadFileResponse } from "../../domain/ActualizarEgresado";

const resolveUploadUrl = (payload?: UploadFileResponse): string | null => {
  if (!payload) {
    return null;
  }

  const values: Array<string | undefined> = [payload.url, payload.location, payload.path];
  const dataItems = Array.isArray(payload.data)
    ? payload.data
    : payload.data
    ? [payload.data]
    : [];

  dataItems.forEach((item) => {
    if (!item) return;
    values.push(item.url, item.location, item.path);
    if (item.attributes) {
      values.push(item.attributes.url, item.attributes.location, item.attributes.path);
    }
  });

  const firstValid = values.find((value) => typeof value === "string" && value.trim().length > 0);
  return firstValid ?? null;
};

export const OrgulloFileService = {
  async uploadImagen(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await apiClient.post<UploadFileResponse>("/files", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const url = resolveUploadUrl(data);
    if (!url) {
      throw new Error("El backend no devolvió la URL del archivo subido");
    }
    return url;
  },
};
