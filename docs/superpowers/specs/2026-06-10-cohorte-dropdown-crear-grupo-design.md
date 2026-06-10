# Cohorte generacional como desplegable en Crear Grupo

**Fecha:** 2026-06-10
**Estado:** Aprobado

## Problema

En el wizard de **Crear Nuevo Grupo** (paso 2 — "Filtros de Búsqueda"), el campo
"Cohorte generacional" es un `<input type="text">` libre donde el usuario escribe
el prefijo a mano (ej. "113"). Esto es propenso a errores: el usuario puede escribir
una cohorte que no existe o con formato inválido.

## Objetivo

Reemplazar el campo de texto libre por un **desplegable** (`<select>`) que cargue
las cohortes disponibles desde el backend, mostrando sólo cohortes reales.

## Endpoint

`GET /api/egresado/cohortes` (en el cliente: `apiClient.get('/egresado/cohortes')`,
ya que `VITE_API_BASE_URL` incluye `/api`).

- Sin parámetros.
- Respuesta `200`:

```json
{
  "data": [
    { "value": 261, "label": "261", "cohorte": "261", "periodo_id": 1, "name_period": null },
    { "value": 253, "label": "253", "cohorte": "253", "periodo_id": 2, "name_period": null }
  ]
}
```

- `label`: texto legible a mostrar en el desplegable.
- `cohorte` / `value`: valor que debe enviarse al backend al filtrar egresados.

## Decisiones de diseño

1. **Mapeo de filtro:** la cohorte seleccionada se guarda **sólo** en
   `filtros.cohorte` (numérico). Ya no se usa `prefijo_matricula` en este control.
   `getEgresados` ya envía `cohorte` como query param al previsualizar/importar.
2. **Cohorte obligatoria:** no hay opción "Todas las cohortes". Se usa un placeholder
   `disabled` ("Selecciona una cohorte") para evitar auto-seleccionar la primera, y se
   valida el paso 2 para no poder avanzar sin elegir cohorte.
3. **Patrón:** se replica el patrón existente de "Programa Educativo"
   (service → domain → hook → `<select>`), respetando la arquitectura
   `data/domain/presentation`.

## Cambios (4 archivos, todos en `features/grupos`)

### 1. `domain/Egresado.ts`
Nueva interfaz:
```ts
export interface Cohorte {
  value: number;
  label: string;
  cohorte: string;
  periodo_id: number;
  name_period: string | null;
}
```

### 2. `data/EgresadoService.ts`
Nuevo método (mismo patrón que `getProgramasEducativos`):
```ts
getCohortes: async (): Promise<Cohorte[]> => {
  const { data } = await apiClient.get('/egresado/cohortes');
  return data.data;
},
```

### 3. `presentation/hooks/useCrearGrupoWizard.ts`
- `const [cohortes, setCohortes] = useState<Cohorte[]>([])`
- En el `useEffect` de carga inicial: `EgresadoService.getCohortes().then(setCohortes).catch(console.error)`
- Exponer `cohortes` en el objeto de retorno.

### 4. `presentation/pages/CrearGrupoWizard.tsx`
- Reemplazar el `<input type="text">` de "Cohorte generacional" por un `<select>`
  ligado a `wizard.filtros.cohorte`, con placeholder `disabled` y opciones desde
  `wizard.cohortes` (`value={c.value}` / texto `c.label`).
- Añadir validación del paso 2 al botón "Siguiente":
  `(wizard.step === 2 && !wizard.filtros.cohorte)`.

## Fuera de alcance

- Página **Editar Grupo** (no tiene este campo).
- Buscador de egresados de **orgulloUP** (feature aparte con su propio service).

## Criterios de aceptación

- El paso 2 muestra un desplegable con las cohortes del endpoint, ordenadas como
  las devuelve el backend (descendente).
- No es posible avanzar al paso 3 sin seleccionar una cohorte.
- Al previsualizar (paso 3) e importar (paso 4), se filtra por la cohorte elegida
  vía el query param `cohorte`.
- `prefijo_matricula` ya no se establece desde este control.
