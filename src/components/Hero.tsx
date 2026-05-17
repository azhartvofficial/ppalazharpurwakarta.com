"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const { t } = useLanguage();

  const slides = [
    {
      image: "/pesantren_hero.png",
      title: t('heroTitle1'),
      desc: t('heroDesc1')
    },
    {
      image: "/pesantren_learning.png",
      title: t('heroTitle2'),
      desc: t('heroDesc2')
    },
    {
      image: "/pesantren_mosque.png",
      title: t('heroTitle3'),
      desc: t('heroDesc3')
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="hero">
      {slides.map((slide, index) => (
        <div 
          key={index} 
          className={`slide ${index === current ? "active" : ""}`}
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          <div className="hero-overlay"></div>
          <div className="container hero-content">
            <div className="content-inner">
              <h1 className="hero-title">
                {slide.title}
              </h1>
              <p className="hero-desc">{slide.desc}</p>
            </div>
          </div>
        </div>
      ))}

      {/* Separated Glass Action Buttons */}
      <div className="hero-static-actions">
        <div className="container">
          <div className="hero-btns-separated">
            <Link href="/pendaftaran" className="glass-btn-pill">
              {t('ctaDaftar')}
            </Link>
            <Link href="#profil" className="glass-btn-pill secondary">
              {t('ctaJelajahi')}
            </Link>
          </div>
        </div>
      </div>

      {/* Removed nav buttons as requested */}

      <div className="hero-timeline-container">
        <div className="container">
          <div className="timeline-grid">
            {slides.map((slide, index) => (
              <div 
                key={index} 
                className={`timeline-item ${index === current ? "active" : ""}`}
                onClick={() => setCurrent(index)}
              >
                <div className="timeline-info">
                  <span className="timeline-title">{slide.title}</span>
                </div>
                <div className="timeline-bar-bg">
                  <div className={`timeline-bar-fill ${index === current ? "animate" : ""}`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .hero {
          height: 100vh;
          min-height: 700px;
          position: relative;
          overflow: hidden;
          background: #000;
        }

        .slide {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          opacity: 0;
          transition: opacity 1.5s ease-in-out, transform 2s ease;
          display: flex;
          align-items: center;
          text-align: left;
          color: var(--white);
          transform: scale(1.1);
        }

        .slide.active {
          opacity: 1;
          transform: scale(1);
          z-index: 10;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, rgba(0, 33, 71, 0.8) 0%, rgba(0, 33, 71, 0.4) 50%, rgba(0, 33, 71, 0) 100%);
        }

        .hero-content {
          position: relative;
          z-index: 20;
          width: 100%;
        }

        .content-inner {
          max-width: 850px;
          opacity: 0;
          transform: translateX(-30px);
          transition: all 1s ease 0.5s;
        }

        .slide.active .content-inner {
          opacity: 1;
          transform: translateX(0);
        }

        .hero-title {
          font-family: var(--font-custom), sans-serif;
          font-size: 3.5rem;
          font-weight: 400;
          line-height: 1.2;
          margin-bottom: 1.5rem;
          letter-spacing: -1px;
        }

        .hero-desc {
          font-size: 1.25rem;
          margin-bottom: 2rem;
          max-width: 700px;
          opacity: 0.9;
          font-weight: 400;
          line-height: 1.6;
        }

        .hero-static-actions {
          position: absolute;
          bottom: 20%;
          left: 0;
          width: 100%;
          z-index: 50;
        }

        .hero-btns-separated {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        :global(.glass-btn-pill) {
          display: inline-block;
          padding: 0.75rem 3rem;
          background: rgba(255, 255, 255, 0.1) !important;
          backdrop-filter: blur(40px) saturate(180%);
          -webkit-backdrop-filter: blur(40px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.25) !important;
          border-radius: 100px;
          color: #ffffff !important;
          font-family: 'Inter', sans-serif !important; /* Font tegas */
          font-weight: 900 !important;
          font-size: 0.8rem;
          letter-spacing: 2.5px;
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1) !important;
          cursor: pointer;
          text-align: center;
          text-decoration: none !important;
          text-transform: uppercase;
        }

        :global(.glass-btn-pill.secondary) {
          background: rgba(255, 255, 255, 0.08) !important; /* Slightly lighter but full clarity */
        }

        :global(.glass-btn-pill:hover) {
          background: rgba(255, 255, 255, 0.1) !important;
          border-color: rgba(255, 255, 255, 0.5) !important;
          transform: scale(1.08) translateY(-4px) !important;
          opacity: 1 !important;
          color: #ffffff !important;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
        }

        :global(.glass-btn-pill:active) {
          transform: scale(0.94) translateY(0) !important;
          background: rgba(255, 255, 255, 0.3) !important;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
          transition: all 0.1s ease !important;
        }

        .btn-white {
          background: white;
          color: var(--primary);
          padding: 0.8rem 2rem;
          font-weight: 700;
          border-radius: 4px;
        }

        .hero-timeline-container {
          position: absolute;
          bottom: 50px;
          left: 0;
          width: 100%;
          z-index: 100;
        }

        .timeline-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          max-width: 300px;
          margin: 0;
        }

        .timeline-item {
          cursor: pointer;
          transition: all 0.3s ease;
          opacity: 0.6;
        }

        .timeline-item.active {
          opacity: 1;
        }

        .timeline-info {
          display: flex;
          align-items: baseline;
          gap: 10px;
          margin-bottom: 10px;
          color: white;
        }

        .timeline-index {
          font-size: 0.8rem;
          font-weight: 700;
          opacity: 0.7;
        }

        .timeline-title {
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .timeline-bar-bg {
          height: 3px;
          background: rgba(255, 255, 255, 0.2);
          width: 100%;
          overflow: hidden;
          border-radius: 10px;
        }

        .timeline-bar-fill {
          height: 100%;
          width: 0;
          background: #ffffff;
        }

        .timeline-item.active .timeline-bar-fill.animate {
          animation: progress 6s linear forwards;
        }

        @keyframes progress {
          from { width: 0; }
          to { width: 100%; }
        }

        @media (max-width: 768px) {
          .timeline-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 0.3rem;
            max-width: 100px;
          }
          .timeline-title { 
            display: block; 
            font-size: 0.45rem; 
          }
          .timeline-bar-bg { height: 2px; }
          .hero-timeline-container { bottom: 20px; }
          .hero-title { font-size: 2.2rem; text-align: left; }
          .hero-desc { font-size: 0.95rem; text-align: left; }
          .hero-btns-separated { 
            flex-direction: row !important; 
            justify-content: flex-start !important;
            gap: 0.8rem;
            padding: 0;
            width: 100%;
          }
          :global(.glass-btn-pill) {
            padding: 0.7rem 1.2rem !important;
            font-size: 0.72rem !important;
            letter-spacing: 1px !important;
            width: fit-content;
            min-width: 130px;
          }
          .nav-btn { width: 40px; height: 40px; font-size: 1rem; }
          .prev { left: 10px; }
          .next { right: 10px; }
        }
      `}</style>
    </section>
  );
}
