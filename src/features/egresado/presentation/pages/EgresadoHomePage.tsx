import { UserCircleIcon, EnvelopeIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import { QuickActionCard } from '../../../home/presentation/components';
import { ROUTES } from '../../../../constants/routes';

/*
 * Panel del egresado ("Mi Panel"). Misma línea visual que el Home del administrador
 * (encabezado + tarjetas de acción) pero con las acciones que SÍ le corresponden al
 * egresado. Reutiliza QuickActionCard del módulo home.
 */
export default function EgresadoHomePage() {
    const nombre = localStorage.getItem('egresado_nombre');
    const primerNombre = nombre ? nombre.split(/\s+/)[0] : null;

    return (
        <div className="min-h-screen pb-20 bg-slate-50">
            <div className="max-w-5xl mx-auto">

                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 font-display">
                        Mi Panel
                    </h1>
                    <p className="text-sm text-gray-500">
                        {primerNombre ? `Bienvenido, ${primerNombre}. ` : 'Bienvenido. '}
                        Mantén tu información al día para seguir en contacto con la UP.
                    </p>
                </div>

                {/* Acción principal del egresado */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    <QuickActionCard
                        to={ROUTES.ACTUALIZAR_EGRESADO}
                        icon={UserCircleIcon}
                        iconBg="bg-blue-50"
                        iconColor="text-blue-700"
                        title="Actualizar mi información"
                        description="Revisa y actualiza tus datos personales, de contacto, laborales y tus logros."
                        actionText="Actualizar"
                    />

                    <QuickActionCard
                        to={ROUTES.ACTUALIZAR_EGRESADO}
                        icon={AcademicCapIcon}
                        iconBg="bg-indigo-50"
                        iconColor="text-indigo-700"
                        title="Orgullo UP"
                        description="Completa tu perfil para ser considerado en el programa Orgullo UP."
                        actionText="Completar perfil"
                        hoverRing="hover:ring-indigo-500/30"
                    />
                </div>

                {/* Encuestas: el egresado las responde por el enlace único que recibe por correo */}
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
                    Encuestas
                </h3>
                <div className="flex items-start gap-4 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                    <div className="p-3 rounded-full bg-green-50">
                        <EnvelopeIcon className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-900">¿Tienes una encuesta pendiente?</p>
                        <p className="text-sm text-gray-500">
                            Las encuestas llegan a tu correo electrónico con un enlace único para responderlas.
                            Revisa tu bandeja de entrada y abre el enlace que te enviamos.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
