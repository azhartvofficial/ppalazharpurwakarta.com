"use client";
import React from "react";
import { motion } from "framer-motion";

const Partners = () => {
  // Array of dummy partners for the marquee slider
  const partners = Array(8).fill(0);

  return (
    <section className="partners-section">
      <div className="container">
        <div className="section-header">
          <motion.span 
            className="pre-title"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            JARINGAN KAMI
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Mitra Yayasan Andi Azhar (Yanhar)
          </motion.h2>
        </div>

        <div className="marquee-wrapper">
          <div className="marquee-content">
            {partners.map((_, i) => (
              <div className="partner-logo" key={`p1-${i}`}>
                <div className="placeholder-logo">Mitra {i + 1}</div>
              </div>
            ))}
            {/* Duplicate for infinite scroll */}
            {partners.map((_, i) => (
              <div className="partner-logo" key={`p2-${i}`}>
                <div className="placeholder-logo">Mitra {i + 1}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .partners-section {
          padding: 2rem 0 5rem 0;
          background: #ffffff;
          overflow: hidden;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .section-header {
          text-align: center;
          margin-bottom: 3rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .pre-title {
          display: inline-block;
          padding: 0.3rem 1rem;
          background: #f5f5f5;
          color: #666;
          border-radius: 6px;
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 1rem;
        }

        h2 {
          font-size: 2.2rem;
          color: var(--primary, #002147);
          margin: 0;
          font-weight: 700;
        }

        .marquee-wrapper {
          position: relative;
          width: 100%;
          overflow: hidden;
        }

        /* Fade effects on the edges */
        .marquee-wrapper::before,
        .marquee-wrapper::after {
          content: "";
          position: absolute;
          top: 0;
          width: 150px;
          height: 100%;
          z-index: 2;
          pointer-events: none;
        }

        .marquee-wrapper::before {
          left: 0;
          background: linear-gradient(to right, white 0%, transparent 100%);
        }

        .marquee-wrapper::after {
          right: 0;
          background: linear-gradient(to left, white 0%, transparent 100%);
        }

        .marquee-content {
          display: flex;
          width: fit-content;
          animation: marquee 30s linear infinite;
        }

        .marquee-content:hover {
          animation-play-state: paused;
        }

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50%)); }
        }

        .partner-logo {
          width: 200px;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 1.5rem;
          filter: grayscale(100%);
          opacity: 0.6;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .partner-logo:hover {
          filter: grayscale(0%);
          opacity: 1;
          transform: scale(1.05);
        }

        .placeholder-logo {
          width: 100%;
          height: 100%;
          border: 2px dashed #ccc;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: #aaa;
          font-size: 1.1rem;
          background: #fdfdfd;
        }

        @media (max-width: 768px) {
          h2 {
            font-size: 1.8rem;
          }
          .marquee-wrapper::before,
          .marquee-wrapper::after {
            width: 50px;
          }
          .partner-logo {
            width: 150px;
            height: 80px;
            margin: 0 1rem;
          }
        }
      `}</style>
    </section>
  );
};

export default Partners;
