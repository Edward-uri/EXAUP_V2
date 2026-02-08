export const ROUTES = {
    HOME: '/',
    ENCUESTAS: '/encuestas',
    ENCUESTAS_CREAR: '/encuestas/crear',
    ENCUESTAS_GESTIONAR: (id: string) => `/encuestas/${id}/gestionar`,
    ENCUESTAS_ANALYTICS: (id: string) => `/encuestas/${id}/analytics`,
    ENCUESTAS_RESPONDER: (uuid: string) => `/encuestas/responder/${uuid}`,
    ENCUESTAS_RESPONDER_SHORT: (uuid: string) => `/survey/${uuid}`,
    FORMULARIOS: '/formularios',
    FORMULARIOS_CREAR: '/formularios/crear',
    ORGULLO_UP: '/orgullo-up'
} as const;