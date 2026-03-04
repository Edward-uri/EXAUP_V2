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
    Bars3Icon,
    DocumentIcon,
    HomeIcon,
    XMarkIcon,
    ChevronRightIcon,
    ClipboardDocumentListIcon,
    ArrowRightStartOnRectangleIcon,
    StarIcon,
} from '@heroicons/react/24/outline'
import { ROUTES } from '../../constants/routes'
import { STORAGE_KEYS } from '../../core/api.config'
import { RequireAuthPageAlert } from '../components/PageAlert/RequireAuthPageAlert'
import { SessionExpiredPageAlert } from '../components/PageAlert/SessionExpiredPageAlert'

interface NavItem {
    name: string;
    href?: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    children?: { name: string; href: string }[];
}

const navigation: NavItem[] = [
    { name: 'Inicio', href: ROUTES.HOME, icon: HomeIcon },
    { 
        name: 'Encuestas', 
        icon: DocumentIcon,
        children: [
            { name: 'Crear nueva', href: ROUTES.ENCUESTAS_CREAR },
            { name: 'Ver todas', href: ROUTES.ENCUESTAS },
        ]
    },
    { 
        name: 'Formularios', 
        icon: ClipboardDocumentListIcon,
        children: [
            { name: 'Crear nuevo', href: ROUTES.FORMULARIOS_CREAR }, 
            { name: 'Ver todos', href: ROUTES.FORMULARIOS },
        ]
    },
    { name: 'Orgullo UP', href: ROUTES.ORGULLO_UP, icon: StarIcon },
]

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

export default function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const location = useLocation()
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

            const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
            const hasToken = !!token

            const stored = localStorage.getItem(STORAGE_KEYS.USER)
            if (!stored) {
                setIsAuthenticated(hasToken ? true : false)
            } else {
                const parsed = JSON.parse(stored) as { nombre?: string; email?: string }
                if (parsed?.nombre) {
                    setUserName(parsed.nombre)
                }
                if (parsed?.email) {
                    setUserEmail(parsed.email)
                }

                setIsAuthenticated(hasToken && (!!parsed?.email || !!parsed?.nombre))
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

    const isCurrent = (href: string | undefined) => {
        if (!href) return false
        return location.pathname === href
    }

    const isChildActive = (children: { href: string }[] | undefined) => {
        if (!children) return false;
        return children.some(child => location.pathname === child.href);
    }

    const renderNavItem = (item: NavItem) => {
        if (!item.children) {
            const active = isCurrent(item.href)
            return (
                <li key={item.name}>
                    <Link
                        to={item.href!}
                        className={classNames(
                            active
                                ? 'bg-white text-blue-900 shadow-sm'
                                : 'text-blue-950/70 hover:bg-white/30 hover:text-blue-900',
                            'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold transition-all duration-200 ease-in-out'
                        )}
                    >
                        <item.icon
                            aria-hidden="true"
                            className={classNames(
                                active ? 'text-blue-600' : 'text-blue-900/60 group-hover:text-blue-900',
                                'size-6 shrink-0'
                            )}
                        />
                        {item.name}
                    </Link>
                </li>
            )
        }

        const anyChildActive = isChildActive(item.children);

        return (
            <li key={item.name}>
                <Disclosure as="div" defaultOpen={anyChildActive}>
                    {({ open }) => (
                        <>
                            <DisclosureButton
                                className={classNames(
                                    anyChildActive ? 'text-blue-900' : 'text-blue-950/70 hover:bg-white/30 hover:text-blue-900',
                                    'group flex w-full items-center gap-x-3 rounded-md p-2 text-left text-sm/6 font-semibold transition-all duration-200'
                                )}
                            >
                                <item.icon
                                    aria-hidden="true"
                                    className={classNames(
                                        anyChildActive ? 'text-blue-600' : 'text-blue-900/60 group-hover:text-blue-900',
                                        'size-6 shrink-0'
                                    )}
                                />
                                {item.name}
                                <ChevronRightIcon
                                    aria-hidden="true"
                                    className={classNames(
                                        open ? 'rotate-90 text-blue-900' : 'text-blue-900/50',
                                        'ml-auto size-5 shrink-0 transition-transform duration-200'
                                    )}
                                />
                            </DisclosureButton>
                            <DisclosurePanel as="ul" className="mt-1 px-2 space-y-1">
                                {item.children?.map((subItem) => {
                                    const subActive = isCurrent(subItem.href)
                                    return (
                                        <li key={subItem.name}>
                                            <Link
                                                to={subItem.href}
                                                className={classNames(
                                                    subActive
                                                        ? 'bg-white/50 text-blue-900 font-bold shadow-sm'
                                                        : 'text-blue-900/70 hover:bg-white/30 hover:text-blue-900',
                                                    'block rounded-md py-2 pr-2 pl-9 text-sm/6 transition-all duration-200'
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
                                        <XMarkIcon aria-hidden="true" className="size-6 text-white" />
                                    </button>
                                </div>
                            </TransitionChild>

                            <div className="relative flex grow flex-col gap-y-5 overflow-y-auto bg-[#8DD2FF] px-6 pb-4">
                                <div className="flex h-16 shrink-0 items-center">
                                    <img
                                        alt="Logo"
                                        src="/EXAUP.svg"
                                        className="h-10 w-auto"
                                    />
                                </div>
                                <nav className="flex flex-1 flex-col">
                                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                                        <li>
                                            <ul role="list" className="-mx-2 space-y-1">
                                                {navigation.map(renderNavItem)}
                                            </ul>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </DialogPanel>
                    </div>
                </Dialog>

                <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
                    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-[#8DD2FF] border-r border-blue-300/30 px-6 pb-4">
                        <div className="flex h-16 shrink-0 items-center mt-2">
                            <img
                                alt="Logo"
                                src="/EXAUP.svg"
                                className="h-10 w-auto"
                            />
                        </div>
                        <nav className="flex flex-1 flex-col">
                            <ul role="list" className="flex flex-1 flex-col gap-y-7">
                                <li>
                                    <ul role="list" className="-mx-2 space-y-1">
                                        {navigation.map(renderNavItem)}
                                    </ul>
                                </li>

                                <li className="mt-auto">
                                    <div className="border-t border-blue-900/10 -mx-2 mb-4"></div>
                                    <div className="flex items-center gap-x-3 px-2 py-2 mb-2 rounded-xl bg-white/10 border border-white/10">
                                        <div className="h-9 w-9 rounded-full bg-white flex items-center justify-center text-blue-600 font-bold text-sm shadow-sm">
                                            {getInitials(userName || userEmail)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-blue-950 truncate">{userName || 'Usuario'}</p>
                                            <p className="text-xs text-blue-900/70 truncate">{userEmail || 'usuario@exaup.edu.mx'}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <button className="w-full flex items-center gap-x-3 px-2 py-2 text-sm font-medium text-blue-900/80 hover:bg-red-500/10 hover:text-red-700 rounded-lg transition-colors">
                                            <ArrowRightStartOnRectangleIcon className="size-5" />
                                            Cerrar sesión
                                        </button>
                                    </div>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>

                <div className="sticky top-0 z-40 flex items-center gap-x-4 bg-white px-4 py-3 shadow-sm border-b border-gray-200 sm:px-6 lg:hidden">
                    <button
                        type="button"
                        onClick={() => setSidebarOpen(true)}
                        className="-m-2 p-2 text-gray-500 hover:text-gray-700 lg:hidden rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <span className="sr-only">Abrir sidebar</span>
                        <Bars3Icon aria-hidden="true" className="size-6" />
                    </button>
                    <div className="h-6 w-px bg-gray-200"></div>
                    <div className="flex-1">
                        <img src="/EXAUP.svg" alt="Logo" className="h-7 w-auto" />
                    </div>
                </div>

                <main className="lg:pl-72 bg-slate-50 min-h-screen">
                    <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </>
    )
}