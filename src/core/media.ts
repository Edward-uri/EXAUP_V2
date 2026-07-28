/**
 * El backend arma las URLs de archivos concatenando el prefijo `/uploads` a una
 * ruta que ya lo trae, y devuelve `/uploads/uploads/users/...`. Hasta que se
 * corrija allá, toda URL de imagen que entre al front pasa por aquí.
 *
 * Colapsa cualquier repetición del segmento, no solo la doble.
 */
export const normalizeImageUrl = (url: string | null | undefined): string | null => {
  if (!url) return null;
  return url.replace(/(?:\/uploads){2,}\//, '/uploads/');
};
