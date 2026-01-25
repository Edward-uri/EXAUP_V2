import {
    EyeIcon,
    UserGroupIcon,
    UsersIcon,
    PaperAirplaneIcon
} from '@heroicons/react/24/outline';

export type Tab = 'preview' | 'asignar' | 'participantes' | 'enviar';

interface TabNavigationProps {
    activeTab: Tab;
    onTabChange: (tab: Tab) => void;
}

const tabs: { id: Tab; name: string; icon: any }[] = [
    { id: 'preview', name: 'Vista Previa', icon: EyeIcon },
    { id: 'asignar', name: 'Asignar Grupos', icon: UserGroupIcon },
    { id: 'participantes', name: 'Participantes', icon: UsersIcon },
    { id: 'enviar', name: 'Enviar', icon: PaperAirplaneIcon },
];

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
    return (
        <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`
                                group inline-flex items-center gap-2 border-b-2 py-4 px-1 text-sm font-medium transition-colors
                                ${isActive
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                }
                            `}
                        >
                            <Icon className="w-5 h-5" />
                            {tab.name}
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}
