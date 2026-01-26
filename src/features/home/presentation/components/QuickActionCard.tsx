import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

interface QuickActionCardProps {
    to: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    iconBg: string;
    iconColor: string;
    title: string;
    description: string;
    actionText: string;
    hoverRing?: string;
}

export function QuickActionCard({
    to,
    icon: Icon,
    iconBg,
    iconColor,
    title,
    description,
    actionText,
    hoverRing = 'hover:ring-blue-500/30'
}: QuickActionCardProps) {
    return (
        <Link 
            to={to}
            className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5 transition-all hover:shadow-md ${hoverRing}`}
        >
            <div>
                <span className={`inline-flex rounded-lg ${iconBg} p-3 ${iconColor} ring-4 ring-white`}>
                    <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-semibold leading-7 text-gray-900">
                    {title}
                </h3>
                <p className="mt-1 text-sm leading-6 text-gray-500">
                    {description}
                </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-blue-600 group-hover:text-blue-700">
                {actionText} <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
        </Link>
    );
}
