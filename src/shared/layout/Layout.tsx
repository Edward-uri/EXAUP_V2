'use client'

import { useState, useEffect } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { 
    Dialog, 
    DialogBackdrop, 
    DialogPanel, 
    TransitionChild, 
    Disclosure, 
    DisclosureButton, 
    DisclosurePanel 
} from '@headlessui/react'
import {
    AwardIcon,
    ChevronRightIcon,
    ClipboardListIcon,
    FileTextIcon,
    LayoutDashboardIcon,
    LogOutIcon,
    MenuIcon,
    PanelLeftCloseIcon,
    PanelLeftOpenIcon,
    UsersIcon,
    XIcon,
    ZapIcon,
} from 'lucide-react'
import { ROUTES } from '../../constants/routes'
import { STORAGE_KEYS } from '../../core/api.config'
import { ALL_ROLES, type UserRole } from '../../features/login/domain/Roles'
import { LoginService } from '../../features/login/data/LoginService'
import { RequireAuthPageAlert } from '../components/PageAlert/RequireAuthPageAlert'
import { SessionExpiredPageAlert } from '../components/PageAlert/SessionExpiredPageAlert'
import { Brand } from '../components/Brand'

interface NavItem {
    name: string;
    href?: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    children?: { name: string; href: string }[];
    allowedRoles?: UserRole[];
}

const navigation: NavItem[] = [
    { name: 'Inicio', href: ROUTES.HOME, icon: LayoutDashboardIcon },
    {
        name: 'Encuestas',
        icon: ClipboardListIcon,
        children: [
            { name: 'Crear nueva', href: ROUTES.ENCUESTAS_CREAR },
            { name: 'Ver todas', href: ROUTES.ENCUESTAS },
        ]
    },
    {
        name: 'Formularios',
        icon: FileTextIcon,
        children: [
            { name: 'Crear nuevo', href: ROUTES.FORMULARIOS_CREAR },
            { name: 'Ver todos', href: ROUTES.FORMULARIOS },
        ]
    },
    {
        name: 'Grupos',
        icon: UsersIcon,
        children: [
            { name: 'Crear nuevo', href: ROUTES.GRUPOS_CREAR },
            { name: 'Ver todos', href: ROUTES.GRUPOS },
        ]
    },
    {
        name: 'Eventos Automáticos',
        icon: ZapIcon,
        children: [
            { name: 'Crear nuevo', href: ROUTES.EVENTOS_AUTOMATICOS_CREAR },
            { name: 'Ver todos', href: ROUTES.EVENTOS_AUTOMATICOS },
        ]
    },
    { name: 'Orgullo UP', href: ROUTES.ORGULLO_UP, icon: AwardIcon },
]

/* El `before:` es la barra turquesa de item activo: va posicionada en vez de ser
   un border para que no desplace el contenido al activarse. */
const NAV_ITEM_BASE =
    'group relative flex items-center gap-x-3 rounded-lg py-2 pl-3 pr-2 font-display text-sm font-medium ' +
    'transition-colors duration-200 before:absolute before:left-0 before:top-1/2 before:h-5 before:w-0.5 ' +
    "before:-translate-y-1/2 before:rounded-r-full before:content-['']"

function classNames(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(' ')
}

function getInitials(source?: string | null): string {
    if (!source) return 'EX'
    const cleaned = source.trim()
    if (!cleaned) return 'EX'

    const parts = cleaned.split(/\s+/)
    const firstTwo = parts.slice(0, 2)
    const initials = firstTwo
        .map((p) => p.charAt(0).toUpperCase())
        .join('')
        .slice(0, 2)

    return initials || 'EX'
}

const SIDEBAR_COLLAPSED_KEY = 'sidebar_collapsed'

export default function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    // Se lee en el inicializador para que no haya parpadeo de ancho al montar.
    const [collapsed, setCollapsed] = useState(
        () => localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === '1'
    )
    const location = useLocation()
    const [userName, setUserName] = useState<string | null>(null)
    const [userEmail, setUserEmail] = useState<string | null>(null)
    const [userRoles, setUserRoles] = useState<UserRole[] | null>(null)
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
    const [hasSessionExpired, setHasSessionExpired] = useState(false)

    useEffect(() => {
        const handleSessionExpired = () => {
            setHasSessionExpired(true)
            setIsAuthenticated(false)
        }

        try {
            const expiredFlag = localStorage.getItem(STORAGE_KEYS.SESSION_EXPIRED) === '1'
            setHasSessionExpired(expiredFlag)

            const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
            const hasToken = !!token

            const stored = localStorage.getItem(STORAGE_KEYS.USER)
            if (!stored) {
                // Aceptamos sesión por token o por usuario persistido (backend por cookie)
                setIsAuthenticated(hasToken)
            } else {
                const parsed = JSON.parse(stored) as { nombre?: string; email?: string; roles?: string[] }
                if (parsed?.nombre) {
                    setUserName(parsed.nombre)
                }
                if (parsed?.email) {
                    setUserEmail(parsed.email)
                }

                if (Array.isArray(parsed?.roles)) {
                    // Normalizamos/filtramos solo roles conocidos
                    const normalizedRoles = parsed.roles.filter((r): r is UserRole =>
                        ALL_ROLES.includes(r as UserRole)
                    )
                    setUserRoles(normalizedRoles.length > 0 ? normalizedRoles : null)
                }

                const hasUserInfo = !!parsed?.email || !!parsed?.nombre
                setIsAuthenticated(hasToken || hasUserInfo)
            }
        } catch {
            setIsAuthenticated(false)
        }

        if (typeof window !== 'undefined') {
            window.addEventListener('session-expired', handleSessionExpired)
        }

        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('session-expired', handleSessionExpired)
            }
        }
    }, [])

    const handleLogout = () => {
        LoginService.logout()
        setHasSessionExpired(false)
        setIsAuthenticated(false)
        setUserName(null)
        setUserEmail(null)
        setUserRoles(null)
        setSidebarOpen(false)
    }

    const isCurrent = (href: string | undefined) => {
        if (!href) return false
        return location.pathname === href
    }

    const isChildActive = (children: { href: string }[] | undefined) => {
        if (!children) return false;
        return children.some(child => location.pathname === child.href);
    }

    const canAccessNavItem = (item: NavItem): boolean => {
        if (!item.allowedRoles || item.allowedRoles.length === 0) {
            return true
        }

        if (!userRoles || userRoles.length === 0) {
            return false
        }

        return item.allowedRoles.some((role) => userRoles.includes(role))
    }

    const toggleCollapsed = () => {
        setCollapsed((prev) => {
            const next = !prev
            localStorage.setItem(SIDEBAR_COLLAPSED_KEY, next ? '1' : '0')
            return next
        })
    }

    /* `rail` = riel de solo iconos. El drawer móvil siempre se renderiza
       expandido, así que recibe rail=false explícitamente. */
    const renderNavItem = (rail: boolean) => (item: NavItem) => {
        if (!canAccessNavItem(item)) {
            return null
        }

        if (!item.children) {
            const active = isCurrent(item.href)
            return (
                <li key={item.name}>
                    <Link
                        to={item.href!}
                        aria-current={active ? 'page' : undefined}
                        title={rail ? item.name : undefined}
                        className={classNames(
                            active
                                ? 'bg-white/10 text-white before:bg-turquesa'
                                : 'text-blue-200/80 hover:bg-white/5 hover:text-white',
                            NAV_ITEM_BASE,
                            rail && 'justify-center pr-3'
                        )}
                    >
                        <item.icon
                            aria-hidden="true"
                            className={classNames(
                                active ? 'text-turquesa' : 'text-blue-300/70 group-hover:text-turquesa',
                                'size-5 shrink-0 transition-colors'
                            )}
                        />
                        <span className={rail ? 'sr-only' : undefined}>{item.name}</span>
                    </Link>
                </li>
            )
        }

        const anyChildActive = isChildActive(item.children);

        /* En riel no cabe el submenú: el clic expande el sidebar y el
           Disclosure queda abierto por defecto si algún hijo está activo. */
        if (rail) {
            return (
                <li key={item.name}>
                    <button
                        type="button"
                        onClick={toggleCollapsed}
                        title={item.name}
                        className={classNames(
                            anyChildActive
                                ? 'bg-white/10 text-white before:bg-turquesa'
                                : 'text-blue-200/80 hover:bg-white/5 hover:text-white',
                            NAV_ITEM_BASE, 'w-full justify-center pr-3'
                        )}
                    >
                        <item.icon
                            aria-hidden="true"
                            className={classNames(
                                anyChildActive ? 'text-turquesa' : 'text-blue-300/70 group-hover:text-turquesa',
                                'size-5 shrink-0 transition-colors'
                            )}
                        />
                        <span className="sr-only">{item.name}</span>
                    </button>
                </li>
            )
        }

        return (
            <li key={item.name}>
                <Disclosure as="div" defaultOpen={anyChildActive}>
                    {({ open }) => (
                        <>
                            <DisclosureButton
                                className={classNames(
                                    anyChildActive
                                        ? 'text-white before:bg-turquesa'
                                        : 'text-blue-200/80 hover:bg-white/5 hover:text-white',
                                    NAV_ITEM_BASE, 'w-full text-left'
                                )}
                            >
                                <item.icon
                                    aria-hidden="true"
                                    className={classNames(
                                        anyChildActive ? 'text-turquesa' : 'text-blue-300/70 group-hover:text-turquesa',
                                        'size-5 shrink-0 transition-colors'
                                    )}
                                />
                                {item.name}
                                <ChevronRightIcon
                                    aria-hidden="true"
                                    className={classNames(
                                        open ? 'rotate-90 text-turquesa' : 'text-blue-300/50',
                                        'ml-auto size-4 shrink-0 transition-transform duration-200'
                                    )}
                                />
                            </DisclosureButton>
                            {/* La guía vertical cuelga de la columna del icono para que
                                los subitems no floten sueltos al expandirse. */}
                            <DisclosurePanel as="ul" className="my-1 ml-[1.4rem] space-y-0.5 border-l border-white/10 pl-3">
                                {item.children?.map((subItem) => {
                                    const subActive = isCurrent(subItem.href)
                                    return (
                                        <li key={subItem.name}>
                                            <Link
                                                to={subItem.href}
                                                aria-current={subActive ? 'page' : undefined}
                                                className={classNames(
                                                    subActive
                                                        ? 'bg-white/10 font-semibold text-white'
                                                        : 'text-blue-200/60 hover:bg-white/5 hover:text-white',
                                                    'block rounded-lg px-3 py-1.5 text-sm transition-colors duration-200'
                                                )}
                                            >
                                                {subItem.name}
                                            </Link>
                                        </li>
                                    )
                                })}
                            </DisclosurePanel>
                        </>
                    )}
                </Disclosure>
            </li>
        )
    }

    if (isAuthenticated === null) {
        return null
    }

    if (isAuthenticated === false) {
        if (hasSessionExpired) {
            return <SessionExpiredPageAlert />
        }

        return <RequireAuthPageAlert />
    }

    return (
        <>
            <div>
                <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 lg:hidden">
                    <DialogBackdrop
                        transition
                        className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-closed:opacity-0"
                    />

                    <div className="fixed inset-0 flex">
                        <DialogPanel
                            transition
                            className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-closed:-translate-x-full"
                        >
                            <TransitionChild>
                                <div className="absolute top-0 left-full flex w-16 justify-center pt-5 duration-300 ease-in-out data-closed:opacity-0">
                                    <button type="button" onClick={() => setSidebarOpen(false)} className="-m-2.5 p-2.5">
                                        <span className="sr-only">Cerrar sidebar</span>
                                        <XIcon aria-hidden="true" className="size-6 text-white" />
                                    </button>
                                </div>
                            </TransitionChild>

                            <div className="relative flex grow flex-col bg-blue-950">
                                <div className="shrink-0 border-b border-white/10 px-6 py-5">
                                    <Brand />
                                </div>
                                <nav className="flex-1 overflow-y-auto px-3 py-4">
                                    <ul role="list" className="space-y-0.5">
                                        {navigation.map(renderNavItem(false))}
                                    </ul>
                                </nav>
                            </div>
                        </DialogPanel>
                    </div>
                </Dialog>

                {/* Tres bloques fijos: marca arriba, navegación con su propio scroll,
                    sesión abajo. Así la marca y el logout nunca se van con el scroll. */}
                <div
                    className={classNames(
                        'hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col',
                        'transition-[width] duration-300 ease-in-out motion-reduce:transition-none',
                        collapsed ? 'lg:w-20' : 'lg:w-64'
                    )}
                >
                    {/* Fuera del contenedor con overflow-hidden: si no, la mitad del
                        botón que sobresale del borde queda recortada. */}
                    <button
                        type="button"
                        onClick={toggleCollapsed}
                        title={collapsed ? 'Expandir menú' : 'Contraer menú'}
                        className="absolute right-0 top-24 z-10 -translate-y-1/2 translate-x-1/2 rounded-full border border-white/15 bg-blue-900 p-1.5 text-blue-200 shadow-lg transition-colors hover:bg-blue-800 hover:text-white"
                    >
                        {collapsed ? (
                            <PanelLeftOpenIcon className="size-4" />
                        ) : (
                            <PanelLeftCloseIcon className="size-4" />
                        )}
                        <span className="sr-only">{collapsed ? 'Expandir menú' : 'Contraer menú'}</span>
                    </button>

                    <div className="flex grow flex-col overflow-hidden border-r border-white/10 bg-blue-950">
                        {/* Altura fija: el bloque de marca no debe reflowear mientras el
                            ancho anima, si no el logo "salta" al expandir. */}
                        <div
                            className={classNames(
                                'flex h-24 shrink-0 items-center border-b border-white/10',
                                collapsed ? 'justify-center px-2' : 'px-6'
                            )}
                        >
                            <Brand compact={collapsed} />
                        </div>

                        <nav className={classNames('flex-1 overflow-y-auto py-4', collapsed ? 'px-2' : 'px-3')}>
                            <ul role="list" className="space-y-0.5">
                                {navigation.map(renderNavItem(collapsed))}
                            </ul>
                        </nav>

                        <div className={classNames('shrink-0 border-t border-white/10', collapsed ? 'p-2' : 'p-3')}>
                            {collapsed ? (
                                <div
                                    title={userName || 'Usuario'}
                                    className="mx-auto mb-1 flex size-9 items-center justify-center rounded-full bg-turquesa font-display text-sm font-semibold text-blue-950"
                                >
                                    {getInitials(userName || userEmail)}
                                </div>
                            ) : (
                                <div className="mb-1 flex items-center gap-x-3 rounded-xl border border-white/10 bg-white/5 p-2">
                                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-turquesa font-display text-sm font-semibold text-blue-950">
                                        {getInitials(userName || userEmail)}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-semibold text-white">{userName || 'Usuario'}</p>
                                        <p className="truncate text-xs text-blue-200/60">{userEmail || 'usuario@upchiapas.edu.mx'}</p>
                                    </div>
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={handleLogout}
                                title={collapsed ? 'Cerrar sesión' : undefined}
                                className={classNames(
                                    'flex w-full items-center gap-x-3 rounded-lg py-2 text-sm font-medium text-blue-200/70 transition-colors hover:bg-red-500/15 hover:text-red-300',
                                    collapsed ? 'justify-center px-2' : 'px-3'
                                )}
                            >
                                <LogOutIcon className="size-5 shrink-0" />
                                <span className={collapsed ? 'sr-only' : undefined}>Cerrar sesión</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="sticky top-0 z-40 flex items-center gap-x-4 bg-blue-950 px-4 py-3 shadow-sm border-b border-white/10 sm:px-6 lg:hidden">
                    <button
                        type="button"
                        onClick={() => setSidebarOpen(true)}
                        className="-m-2 p-2 text-blue-200 hover:text-white lg:hidden rounded-lg hover:bg-white/10 transition-colors"
                    >
                        <span className="sr-only">Abrir sidebar</span>
                        <MenuIcon aria-hidden="true" className="size-6" />
                    </button>
                    <div className="h-6 w-px bg-white/20"></div>
                    <div className="flex-1">
                        <Brand showName={false} />
                    </div>
                </div>

                <main
                    className={classNames(
                        'min-h-screen bg-slate-50 transition-[padding] duration-300 ease-in-out motion-reduce:transition-none',
                        collapsed ? 'lg:pl-20' : 'lg:pl-64'
                    )}
                >
                    <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </>
    )
}