import { Navigate, Outlet } from 'react-router-dom'
import { STORAGE_KEYS } from '../../core/api.config'
import { ROUTES } from '../../constants/routes'
import { puedeUsar, type Funcionalidad } from '../../features/login/domain/Permisos'

function leerRoles(): string[] {
    try {
        const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) ?? 'null')
        return Array.isArray(user?.roles) ? user.roles : []
    } catch {
        return []
    }
}

interface Props {
    funcionalidad: Funcionalidad
}

/* Deja pasar a las rutas hijas solo si el rol del usuario puede usar la
   funcionalidad; si no, lo manda al inicio. */
export default function RequireFuncionalidad({ funcionalidad }: Props) {
    if (!puedeUsar(leerRoles(), funcionalidad)) {
        return <Navigate to={ROUTES.HOME} replace />
    }
    return <Outlet />
}