"use client";
import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

const AcademicPrograms = () => {
  const { language } = useLanguage();

  const programs = [
    {
      title: "Tahfidz Al-Qur'an",
      subtitle: "Mujahid Qur'ani",
      image: "https://images.unsplash.com/photo-1584281729155-3c9933073019?q=80&w=2070&auto=format&fit=crop",
    },
    {
      title: "Bahasa Arab",
      subtitle: "Literasi Islam",
      image: "https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?q=80&w=2070&auto=format&fit=crop",
    },
    {
      title: "Sains & Teknologi",
      subtitle: "Mujahid Digital",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop",
    },
    {
      title: "Kitab Kuning",
      subtitle: "Dirasah Islamiyah",
      image: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=2070&auto=format&fit=crop",
    },
  ];

  const allPrograms = [...programs, ...programs, ...programs, ...programs, ...programs]; 

  return (
    <section className="academic-section">
      <div className="container">
        <div className="section-header">
          <h2 className="title-main">
            Program Akademik Unggul <br />
            <span>bagi Para Mujahid Masa Depan</span>
          </h2>
          <p className="description">
            Program Akademik yang dirancang untuk mensinergikan kecerdasan intelektual, 
            spiritual, dan keterampilan teknologi guna melahirkan mujahid yang siap menghadapi tantangan global.
          </p>
        </div>
      </div>

      <div className="slider-wrapper">
        <div className="slider-track">
          {allPrograms.map((item, index) => (
            <div className="program-card" key={index}>
              <div className="card-bg" style={{ backgroundImage: `url(${item.image})` }}></div>
              <div className="card-overlay"></div>
              <div className="card-content">
                <span className="card-subtitle">{item.subtitle}</span>
                <h3 className="card-title">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container">
        <div className="academic-cta-banner">
          <h2 className="cta-text">
            Jelajahi persyaratan pendaftaran <br />
            dan join sekarang
          </h2>
          <Link href="/pendaftaran">
            <button className="cta-button">
              Pendaftaran <span className="arrow-icon">→</span>
            </button>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .academic-section {
          padding: 1rem 0 1rem 0;
          background: #fff;
          overflow: hidden;
        }

        .section-header {
          text-align: center;
          margin-bottom: 2rem;
          max-width: 1000px;
          margin-left: auto;
          margin-right: auto;
          padding: 0 1rem;
        }

        .badge-wrapper {
          display: flex;
          justify-content: center;
          width: 100%;
          margin-bottom: 1rem;
          position: relative;
          padding: 0.5rem 0;
        }

        .section-badge {
          display: inline-block;
          padding: 0.3rem 1rem;
          background: #f5f5f5;
          color: #666;
          border-radius: 6px;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          position: relative;
          z-index: 1;
        }

        .title-main {
          font-family: var(--font-custom), sans-serif;
          font-size: 3.5rem;
          color: var(--primary);
          line-height: 1.05;
          margin-bottom: 0.8rem; /* Closer to description */
          font-weight: 400;
        }

        .title-main span {
          color: var(--primary);
          font-weight: 400;
        }

        .description {
          color: #666;
          font-size: 0.95rem; /* Smaller font */
          line-height: 1.6;
          max-width: 850px;
          margin: 0 auto;
          text-align: justify;
        }

        /* Slider Styles */
        .slider-wrapper {
          width: 100%;
          overflow: hidden;
          padding: 2rem 0;
          position: relative;
        }

        .slider-wrapper::before,
        .slider-wrapper::after {
          content: "";
          position: absolute;
          top: 0;
          width: 250px;
          height: 100%;
          z-index: 2;
          pointer-events: none;
        }

        .slider-wrapper::before {
          left: 0;
          background: linear-gradient(to right, white 0%, white 20%, transparent 100%);
        }

        .slider-wrapper::after {
          right: 0;
          background: linear-gradient(to left, white 0%, white 20%, transparent 100%);
        }

        .slider-track {
          display: flex;
          gap: 1rem;
          width: fit-content;
          animation: infiniteScroll 40s linear infinite;
        }

        @keyframes infiniteScroll {
          from { transform: translateX(0); }
          to { transform: translateX(calc(-300px * 4 - 4rem)); } /* Total width of one set of 4 cards */
        }

        .program-card {
          width: 300px;
          height: 380px;
          flex-shrink: 0;
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
        }

        .card-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          transition: transform 0.8s ease;
        }

        .card-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            to top,
            rgba(0, 51, 102, 0.9) 0%,
            rgba(0, 51, 102, 0.3) 50%,
            transparent 100%
          );
        }

        .card-content {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          padding: 2rem;
          color: white;
          z-index: 1;
        }

        .card-subtitle {
          display: block;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 0.5rem;
          opacity: 0.9;
          font-weight: 600;
        }

        .card-title {
          font-size: 1.5rem;
          font-weight: 700;
          line-height: 1.2;
          font-family: var(--font-custom), sans-serif;
        }

        /* Removed hover zoom as requested */
        .program-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0, 51, 102, 0.15);
        }

        @media (max-width: 768px) {
          .title-main { font-size: 2rem; }
          .program-card { width: 260px; height: 340px; }
          
          /* Reduced white masks for mobile */
          .slider-wrapper::before,
          .slider-wrapper::after {
            width: 60px;
          }

          .slider-track {
            margin-left: 0;
            animation: infiniteScrollMobile 25s linear infinite;
          }

          @keyframes infiniteScrollMobile {
            from { transform: translateX(0); }
            to { transform: translateX(calc(-260px * 4 - 4rem)); }
          }
        }

        .academic-cta-banner {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          padding: 2.5rem 4rem;
          margin: 1rem auto 2rem auto;
          max-width: 900px;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(30px) saturate(200%);
          -webkit-backdrop-filter: blur(30px) saturate(200%);
          border-radius: 40px;
          border: 1px solid rgba(255, 255, 255, 0.4);
          box-shadow: 
            0 25px 80px rgba(0, 51, 102, 0.1),
            inset 0 0 40px rgba(255, 255, 255, 0.3);
          position: relative;
          overflow: hidden;
          transition: all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
          gap: 5rem;
          z-index: 5;
        }

        .academic-cta-banner::after {
          content: "";
          position: absolute;
          top: -100px;
          left: -100px;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(0, 119, 204, 0.15) 0%, transparent 70%);
          filter: blur(40px);
          z-index: -1;
          animation: liquidFlow 10s infinite alternate;
        }

        @keyframes liquidFlow {
          from { transform: translate(0, 0); }
          to { transform: translate(400px, 100px); }
        }

        .academic-cta-banner:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 40px 100px rgba(0, 51, 102, 0.15);
          border-color: rgba(255, 255, 255, 0.8);
        }

        .cta-text {
          position: relative;
          z-index: 10;
          font-family: var(--font-custom), sans-serif;
          color: #003366;
          text-shadow: 0 2px 4px rgba(255, 255, 255, 0.5);
          font-size: 1.9rem;
          line-height: 1.3;
          font-weight: 400;
          margin: 0;
          text-align: left;
        }

        .cta-button {
          position: relative;
          z-index: 10;
          display: flex;
          align-items: center;
          gap: 15px;
          background: linear-gradient(135deg, #0056b3 0%, #007bff 100%);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 1.1rem 2.6rem;
          border-radius: 100px;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.4s ease;
          box-shadow: 0 10px 30px rgba(0, 86, 179, 0.3);
        }

        .cta-button:hover {
          background: #004494;
          transform: scale(1.05);
          box-shadow: 0 15px 35px rgba(0, 86, 179, 0.3);
        }

        .arrow-icon {
          font-size: 1.3rem;
          transition: transform 0.3s ease;
        }

        .cta-button:hover .arrow-icon {
          transform: translateX(5px);
        }

        @media (max-width: 768px) {
          .academic-section { padding: 1rem 0 0.5rem 0; }
          .academic-cta-banner {
            flex-direction: column;
            padding: 2.5rem 1rem !important;
            text-align: center;
            gap: 2rem;
            margin: 2rem 0;
          }
          .cta-text {
            font-size: 1.28rem !important;
            text-align: center;
            line-height: 1.3;
            letter-spacing: -0.3px !important;
          }
          .cta-button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
};

export default AcademicPrograms;
