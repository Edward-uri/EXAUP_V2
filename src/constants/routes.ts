export const ROUTES = {
    HOME: '/',
    ENCUESTAS: '/encuestas',
    ENCUESTAS_CREAR: '/encuestas/crear',
    ENCUESTAS_GESTIONAR: (id: string) => `/encuestas/${id}/gestionar`,
    FORMULARIOS: '/formularios',
    FORMULARIOS_CREAR: '/formularios/crear'
} as const;