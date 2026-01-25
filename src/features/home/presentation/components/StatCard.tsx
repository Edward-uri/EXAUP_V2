interface StatCardProps {
    label: string;
    value: number | string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    color: string;
    bg: string;
}

export function StatCard({ label, value, icon: Icon, color, bg }: StatCardProps) {
    return (
        <div className="flex items-center gap-4 bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className={`p-3 rounded-full ${bg}`}>
                <Icon className={`w-6 h-6 ${color}`} />
            </div>
            <div>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-sm text-gray-500 font-medium">{label}</p>
            </div>
        </div>
    );
}
