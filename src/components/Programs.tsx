"use client";
import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Programs() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -382, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollRef.current.scrollBy({ left: 382, behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      scrollRight();
    }, 8000); // Sangat lama (8 detik)
    return () => clearInterval(interval);
  }, []);

  const news = [
    {
      title: "Penerimaan Santri Baru Tahun Ajaran 2026/2027 Resmi Dibuka",
      date: "12 Mei 2026",
      category: "Pengumuman",
      image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto=format&fit=crop",
      excerpt: "Alhamdulillah, Pondok Pesantren Al-Azhar kembali membuka pendaftaran untuk santri baru dengan berbagai program unggulan."
    },
    {
      title: "Prestasi Gemilang Santri di Ajang Musabaqah Qira'atil Kutub",
      date: "05 Mei 2026",
      category: "Prestasi",
      image: "https://images.unsplash.com/photo-1609599006353-e629aaab31bc?q=80&w=2000&auto=format&fit=crop",
      excerpt: "Delegasi santri Al-Azhar berhasil membawa pulang juara umum pada ajang MQK tingkat Nasional."
    },
    {
      title: "Kunjungan Studi Banding dari Universitas Al-Azhar Kairo",
      date: "28 April 2026",
      category: "Kunjungan",
      image: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=2070&auto=format&fit=crop",
      excerpt: "Mempererat tali silaturahmi dan kerja sama pendidikan, masyayikh dari Al-Azhar Kairo mengunjungi pondok kami."
    },
    {
      title: "Peresmian Gedung Asrama Baru Khusus Santri Tahfidz",
      date: "15 April 2026",
      category: "Infrastruktur",
      image: "https://images.unsplash.com/photo-1584281729155-3c9933073019?q=80&w=2070&auto=format&fit=crop",
      excerpt: "Fasilitas asrama modern khusus untuk program tahfidz intensif telah resmi beroperasi."
    }
  ];

  return (
    <section id="berita" className="news-section">
      <div className="container">
        <div className="section-header">
          <div className="header-left">
            <span className="pre-title">KABAR TERKINI</span>
            <h2 className="blue-title">Berita Al-Azhar</h2>
          </div>
        </div>

        <div className="slider-wrapper">
          <button onClick={scrollLeft} className="side-nav prev" aria-label="Previous">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          
          <div className="news-slider" ref={scrollRef}>
            {news.map((item, index) => (
              <motion.div 
                key={index} 
                className="news-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="news-img-wrapper">
                  <div className="news-img" style={{ backgroundImage: `url(${item.image})` }}></div>
                </div>
                <div className="news-content">
                  <span className="news-date">{item.date}</span>
                  <h3 className="news-title">{item.title}</h3>
                  <p className="news-excerpt">{item.excerpt}</p>
                  <Link href="/berita" className="read-more">Baca Selengkapnya &rarr;</Link>
                </div>
              </motion.div>
            ))}
          </div>

          <button onClick={scrollRight} className="side-nav next" aria-label="Next">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>

        <div className="bottom-actions">
          <Link href="/berita" className="view-all-btn">
            Lihat Semua Berita
          </Link>
        </div>
        
        <p className="news-desc-bottom">Dikelola oleh Azhar TV</p>
      </div>

      <style jsx>{`
        .news-section {
          padding: 3rem 0 3rem 0;
          background: #ffffff;
          overflow: hidden;
          position: relative;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          position: relative;
        }

        .section-header {
          display: flex;
          justify-content: center;
          text-align: center;
          margin-bottom: 2rem;
        }

        .pre-title {
          display: inline-block;
          padding: 0.4rem 1.2rem;
          background: rgba(0, 33, 71, 0.05);
          color: var(--primary);
          border-radius: 50px;
          font-size: 0.8rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 0.2rem;
        }

        .news-desc-bottom {
          text-align: center;
          font-size: 0.9rem;
          color: #888;
          font-style: italic;
          margin-top: 2rem;
        }

        .blue-title {
          font-size: 3.5rem;
          color: #002147; /* Biru Tua Al-Azhar */
          margin: 0;
          font-weight: 900;
          line-height: 1.1;
        }

        .slider-wrapper {
          position: relative;
          margin: 0 -1rem;
          padding: 0 1rem;
        }

        .side-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 64px;
          height: 64px;
          background: white;
          border: 1.5px solid rgba(0, 33, 71, 0.1);
          border-radius: 50%;
          box-shadow: 0 15px 35px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
          cursor: pointer;
          z-index: 10;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .side-nav:hover {
          background: var(--primary);
          color: white;
          transform: translateY(-50%) scale(1.15);
          box-shadow: 0 20px 40px rgba(0, 33, 71, 0.25);
        }

        .side-nav.prev { left: -32px; }
        .side-nav.next { right: -32px; }

        .news-slider {
          display: flex;
          gap: 2rem;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
          padding: 1rem 0 1rem 0;
          -webkit-overflow-scrolling: touch;
        }

        .news-slider::-webkit-scrollbar {
          display: none;
        }

        .news-card {
          min-width: 380px;
          max-width: 380px;
          scroll-snap-align: center;
          background: white;
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 15px 45px rgba(0,0,0,0.06);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid rgba(0,0,0,0.04);
        }

        .news-card:hover {
          transform: translateY(-12px);
          box-shadow: 0 35px 70px rgba(0, 33, 71, 0.15);
        }

        .news-img-wrapper {
          width: 100%;
          height: 260px;
          position: relative;
          overflow: hidden;
        }

        .news-img {
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          transition: transform 1s ease;
        }

        .news-card:hover .news-img {
          transform: scale(1.1);
        }


        .news-content {
          padding: 2.2rem;
          display: flex;
          flex-direction: column;
        }

        .news-date {
          font-size: 0.9rem;
          color: #888;
          font-weight: 600;
          margin-bottom: 0.8rem;
        }

        .news-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--primary);
          margin-bottom: 1.2rem;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .news-excerpt {
          font-size: 1.05rem;
          color: #555;
          line-height: 1.7;
          margin-bottom: 2rem;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .read-more {
          font-weight: 800;
          color: #ff8c00;
          font-size: 0.95rem;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          transition: all 0.3s ease;
        }

        .read-more:hover {
          gap: 1rem;
        }

        .bottom-actions {
          display: flex;
          justify-content: center;
          margin-top: 0rem;
        }

        .view-all-btn {
          display: inline-block;
          color: white;
          background: #002147;
          font-weight: 800;
          text-decoration: none;
          font-size: 0.95rem;
          padding: 1rem 3rem;
          border-radius: 50px;
          transition: all 0.4s ease;
          position: relative;
          z-index: 1;
          text-transform: uppercase;
          letter-spacing: 1px;
          box-shadow: 0 10px 25px rgba(0, 33, 71, 0.2);
          overflow: hidden;
        }

        .view-all-btn::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), transparent);
          z-index: -1;
        }

        .view-all-btn:hover {
          background: #ff8c00;
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(255, 140, 0, 0.3);
          letter-spacing: 1.5px;
        }

        .view-all-btn:active {
          transform: translateY(-2px) scale(0.96);
          box-shadow: 0 5px 15px rgba(255, 140, 0, 0.2);
          transition: all 0.1s ease;
        }

        @media (max-width: 992px) {
          .blue-title { font-size: 2.8rem; }
          .side-nav { width: 50px; height: 50px; }
          .side-nav.prev { left: -15px; }
          .side-nav.next { right: -15px; }
        }

        @media (max-width: 768px) {
          .news-section { padding: 1rem 0; }
          .blue-title { font-size: 2.2rem; }
          .news-card { min-width: 300px; max-width: 300px; }
          .side-nav { display: flex; transform: translateY(-50%); }
          .side-nav.prev { left: 5px; }
          .side-nav.next { right: 5px; }
          .view-all-btn { width: 100%; justify-content: center; padding: 1rem 2rem; }
        }
      `}</style>
    </section>
  );
}
