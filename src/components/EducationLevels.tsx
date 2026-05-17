"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import localFont from "next/font/local";

const frizQuadrata = localFont({
  src: "../Font/friz-quadrata-std-medium-5870338ec7ef8.otf",
  variable: "--font-friz",
});

const EducationLevels = () => {
  const levels = [
    {
      title: "Pondok Pesantren",
      link: "/unit/ponpes",
      icon: (
        <img 
          src="/Logo/Logo%20Pondok%20Pesantren.png" 
          alt="Logo Pondok Pesantren" 
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      ),
      color: "var(--primary)"
    },
    {
      title: "Madrasah Aliyah",
      link: "/unit/ma",
      icon: (
        <img 
          src="/Logo/Logo%20Madrasah%20Aliyah.png" 
          alt="Logo Madrasah Aliyah" 
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      ),
      color: "#003a7d"
    },
    {
      title: "SMP Islam",
      link: "/unit/smp",
      icon: (
        <img 
          src="/Logo/Logo%20SMP.png" 
          alt="Logo SMP Islam" 
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      ),
      color: "#004d99"
    },
    {
      title: "SDIT Al-Azhar",
      link: "/unit/sdit",
      icon: (
        <img 
          src="/Logo/Logo%20SDIT.png" 
          alt="Logo SDIT Al-Azhar" 
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      ),
      color: "#005cb8"
    },
    {
      title: "TKIT Al-Azhar",
      link: "#",
      comingSoon: true,
      icon: (
        <img 
          src="/Logo/Logo%20TK.png" 
          alt="Logo TKIT Al-Azhar" 
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      ),
      color: "#6c757d"
    },
  ];

  return (
    <section className="education-levels" id="jenjang">
      <div className="container">
        <div className="levels-header section-header-premium">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="top-subtitle">JENJANG PENDIDIKAN</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className={`title-main ${frizQuadrata.className}`}
          >
            Pendidikan Terpadu Pesantren <br />
            <span>Full Day & Boarding School</span>
          </motion.h2>
        </div>

        <div className="levels-grid">
          {levels.map((level, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.1, y: -5, transition: { duration: 0.2 } }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <Link 
                href={level.comingSoon ? "#" : level.link} 
                className="level-card"
                onClick={(e) => {
                  if ((level as any).comingSoon) {
                    e.preventDefault();
                    alert("TKIT Al-Azhar Segera Hadir!");
                  }
                }}
              >
                <div className="card-content">
                  <div className="icon-box" style={{ '--unit-color': level.color } as React.CSSProperties}>
                    <div className="icon-symbol">{level.icon}</div>
                  </div>
                  <h3 className="level-label">
                    {level.title}
                    {(level as any).comingSoon && (
                      <span style={{ display: 'block', fontSize: '0.75rem', color: '#ff8c00', marginTop: '0.5rem', textAlign: 'center' }}>
                        (Segera Hadir)
                      </span>
                    )}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .education-levels {
          padding: 2rem 0 4rem 0;
          background: #fafbfc;
          position: relative;
          overflow: hidden;
        }

        .container {
          position: relative;
          z-index: 5;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .section-header-premium {
          text-align: center;
          margin-bottom: 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .top-subtitle {
          display: inline-block;
          padding: 0.3rem 1rem;
          background: #f5f5f5;
          color: #666;
          border-radius: 6px;
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 0.8rem;
        }

        :global(.title-main) {
          font-size: 3rem !important;
          line-height: 1.15;
          margin-bottom: 1rem;
          font-weight: 400 !important; /* Memaksa ketebalan asli font, mencegah faux-bold */
          font-style: normal;
          letter-spacing: -0.5px;
          text-align: center;
          color: var(--primary);
        }

        :global(.title-main span) {
          font-weight: 400 !important;
        }

        .levels-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1.5rem;
        }

        .level-card {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          text-decoration: none;
          background-color: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 24px;
          padding: 3rem 1.5rem;
          height: 100%;
          transition: box-shadow 0.3s ease, border-color 0.3s ease;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
          overflow: hidden;
          z-index: 1;
        }

        .level-card:hover {
          box-shadow: 0 20px 40px rgba(0, 33, 71, 0.1);
          border-color: rgba(0, 33, 71, 0.15);
          z-index: 10;
        }

        .card-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }

        .icon-box {
          width: 180px;
          height: 180px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          color: var(--unit-color);
          margin-bottom: 0.5rem;
          background: transparent;
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .icon-symbol {
          width: 150px;
          height: 150px;
          z-index: 2;
        }

        .level-card:hover .icon-box {
          transform: scale(1.15);
        }

        .level-label {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--primary);
          margin: 0;
          transition: color 0.3s ease;
        }
        
        .level-card:hover .level-label {
          color: var(--unit-color);
        }

        @media (max-width: 1024px) {
          .levels-grid { grid-template-columns: repeat(3, 1fr); }
        }

        @media (max-width: 768px) {
          .education-levels { padding: 2rem 0 2rem 0; }
          .section-header-premium { margin-bottom: 0.5rem; }
          .levels-grid { 
            grid-template-columns: repeat(6, 1fr); 
            gap: 0.5rem; 
          }
          .levels-grid > :global(div:nth-child(-n+3)) {
            grid-column: span 2;
          }
          .levels-grid > :global(div:nth-child(4)) {
            grid-column: 2 / span 2;
          }
          .levels-grid > :global(div:nth-child(5)) {
            grid-column: span 2;
          }
          .level-card { padding: 1.5rem 0.5rem; }
          :global(.title-main) { 
            font-size: 2rem !important; 
          }
          .icon-box { width: 80px; height: 80px; margin-bottom: 0.5rem; }
          .icon-symbol { width: 65px; height: 65px; }
          .level-label { font-size: 0.85rem; }
        }

        @media (max-width: 480px) {
          :global(.title-main) { font-size: 1.4rem !important; }
          .icon-box { width: 60px; height: 60px; }
          .icon-symbol { width: 50px; height: 50px; }
          .level-label { font-size: 0.75rem; }
        }
      `}</style>
    </section>
  );
};

export default EducationLevels;
