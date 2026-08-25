"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";

export default function BeritaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<any>(null);
  const [pengumumanList, setPengumumanList] = useState<any[]>([]);
  const [beritaList, setBeritaList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageUrl, setPageUrl] = useState("");
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    setPageUrl(typeof window !== 'undefined' ? window.location.href : "");
    const fetchArticle = async () => {
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .eq('id', params.id)
        .single();
      
      if (error || !data) {
        alert("Berita tidak ditemukan!");
        router.push("/berita");
        return;
      } else {
        setArticle(data);
      }
      
      // Fetch Papan Pengumuman
      const { data: dataPengumuman } = await supabase
        .from('news_articles')
        .select('id, judul_utama, created_at')
        .eq('kategori', 'Papan Pengumuman')
        .eq('status', 'Published')
        .neq('id', params.id)
        .order('created_at', { ascending: false })
        .limit(3);
        
      if (dataPengumuman) setPengumumanList(dataPengumuman);

      // Fetch Berita Lainnya
      const { data: dataBerita } = await supabase
        .from('news_articles')
        .select('id, judul_utama, created_at, gambar_judul_url')
        .eq('kategori', 'Artikel Berita')
        .eq('status', 'Published')
        .neq('id', params.id)
        .order('created_at', { ascending: false })
        .limit(4);
        
      if (dataBerita) setBeritaList(dataBerita);

      setLoading(false);
    };

    if (params.id) {
      fetchArticle();
    }
  }, [params.id, router]);

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="loader" style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#002147' }}>Memuat Berita...</div>
      </div>
    );
  }

  if (!article) return null;

  const handleShareWhatsApp = async () => {
    // Extract plain text snippet
    const plainText = (article.isi_berita || "").replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').trim();
    const snippet = plainText.length > 450 ? plainText.substring(0, 450) + "....." : plainText;
    
    const textToShare = `*${(article.judul_utama || "").trim()}*\n\n"${snippet}"\n\nBaca selengkapnya di:\n${pageUrl}`;
    
    if (navigator.share || navigator.clipboard) {
      try {
        if (article.gambar_judul_url) {
          setIsSharing(true);
          const response = await fetch(article.gambar_judul_url);
          const blob = await response.blob();
          let ext = 'jpg';
          if (blob.type.includes('png')) ext = 'png';
          if (blob.type.includes('webp')) ext = 'webp';
          const file = new File([blob], `berita.${ext}`, { type: blob.type || 'image/jpeg' });
          
          if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
             await navigator.share({
                title: article.judul_utama,
                text: textToShare,
                files: [file]
             });
             setIsSharing(false);
             return;
          } else if (navigator.clipboard && window.ClipboardItem) {
             // Fallback Desktop: Salin ke clipboard lalu buka WA
             try {
               const item = new ClipboardItem({ [blob.type]: blob });
               await navigator.clipboard.write([item]);
               alert("Foto sampul berhasil disalin ke Clipboard! \n\nSilakan tekan 'Paste' atau 'Ctrl+V' di kolom chat WhatsApp nanti.");
             } catch (clipErr) {
               console.warn("Gagal copy clipboard:", clipErr);
             }
          }
        }
        
        if (navigator.share) {
          // Text-only native share fallback
          await navigator.share({
            title: article.judul_utama,
            text: textToShare
          });
          setIsSharing(false);
          return;
        }
      } catch (error: any) {
        setIsSharing(false);
        if (error.name !== 'AbortError') {
           window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(textToShare)}`, '_blank');
        }
        return;
      }
    }
    
    // Fallback for Desktop/browsers without native share
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(textToShare)}`, '_blank');
  };

  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return "";
    let videoId = "";
    // Robust regex to extract YouTube ID from various formats (m.youtube, shorts, youtu.be, etc.)
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
    const match = url.trim().match(regExp);
    
    if (match && match[2].length >= 11) {
      videoId = match[2].substring(0, 11);
    }
    
    // Default to embed URL with autoplay=0 if video ID is found
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0` : url;
  };

  let finalContent = article.isi_berita || "";
  let revisionDate = null;
  const revMatch = finalContent.match(/---REVISION_TIMESTAMP:(\d+)---/);
  if (revMatch) {
    revisionDate = parseInt(revMatch[1]);
    finalContent = finalContent.replace(/\n\n---REVISION_TIMESTAMP:\d+---/g, '');
    finalContent = finalContent.replace(/---REVISION_TIMESTAMP:\d+---/g, '');
  }

  return (
    <main className="berita-detail-page">
      <Navbar />
      <div style={{ height: '80px', backgroundColor: 'var(--white)' }}></div>

      <div className="berita-layout-container">
        <article className="article-container">
          {/* Header */}
          <header className="article-header">
            <div className="article-category">{article.kategori}</div>
            <h1 className="article-title">{article.judul_utama}</h1>
            <div className="article-meta">
              <div className="author-info">
                <span className="author-name">Oleh <strong>{article.penulis}</strong></span>
                {article.sumber_opsional && (
                  <span className="author-source"> | Sumber Tambahan: {article.sumber_opsional}</span>
                )}
              </div>
              <div className="article-date">
                {new Date(article.created_at).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })} WIB
                {revisionDate && (
                  <div style={{ marginTop: '4px', fontSize: '0.85rem', color: '#64748b', fontStyle: 'italic' }}>
                    Revisi: {new Date(revisionDate).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })} WIB
                  </div>
                )}
              </div>
            </div>

            {/* Share Button */}
            <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button 
                onClick={handleShareWhatsApp}
                disabled={isSharing}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: isSharing ? '#a3e6b8' : '#25D366',
                  color: 'white',
                  borderRadius: '25px',
                  border: 'none',
                  cursor: isSharing ? 'not-allowed' : 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  boxShadow: '0 4px 6px -1px rgba(37, 211, 102, 0.2), 0 2px 4px -1px rgba(37, 211, 102, 0.1)',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onMouseOver={(e) => { if(!isSharing) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 8px -1px rgba(37, 211, 102, 0.3)'; } }}
                onMouseOut={(e) => { if(!isSharing) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(37, 211, 102, 0.2)'; } }}
              >
                {isSharing ? (
                  <div style={{ width: '18px', height: '18px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}>
                    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                  </div>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                )}
                {isSharing ? 'Memproses...' : 'Bagikan ke WhatsApp'}
              </button>
            </div>
          </header>

          {/* Cover Image */}
          <div className="article-cover-container">
            {article.gambar_judul_url ? (
              <div className="image-wrapper">
                <img 
                  src={article.gambar_judul_url} 
                  alt={article.judul_utama} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>
            ) : (
              <div className="image-wrapper placeholder">
                Tidak Ada Gambar Utama
              </div>
            )}
            <div className="image-caption">
              Sumber Foto: {article.sumber_gambar === 'Manual' && article.sumber_gambar_manual ? article.sumber_gambar_manual : 'Tim Media Azhar TV'}
            </div>
          </div>

          {/* Content */}
          <div className="article-body">
            {finalContent.split('\n').map((paragraph: string, idx: number) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          {/* Closing Paragraph */}
          {article.paragraf_penutup && (
            <div className="article-closing" style={{ marginTop: '2rem', fontSize: '1.15rem', lineHeight: '1.8', color: '#1e293b', fontFamily: "'Georgia', serif" }}>
              {article.paragraf_penutup.split('\n').map((paragraph: string, idx: number) => (
                <p key={idx} style={{ marginBottom: '1.5rem' }}>{paragraph}</p>
              ))}
            </div>
          )}

          {/* Attachments */}
          {article.jenis_lampiran_2 && article.lampiran_2_url && (
            <div className="article-attachment-box">
              {article.jenis_lampiran_2 === 'Video Youtube' ? (
                <div className="video-container">
                  {article.lampiran_2_url.includes("|||") && (
                    <h4 style={{ marginBottom: '1rem', fontSize: '1.1rem', color: '#1e293b' }}>
                      {article.lampiran_2_url.split("|||")[1]}
                    </h4>
                  )}
                  <iframe 
                    width="100%" 
                    height="400" 
                    src={getYouTubeEmbedUrl(article.lampiran_2_url.split("|||")[0])} 
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </div>
              ) : article.jenis_lampiran_2 === 'Gambar' ? (
                <div className="attachment-image">
                  {article.lampiran_2_url.includes("|||") && (
                    <h4 style={{ marginBottom: '1rem', fontSize: '1.1rem', color: '#1e293b' }}>
                      {article.lampiran_2_url.split("|||")[1]}
                    </h4>
                  )}
                  <img src={article.lampiran_2_url.split("|||")[0]} alt="Lampiran" style={{ maxWidth: '100%', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                </div>
              ) : (
                <div>
                  {article.lampiran_2_url.includes("|||") && (
                    <h4 style={{ marginBottom: '1rem', fontSize: '1.1rem', color: '#1e293b' }}>
                      {article.lampiran_2_url.split("|||")[1]}
                    </h4>
                  )}
                  <a href={article.lampiran_2_url.split("|||")[0]} target="_blank" rel="noopener noreferrer" className="btn-download">
                    Lihat / Unduh {article.jenis_lampiran_2}
                  </a>
                </div>
              )}
            </div>
          )}
        </article>

        <aside className="sidebar-container">
          <div className="sidebar-widget widget-pengumuman">
            <h3 className="widget-title">Papan Pengumuman</h3>
            <div className="widget-content">
              {pengumumanList.length > 0 ? (
                pengumumanList.map(p => (
                  <Link href={`/berita/${p.id}`} key={p.id} className="widget-item pengumuman-item">
                    <span className="widget-date">{new Date(p.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <h4>{p.judul_utama}</h4>
                  </Link>
                ))
              ) : (
                <div className="empty-state">
                  <p>Segera Hadir</p>
                </div>
              )}
            </div>
          </div>

          <div className="sidebar-widget widget-berita">
            <h3 className="widget-title">Berita Lainnya</h3>
            <div className="widget-content">
              {beritaList.length > 0 ? (
                beritaList.map(b => (
                  <Link href={`/berita/${b.id}`} key={b.id} className="widget-item berita-item">
                    <div className="berita-item-img">
                      {b.gambar_judul_url ? (
                        <img src={b.gambar_judul_url} alt={b.judul_utama} />
                      ) : (
                        <div className="no-img">IMG</div>
                      )}
                    </div>
                    <div className="berita-item-info">
                      <span className="widget-date">{new Date(b.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      <h4>{b.judul_utama}</h4>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="empty-state">
                  <p>Segera Hadir</p>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>

      <Footer />

      <style jsx>{`
        .berita-detail-page {
          background-color: #f8fafc;
          min-height: 100vh;
        }

        .berita-layout-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        @media (min-width: 993px) {
          .berita-layout-container {
            grid-template-columns: 2fr 1fr;
            align-items: flex-start;
          }
        }

        .article-container {
          background: white;
          padding: 2.5rem;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
          border-radius: 20px;
        }

        .sidebar-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          position: sticky;
          top: 100px;
        }

        .sidebar-widget {
          background: white;
          border-radius: 20px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
          border: 1px solid #f1f5f9;
        }

        .widget-title {
          font-size: 1.2rem;
          color: #002147;
          font-weight: 800;
          margin-bottom: 1.5rem;
          padding-bottom: 0.8rem;
          border-bottom: 2px solid #f1f5f9;
        }

        .widget-content {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .widget-item {
          text-decoration: none;
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          transition: transform 0.2s;
        }

        .widget-item:hover {
          transform: translateX(5px);
        }

        .widget-item h4 {
          color: #0f172a;
          font-size: 0.95rem;
          font-weight: 700;
          line-height: 1.4;
          margin: 0;
        }

        .widget-item:hover h4 {
          color: #ff8c00;
        }

        .widget-date {
          font-size: 0.75rem;
          color: #64748b;
          font-weight: 600;
        }

        .pengumuman-item {
          padding: 1rem;
          background: #fffbeb;
          border-left: 3px solid #fbbf24;
          border-radius: 0 8px 8px 0;
        }

        .berita-item {
          flex-direction: column;
          align-items: stretch;
          gap: 0.8rem;
          padding-bottom: 1.2rem;
          border-bottom: 1px solid #f1f5f9;
        }

        .berita-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .berita-item-img {
          width: 100%;
          aspect-ratio: 16 / 9;
          flex-shrink: 0;
          border-radius: 12px;
          overflow: hidden;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .berita-item-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .no-img {
          font-size: 1.5rem;
        }

        .berita-item-info {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .empty-state {
          text-align: center;
          padding: 2rem 1rem;
          background: #f8fafc;
          border-radius: 12px;
          border: 2px dashed #cbd5e1;
          color: #64748b;
        }

        .empty-icon {
          font-size: 2rem;
          display: block;
          margin-bottom: 0.5rem;
        }

        .empty-state p {
          margin: 0;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .article-category {
          color: #ff8c00;
          font-weight: 800;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin-bottom: 1rem;
        }

        .article-title {
          font-size: 2.5rem;
          font-weight: 900;
          line-height: 1.3;
          color: #0f172a;
          margin-bottom: 1.5rem;
          font-family: 'Georgia', serif;
        }

        .article-meta {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #e2e8f0;
          margin-bottom: 2rem;
        }

        .author-name {
          font-size: 1rem;
          color: #334155;
        }

        .author-source {
          font-size: 0.9rem;
          color: #64748b;
        }

        .article-date {
          font-size: 0.85rem;
          color: #94a3b8;
        }

        .article-cover-container {
          margin-bottom: 2.5rem;
        }

        .image-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          border-radius: 12px;
          overflow: hidden;
          background: #e2e8f0;
        }

        .image-wrapper.placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
          font-size: 1.2rem;
          font-weight: bold;
        }

        .image-caption {
          font-size: 0.8rem;
          color: #64748b;
          text-align: right;
          margin-top: 0.5rem;
          font-style: italic;
        }

        .article-body {
          font-size: 1.15rem;
          line-height: 1.8;
          color: #1e293b;
          font-family: 'Georgia', serif;
        }

        .article-body p {
          margin-bottom: 1.5rem;
        }

        .article-attachment-box {
          margin-top: 3rem;
          padding: 2rem;
          background: #f1f5f9;
          border-radius: 12px;
          border-left: 5px solid #002147;
        }

        .article-attachment-box h3 {
          margin-top: 0;
          color: #002147;
          font-size: 1.2rem;
          margin-bottom: 1rem;
        }

        .btn-download {
          display: inline-block;
          background: #002147;
          color: white;
          padding: 0.8rem 1.5rem;
          border-radius: 8px;
          text-decoration: none;
          font-weight: bold;
          transition: background 0.2s;
        }

        .btn-download:hover {
          background: #001530;
        }

        .video-container {
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
        }

        @media (max-width: 768px) {
          .article-title {
            font-size: 2rem;
          }
          .article-body {
            font-size: 1.05rem;
          }
        }
      `}</style>
    </main>
  );
}
