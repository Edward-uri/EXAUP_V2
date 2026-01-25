interface FormHeaderProps {
    titulo: string;
    setTitulo: (val: string) => void;
    descripcion: string;
    setDescripcion: (val: string) => void;
}

export const FormHeader = ({ titulo, setTitulo, descripcion, setDescripcion }: FormHeaderProps) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 border-t-[10px] border-t-blue-600 px-7 py-6 mb-6">
            <input
                type="text"
                className="w-full text-2xl md:text-3xl font-medium text-gray-900 border-b-2 border-transparent hover:border-gray-200 focus:border-blue-600 focus:outline-none focus:ring-0 py-2 transition-all duration-200 placeholder:text-gray-400 placeholder:font-normal"
                placeholder="Título del formulario"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
            />
            <div className="mt-3">
                <input
                    type="text"
                    className="w-full text-sm text-gray-600 border-b border-transparent hover:border-gray-200 focus:border-blue-600 focus:outline-none focus:ring-0 py-2 transition-all duration-200 placeholder:text-gray-400"
                    placeholder="Descripción del formulario (opcional)"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                />
            </div>
        </div>
    );
};