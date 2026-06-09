"use client";
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import localFont from "next/font/local";
import Image from "next/image";

const frizQuadrata = localFont({
  src: "../../Font/friz-quadrata-std-medium-5870338ec7ef8.otf",
  variable: "--font-friz",
});

export default function AzharTvPage() {
  const [activeSlide, setActiveSlide] = useState(0);

  const newsSlides = [
    {
      title: "Penerimaan Santri Baru Tahun Ajaran 2026/2027 Resmi Dibuka",
      image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto=format&fit=crop",
      excerpt: "Alhamdulillah, Pondok Pesantren Al-Azhar kembali membuka pendaftaran untuk santri baru dengan berbagai program unggulan yang dirancang untuk mencetak generasi Qur'ani yang berwawasan global.",
      date: "12 Mei 2026"
    },
    {
      title: "Prestasi Gemilang Santri di Ajang Musabaqah Qira'atil Kutub",
      image: "https://images.unsplash.com/photo-1609599006353-e629aaab31bc?q=80&w=2000&auto=format&fit=crop",
      excerpt: "Delegasi santri Al-Azhar berhasil membawa pulang juara umum pada ajang MQK tingkat Nasional. Pencapaian ini membuktikan bahwa kualitas pendidikan kitab kuning di pesantren kami mampu bersaing di kancah nasional.",
      date: "05 Mei 2026"
    },
    {
      title: "Kunjungan Studi Banding dari Universitas Al-Azhar Kairo",
      image: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=2070&auto=format&fit=crop",
      excerpt: "Mempererat tali silaturahmi dan kerja sama pendidikan, masyayikh dari Al-Azhar Kairo mengunjungi pondok kami untuk berdiskusi mengenai pengembangan kurikulum dan pertukaran pelajar di masa depan.",
      date: "28 April 2026"
    },
    {
      title: "Peresmian Gedung Asrama Baru Khusus Santri Tahfidz",
      image: "https://images.unsplash.com/photo-1584281729155-3c9933073019?q=80&w=2070&auto=format&fit=crop",
      excerpt: "Fasilitas asrama modern khusus untuk program tahfidz intensif telah resmi beroperasi. Fasilitas ini dilengkapi dengan lingkungan yang kondusif untuk mendukung santri dalam menghafal Al-Qur'an 30 juz.",
      date: "15 April 2026"
    }
  ];

  const youtubeVideos = [
    { title: "Profil Pondok Pesantren Al-Azhar", category: "OFFICIAL PROFILE", thumbnail: "https://res.cloudinary.com/dpgqct4hz/image/upload/v1778999219/yfb3mbixr4otuvcl6wmp.jpg", url: "#" },
    { title: "Kegiatan Harian Santri Tahfidz", category: "SANTRI LIFE", thumbnail: "https://res.cloudinary.com/dpgqct4hz/image/upload/v1778999222/ukeruaf1uucte6dv8iga.png", url: "#" },
    { title: "Tips Menghafal Al-Qur'an Metode Azhari", category: "TIPS & TRICK", thumbnail: "https://res.cloudinary.com/dpgqct4hz/image/upload/v1778999223/u4w8kpjgqksooonrotdc.png", url: "#" },
  ];

  const documentationEvents = [
    { title: "Ramadhan Kareem 1447H", count: "250+ Photos", link: "https://drive.google.com" },
    { title: "Porseni Antar Kelas 2026", count: "180+ Photos", link: "https://drive.google.com" },
    { title: "Rihlah Ilmiah Jawa Timur", count: "320+ Photos", link: "https://drive.google.com" },
    { title: "Idul Adha & Qurban 2025", count: "120+ Photos", link: "https://drive.google.com" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % newsSlides.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [newsSlides.length]);

  const activeNews = newsSlides[activeSlide];

  return (
    <main className="tv-page">
      <Navbar />

      {/* Top News Slider - UPI Style */}
      <section className="news-section">
        <div className="container">
          <div className="news-content-wrapper">
            <div className="news-grid">
              <div className="news-text-content">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSlide}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h2 className={`main-title ${frizQuadrata.className}`}>{activeNews.title}</h2>
                    <p className="news-desc">{activeNews.excerpt}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="news-image-content">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSlide}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.5 }}
                    style={{ width: '100%' }}
                  >
                    <div className="featured-img" style={{ backgroundImage: `url(${activeNews.image})` }}>
                    </div>
                  </motion.div>
                </AnimatePresence>
                <div className="slider-controls-custom">
                  {newsSlides.map((_, idx) => (
                    <button 
                      key={idx}
                      className={`dot-indicator ${idx === activeSlide ? 'active' : ''}`}
                      onClick={() => setActiveSlide(idx)}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                  <button 
                    className="next-btn-round"
                    onClick={() => setActiveSlide((activeSlide + 1) % newsSlides.length)}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#002147" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome Bar */}
      <section className="welcome-tv">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="welcome-box"
          >
            <h2 className={`${frizQuadrata.className} rainbow-text`} style={{ fontSize: 'clamp(2rem, 6vw, 3.8rem)', margin: '0 0 -1.5rem 0', letterSpacing: '-1px', lineHeight: 1.2, position: 'relative', zIndex: 10 }}>
              Selamat Datang di Laman Resmi Media
            </h2>
            <div className="welcome-logo">
              <Image src="/Logo/Azhar%20Tv%20Logo.webp" alt="Azhar TV Logo" width={280} height={160} style={{ objectFit: 'contain' }} unoptimized />
            </div>
            <p style={{ fontSize: 'clamp(1rem, 4vw, 1.3rem)', color: '#475569', lineHeight: 1.7, margin: 0 }}>
              Saluran informasi, dokumentasi, dan inspirasi seputar kegiatan Pondok Pesantren Al-Azhar Purwakarta.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Sambutan Manager */}
      <section className="manager-greeting">
        <div className="container">
          <div className="manager-content">
            <motion.div 
              className="manager-image"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Image 
                src="/Ketua%20Media%20Azhar%20Tv.png" 
                alt="Darmawan Bahtiar, C. Sq" 
                width={600} 
                height={750} 
                style={{ objectFit: 'contain' }} 
                className="manager-img"
                unoptimized 
              />
            </motion.div>
            <motion.div 
              className="manager-text"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="manager-role">MANAGER OF AZHAR TV MEDIA</h3>
              <h4 className="manager-name-large">Darmawan Bahtiar, C. Sq</h4>
              <div className="blue-divider-small"></div>
              <div className="quote-text">
                <p>Assalamu’alaikum Warahmatullahi Wabarakatuh,</p>
                <p>Selamat datang di Azhar TV, Media resmi Pondok Pesantren Al-Azhar Purwakarta.</p>
                <p>Puji dan syukur senantiasa kita panjatkan ke hadirat Allah SWT, serta shalawat dan salam semoga selalu tercurah kepada uswatun hasanah kita, Nabi Muhammad SAW.</p>
                <p>Di era digital yang bergerak begitu cepat ini, Pondok Pesantren Al-Azhar Purwakarta berkomitmen untuk tidak hanya mencetak generasi yang tafaqquh fiddin (paham agama), tetapi juga kreatif dan adaptif terhadap perkembangan zaman. Azhar TV hadir sebagai wadah syiar, sekaligus jembatan informasi antara pesantren, orang tua santri, alumni, dan masyarakat luas.</p>
                <p>Melalui media ini, kami dengan bangga menyajikan <strong>Lensa Kegiatan Santri</strong>: Rekaman dokumentasi foto dan video yang menangkap momen-momen berharga para santri, mulai dari kedisiplinan mengaji, menghafal Al-Qur'an, hingga keseruan berorganisasi dan berolahraga dan menjadi <strong>Kreativitas Ruang ekspresi</strong> bagi para santri untuk menyalurkan bakat mereka di bidang multimedia, dakwah visual, dan karya seni islami.</p>
                <p>Azhar TV hadir memberikan Dokumentasi kajian, kegiatan besar pesantren, serta nilai-nilai budi pekerti luhur yang diajarkan sehari-hari di pondok pesantren Al-Azhar. kami juga hadir sebagai mediator untuk <strong>Melihat Al-Azhar Lebih Dekat, Merasakan Kehangatan Nyata</strong>. Melalui setiap jepretan foto dan setiap detik video yang kami tayangkan, kami ingin mengajak Anda semua untuk melihat lebih dekat bagaimana karakter, kemandirian, dan akhlak mulia para santri dibentuk di sini.</p>
                <p>Terima kasih atas dukungan, doa, dan kepercayaan yang terus mengalir untuk Pondok Pesantren Al-Azhar Purwakarta. Jangan lupa untuk terus mengikuti perkembangan, menyukai, dan membagikan setiap konten positif dari kami sebagai bagian dari syiar kebaikan.</p>
                <p>Wassalamu’alaikum Warahmatullahi Wabarakatuh,</p>
                <p><strong>Manajemen Azhar TV</strong></p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Managed Platforms */}
      <section className="managed-platforms">
        <div className="container">
          <div className="section-title text-center">
            <h2 className={frizQuadrata.className} style={{ fontSize: '2.5rem', color: '#002147', marginBottom: '1rem' }}>Ikuti Akun Media Sosial Kami</h2>
            <div className="title-accent" style={{ margin: '0 auto 3rem' }}></div>
          </div>

          <div className="platforms-grid">
            <motion.a href="https://www.facebook.com/ponpes.alazharpurwakarra" target="_blank" rel="noopener noreferrer" className="platform-card" whileHover={{ y: -10 }}>
              <div className="platform-icon">
                <Image src="/Logo/Logo%20Facebook.png" alt="Facebook" width={85} height={85} style={{ objectFit: 'contain' }} unoptimized />
              </div>
              <h4>Facebook</h4>
            </motion.a>

            <motion.a href="https://www.instagram.com/azhar_tv_" target="_blank" rel="noopener noreferrer" className="platform-card" whileHover={{ y: -10 }}>
              <div className="platform-icon">
                <Image src="/Logo/Logo%20Instagram.png" alt="Instagram" width={85} height={85} style={{ objectFit: 'contain' }} unoptimized />
              </div>
              <h4>Instagram</h4>
            </motion.a>

            <motion.a href="https://www.tiktok.com/@azhar.gallery" target="_blank" rel="noopener noreferrer" className="platform-card" whileHover={{ y: -10 }}>
              <div className="platform-icon">
                <Image src="/Logo/Logo%20Tiktok.png" alt="TikTok" width={85} height={85} style={{ objectFit: 'contain' }} unoptimized />
              </div>
              <h4>TikTok</h4>
            </motion.a>

            <motion.a href="https://www.youtube.com/@Tvazhar" target="_blank" rel="noopener noreferrer" className="platform-card" whileHover={{ y: -10 }}>
              <div className="platform-icon">
                <Image src="/Logo/Logo%20Youtube.png" alt="YouTube" width={85} height={85} style={{ objectFit: 'contain' }} unoptimized />
              </div>
              <h4>YouTube</h4>
            </motion.a>

            <motion.a href="/" className="platform-card" whileHover={{ y: -10 }}>
              <div className="platform-icon">
                <Image src="/Logo/Logo%20Website.png" alt="Website" width={85} height={85} style={{ objectFit: 'contain' }} unoptimized />
              </div>
              <h4>Website</h4>
            </motion.a>
          </div>
        </div>
      </section>

      {/* YouTube Section */}
      <section className="youtube-center">
        <div className="container">
          <div className="section-title">
            <h2 className={frizQuadrata.className}>Azhar Tv Channel</h2>
            <div className="title-accent"></div>
          </div>

          <div className="video-grid">
            {youtubeVideos.map((vid, i) => (
              <motion.div 
                key={i} 
                className="video-item"
                whileHover={{ y: -10 }}
              >
                <div className="thumb-container">
                  <Image src={vid.thumbnail} alt={vid.title} fill style={{ objectFit: 'cover' }} unoptimized
 />
                  <div className="play-overlay">
                    <div className="play-icon">▶</div>
                  </div>
                </div>
                <div className="video-info">
                  <span className="category">{vid.category}</span>
                  <h3>{vid.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Documentation Download */}
      <section className="doc-center">
        <div className="container">
          <div className="glass-container">
            <div className="doc-header">
              <h2 className={frizQuadrata.className}>Dokumentasi & Arsip</h2>
              <p>Tempat santri dan wali santri mengunduh foto dokumentasi kegiatan pesantren.</p>
            </div>

            <div className="event-grid">
              {documentationEvents.map((event, i) => (
                <a key={i} href={event.link} target="_blank" className="event-card">
                  <div className="event-icon">📂</div>
                  <div className="event-info">
                    <h4>{event.title}</h4>
                    <span>{event.count}</span>
                  </div>
                  <div className="download-arrow">↓</div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Latest Slide Documentation */}
      <section className="gallery-slide">
        <div className="container">
           <div className="section-title text-center">
            <h2 className={frizQuadrata.className}>Dokumentasi Terbaru</h2>
            <p>Momen-momen berharga santri dalam lensa kamera</p>
          </div>
          
          <div className="carousel-row">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <div key={num} className="carousel-item">
                <Image 
                  src={`/Alumni ${num}.png`} 
                  alt="Documentation" 
                  width={300} 
                  height={200} 
                  className="gallery-img"
                  unoptimized
 />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        .tv-page {
          background: #ffffff;
          overflow-x: hidden;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        /* UPI Style News Section */
        .news-section {
          padding: 12rem 0 6rem;
          background: #002147;
          color: white;
          overflow: hidden;
        }

        .news-content-wrapper {
          min-height: 450px;
          display: flex;
          align-items: center;
        }

        .news-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 5rem;
          align-items: center;
          width: 100%;
        }

        .news-text-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding-right: 1rem;
        }

        .main-title {
          font-size: 2.6rem;
          font-weight: 400; /* Friz Quadrata natural weight */
          line-height: 1.3;
          margin-bottom: 1.5rem;
          color: white;
        }

        .news-desc {
          font-size: 1.15rem;
          line-height: 1.8;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 2rem;
        }

        .news-image-content {
          flex: 1.2;
          position: relative;
        }

        .featured-img {
          width: 100%;
          aspect-ratio: 380 / 260;
          border-radius: 40px;
          background-size: cover;
          background-position: center;
          box-shadow: 0 20px 50px rgba(0,0,0,0.3);
        }

        .slider-controls-custom {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .dot-indicator {
          width: 40px;
          height: 6px;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          border-radius: 4px;
        }

        .dot-indicator:hover {
          background: rgba(255, 255, 255, 0.5);
        }

        .dot-indicator.active {
          background: #ffcc00;
        }

        .next-btn-round {
          width: 50px;
          height: 50px;
          background: #ffcc00;
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          margin-left: 1rem;
          transition: transform 0.3s ease;
        }

        .next-btn-round:hover {
          transform: scale(1.1);
        }

        /* Welcome Bar */
        .welcome-tv {
          padding: 6rem 0 2rem;
          text-align: center;
          background-color: #f8fafc;
          background-image: 
            radial-gradient(at 90% 10%, rgba(255, 140, 0, 0.08) 0px, transparent 40%),
            radial-gradient(at 10% 90%, rgba(0, 51, 204, 0.05) 0px, transparent 40%),
            radial-gradient(#cbd5e1 1.5px, transparent 1.5px);
          background-size: 100% 100%, 100% 100%, 32px 32px;
          position: relative;
          overflow: hidden;
        }

        .welcome-box {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          padding: 3rem 2.5rem;
          border-radius: 20px;
          position: relative;
          box-shadow: 0 15px 40px rgba(0,33,71,0.06), 0 5px 15px rgba(255,140,0,0.05);
          max-width: 800px;
          margin: 0 auto;
          border: 1px solid rgba(255, 255, 255, 0.8);
        }

        .welcome-box::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 6px;
          background: linear-gradient(90deg, #ff8c00, #ffcc00);
          border-radius: 20px 20px 0 0;
        }

        .welcome-logo {
          margin-top: -1rem;
          margin-bottom: 1rem;
          display: flex;
          justify-content: center;
          position: relative;
          z-index: 1;
        }

        .rainbow-text {
          background-image: linear-gradient(90deg, #002147, #0033cc, #ff8c00, #0033cc, #002147);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent !important;
          animation: rainbowAnimation 6s linear infinite;
          background-size: 200% auto;
        }

        @keyframes rainbowAnimation {
          to { background-position: 200% center; }
        }

        .welcome-box h2 {
          color: #002147;
          font-size: 4.2rem;
          margin-bottom: 0.5rem;
          margin-top: 0;
          letter-spacing: -1.5px;
          line-height: 1.1;
        }

        .welcome-box p {
          color: #475569;
          font-size: 1.25rem;
          line-height: 1.7;
        }

        /* Sambutan Manager */
        .manager-greeting {
          padding: 3rem 0 3rem;
          background-color: #ffffff;
        }

        .manager-content {
          display: flex;
          align-items: flex-start;
          gap: 3rem;
          position: relative;
          z-index: 10;
        }

        .manager-image {
          flex-shrink: 0;
          width: 400px;
          position: relative;
        }

        .manager-img {
          width: 100%;
          height: auto;
          aspect-ratio: 4 / 5;
          object-fit: contain;
          position: relative;
          z-index: 2;
        }

        .manager-text {
          flex: 1;
        }

        .manager-role {
          font-size: 1rem;
          color: #ff8c00;
          font-weight: 800;
          letter-spacing: 2px;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
        }

        .manager-name-large {
          font-size: 2.8rem;
          color: #002147;
          margin-bottom: 1.5rem;
          font-weight: 700;
          line-height: 1.1;
        }

        .blue-divider-small {
          width: 60px;
          height: 5px;
          background: #0033cc;
          margin-bottom: 2rem;
          border-radius: 10px;
        }

        .quote-text {
          font-size: 0.95rem;
          line-height: 1.8;
          color: #475569;
          position: relative;
          text-align: justify;
        }

        .quote-text p {
          margin-bottom: 1rem;
        }

        .quote-text p:last-child {
          margin-bottom: 0;
        }

        /* Managed Platforms */
        .managed-platforms {
          padding: 2rem 0 2rem;
          background: #ffffff;
        }

        .platforms-grid {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 2rem;
        }

        .platform-card {
          background: #f8fafc;
          padding: 2rem;
          border-radius: 20px;
          text-align: center;
          width: 180px;
          border: 1px solid #f1f5f9;
          transition: all 0.3s ease;
          cursor: pointer;
          text-decoration: none;
          color: inherit;
          display: block;
        }

        .platform-card:hover {
          box-shadow: 0 15px 30px rgba(0,33,71,0.08);
          border-color: #e2e8f0;
        }

        .platform-icon {
          width: 90px;
          height: 90px;
          margin: 0 auto 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          color: white;
        }

        /* Icons are now images, backgrounds removed */

        .platform-card h4 {
          color: #002147;
          font-size: 1.1rem;
          font-weight: 600;
        }

        /* YouTube Center */
        .youtube-center {
          padding: 2rem 0 8rem;
        }

        .section-title {
          margin-bottom: 4rem;
          text-align: center;
        }

        .section-title h2 {
          font-size: 2.5rem;
          color: #002147;
          margin-bottom: 1rem;
        }

        .title-accent {
          width: 80px;
          height: 5px;
          background: #ff8c00;
          border-radius: 10px;
          margin: 0 auto;
        }

        .video-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2.5rem;
        }

        .video-item {
          cursor: pointer;
        }

        .thumb-container {
          position: relative;
          height: 220px;
          border-radius: 20px;
          overflow: hidden;
          margin-bottom: 1.5rem;
        }

        .play-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,33,71,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: all 0.3s ease;
        }

        .play-icon {
          width: 60px;
          height: 60px;
          background: #ff8c00;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          transform: scale(0.8);
          transition: all 0.3s ease;
        }

        .video-item:hover .play-overlay {
          opacity: 1;
        }

        .video-item:hover .play-icon {
          transform: scale(1);
        }

        .category {
          color: #ff8c00;
          font-weight: 800;
          font-size: 0.7rem;
          letter-spacing: 2px;
          display: block;
          margin-bottom: 0.5rem;
        }

        .video-info h3 {
          font-size: 1.2rem;
          color: #002147;
          line-height: 1.4;
        }

        /* Documentation Center */
        .doc-center {
          padding-bottom: 8rem;
        }

        .glass-container {
          background: #f8fafc;
          padding: 5rem;
          border-radius: 50px;
        }

        .doc-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .doc-header h2 {
          font-size: 2.5rem;
          color: #002147;
          margin-bottom: 1rem;
        }

        .doc-header p {
          color: #64748b;
          font-size: 1.1rem;
        }

        .event-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
        }

        .event-card {
          display: flex;
          align-items: center;
          background: white;
          padding: 2rem;
          border-radius: 25px;
          text-decoration: none;
          transition: all 0.3s ease;
          border: 1px solid #e2e8f0;
          gap: 1.5rem;
        }

        .event-card:hover {
          transform: scale(1.02);
          border-color: #ff8c00;
          box-shadow: 0 20px 40px rgba(0,0,0,0.05);
        }

        .event-icon {
          font-size: 2.5rem;
        }

        .event-info {
          flex: 1;
        }

        .event-info h4 {
          color: #002147;
          font-size: 1.2rem;
          margin-bottom: 0.3rem;
        }

        .event-info span {
          color: #64748b;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .download-arrow {
          font-size: 1.5rem;
          color: #ff8c00;
          font-weight: 900;
        }

        /* Gallery Slide */
        .gallery-slide {
          padding-bottom: 8rem;
        }

        .carousel-row {
          display: flex;
          gap: 20px;
          overflow-x: auto;
          padding-bottom: 20px;
          scroll-behavior: smooth;
        }

        .carousel-row::-webkit-scrollbar {
          height: 8px;
        }

        .carousel-row::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }

        .carousel-item {
          flex: 0 0 auto;
          width: 300px;
        }

        .gallery-img {
          border-radius: 20px;
          width: 100%;
          height: 200px;
          object-fit: cover;
        }

        @media (max-width: 992px) {
          .video-grid, .event-grid {
            grid-template-columns: 1fr;
          }
          .main-title {
            font-size: 2.2rem;
          }
          .featured-img {
            aspect-ratio: 380 / 260;
          }
          .glass-container { padding: 3rem 1.5rem; }
        }

        @media (max-width: 768px) {
          .news-section {
            padding: 10rem 0 5rem;
          }
          .news-grid {
            display: flex;
            flex-direction: column;
            gap: 3rem;
          }
          .main-title {
            font-size: 1.8rem;
          }
          .pre-title {
            font-size: 1rem;
            margin-bottom: 1.5rem;
          }
          .news-image-content {
            margin: 0 -1rem;
            width: calc(100% + 2rem);
          }
          .featured-img {
            aspect-ratio: 380 / 260;
            border-radius: 15px;
          }
          .slider-controls-custom {
            padding-right: 1rem; /* keep controls from touching edge */
          }
          .news-desc {
            font-size: 1rem;
            margin-bottom: 2rem;
          }
          .news-content-wrapper {
            min-height: auto;
          }
          .manager-content {
            display: flex;
            flex-direction: column;
            gap: 2rem;
            text-align: center;
          }
          .manager-image {
            width: 280px;
            margin: 0 auto;
          }
          .manager-img {
            aspect-ratio: 4 / 5;
            border-radius: 15px;
          }
          .blue-divider-small {
            margin: 0 auto 1.5rem auto;
          }
          .manager-name-large {
            font-size: 1.6rem;
            margin-bottom: 1rem;
          }
          .quote-text {
            font-size: 0.95rem;
            text-align: justify;
          }
          .platforms-grid {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 1rem;
          }
          .platform-card {
            width: calc(50% - 0.5rem);
            padding: 1.5rem 0.5rem;
          }
          .platform-icon {
            width: 60px;
            height: 60px;
            margin: 0 auto 1rem;
          }
          .platform-card h4 {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </main>
  );
}
