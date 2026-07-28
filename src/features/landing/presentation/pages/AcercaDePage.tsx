import React from 'react';
import heroImg from "/hero_acerca_de.png"
import cursosImg from "/cursos_acerca_de.png"
import grecaImg from "/Greca.png"
import Header from "../../../../shared/components/LandingHeader/Header"
import { ROUTES } from "../../../../constants/routes"

interface SidebarLink {
  label: string;
  href: string;
}

interface Stat {
  prefix: string;
  value: string;
  desc: string;
  size: string;
}

interface StatCardProps {
  prefix: string;
  value: string;
  desc: string;
  size: string;
}

interface ImgProps {
  src?: string;
  alt: string;
  className: string;
  placeholder: string;
}

const sidebarLinks: SidebarLink[] = [
  { label: "Titulo Posgrado",          href: "#titulo-posgrado" },
  { label: "Titulación Licenciatura",  href: "#titulacion-licenciatura" },
  { label: "Seguimiento UP",                    href: "#exaup" },
]

const stats: Stat[] = [
  { prefix: "Más de", value: "10+",   desc: "Licenciaturas",               size: "text-3xl" },
  { prefix: "Más de", value: "20+",   desc: "Años haciendo historia",      size: "text-4xl" },
  { prefix: "Más de", value: "3000+", desc: "Egresados contándote a ti",   size: "text-5xl" },
]

const StatCard: React.FC<StatCardProps> = ({ prefix, value, desc, size }) => (
  <div className="flex-1 rounded-2xl flex flex-col items-center justify-center text-center text-white px-4 py-5 shadow-md"
    style={{ background: "var(--color-blue-600)" }}>
    <span className="text-[9px] font-normal tracking-wide opacity-80 mb-0.5">
      {prefix}
    </span>
    <span className={`${size} font-extrabold leading-none`}>
      {value}
    </span>
    <span className="text-[9px] opacity-75 mt-1 leading-tight">
      {desc}
    </span>
  </div>
)

const Img: React.FC<ImgProps> = ({ src, alt, className, placeholder }) =>
  src ? (
    <img src={src} alt={alt} className={className} />
  ) : (
    <div className={`${className} bg-gray-300 flex items-center justify-center`}>
      <span className="text-gray-500 text-[11px] font-medium text-center px-2 leading-tight">
        {placeholder}
      </span>
    </div>
  )

const EgresadosPage: React.FC = () => (
  <>
    <Header />
    <div
      className="min-h-screen flex"
      style={{
        fontFamily: "'SF Compact Display','SF Compact Text','SF Pro Display','SF Pro Text','Segoe UI',sans-serif",
        background: "#f2f3f4"
      }}
    >

    <aside className="w-64 shrink-0 bg-white border-r border-gray-200 pt-8 px-6 hidden md:flex flex-col">
      <h2 className="text-[22px] font-semibold text-gray-800 mb-4">Egresados</h2>
      <nav className="flex flex-col">
        {sidebarLinks.map((link, i) => (
          <a
            key={link.label}
            href={link.href}
            className={`text-[16px] py-3 text-gray-600 hover:text-[#1a2280] transition-colors
              ${i < sidebarLinks.length - 1 ? "border-b border-gray-200" : ""}
            `}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </aside>

    {/* ── Área principal ── */}
    <main className="flex-1 relative overflow-hidden">

      {/* Greca / patrón decorativo derecho */}
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

      {/* Contenido central */}
      <div
        className="relative z-10 py-8 w-full flex flex-col items-center"
        style={{ maxWidth: "calc(100% - 20rem)", margin: "0 auto", transform: "translateX(-50px)" }}
      >

        {/* Título de sección */}
        <h1 className="self-start ml-[10px] text-[40px] font-semibold text-gray-800 mb-5 tracking-tight">
          Seguimiento UP
        </h1>

        <div className="w-full flex flex-col items-center -translate-x-20">

        {/* ── Card imagen hero ── */}
        <div className="bg-white rounded-2xl shadow-sm p-3 mb-5 w-fit self-center -translate-x-6">
          <Img
            src={heroImg}
            alt="Ceremonia de graduación Seguimiento UP"
            className="w-[430px] h-[242px] object-cover rounded-xl"
            placeholder="egresados-hero.jpg"
          />
        </div>

        {/* Texto CTA + botón */}
        <div className="text-center w-[370px] mb-7">
          <p className="text-[13px] font-semibold text-gray-700 leading-snug mb-2">
            Actualiza tus datos y se<br />parte de Seguimiento UP
          </p>
          <a
            href={ROUTES.ACTUALIZAR_EGRESADO}
            className="inline-flex items-center gap-1.5 border border-[#3b4fc8] text-[#3b4fc8] text-[11px] font-semibold px-4 py-1.5 rounded-full hover:bg-[#3b4fc8] hover:text-white transition-all duration-200"
          >
            Actualiza tus datos
            {/* Ícono círculo-play igual al de la imagen */}
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 shrink-0">
              <path fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd" />
            </svg>
          </a>
        </div>

        {/* ── Stats ── */}
        <div className="flex gap-3 mb-10 w-[400px]">
          {stats.map((s) => (
            <StatCard key={s.value} {...s} />
          ))}
        </div>

        {/* ── Card inferior: cursos ── */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden flex w-[520px] self-center -translate-x-6">
          {/* Imagen izquierda */}
          <Img
            src={cursosImg}
            alt="Cursos y talleres para egresados"
            className="w-44 h-56 object-cover shrink-0"
            placeholder="egresados-cursos.jpg"
          />
          {/* Texto derecha */}
          <div className="bg-[#f2f3f4] flex flex-col items-center justify-center text-center flex-1 px-8 py-6">
            <p className="text-[13px] font-semibold text-gray-700 leading-snug mb-3">
              Sigue adquiriendo conocimiento<br />con nuestros
            </p>
            <a
              href={ROUTES.CURSOS}
              className="inline-flex items-center border border-[#3b4fc8] text-[#3b4fc8] text-[11px] font-semibold px-4 py-1.5 rounded-full hover:bg-[#3b4fc8] hover:text-white transition-all duration-200"
            >
              Cursos y talleres
            </a>
          </div>
        </div>
        </div>

      </div>
    </main>
    </div>
  </>
)

export default EgresadosPage
