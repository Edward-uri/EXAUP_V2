'use client'

/*
 * Shell de la VISTA DEL EGRESADO.
 * Reutiliza la misma identidad visual que el Layout de administrador (sidebar marino,
 * acento turquesa, header móvil, avatar y logout) pero con navegación RESTRINGIDA y
 * un guard de scope "egresado": el egresado solo ve lo que le corresponde (HU022).
 */

import { useState, useEffect } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    TransitionChild,
} from '@headlessui/react'
import {
    LayoutDashboardIcon,
    UserIcon,
    ClipboardListIcon,
    LogOutIcon,
    MenuIcon,
    PanelLeftCloseIcon,
    PanelLeftOpenIcon,
    XIcon,
} from 'lucide-react'
import { ROUTES } from '../../constants/routes'
import { STORAGE_KEYS } from '../../core/api.config'
import { getAuthScope, getSessionEgresadoId, clearEgresadoSession } from '../../core/auth-context'
import { RequireAuthPageAlert } from '../components/PageAlert/RequireAuthPageAlert'
import { SessionExpiredPageAlert } from '../components/PageAlert/SessionExpiredPageAlert'
import { Brand } from '../components/Brand'

interface NavItem {
    name: string
    href: string
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

/* Navegación restringida: el egresado NO ve encuestas, formularios, grupos,
   eventos ni la gestión de Orgullo UP (eso es solo del administrador). */
const navigation: NavItem[] = [
    { name: 'Inicio', href: ROUTES.EGRESADO_HOME, icon: LayoutDashboardIcon },
    { name: 'Mis Encuestas', href: ROUTES.EGRESADO_ENCUESTAS, icon: ClipboardListIcon },
    { name: 'Mi Información', href: ROUTES.ACTUALIZAR_EGRESADO, icon: UserIcon },
]

const NAV_ITEM_BASE =
    'group relative flex items-center gap-x-3 rounded-lg py-2 pl-3 pr-2 font-display text-sm font-medium ' +
    'transition-colors duration-200 before:absolute before:left-0 before:top-1/2 before:h-5 before:w-0.5 ' +
    "before:-translate-y-1/2 before:rounded-r-full before:content-['']"

function classNames(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(' ')
}

function getInitials(source?: string | null): string {
    if (!source) return 'EG'
    const cleaned = source.trim()
    if (!cleaned) return 'EG'
    const parts = cleaned.split(/\s+/)
    const initials = parts
        .slice(0, 2)
        .map((p) => p.charAt(0).toUpperCase())
        .join('')
        .slice(0, 2)
    return initials || 'EG'
}

const SIDEBAR_COLLAPSED_KEY = 'egresado_sidebar_collapsed'

export default function EgresadoLayout() {
    const location = useLocation()
    const navigate = useNavigate()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [collapsed, setCollapsed] = useState(
        () => localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === '1'
    )
    const [userName, setUserName] = useState<string | null>(null)
    const [userEmail, setUserEmail] = useState<string | null>(null)
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

            // Guard de egresado: debe existir una sesión con scope "egresado".
            const isEgresado = getAuthScope() === 'egresado'
            const hasToken = !!localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
            const hasId = !!getSessionEgresadoId()
            const byCookies = localStorage.getItem('auth_method') === 'cookies'

            setIsAuthenticated(isEgresado && (hasToken || hasId || byCookies))
            setUserName(localStorage.getItem('egresado_nombre'))
            setUserEmail(localStorage.getItem('egresado_email'))
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
        clearEgresadoSession()
        localStorage.removeItem(STORAGE_KEYS.SESSION_EXPIRED)
        setIsAuthenticated(false)
        setSidebarOpen(false)
        navigate(ROUTES.LOGIN)
    }

    const toggleCollapsed = () => {
        setCollapsed((prev) => {
            const next = !prev
            localStorage.setItem(SIDEBAR_COLLAPSED_KEY, next ? '1' : '0')
            return next
        })
    }

    const isCurrent = (href: string) => location.pathname === href

    const renderNavItem = (rail: boolean) => (item: NavItem) => {
        const active = isCurrent(item.href)
        return (
            <li key={item.name}>
                <Link
                    to={item.href}
                    aria-current={active ? 'page' : undefined}
                    title={rail ? item.name : undefined}
                    onClick={() => setSidebarOpen(false)}
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
                {/* Drawer móvil */}
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
                                        <span className="sr-only">Cerrar menú</span>
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

                {/* Sidebar de escritorio (colapsable) */}
                <div
                    className={classNames(
                        'hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col',
                        'transition-[width] duration-300 ease-in-out motion-reduce:transition-none',
                        collapsed ? 'lg:w-20' : 'lg:w-64'
                    )}
                >
                    <button
                        type="button"
                        onClick={toggleCollapsed}
                        title={collapsed ? 'Expandir menú' : 'Contraer menú'}
                        className="absolute right-0 top-24 z-10 -translate-y-1/2 translate-x-1/2 rounded-full border border-white/15 bg-blue-900 p-1.5 text-blue-200 shadow-lg transition-colors hover:bg-blue-800 hover:text-white"
                    >
                        {collapsed ? <PanelLeftOpenIcon className="size-4" /> : <PanelLeftCloseIcon className="size-4" />}
                        <span className="sr-only">{collapsed ? 'Expandir menú' : 'Contraer menú'}</span>
                    </button>

                    <div className="flex grow flex-col overflow-hidden border-r border-white/10 bg-blue-950">
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
                                    title={userName || 'Egresado'}
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
                                        <p className="truncate text-sm font-semibold text-white">{userName || 'Egresado'}</p>
                                        <p className="truncate text-xs text-blue-200/60">{userEmail || 'egresado@upchiapas.edu.mx'}</p>
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

                {/* Header móvil */}
                <div className="sticky top-0 z-40 flex items-center gap-x-4 bg-blue-950 px-4 py-3 shadow-sm border-b border-white/10 sm:px-6 lg:hidden">
                    <button
                        type="button"
                        onClick={() => setSidebarOpen(true)}
                        className="-m-2 p-2 text-blue-200 hover:text-white lg:hidden rounded-lg hover:bg-white/10 transition-colors"
                    >
                        <span className="sr-only">Abrir menú</span>
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
