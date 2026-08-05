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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .eq('id', params.id)
        .single();
      
      if (error || !data) {
        alert("Berita tidak ditemukan!");
        router.push("/berita");
      } else {
        setArticle(data);
      }
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

  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return "";
    let videoId = "";
    if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0];
    } else if (url.includes("youtube.com/watch?v=")) {
      videoId = url.split("v=")[1]?.split("&")[0];
    } else if (url.includes("youtube.com/embed/")) {
      return url;
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
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

        {/* Attachments */}
        {article.jenis_lampiran_2 && article.lampiran_2_url && (
          <div className="article-attachment-box">
            {article.jenis_lampiran_2 !== 'Video Youtube' && (
              <h3>Lampiran Tambahan ({article.jenis_lampiran_2})</h3>
            )}
            
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
                <img src={article.lampiran_2_url} alt="Lampiran" style={{ maxWidth: '100%', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
              </div>
            ) : (
              <a href={article.lampiran_2_url} target="_blank" rel="noopener noreferrer" className="btn-download">
                Lihat / Unduh {article.jenis_lampiran_2}
              </a>
            )}
          </div>
        )}
      </article>

      <Footer />

      <style jsx>{`
        .berita-detail-page {
          background-color: #f8fafc;
          min-height: 100vh;
        }

        .article-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 3rem 20px;
          background: white;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
          border-radius: 0 0 20px 20px;
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
