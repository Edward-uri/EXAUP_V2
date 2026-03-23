import React, { useState } from 'react';
import Header from "../../../../shared/components/LandingHeader/Header"

interface Curso {
  img: string;
  titulo: string;
  descripcion: string;
  registroUrl: string;
  categoria: string;
}

interface CourseCardProps {
  curso: Curso;
}

const grecaImg = "/Greca.png"

const cursos: Curso[] = [
  {
    img: "/Curso EMPRENDIMIENTO(1) 1.png",
    titulo: "Curso de emprendimiento",
    descripcion: "El curso de emprendimiento es gratuito, 100% en línea y abierto a todo el público.",
    registroUrl: "#",
    categoria: "Emprendimiento",
  },
  {
    img: "/Curso EMPRENDIMIENTO(1) 1.png",
    titulo: "Curso 2",
    descripcion: "Descripción del segundo curso.",
    registroUrl: "#",
    categoria: "Categoría 2",
  },
  {
    img: "/Curso EMPRENDIMIENTO(1) 1.png",
    titulo: "Curso 3",
    descripcion: "Descripción del tercer curso.",
    registroUrl: "#",
    categoria: "Categoría 3",
  },
]

const CourseCard: React.FC<CourseCardProps> = ({ curso }) => (
  <div className="bg-white rounded-2xl shadow-lg w-[300px] shrink-0 overflow-hidden flex flex-col">
    {/* Imagen del curso */}
    {curso.img ? (
      <img
        src={curso.img}
        alt={curso.titulo}
        className="w-full h-[180px] object-cover"
      />
    ) : (
      <div className="w-full h-[110px] bg-amber-400 flex items-center justify-center">
        <span className="text-white text-[10px] font-semibold text-center px-2 leading-tight">
          📷 imagen del curso
        </span>
      </div>
    )}

    {/* Contenido */}
    <div className="px-3 py-2 flex flex-col gap-1 flex-1">
      <p className="text-[10px] text-gray-600 leading-snug flex-1">
        {curso.descripcion}
      </p>
      <p className="text-[10px] text-[#3b4fc8] font-semibold">
        Regístrate aquí:
      </p>
      <a
        href={curso.registroUrl}
        className="mt-1 bg-[#2a3bbf] hover:bg-[#1a2a9e] text-white text-[10px] font-semibold text-center py-1.5 rounded-md transition-colors"
      >
        {curso.categoria}
      </a>
    </div>
  </div>
)

const SideCard: React.FC = () => (
  <div className="bg-white rounded-2xl w-[180px] h-[300px] shrink-0 opacity-80 shadow-md" />
)

const CursosTalleresPage: React.FC = () => {
  const [current, setCurrent] = useState<number>(0)

  const prev = () => setCurrent((c) => (c - 1 + cursos.length) % cursos.length)
  const next = () => setCurrent((c) => (c + 1) % cursos.length)

  const curso = cursos[current]

  return (
    <>
      <Header />
      <div
        className="min-h-screen flex"
        style={{
          fontFamily: "'SF Compact Display','SF Compact Text','SF Pro Display','SF Pro Text','Segoe UI',sans-serif",
          background: "#f2f3f4"
        }}
      >
        {/* ── Sidebar ── */}
        <aside className="w-64 shrink-0 bg-white border-r border-gray-200 pt-8 px-6 hidden md:flex flex-col">
          <h2 className="text-[22px] font-semibold text-gray-800 mb-4">Cursos Y Talleres</h2>
        </aside>

        {/* ── Main ── */}
        <main className="flex-1 relative overflow-hidden">

        {/* Greca decorativa derecha */}
        {grecaImg ? (
          <img
            src={grecaImg}
            alt=""
            aria-hidden="true"
            className="absolute right-0 top-0 h-full w-80 object-cover pointer-events-none select-none"
          />
        ) : (
          <svg
            className="absolute right-0 top-0 h-full w-80 pointer-events-none select-none"
            viewBox="0 0 320 800"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <rect width="320" height="800" fill="#e2e5ee" />
            {Array.from({ length: 15 }).map((_, row) =>
              Array.from({ length: 6 }).map((_, col) => {
                const x = col * 54 + 1
                const y = row * 54 + 1
                return (
                  <g key={`${row}-${col}`} transform={`translate(${x},${y})`}>
                    <rect x="5" y="5" width="42" height="42" rx="2" fill="none" stroke="#c5c9d8" strokeWidth="1.2" />
                    <rect x="14" y="14" width="24" height="24" rx="1" fill="none" stroke="#c5c9d8" strokeWidth="0.9" />
                    <rect x="20" y="20" width="12" height="12" rx="1" fill="#c5c9d8" opacity="0.55" />
                  </g>
                )
              })
            )}
          </svg>
        )}

          {/* Contenido */}
          <div className="relative z-10 px-10 py-8">

            {/* Título */}
            <h1 className="self-start ml-[10px] text-[40px] font-semibold text-gray-800 mb-5 tracking-tight">
              Cursos Y Talleres
            </h1>

          {/* ── Carrusel ── */}
          <div
            className="rounded-2xl px-6 py-8 flex items-center justify-center gap-4 max-w-[850px]"
            style={{
              background: "linear-gradient(135deg, #3b5bdb 0%, #74c0fc 100%)",
            }}
          >
            {/* Flecha izquierda */}
            <button
              onClick={prev}
              className="text-white text-3xl font-light w-8 shrink-0 hover:scale-110 transition-transform select-none"
              aria-label="Anterior"
            >
              ‹
            </button>

            {/* Tarjeta lateral izquierda */}
            <SideCard />

            {/* Tarjeta central activa */}
            <div className="flex flex-col items-center gap-2">
              <p className="text-white text-[11px] font-semibold tracking-wide mb-1">
                {curso.titulo}
              </p>
              <CourseCard curso={curso} />
            </div>

            {/* Tarjeta lateral derecha */}
            <SideCard />

            {/* Flecha derecha */}
            <button
              onClick={next}
              className="text-white text-3xl font-light w-8 shrink-0 hover:scale-110 transition-transform select-none"
              aria-label="Siguiente"
            >
              ›
            </button>
          </div>

            {/* Indicadores (dots) */}
            <div className="flex gap-2 mt-4 justify-center max-w-[590px]">
              {cursos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-1.5 rounded-full transition-all duration-200 ${
                    i === current ? "w-6 bg-[#3b4fc8]" : "w-4 bg-gray-400"
                  }`}
                  aria-label={`Ir al curso ${i + 1}`}
                />
              ))}
            </div>

          </div>
        </main>
      </div>
    </>
  )
}

export default CursosTalleresPage
