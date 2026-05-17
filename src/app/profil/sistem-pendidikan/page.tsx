"use client";
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export default function SistemPendidikanPage() {
  const { t } = useLanguage();

  interface ConceptItem {
    title: string;
    subtitle: string;
    desc: string;
    image?: string;
    images?: string[];
    icon?: React.ReactNode;
    color: string;
  }

  const concepts: ConceptItem[] = [
    {
      title: "Kurikulum Pesantren",
      subtitle: "Al-Qur'an & Sunnah",
      desc: "Kurikulum ini berlandaskan pada Al-Qur'an dan Sunnah sebagai pedoman utama dalam mendidik santri. Dalam implementasinya, kami tidak berafiliasi pada satu organisasi atau mazhab tertentu, melainkan mengkaji secara mendalam pemikiran dan pendapat 4 Imam Mazhab guna memberikan wawasan keilmuan yang luas, inklusif, dan objektif bagi setiap santri.",
      image: "/Logo/Logo Pondok Pesantren.png",
      color: "#002147"
    },
    {
      title: "Kurikulum Nasional",
      subtitle: "STANDAR PENDIDIKAN",
      desc: "Kami menerapkan kurikulum resmi dari Kemendikbud dan Kemenag untuk menjamin kualitas akademik dan kompetensi standar nasional. Pembelajaran diintegrasikan untuk membekali santri dengan penguasaan sains, teknologi, dan ilmu pengetahuan umum yang selaras dengan nilai-nilai religius dan moderasi beragama.",
      images: ["/Logo/Logo Kemendikbud.png", "/Logo/Logo Kemenag.png"],
      color: "#ffffff"
    },
    {
      title: "Wawasan Modern",
      subtitle: "INTERNASIONAL",
      desc: "Pendidikan kami mengadopsi standar kurikulum nasional hingga internasional guna mencetak lulusan yang berdaya saing global. Melalui penguatan bahasa asing dan kompetensi modern, kami berkomitmen mengantarkan para alumni untuk melanjutkan studi ke berbagai perguruan tinggi ternama, baik di dalam negeri maupun mancanegara.",
      image: "/Logo/UNESCO.png",
      color: "#002147"
    }
  ];

  const curriculumPoints = [
    { title: "Tahfidzul Qur'an", detail: "Program unggulan yang mendidik santri untuk menghafal Al-Qur'an dengan tajwid dan pemahaman yang benar." },
    { title: "Bahasa Arab & Inggris", detail: "Pembiasaan komunikasi aktif menggunakan bahasa internasional untuk wawasan global." },
    { title: "Kajian Kitab Kuning", detail: "Pendalaman literatur Islam klasik untuk memahami hukum dan aqidah secara mendalam." },
    { title: "Kurikulum Nasional", detail: "Mengadopsi kurikulum resmi pemerintah untuk menjamin legalitas dan standar akademik kelulusan." }
  ];

  return (
    <main className="sistem-pendidikan-page">
      <Navbar />

      {/* Hero Header */}
      <section className="hero-header">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="pre-title">Metodologi & Kurikulum</span>
            <h1>Sistem Pendidikan</h1>
            <p className="school-name">Pesantren Al-Azhar Purwakarta</p>
            <p className="hero-desc">"Menjadikan Hafidz yang Sarjana dan Sarjana yang Hafidz"</p>
          </motion.div>
        </div>
      </section>

      {/* Concept Section */}
      <section className="concept-section">
        <div className="container">
          <div className="concept-grid">
            {concepts.map((item, idx) => (
              <motion.div 
                key={idx}
                className="concept-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
              >
                <div className="icon-wrapper-flex">
                  {item.image && (
                    <div className="card-icon" style={{ background: item.color }}>
                      <img src={item.image} alt={item.title} className="icon-img" />
                    </div>
                  )}
                  {item.images && item.images.map((img, i) => (
                    <div key={i} className="card-icon" style={{ background: item.color }}>
                      <img src={img} alt={`${item.title} ${i}`} className="icon-img" />
                    </div>
                  ))}
                  {item.icon && (
                    <div className="card-icon" style={{ background: item.color }}>
                      {item.icon}
                    </div>
                  )}
                </div>
                <span className="card-subtitle" style={{ textAlign: 'center', width: '100%' }}>{item.subtitle}</span>
                <h3 style={{ textAlign: 'center', width: '100%' }}>{item.title}</h3>
                <div className="divider"></div>
                <p style={{ textAlign: 'center', width: '100%' }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum Details */}
      <section className="curriculum-details">
        <div className="container">
          <div className="details-wrapper">
            <div className="details-text">
              <h2>Pilar Utama Pendidikan</h2>
              <div className="points-grid">
                {curriculumPoints.map((point, idx) => (
                  <div key={idx} className="point-item">
                    <div className="point-dot"></div>
                    <div className="point-content">
                      <h4>{point.title}</h4>
                      <p>{point.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="details-image">
              <img src="/Sistem Pendidikan.png" alt="Sistem Pendidikan" />
              <div className="image-overlay-box">
                <strong>Profesional dan Sinergi</strong>
                <span>Menuju lembaga modern untuk mencapai berkah dan ridho ilahi</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action or Summary */}
      <section className="summary-section">
        <div className="container">
          <div className="summary-box">
            <h3>Wujudkan Masa Depan Gemilang</h3>
            <p>Bersama Pesantren Al-Azhar Purwakarta, setiap santri didorong untuk menemukan potensi terbaiknya dalam lingkungan yang mendukung dan penuh berkah.</p>
          </div>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        .sistem-pendidikan-page {
          background: #ffffff;
        }

        .hero-header {
          padding: 12rem 0 6rem;
          background: linear-gradient(rgba(0, 33, 71, 0.9), rgba(0, 33, 71, 0.8)), url('/Al-Azhar 1.png');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          color: white;
          text-align: center;
        }

        .pre-title {
          color: var(--secondary);
          text-transform: uppercase;
          font-weight: 800;
          letter-spacing: 3px;
          font-size: 0.9rem;
          display: block;
          margin-bottom: 1rem;
        }

        h1 {
          font-size: 4rem;
          font-weight: 900;
          margin-bottom: 0;
          font-family: var(--font-custom), sans-serif;
        }

        .school-name {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--secondary);
          margin-bottom: 2rem;
          text-transform: uppercase;
          letter-spacing: 5px;
          opacity: 0.9;
        }

        .hero-desc {
          font-size: 1.25rem;
          max-width: 700px;
          margin: 0 auto;
          opacity: 0.8;
          line-height: 1.6;
        }

        .concept-section {
          padding: 80px 0 40px;
          margin-top: 40px;
          background: repeating-linear-gradient(
            45deg,
            rgba(0, 33, 71, 0.05),
            rgba(0, 33, 71, 0.05) 2px,
            transparent 2px,
            transparent 15px
          ), repeating-linear-gradient(
            -45deg,
            rgba(0, 33, 71, 0.05),
            rgba(0, 33, 71, 0.05) 2px,
            transparent 2px,
            transparent 15px
          );
        }

        .concept-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2.5rem;
        }

        .concept-card {
          background: white;
          padding: 3.5rem 2.5rem;
          border-radius: 30px;
          box-shadow: 0 30px 60px rgba(0,0,0,0.08);
          transition: all 0.4s ease;
          position: relative;
          z-index: 2;
          border-bottom: 5px solid #eee;
          text-align: center;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: flex-start !important;
        }

        .concept-card:hover {
          transform: translateY(-15px);
          border-bottom-color: var(--secondary);
        }

        .icon-wrapper-flex {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 2rem;
          width: 100%;
        }

        .card-icon {
          width: 80px;
          height: 80px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.2rem;
          box-shadow: 0 10px 25px rgba(0,0,0,0.06);
          padding: 12px;
          background: white !important;
          border: 1px solid #f0f0f0;
          transition: transform 0.3s ease;
        }

        .concept-card:hover .card-icon {
          transform: scale(1.05);
        }
        
        .icon-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .card-subtitle {
          color: var(--secondary);
          font-weight: 700;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          display: block;
          margin-bottom: 0.5rem;
          text-align: center;
          width: 100%;
        }

        .concept-card h3 {
          font-size: 1.8rem;
          color: var(--primary);
          margin-bottom: 1rem;
          text-align: center;
          width: 100%;
        }

        .divider {
          width: 60px;
          height: 4px;
          background: var(--secondary);
          margin: 0 auto 1.5rem auto !important;
          border-radius: 10px;
        }

        .concept-card p {
          color: #666;
          line-height: 1.7;
          font-size: 1.05rem;
          text-align: center;
          width: 100%;
        }

        .curriculum-details {
          padding: 40px 0 100px;
          background: #f8fafc;
        }

        .details-wrapper {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6rem;
          align-items: center;
        }

        .details-text h2 {
          font-size: 2.8rem;
          color: var(--primary);
          margin-bottom: 1.5rem;
        }

        .details-text p {
          font-size: 1.15rem;
          color: #555;
          margin-bottom: 3rem;
          line-height: 1.8;
        }

        .points-grid {
          display: grid;
          gap: 2rem;
        }

        .point-item {
          display: flex;
          gap: 1.5rem;
        }

        .point-dot {
          width: 12px;
          height: 12px;
          background: var(--secondary);
          border-radius: 50%;
          margin-top: 8px;
          flex-shrink: 0;
        }

        .point-content h4 {
          font-size: 1.25rem;
          color: var(--primary);
          margin-bottom: 0.5rem;
        }

        .point-content p {
          font-size: 0.95rem;
          color: #777;
          margin: 0;
        }

        .details-image {
          position: relative;
        }

        .details-image img {
          width: 100%;
          border-radius: 0;
          filter: drop-shadow(0 20px 40px rgba(0,0,0,0.1));
          object-fit: contain;
        }

        .image-overlay-box {
          position: absolute;
          bottom: -30px;
          right: -30px;
          background: white;
          padding: 2.5rem;
          border-radius: 25px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          display: flex;
          flex-direction: column;
          border-left: 8px solid var(--secondary);
        }

        .image-overlay-box strong {
          font-size: 1.3rem;
          color: var(--primary);
        }

        .image-overlay-box span {
          color: #666;
          font-weight: 500;
        }

        .summary-section {
          padding: 80px 0 120px;
        }

        .summary-box {
          background: var(--primary);
          padding: 4rem;
          border-radius: 40px;
          color: white;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .summary-box::before {
          content: '';
          position: absolute;
          top: -100px;
          right: -100px;
          width: 300px;
          height: 300px;
          background: rgba(255,255,255,0.05);
          border-radius: 50%;
        }

        .summary-box h3 {
          font-size: 2.5rem;
          margin-bottom: 1.5rem;
        }

        .summary-box p {
          font-size: 1.2rem;
          max-width: 800px;
          margin: 0 auto;
          opacity: 0.8;
          line-height: 1.8;
        }

        @media (max-width: 992px) {
          .details-wrapper {
            grid-template-columns: 1fr;
            gap: 4rem;
          }
          h1 { font-size: 2.8rem; }
          .hero-header { padding: 10rem 0 5rem; }
          .image-overlay-box {
            position: static;
            margin-top: 2rem;
          }
        }


      `}</style>
    </main>
  );
}
