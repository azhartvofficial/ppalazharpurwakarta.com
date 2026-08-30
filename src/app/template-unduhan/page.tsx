"use client";
import React, { useState, useEffect, useRef } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import * as htmlToImage from 'html-to-image';

const toTitleCase = (str: string) => {
  if (!str) return "";
  return str.replace(/\b\w/g, char => char.toUpperCase());
};

export default function TemplateUnduhanPage() {
  const [dbNews, setDbNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNewsId, setSelectedNewsId] = useState<string>("");
  const templateRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .eq('status', 'Published')
        .order('created_at', { ascending: false })
        .limit(20);

      if (data && !error) {
        setDbNews(data);
        if (data.length > 0) {
          setSelectedNewsId(data[0].id);
        }
      }
      setLoading(false);
    };
    fetchNews();
  }, []);

  const handleDownload = async () => {
    if (!templateRef.current) return;
    try {
      setIsDownloading(true);
      // We use html-to-image to generate the picture
      const dataUrl = await htmlToImage.toPng(templateRef.current, { quality: 1, pixelRatio: 3 });
      
      const link = document.createElement('a');
      link.download = `template-berita-${selectedNewsId}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to download image', err);
      alert("Gagal mengunduh template. Silakan coba lagi.");
    } finally {
      setIsDownloading(false);
    }
  };

  const selectedNews = dbNews.find(n => n.id === selectedNewsId) || null;

  return (
    <main className="template-page">
      <Navbar />
      
      {/* Spacer for fixed navbar */}
      <div style={{ height: '80px', backgroundColor: 'var(--white)' }}></div>

      <section className="template-section">
        <div className="container">
          <div className="section-title-box">
            <h2>Template <span>Unduhan Berita</span></h2>
            <div className="title-line"></div>
            <p className="subtitle">Unduh template berita dengan format 9:16 untuk dibagikan ke Story atau Status Anda.</p>
          </div>

          {loading ? (
            <div className="loading-state">Memuat berita...</div>
          ) : (
            <div className="template-workspace">
              {/* Controls */}
              <div className="controls-panel">
                <div className="form-group">
                  <label htmlFor="newsSelect">Pilih Berita:</label>
                  <select 
                    id="newsSelect" 
                    value={selectedNewsId} 
                    onChange={(e) => setSelectedNewsId(e.target.value)}
                    className="news-select"
                  >
                    {dbNews.map((news) => (
                      <option key={news.id} value={news.id}>
                        {toTitleCase(news.judul_utama || news.title || "Berita")}
                      </option>
                    ))}
                  </select>
                </div>
                
                <button 
                  className={`download-btn ${isDownloading ? 'downloading' : ''}`}
                  onClick={handleDownload}
                  disabled={isDownloading || !selectedNews}
                >
                  {isDownloading ? 'Memproses...' : 'Unduh Template (PNG)'}
                </button>

                {selectedNews && (
                  <div className="link-copy-section">
                    <label>Tautan Berita (Untuk Stiker IG):</label>
                    <div className="copy-input-group">
                      <input 
                        type="text" 
                        readOnly 
                        value={typeof window !== 'undefined' ? `${window.location.origin}/berita/${selectedNews.id}` : ''} 
                        className="link-input"
                      />
                      <button 
                        onClick={() => {
                           navigator.clipboard.writeText(`${window.location.origin}/berita/${selectedNews.id}`);
                           alert('Tautan disalin! Silakan paste di Stiker Link Instagram Anda.');
                        }}
                        className="copy-btn"
                        title="Salin Tautan"
                      >
                        Salin
                      </button>
                      <a 
                        href="instagram://" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="ig-btn"
                        title="Buka Aplikasi Instagram"
                        onClick={(e) => {
                          // Fallback to web if app doesn't open
                          setTimeout(() => {
                            window.open('https://instagram.com', '_blank');
                          }, 500);
                        }}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                           <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                           <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                           <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                        </svg>
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Preview Area */}
              <div className="preview-panel">
                <div className="preview-container">
                  {selectedNews ? (
                    <div className="template-box" ref={templateRef}>
                      {/* WhatsApp Link Preview Mockup */}
                      <div className="wa-mockup-wrapper">
                        
                        {/* The WA Link Preview Card */}
                        <div className="wa-link-card">
                          {/* Image */}
                          <div className="wa-card-image-container">
                            <img 
                              src={selectedNews.gambar_judul_url || selectedNews.image || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop'} 
                              alt="News Cover" 
                              className="wa-card-image"
                              crossOrigin="anonymous" 
                            />
                          </div>

                          {/* Content */}
                          <div className="wa-card-content">
                            <h2 className="wa-card-title">
                              {toTitleCase(selectedNews.judul_utama || selectedNews.title || "")}
                            </h2>
                            <p className="wa-card-desc">
                              {selectedNews.isi_berita 
                                ? selectedNews.isi_berita.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').substring(0, 100) + '...'
                                : 'PURWAKARTA — Pondok Pesantren Al Azhar, kegiatan rutinitas yang diikuti oleh para santri...'}
                            </p>
                            <div className="wa-card-url">
                              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '6px', opacity: 0.8}}>
                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                              </svg>
                              pp-alazharpwk.com
                            </div>
                          </div>
                        </div>

                        {/* Link Placeholder (Space for IG Link Sticker) */}
                        <div className="ig-link-space">
                          <span className="ig-link-text">BACA DI SINI</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="empty-preview">
                      <p>Silakan pilih berita terlebih dahulu</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />

      <style jsx>{`
        .template-page {
          background-color: #f4f6f9;
          min-height: 100vh;
        }

        .template-section {
          padding: 60px 0 100px;
        }

        .section-title-box {
          position: relative;
          margin-bottom: 40px;
          padding-bottom: 15px;
          border-bottom: 2px solid #e1e5eb;
          text-align: center;
        }

        .section-title-box h2 {
          font-size: 2.2rem;
          color: var(--primary);
          font-weight: 800;
          margin-bottom: 10px;
        }

        .section-title-box h2 span {
          color: var(--secondary);
        }

        .title-line {
          position: absolute;
          bottom: -2px;
          left: 50%;
          transform: translateX(-50%);
          width: 100px;
          height: 4px;
          background: var(--secondary);
        }

        .subtitle {
          color: #64748b;
          font-size: 1.1rem;
        }

        .loading-state {
          text-align: center;
          padding: 50px;
          font-size: 1.2rem;
          color: #64748b;
        }

        .template-workspace {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 40px;
          max-width: 1000px;
          margin: 0 auto;
        }

        @media (min-width: 768px) {
          .template-workspace {
            flex-direction: row;
            align-items: flex-start;
          }
        }

        .controls-panel {
          flex: 1;
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
          width: 100%;
        }

        .form-group {
          margin-bottom: 25px;
        }

        .form-group label {
          display: block;
          margin-bottom: 10px;
          font-weight: 700;
          color: var(--primary);
          font-size: 1.1rem;
        }

        .news-select {
          width: 100%;
          padding: 12px 15px;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          outline: none;
          transition: border-color 0.2s;
          background-color: #f8fafc;
        }

        .news-select:focus {
          border-color: var(--primary);
        }

        .download-btn {
          width: 100%;
          padding: 15px;
          background: var(--primary);
          color: white;
          font-weight: 700;
          font-size: 1.1rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 33, 71, 0.2);
        }

        .download-btn:hover:not(:disabled) {
          background: var(--secondary);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(243, 156, 18, 0.3);
        }

        .download-btn:disabled {
          background: #94a3b8;
          cursor: not-allowed;
          box-shadow: none;
        }

        .download-btn.downloading {
          opacity: 0.8;
        }

        .link-copy-section {
          margin-top: 25px;
          padding-top: 25px;
          border-top: 1px solid #e2e8f0;
        }

        .link-copy-section label {
          display: block;
          margin-bottom: 10px;
          font-weight: 700;
          color: var(--primary);
          font-size: 0.95rem;
        }

        .copy-input-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .link-input {
          flex: 1;
          padding: 10px 12px;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          font-size: 0.85rem;
          color: #475569;
          background: #f8fafc;
          outline: none;
        }

        .copy-btn {
          background: var(--secondary);
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 6px;
          font-weight: 700;
          font-size: 0.85rem;
          cursor: pointer;
          transition: background 0.2s;
          flex-shrink: 0;
        }

        .copy-btn:hover {
          background: #e67e00;
        }

        .ig-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
          color: white;
          width: 40px;
          height: 40px;
          min-width: 40px;
          min-height: 40px;
          border-radius: 6px;
          text-decoration: none;
          transition: transform 0.2s;
          flex-shrink: 0;
        }

        .ig-btn:hover {
          transform: translateY(-2px);
        }

        .preview-panel {
          display: flex;
          justify-content: center;
          width: 100%;
          flex: 1;
        }

        .preview-container {
          background: #e2e8f0;
          padding: 20px;
          border-radius: 16px;
          box-shadow: inset 0 2px 10px rgba(0,0,0,0.05);
        }

        /* 9:16 Aspect Ratio Box */
        .template-box {
          position: relative;
          width: 360px;
          height: 640px;
          background-color: #0b141a; 
          background-image: url('/mascot-bg.png');
          background-size: cover;
          background-position: center;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        }

        .wa-mockup-wrapper {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
          position: relative;
        }

        /* WA Link Card */
        .wa-link-card {
          width: 100%;
          background-color: #202c33;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
          display: flex;
          flex-direction: column;
        }

        .wa-card-image-container {
          width: 100%;
          aspect-ratio: 1.91 / 1;
          background-color: #111b21;
        }

        .wa-card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .wa-card-content {
          padding: 12px 16px;
        }

        .wa-card-title {
          color: #e9edef;
          font-size: 1.05rem;
          font-weight: 700;
          line-height: 1.3;
          margin-bottom: 6px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .wa-card-desc {
          color: #8696a0;
          font-size: 0.85rem;
          line-height: 1.4;
          margin-bottom: 10px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .wa-card-url {
          color: #8696a0;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }

        /* IG Link Placeholder Space */
        .ig-link-space {
          position: absolute;
          bottom: 35px;
          left: 50%;
          transform: translateX(-50%);
          background: #ffffff;
          padding: 6px 16px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 10px rgba(0,0,0,0.15);
        }

        .ig-link-text {
          font-weight: 800;
          font-size: 0.75rem;
          letter-spacing: 0.5px;
          color: #0b141a;
        }
      `}</style>
    </main>
  );
}
