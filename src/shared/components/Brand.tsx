/* Marca de la plataforma: logo institucional UPCh + nombre en Kanit.
   UPL2.png es blanco sobre transparente, así que este componente asume
   siempre una superficie marino (Figma: "Marino: navbar"). */
export function Brand({ showName = true, compact = false }: { showName?: boolean; compact?: boolean }) {
    /* El logo es un lockup horizontal (1541×367): en el riel contraído no cabe,
       así que ahí se reduce al monograma turquesa. */
    if (compact) {
        return (
            <span
                title="Seguimiento UP"
                className="flex size-10 items-center justify-center rounded-xl bg-turquesa font-display text-sm font-bold text-blue-950"
            >
                UP
            </span>
        )
    }

    /* Ancho fijo + max-w-none: mientras el sidebar anima su ancho, el contenedor
       padre es más angosto que el logo. Sin esto el `max-width:100%` del preflight
       lo reescala en cada frame y se ve como un tirón. */
    return (
        <div className="flex w-44 shrink-0 flex-col gap-2">
            <img
                src="/UPL2.png"
                alt="Universidad Politécnica de Chiapas"
                width={1541}
                height={367}
                className="h-10 w-auto max-w-none self-start"
            />
            {showName && (
                <span className="whitespace-nowrap font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-200/50">
                    Seguimiento <span className="text-turquesa">UP</span>
                </span>
            )}
        </div>
    )
}
