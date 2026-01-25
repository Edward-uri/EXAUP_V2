import { PlusCircleIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

interface FloatingToolboxProps {
    onAddQuestion: () => void;
}

export const FloatingToolbox = ({ onAddQuestion }: FloatingToolboxProps) => {
    return (
        <div className="flex flex-col gap-1 bg-white p-1.5 rounded-xl shadow-lg border border-gray-100 text-gray-500 w-14 items-center transition-all z-10">
            <button 
                onClick={onAddQuestion}
                className="group relative p-2.5 rounded-lg hover:bg-blue-50 transition-all duration-200"
                title="Añadir pregunta"
            >
                <PlusCircleIcon className="w-6 h-6 text-gray-500 group-hover:text-blue-600 transition-colors" />
            </button>
            
            <button 
                className="group p-2.5 rounded-lg hover:bg-purple-50 transition-all duration-200" 
                title="Importar preguntas"
            >
                <DocumentTextIcon className="w-5 h-5 group-hover:text-purple-600 transition-colors" />
            </button>

       
        </div>
    );
};