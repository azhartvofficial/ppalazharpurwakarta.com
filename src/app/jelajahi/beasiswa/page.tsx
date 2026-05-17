"use client";
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { motion } from "framer-motion";

const BeasiswaPage = () => {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-content"
          >
            <span className="badge">Program Solusi Umat</span>
            <h1>Langkah Awal Menuju Masa Depan yang lebih Berwarna</h1>
            <p>
              Pendidikan berkualitas adalah hak setiap anak. Pondok Pesantren Al-Azhar Purwakarta 
              hadir dengan program beasiswa khusus untuk memastikan potensi terbaik tidak terhenti 
              karena kendala biaya.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="content-section">
        <div className="container grid-layout">
          <div className="text-content">
            <h2>Membuka Pintu Harapan</h2>
            <p>
              Banyak santri berbakat menghadapi tantangan ekonomi yang menghambat langkah mereka dalam menuntut ilmu. 
              Al-Azhar memahami hal ini dan berkomitmen untuk menjadi jembatan bagi mereka. 
              Melalui Jalur Beasiswa, kami mengundang putra-putri terbaik bangsa untuk bergabung tanpa harus khawatir akan beban finansial.
            </p>
            
            <div className="feature-list">
              <div className="feature-item">
                <div className="icon">✓</div>
                <div>
                  <h3>Beasiswa Tahfidz</h3>
                  <p>Bagi calon santri yang memiliki hafalan Al-Qur'an minimal 3 Juz.</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="icon">✓</div>
                <div>
                  <h3>Beasiswa Prestasi</h3>
                  <p>Bagi calon santri yang memiliki prestasi akademik atau non-akademik di tingkat kabupaten/provinsi.</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="icon">✓</div>
                <div>
                  <h3>Beasiswa Afirmasi</h3>
                  <p>Bantuan khusus bagi keluarga kurang mampu dengan potensi akademik tinggi.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="cta-sidebar">
            <div className="sticky-box">
              <h3>Siap Melangkah?</h3>
              <p>Segera daftarkan diri Anda dan raih kesempatan beasiswa tahun ini.</p>
              <Link href="/pendaftaran">
                <button className="primary-btn">Daftar Sekarang</button>
              </Link>
              <button className="secondary-btn">Konsultasi via WhatsApp</button>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        .hero-section {
          padding: 12rem 0 6rem 0;
          background: linear-gradient(135deg, #003366 0%, #0056b3 100%);
          color: white;
          text-align: center;
        }

        .badge {
          display: inline-block;
          padding: 0.5rem 1.5rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 100px;
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 2rem;
          color: #e67e22;
        }

        h1 {
          font-family: var(--font-custom), sans-serif;
          font-size: 3.5rem;
          max-width: 900px;
          margin: 0 auto 2rem auto;
          line-height: 1.1;
        }

        .hero-content p {
          font-size: 1.25rem;
          max-width: 700px;
          margin: 0 auto;
          opacity: 0.9;
          line-height: 1.6;
        }

        .content-section {
          padding: 6rem 0;
        }

        .grid-layout {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 4rem;
        }

        h2 {
          font-family: var(--font-custom), sans-serif;
          font-size: 2.5rem;
          color: #003366;
          margin-bottom: 1.5rem;
        }

        .text-content p {
          font-size: 1.1rem;
          color: #555;
          line-height: 1.8;
          margin-bottom: 3rem;
        }

        .feature-list {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .feature-item {
          display: flex;
          gap: 1.5rem;
          padding: 2rem;
          background: #f8f9fa;
          border-radius: 20px;
          transition: all 0.3s ease;
        }

        .feature-item:hover {
          transform: translateX(10px);
          background: #f0f7ff;
        }

        .icon {
          width: 40px;
          height: 40px;
          background: #0056b3;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          flex-shrink: 0;
        }

        .feature-item h3 {
          font-size: 1.3rem;
          color: #003366;
          margin-bottom: 0.5rem;
        }

        .feature-item p {
          margin-bottom: 0;
          font-size: 1rem;
        }

        .cta-sidebar .sticky-box {
          position: sticky;
          top: 120px;
          padding: 3rem;
          background: #fff;
          border-radius: 30px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.05);
          border: 1px solid #eee;
          text-align: center;
        }

        .sticky-box h3 {
          font-family: var(--font-custom), sans-serif;
          font-size: 1.8rem;
          color: #003366;
          margin-bottom: 1rem;
        }

        .primary-btn {
          width: 100%;
          background: #0056b3;
          color: white;
          border: none;
          padding: 1.1rem;
          border-radius: 12px;
          font-weight: 700;
          margin-top: 1.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .secondary-btn {
          width: 100%;
          background: transparent;
          color: #25d366;
          border: 2px solid #25d366;
          padding: 1rem;
          border-radius: 12px;
          font-weight: 700;
          margin-top: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .primary-btn:hover { background: #003366; transform: scale(1.02); }
        .secondary-btn:hover { background: #25d366; color: white; }

        @media (max-width: 992px) {
          .grid-layout { grid-template-columns: 1fr; gap: 3rem; }
          h1 { font-size: 2.5rem; }
        }

        @media (max-width: 768px) {
          .hero-section { padding: 10rem 1rem 5rem 1rem; }
          h1 { font-size: 2rem; }
          .grid-layout { padding: 0 1.5rem; }
        }
      `}</style>
    </main>
  );
};

export default BeasiswaPage;
