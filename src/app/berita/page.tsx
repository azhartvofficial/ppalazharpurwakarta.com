"use client";
import React, { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
const sliderData = [
  {
    id: 1,
    title: "Kunjungan Ulama dari Universitas Al-Azhar Kairo Mesir",
    category: "Liputan Khusus",
    date: "28 April 2026",
    image: "https://images.unsplash.com/photo-1577985043696-8bd54d9f093f?q=80&w=1200&auto=format&fit=crop",
    link: "#"
  },
  {
    id: 2,
    title: "Pendaftaran Santri Baru Gelombang 2 Resmi Dibuka",
    category: "Pengumuman",
    date: "26 April 2026",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop",
    link: "#"
  },
  {
    id: 3,
    title: "Santri Al-Azhar Juara Umum Lomba Tahfidz Provinsi",
    category: "Prestasi",
    date: "24 April 2026",
    image: "https://images.unsplash.com/photo-1542820229-081e0c12af0b?q=80&w=1200&auto=format&fit=crop",
    link: "#"
  }
];

const latestNews = [
  {
    id: 4,
    title: "Tausiah Inspiratif Kekuatan Doa Orang Tua dalam Tabligh Akbar 100 Tahun",
    category: "SANTRI",
    date: "09 Jun 2026",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop",
    link: "#"
  },
  {
    id: 5,
    title: "Keberkahan Guru dan Estafet Amal Saleh: Catatan dari Materi Tabligh Akbar",
    category: "SANTRI",
    date: "09 Jun 2026",
    image: "https://images.unsplash.com/photo-1526676037777-05a232554f77?q=80&w=600&auto=format&fit=crop",
    link: "#"
  },
  {
    id: 6,
    title: "Menyiapkan Bekal untuk Kehidupan Abadi: Pesan Ustadz Das'ad Latif",
    category: "SANTRI",
    date: "08 Jun 2026",
    image: "https://images.unsplash.com/photo-1601662528567-526cd06f6582?q=80&w=400&auto=format&fit=crop",
    link: "#"
  },
  {
    id: 7,
    title: "Ribuan Hadirin Memadati Lapangan Hijau dalam Tabligh Akbar",
    category: "SANTRI",
    date: "08 Jun 2026",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400&auto=format&fit=crop",
    link: "#"
  },
  {
    id: 8,
    title: "PMDG Kirimkan 8 Delegasi dalam BPSARA di Singapura",
    category: "SANTRI",
    date: "07 Jun 2026",
    image: "https://images.unsplash.com/photo-1577985043696-8bd54d9f093f?q=80&w=400&auto=format&fit=crop",
    link: "#"
  },
  {
    id: 9,
    title: "Makna Kepemimpinan dalam Lakon Parikesit Dadi Ratu",
    category: "SANTRI",
    date: "06 Jun 2026",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=400&auto=format&fit=crop",
    link: "#"
  },
  {
    id: 10,
    title: "Ribuan Penonton Padati Pagelaran Wayang Kulit",
    category: "SANTRI",
    date: "05 Jun 2026",
    image: "https://images.unsplash.com/photo-1542820229-081e0c12af0b?q=80&w=400&auto=format&fit=crop",
    link: "#"
  },
  {
    id: 11,
    title: "Kunjungan Studi Banding dari Pesantren Darussalam Tasikmalaya",
    category: "KUNJUNGAN",
    date: "04 Jun 2026",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=400&auto=format&fit=crop",
    link: "#"
  },
  {
    id: 12,
    title: "Pelantikan Pengurus Organisasi Pelajar Pesantren Al-Azhar (OPPA)",
    category: "SANTRI",
    date: "03 Jun 2026",
    image: "https://images.unsplash.com/photo-1526676037777-05a232554f77?q=80&w=400&auto=format&fit=crop",
    link: "#"
  },
  {
    id: 13,
    title: "Ujian Syafahi Akhir Semester Genap Berjalan Lancar",
    category: "PENDIDIKAN",
    date: "02 Jun 2026",
    image: "https://images.unsplash.com/photo-1601662528567-526cd06f6582?q=80&w=400&auto=format&fit=crop",
    link: "#"
  }
];

const announcements = [
  { id: 1, title: "Jadwal Kedatangan Santri Lama Pasca Liburan Idul Fitri", date: "01 Mei 2026" },
  { id: 2, title: "Informasi Pembayaran SPP Bulanan Menggunakan Virtual Account", date: "29 April 2026" },
  { id: 3, title: "Undangan Rapat Wali Santri Calon Lulusan Tahun 2026", date: "25 April 2026" },
  { id: 4, title: "Rekrutmen Guru dan Musyrif Asrama Tahun Ajaran Baru", date: "20 April 2026" },
];

export default function BeritaPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [dbNews, setDbNews] = useState<any[]>([]);
  const [dbAnnouncements, setDbAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .eq('status', 'Published')
        .order('created_at', { ascending: false });

      if (data && !error) {
        setDbNews(data.filter(item => item.kategori === 'Artikel Berita'));
        setDbAnnouncements(data.filter(item => item.kategori === 'Papan Pengumuman'));
      }
      setLoading(false);
    };
    fetchNews();
  }, []);

  // Hapus fallback mock data, jika kosong ya benar-benar kosong
  const finalNews = dbNews;
  
  const finalSliderData = sliderData as any[];
  
  const finalAnnouncements = dbAnnouncements.length > 0 ? dbAnnouncements : [{
    id: 'empty-announcement',
    judul_utama: "Belum Ada Pengumuman",
    title: "Belum Ada Pengumuman",
    created_at: null,
    date: "-"
  }];

  // Implement Max 24 limit logic
  const limitedNews = finalNews.slice(0, 24);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(limitedNews.length / itemsPerPage) || 1;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = limitedNews.slice(startIndex, startIndex + itemsPerPage);

  // Fill empty slots with "Segera Hadir"
  const displayItems = [...currentItems];
  while (displayItems.length < itemsPerPage) {
    displayItems.push({
      id: `placeholder-${displayItems.length}` as any,
      judul_utama: "Segera Hadir",
      title: "Segera Hadir",
      kategori: "INFO",
      created_at: null,
      gambar_judul_url: "",
      link: "#",
      isPlaceholder: true
    } as any);
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % finalSliderData.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [finalSliderData.length]);

  return (
    <main className="berita-page">
      <Navbar />
      
      {/* Spacer for fixed navbar */}
      <div style={{ height: '80px', backgroundColor: 'var(--white)' }}></div>

      {/* Hero Carousel Section */}
      <section className="hero-slider-section">
        <div className="slider-container">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="slide-item"
              style={{ backgroundImage: `url(${finalSliderData[currentSlide]?.gambar_judul_url || finalSliderData[currentSlide]?.image || 'https://images.unsplash.com/photo-1577985043696-8bd54d9f093f?q=80&w=1200&auto=format&fit=crop'})` }}
            >
              <div className="slide-overlay">
                <div className="slide-content container">
                  <h1 className="slide-title">{finalSliderData[currentSlide]?.judul_utama || finalSliderData[currentSlide]?.title}</h1>
                  <div className="slide-meta">
                    <span className="slide-date">🗓 {finalSliderData[currentSlide]?.created_at ? new Date(finalSliderData[currentSlide].created_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'}) : finalSliderData[currentSlide]?.date}</span>
                  </div>
                  <Link href={`/berita/${finalSliderData[currentSlide]?.id}`} className="slide-btn">
                    Baca Berita
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slider Controls */}
          <div className="slider-controls">
            {finalSliderData.map((_, index) => (
              <button 
                key={index} 
                className={`slider-dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Main Portal Content */}
      <section className="portal-content-section">
        <div className="container portal-grid">
          
          {/* Main Left Column (70%) */}
          <div className="main-column">
            <div className="section-title-box">
              <h2>Berita <span>Terkini</span></h2>
              <div className="title-line"></div>
            </div>

            <div className="latest-news-grid">
              {displayItems.map((news, index) => {
                const isTopRow = index < 2;
                
                if ((news as any).isPlaceholder) {
                  return (
                    <article key={news.id} className={`news-grid-item ${isTopRow ? 'top-row' : 'bottom-row'} placeholder-item`}>
                      <div className="placeholder-content">
                        <span>Segera Hadir</span>
                      </div>
                    </article>
                  );
                }

                return (
                  <article key={news.id} className={`news-grid-item ${isTopRow ? 'top-row' : 'bottom-row'}`}>
                    <Link href={`/berita/${news.id}`} style={{ display: 'block', width: '100%', height: '100%', textDecoration: 'none', color: 'inherit' }}>
                      <img 
                        src={news.gambar_judul_url || news.image || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=400&auto=format&fit=crop'} 
                        alt={news.judul_utama || news.title || 'News'} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                      <div className="news-grid-overlay">
                        <h3 className="news-title">
                          {news.judul_utama || news.title}
                        </h3>
                      <div className="news-meta">
                        <span>{news.penulis || 'Humas'} - {news.created_at ? new Date(news.created_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'}) : news.date}</span>
                      </div>
                      
                      {/* Opsi Lampiran di Daftar Berita (jika ada) */}
                      {news.jenis_lampiran_2 && (
                         <div style={{ marginTop: '8px', pointerEvents: 'auto' }}>
                           <span 
                             onClick={(e) => {
                               e.preventDefault();
                               e.stopPropagation();
                               window.open(news.lampiran_2_url.split('|||')[0], '_blank', 'noopener,noreferrer');
                             }}
                             style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.7rem', padding: '4px 10px', background: 'rgba(255,255,255,0.2)', borderRadius: '4px', color: 'white', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.4)', transition: 'all 0.2s ease' }} 
                             onMouseOver={e => e.currentTarget.style.background = 'var(--primary)'} 
                             onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                           >
                               🔗 Lihat {news.jenis_lampiran_2}
                           </span>
                         </div>
                      )}
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                  <button 
                    key={pageNum} 
                    className={`page-item ${currentPage === pageNum ? 'active' : ''}`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                ))}
                {currentPage < totalPages && (
                  <button className="page-item" onClick={() => setCurrentPage(prev => prev + 1)}>Next &raquo;</button>
                )}
              </div>
            )}
          </div>

          {/* Sidebar Right Column (30%) */}
          <aside className="sidebar-column">
            
            {/* Widget: Pengumuman */}
            <div className="sidebar-widget widget-pengumuman">
              <div className="widget-header">
                <h3>Papan <span>Pengumuman</span></h3>
              </div>
              <div className="widget-content">
                <ul className="announcement-list">
                  {finalAnnouncements.map((item) => (
                    <li key={item.id}>
                      <Link href={`/berita/${item.id}`}>
                        <div className="ann-date">{item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'}) : item.date}</div>
                        <div className="ann-title">{item.judul_utama || item.title}</div>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link href="#" className="view-all-btn">Lihat Semua Pengumuman</Link>
              </div>
            </div>


          </aside>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        .berita-page {
          background-color: #f4f6f9;
        }

        /* Hero Slider CSS */
        .hero-slider-section {
          width: 100%;
          position: relative;
          background: #000;
        }

        .slider-container {
          position: relative;
          width: 100%;
          height: 550px;
          overflow: hidden;
        }

        .slide-item {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
        }

        .slide-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,33,71,0.95) 0%, rgba(0,33,71,0.4) 50%, rgba(0,0,0,0.1) 100%);
          display: flex;
          align-items: flex-end;
          padding-bottom: 80px;
        }

        .slide-content {
          color: white;
          z-index: 2;
        }

        .slide-category {
          display: inline-block;
          background: var(--secondary); /* Orange */
          color: white;
          padding: 6px 16px;
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          border-radius: 4px;
          margin-bottom: 15px;
          letter-spacing: 1px;
        }

        .slide-title {
          font-size: 2.8rem;
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 15px;
          max-width: 800px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }

        .slide-meta {
          font-size: 1rem;
          color: #e0e0e0;
          margin-bottom: 25px;
        }

        .slide-btn {
          display: inline-block;
          background: var(--primary);
          color: white;
          padding: 12px 30px;
          border-radius: 30px;
          font-weight: 600;
          transition: all 0.3s ease;
          border: 2px solid rgba(255,255,255,0.2);
        }

        .slide-btn:hover {
          background: white;
          color: var(--primary);
          border-color: white;
        }

        .slider-controls {
          position: absolute;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 10px;
          z-index: 10;
        }

        .slider-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: rgba(255,255,255,0.4);
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .slider-dot.active {
          background: var(--secondary);
          width: 30px;
          border-radius: 10px;
        }

        /* Portal Layout CSS */
        .portal-content-section {
          padding: 60px 0 100px;
        }

        .portal-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 40px;
          align-items: start;
        }

        /* Section Titles */
        .section-title-box {
          position: relative;
          margin-bottom: 30px;
          padding-bottom: 15px;
          border-bottom: 2px solid #e1e5eb;
        }

        .section-title-box h2 {
          font-size: 1.8rem;
          color: var(--primary);
          font-weight: 800;
        }

        .section-title-box h2 span {
          color: var(--secondary);
        }

        .title-line {
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 80px;
          height: 4px;
          background: var(--secondary);
        }

        /* Latest News Grid Masonry */
        .latest-news-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 4px;
        }

        .news-grid-item {
          position: relative;
          overflow: hidden;
          background: #000;
          display: block;
        }
        
        .news-grid-item img {
          transition: transform 0.5s ease;
        }

        .news-grid-item:hover img {
          transform: scale(1.05);
        }

        .news-grid-item.top-row {
          grid-column: span 6;
          height: 380px;
        }

        .news-grid-item.bottom-row {
          grid-column: span 4;
          height: 200px;
        }

        .placeholder-item {
          background: #eef2f6 !important;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px dashed #cbd5e1;
        }

        .placeholder-content span {
          color: #94a3b8;
          font-weight: 700;
          font-size: 1.1rem;
          letter-spacing: 1px;
        }

        .news-grid-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 50%, transparent 100%);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 20px;
          color: white;
          pointer-events: none;
        }

        .news-cat-badge {
          align-self: flex-start;
          background: var(--primary);
          color: white;
          padding: 4px 10px;
          font-size: 0.7rem;
          font-weight: 800;
          border-radius: 2px;
          margin-bottom: 10px;
          letter-spacing: 0.5px;
        }

        .news-title {
          color: white;
          font-weight: 700;
          line-height: 1.3;
          margin-bottom: 8px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
          pointer-events: auto;
        }

        .news-title a {
          color: white;
        }

        .news-grid-item.top-row .news-title {
          font-size: 1.6rem;
        }

        .news-grid-item.bottom-row .news-title {
          font-size: 0.95rem;
          margin-bottom: 5px;
        }

        .news-grid-item.bottom-row .news-grid-overlay {
          padding: 12px;
        }

        .news-meta {
          font-size: 0.75rem;
          color: #e0e0e0;
          font-weight: 500;
        }

        /* Pagination */
        .pagination {
          display: flex;
          gap: 10px;
          margin-top: 40px;
          justify-content: center;
        }

        .page-item {
          padding: 8px 16px;
          background: white;
          border: 1px solid #ddd;
          border-radius: 6px;
          color: var(--primary);
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .page-item:hover, .page-item.active {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
        }

        /* Sidebar Widgets */
        .sidebar-widget {
          background: white;
          border-radius: 12px;
          padding: 25px;
          box-shadow: 0 5px 20px rgba(0,0,0,0.03);
          margin-bottom: 30px;
          border-top: 4px solid var(--primary);
        }

        .widget-header {
          margin-bottom: 20px;
          border-bottom: 1px solid #eee;
          padding-bottom: 15px;
        }

        .widget-header h3 {
          font-size: 1.3rem;
          color: var(--primary);
          font-weight: 800;
        }

        .widget-header h3 span {
          color: var(--secondary);
        }

        /* Announcement List */
        .announcement-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .announcement-list li {
          margin-bottom: 15px;
          padding-bottom: 15px;
          border-bottom: 1px dashed #eee;
        }

        .announcement-list li:last-child {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
        }

        .announcement-list a {
          display: block;
          transition: transform 0.2s ease;
        }

        .announcement-list a:hover {
          transform: translateX(5px);
        }

        .ann-date {
          font-size: 0.8rem;
          color: var(--secondary);
          font-weight: 700;
          margin-bottom: 5px;
        }

        .ann-title {
          font-size: 0.95rem;
          color: var(--primary);
          font-weight: 600;
          line-height: 1.4;
        }

        .view-all-btn {
          display: block;
          text-align: center;
          margin-top: 20px;
          padding: 10px;
          background: #f4f6f9;
          color: var(--primary);
          font-weight: 700;
          border-radius: 6px;
          transition: background 0.2s ease;
        }

        .view-all-btn:hover {
          background: var(--primary);
          color: white;
        }

        /* Video Widget */
        .video-thumb {
          position: relative;
          width: 100%;
          height: 180px;
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 15px;
        }

        .play-btn {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 50px;
          height: 50px;
          background: rgba(255,255,255,0.9);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--secondary);
          font-size: 1.5rem;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .video-thumb:hover .play-btn {
          transform: translate(-50%, -50%) scale(1.1);
          background: var(--secondary);
          color: white;
        }

        .video-title {
          font-size: 0.95rem;
          color: var(--primary);
          font-weight: 700;
          line-height: 1.4;
        }

        /* Category List */
        .category-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .category-list li {
          margin-bottom: 10px;
        }

        .category-list a {
          display: flex;
          justify-content: space-between;
          padding: 10px 15px;
          background: #f8fafc;
          border-radius: 6px;
          color: #555;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .category-list a:hover {
          background: var(--primary);
          color: white;
        }

        .category-list a:hover span {
          color: rgba(255,255,255,0.8);
        }

        .category-list span {
          color: #999;
          font-size: 0.85rem;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .portal-grid {
            grid-template-columns: 1fr;
          }
          .slider-container {
            height: 450px;
          }
          .slide-title {
            font-size: 2.2rem;
          }
          .latest-news-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .news-grid-item.top-row {
            grid-column: span 1;
            height: 300px;
          }
          .news-grid-item.bottom-row {
            grid-column: span 1;
            height: 250px;
          }
          .news-grid-item.bottom-row .news-title {
            font-size: 1.2rem;
          }
        }

        @media (max-width: 768px) {
          .slider-container {
            height: 400px;
          }
          .slide-title {
            font-size: 1.8rem;
          }
          .latest-news-grid {
            grid-template-columns: 1fr;
          }
          .news-grid-item.top-row, .news-grid-item.bottom-row {
            grid-column: span 1;
            height: 250px;
          }
          .slide-content {
            padding: 0 20px;
          }
        }
      `}</style>
    </main>
  );
}
