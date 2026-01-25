import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange?: (items: number) => void;
    itemsPerPageOptions?: number[];
}

export function Pagination({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
    onItemsPerPageChange,
    itemsPerPageOptions = [10, 25, 50, 100]
}: PaginationProps) {
    
    // Calcular rango de items mostrados
    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    // Generar números de página a mostrar
    const getPageNumbers = () => {
        const pages: (number | 'ellipsis')[] = [];
        const maxVisible = 5;
        
        if (totalPages <= maxVisible + 2) {
            // Mostrar todas las páginas
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Siempre mostrar primera página
            pages.push(1);
            
            if (currentPage > 3) {
                pages.push('ellipsis');
            }
            
            // Páginas alrededor de la actual
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);
            
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
            
            if (currentPage < totalPages - 2) {
                pages.push('ellipsis');
            }
            
            // Siempre mostrar última página
            pages.push(totalPages);
        }
        
        return pages;
    };

    if (totalPages <= 1 && !onItemsPerPageChange) {
        return null;
    }

    return (
        <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Info y selector de items por página */}
            <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>
                    Mostrando <span className="font-medium">{startItem}</span> - <span className="font-medium">{endItem}</span> de <span className="font-medium">{totalItems}</span>
                </span>
                
                {onItemsPerPageChange && (
                    <div className="flex items-center gap-2">
                        <span className="text-gray-500">|</span>
                        <label className="text-gray-500">Por página:</label>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                            className="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            {itemsPerPageOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* Controles de navegación */}
            {totalPages > 1 && (
                <div className="flex items-center gap-1">
                    {/* Botón anterior */}
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-lg transition-colors ${
                            currentPage === 1
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                        aria-label="Página anterior"
                    >
                        <ChevronLeftIcon className="w-5 h-5" />
                    </button>

                    {/* Números de página */}
                    <div className="hidden sm:flex items-center gap-1">
                        {getPageNumbers().map((page, index) => (
                            page === 'ellipsis' ? (
                                <span key={`ellipsis-${index}`} className="px-2 text-gray-400">...</span>
                            ) : (
                                <button
                                    key={page}
                                    onClick={() => onPageChange(page)}
                                    className={`min-w-[36px] h-9 rounded-lg text-sm font-medium transition-colors ${
                                        currentPage === page
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    {page}
                                </button>
                            )
                        ))}
                    </div>

                    {/* Indicador móvil */}
                    <span className="sm:hidden text-sm text-gray-600 px-3">
                        {currentPage} / {totalPages}
                    </span>

                    {/* Botón siguiente */}
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-lg transition-colors ${
                            currentPage === totalPages
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                        aria-label="Página siguiente"
                    >
                        <ChevronRightIcon className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>
    );
}
