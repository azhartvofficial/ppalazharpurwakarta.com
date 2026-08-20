"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

import { supabase } from "@/lib/supabase";

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const { t } = useLanguage();
  const [slides, setSlides] = useState<any[]>([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    try {
      const sessionStr = localStorage.getItem('admin_session');
      if (sessionStr) {
        const session = JSON.parse(sessionStr);
        const role = session?.user_metadata?.role || session?.role;
        if (role && role.toLowerCase() === 'super admin') {
          setIsSuperAdmin(true);
        }
      }
    } catch (e) {
      console.error(e);
    }
    const fetchBeranda = async () => {
      const { data, error } = await supabase
        .from('beranda_content')
        .select(`
          *,
          news_articles (id, judul_utama, gambar_judul_url, isi_berita)
        `)
        .eq('status', 'Rilis')
        .order('created_at', { ascending: false })
        .limit(8);
        
      if (data && data.length > 0) {
        setSlides(data.map(item => {
          let finalDesc = item.deskripsi || '';
          if (!finalDesc && item.news_articles?.isi_berita) {
            finalDesc = item.news_articles.isi_berita.replace(/<[^>]+>/g, '');
            if (finalDesc.length > 150) finalDesc = finalDesc.substring(0, 150) + '...';
          }
          
          return {
            image: item.foto_utama_url || item.news_articles?.gambar_judul_url || '',
            title: item.judul_utama || item.news_articles?.judul_utama || '',
            desc: finalDesc,
            isNews: item.tipe === 'berita',
            newsId: item.berita_id || item.news_articles?.id
          };
        }));
      } else {
        setSlides([]);
      }
    };
    fetchBeranda();
  }, [t]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="hero">
      {slides.length === 0 && (
        <div className="hero-overlay" style={{ background: 'linear-gradient(90deg, rgba(0, 33, 71, 1) 0%, rgba(0, 33, 71, 0.8) 100%)', zIndex: 1 }}></div>
      )}
      {isSuperAdmin && (
        <div style={{ position: 'absolute', top: '160px', right: '20px', zIndex: 100 }}>
          <Link 
            href="/admin"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#002147',
              border: '2px solid rgba(255,255,255,0.8)',
              borderRadius: '50%',
              width: '45px',
              height: '45px',
              color: 'white',
              boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            title="Edit Konten Beranda (Super Admin)"
            onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 6px 15px rgba(0,33,71,0.5)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)'; }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '20px', height: '20px' }}>
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </Link>
        </div>
      )}
      {slides.map((slide, index) => (
        <div 
          key={index} 
          className={`slide ${index === current ? "active" : ""}`}
        >
          <Image 
            src={slide.image} 
            alt={slide.title} 
            fill 
            priority 
            style={{ objectFit: "cover", objectPosition: "center" }} 
            sizes="100vw"
          />
          <div className="hero-overlay"></div>
          <div className="container hero-content">
            <div className="content-inner">
              <h1 className="hero-title">
                {slide.title}
              </h1>
              <p className="hero-desc">{slide.desc}</p>
              {slide.isNews && slide.newsId && (
                <Link href={`/berita/${slide.newsId}`} className="hero-inline-news">
                  Baca Selengkapnya &rarr;
                </Link>
              )}
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
            <Link href="/profil/alazhapurwakarta" className="glass-btn-pill secondary">
              <span className="desk-text">{t('ctaJelajahi')}</span>
              <span className="mob-text">JELAJAHI<br/>AL-AZHAR</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Removed nav buttons as requested */}

      {slides.length > 0 && (
        <div className="hero-timeline-container">
          <div className="container">
          <div className="timeline-grid">
            {slides.map((slide, index) => (
              <div 
                key={index} 
                className={`timeline-item ${index === current ? "active" : ""}`}
                onClick={() => setCurrent(index)}
              >
                <div className="timeline-info" style={{ display: index === current ? 'flex' : 'none' }}>
                  <span className="timeline-title">{slide.title}</span>
                </div>
                <div className="timeline-bar-bg" style={{ height: index === current ? '3px' : '2px', opacity: index === current ? 1 : 0.4 }}>
                  <div className={`timeline-bar-fill ${index === current ? "animate" : ""}`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      )}

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
          margin-bottom: 0.5rem;
          max-width: 700px;
          opacity: 0.9;
          font-weight: 400;
          line-height: 1.6;
        }

        .hero-inline-news {
          display: inline-block;
          margin-bottom: 2rem;
          color: #fff;
          font-weight: 700;
          font-size: 1.1rem;
          text-decoration: underline;
          text-underline-offset: 4px;
          pointer-events: auto;
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
          background: rgba(255, 255, 255, 0.15) !important;
          border-color: rgba(255, 255, 255, 0.5) !important;
          color: #ffffff !important;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }

        :global(.glass-btn-pill:active) {
          background: rgba(255, 255, 255, 0.25) !important;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }

        .btn-white {
          background: white;
          color: var(--primary);
          padding: 0.8rem 2rem;
          font-weight: 700;
          border-radius: 4px;
        }

        .mob-text { display: none; }
        .desk-text { display: inline-block; }

        .hero-timeline-container {
          position: absolute;
          bottom: 50px;
          left: 0;
          width: 100%;
          z-index: 100;
        }

        .timeline-grid {
          display: flex;
          gap: 0.5rem;
          width: 100%;
          max-width: 600px;
          margin: 0;
        }

        .timeline-item {
          cursor: pointer;
          transition: all 0.3s ease;
          opacity: 0.6;
          flex: 1;
        }

        .timeline-item.active {
          opacity: 1;
          flex: 2;
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
            gap: 0.3rem;
            max-width: 300px;
          }
          .timeline-title { 
            display: block; 
            font-size: 0.45rem; 
          }
          .timeline-bar-bg { height: 2px; }
          .hero-timeline-container { bottom: 20px; }
          .hero-title { font-size: 2.2rem; text-align: left; }
          .hero-desc { font-size: 0.95rem; text-align: left; }
          .hero-inline-news { font-size: 0.95rem; text-align: left; margin-bottom: 1rem; }
          .hero-btns-separated { 
            flex-direction: row !important; 
            justify-content: flex-start !important;
            gap: 0.4rem;
            padding: 0;
            width: 100%;
            flex-wrap: nowrap;
          }
          :global(.glass-btn-pill) {
            padding: 0.4rem 0.6rem !important;
            font-size: 0.65rem !important;
            letter-spacing: 0.5px !important;
            width: fit-content;
            min-width: unset !important;
            height: 45px !important;
            flex: 1;
            text-align: center;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
          :global(.glass-btn-pill .mob-text) {
            line-height: 1.1;
          }
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
          .desk-text { display: none; }
          .mob-text { display: inline-block; line-height: 1.1; text-align: center; }
          .nav-btn { width: 40px; height: 40px; font-size: 1rem; }
          .prev { left: 10px; }
          .next { right: 10px; }
        }
      `}</style>
    </section>
  );
}
