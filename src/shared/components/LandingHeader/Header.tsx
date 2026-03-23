import React, { useState } from "react";

interface NavLink {
  label: string;
  href: string;
}

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [lang, setLang] = useState<"EN" | "ES">("ES");

  const topLinks: NavLink[] = [
    { label: "Transparencia", href: "#" },
    { label: "Contraloría Social", href: "#" },
    { label: "Estudiantes", href: "#" },
    { label: "Egresados", href: "#" },
    { label: "Docentes", href: "#" },
  ];

  const navLinks: NavLink[] = [
    { label: "NOSOTROS", href: "#" },
    { label: "OFERTA EDUCATIVA", href: "#" },
    { label: "VINCULACIÓN", href: "#" },
    { label: "INVESTIGACIÓN", href: "#" },
    { label: "CALENDARIO ESCOLAR", href: "#" },
  ];

  return (
    <header className="w-full font-sans">
      {/* Top bar */}
      <div
        className="bg-[#1b258d] px-6 py-3 flex items-center justify-between"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        {/* Logo */}
        <a href="#" className="flex items-center gap-3 shrink-0">
          {/* UP Logo Image */}
          <img
            src="/UPL2.png"
            alt="Universidad Politécnica de Chiapas"
            className="w-64 h-16 ml-10"
          />
        </a>

        {/* Top nav links - desktop */}
        <nav className="hidden md:flex items-center gap-6">
          {topLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-gray-300 text-sm font-light hover:text-gray-100 transition-colors duration-200 whitespace-nowrap"
            >
              {link.label}
            </a>
          ))}
          {/* Platinum badge */}
          <a
            href="#"
            className="bg-gradient-to-r from-[#6a0dad] to-[#00c6a7] text-gray-100 text-xs font-light px-4 py-2 tracking-widest uppercase"
          >
            PLATINUM
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Bottom nav bar */}
      <div
        className="bg-[#020035] pl-6 pr-5 py-3 hidden md:flex items-center justify-end gap-8"
        style={{ fontFamily: "sans-serif" }}
      >
        {navLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="text-white text-sm font-bold tracking-wider hover:text-blue-300 transition-colors duration-200 whitespace-nowrap"
          >
            {link.label}
          </a>
        ))}

        {/* Language toggle */}
        <div className="ml-4 flex items-center gap-1 text-sm font-bold text-white">
          <button
            onClick={() => setLang("EN")}
            className={`hover:text-blue-300 transition-colors ${lang === "EN" ? "text-blue-300" : ""}`}
          >
            EN
          </button>
          <span className="opacity-50">|</span>
          <button
            onClick={() => setLang("ES")}
            className={`hover:text-blue-300 transition-colors ${lang === "ES" ? "text-blue-300" : ""}`}
          >
            ES
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a0f6e] border-t border-blue-800">
          <div className="px-6 py-4 flex flex-col gap-3" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            {topLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-gray-300 text-sm font-light hover:text-gray-100 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <hr className="border-blue-700 my-1" />
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-white text-sm font-bold tracking-wider hover:text-blue-300 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <hr className="border-blue-700 my-1" />
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <button onClick={() => setLang("EN")} className={lang === "EN" ? "text-blue-300" : ""}>EN</button>
              <span className="opacity-50">|</span>
              <button onClick={() => setLang("ES")} className={lang === "ES" ? "text-blue-300" : ""}>ES</button>
            </div>
            <a
              href="#"
              className="bg-gradient-to-r from-[#6a0dad] to-[#00c6a7] text-white text-xs font-bold px-4 py-2 tracking-widest uppercase text-center w-fit"
            >
              PLATINUM
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
