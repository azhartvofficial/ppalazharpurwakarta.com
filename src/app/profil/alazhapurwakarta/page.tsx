"use client";
import React, { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import localFont from "next/font/local";

const frizQuadrata = localFont({
  src: "../../../Font/friz-quadrata-std-medium-5870338ec7ef8.otf",
  variable: "--font-friz",
});

export default function SejarahPage() {
  const { t } = useLanguage();
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVideoVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <main>
      <Navbar />
      
      {/* Main Content */}
      <section className="sejarah-content">
        <div className="container">
          <div className="grid-container">
            <div className="sejarah-text">
              <span className="subtitle">Profil Al-Azhar Purwakarta</span>
              <h2 className={frizQuadrata.className}>Mencetak Generasi Hafidz Berilmu dan Berakhlak Rabbani</h2>
              <p>
                Pesantren Al-Azhar Purwakarta adalah lembaga pendidikan Islam yang bersifat independen serta tidak memiliki keterkaitan dengan partai politik atau organisasi massa tertentu, juga tidak berhubungan atau terlibat dengan sekte atau ajaran atau aliran agama yang dilarang oleh Pemerintah Republik Indonesia. Tahfidz dan Bahasa Arab merupakan program unggulan dari lembaga kami.
              </p>
              <p>
                Pesantren Al-Azhar Purwakarta menerapkan sistem pendidikan berbasis Boarding School & Full Day School (Non Mondok). Unit Pendidikan yang ada di Pesantren Al-Azhar Purwakarta dimulai dari jenjang SDIT Al-Azhar, SMP Islam Al-Azhar, Madrasah Aliyah Unggulan Al-Azhar, dan akan segera hadir jenjang pendidikan TKIT Al-Azhar Purwakarta.
              </p>
            </div>
            <div className="sejarah-img">
              <img src="https://res.cloudinary.com/dpgqct4hz/image/upload/v1778999221/jbdav9rhoivmmytzjjen.png" alt="Profil Al-Azhar Purwakarta" />
            </div>
          </div>

          <div className="visi-misi-section">
              <div className="vm-logos-column">
                <div className="vm-logos-row">
                  <img src="https://res.cloudinary.com/dpgqct4hz/image/upload/v1778999207/ntxuizh8mm8odxndbvs2.png" alt="Logo Ponpes" />
                  <img src="https://res.cloudinary.com/dpgqct4hz/image/upload/v1778999209/ftxowvzkp4bix7mimh3v.png" alt="Logo SMP" />
                  <img src="https://res.cloudinary.com/dpgqct4hz/image/upload/v1778999206/tseftzv1omefjsldurni.png" alt="Logo MA" />
                </div>
                <div className="vm-logos-row">
                  <img src="https://res.cloudinary.com/dpgqct4hz/image/upload/v1778999208/vqmahfuz6iqrzg916oab.png" alt="Logo SDIT" />
                  <img src="https://res.cloudinary.com/dpgqct4hz/image/upload/v1778999210/xblypre0sq4suc8bjdld.png" alt="Logo TK" />
                </div>
              </div>
            <div className="v-m-box">
              <div className="v-m-item">
                <h3 className={frizQuadrata.className}>Visi</h3>
                <p>Terwujudnya pesantren yang mampu mencetak generasi penghafal Al-Qur'an, berilmu dan berakhlak mulia</p>
              </div>
              <div className="v-m-item" style={{ marginTop: '2rem' }}>
                <h3 className={frizQuadrata.className}>Misi</h3>
                <ol>
                  <li>Menjadi pelopor dalam penerapan tahsin dan tahfidz qur'an</li>
                  <li>Menerapkan nilai-nilai Islam dalam berbagai aspek kehidupan.</li>
                  <li>Menanamkan akhlak islami dalam kehidupan sehari-hari</li>
                  <li>Menjadi penyatu ummat melalui pendidikan dan dakwah</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="video-profile-section">
            <div className="section-header-video">
              <h3 className={`${frizQuadrata.className} video-title`}>
                <strong>Profil Pondok Pesantren <br /> Al-Azhar Purwakarta</strong>
              </h3>
              <div className="title-accent"></div>
            </div>
            <div className="video-container" ref={videoRef}>
              {isVideoVisible ? (
                <iframe 
                  src="https://www.youtube.com/embed/N7mmwdmUR98?autoplay=1&mute=1&loop=1&playlist=N7mmwdmUR98&rel=0&showinfo=0&modestbranding=1" 
                  title="Video Profil Pondok Pesantren Al-Azhar Purwakarta" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              ) : null}
            </div>
            <p className="video-caption">Dikelola oleh Azhar TV</p>
          </div>

          <div className="history-timeline">
            <h3 className={frizQuadrata.className}>Sejak 2017</h3>
            <p>
              Didirikan dengan semangat untuk mencetak kader ulama yang intelek, Pondok Pesantren Al-Azhar Purwakarta terus bertransformasi menjadi lembaga pendidikan modern tanpa meninggalkan nilai-nilai luhur pesantren. 
              Hingga saat ini, kami telah meluluskan ribuan alumni yang berkiprah di berbagai sektor, baik di dalam maupun luar negeri.
            </p>
          </div>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        .sejarah-content {
          padding: 12rem 0 8rem 0;
        }

        .grid-container {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 4rem;
          align-items: start;
        }

        .sejarah-img img {
          width: 100%;
        }

        .subtitle {
          color: var(--primary);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
          display: block;
          margin-bottom: 1rem;
          font-size: 0.9rem;
        }

        h2 {
          font-size: 2.8rem;
          color: var(--primary);
          margin-bottom: 2rem;
          line-height: 1.2;
        }

        .sejarah-text p {
          font-size: 1.15rem;
          line-height: 1.8;
          color: #555;
          margin-bottom: 1.5rem;
        }

        .visi-misi-section {
          display: flex;
          flex-direction: column;
          gap: 3rem;
          margin-top: 1.5rem;
          align-items: center;
        }

        .vm-logos-column {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          width: 100%;
          max-width: 1000px;
        }

        .vm-logos-row {
          display: flex;
          justify-content: center;
          gap: 2.5rem;
          flex-wrap: wrap;
        }

        .vm-logos-row img {
          width: 90px;
          height: auto;
          object-fit: contain;
          display: block;
        }

        .v-m-content {
          width: 100%;
        }

        .v-m-box {
          padding: 3rem;
          background: white;
          border-radius: 24px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
          border-left: 6px solid var(--secondary);
          height: 100%;
        }

        .v-m-item h3 {
          color: var(--primary);
          font-size: 1.5rem;
          margin-bottom: 1rem;
        }

        .v-m-item ol {
          padding-left: 1.5rem;
          color: #555;
        }

        .v-m-item ol li {
          margin-bottom: 0.8rem;
          line-height: 1.6;
        }

        .history-timeline {
          margin-top: 6rem;
          padding-top: 4rem;
          border-top: 1px solid #e2e8f0;
        }

        .history-timeline h3 {
          font-size: 1.8rem;
          color: var(--primary);
          margin-bottom: 1.5rem;
        }

        .video-profile-section {
          margin-top: 5rem;
          padding-top: 3rem;
        }

        .section-header-video {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .section-header-video h3.video-title {
          font-size: 2.2rem;
          line-height: 1.25;
          color: var(--primary);
          margin-bottom: 1rem;
          font-weight: normal;
          font-style: normal;
          letter-spacing: -0.5px;
        }

        .title-accent {
          width: 80px;
          height: 4px;
          background: #ff8c00;
          margin: 0 auto;
          border-radius: 4px;
        }

        .video-container {
          position: relative;
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
          aspect-ratio: 16 / 9;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
          background: #000;
        }

        .video-container iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: none;
        }

        .video-caption {
          text-align: center;
          font-size: 0.85rem;
          color: #888;
          font-style: italic;
          margin-top: 1rem;
        }

        @media (max-width: 992px) {
          .grid-container {
            grid-template-columns: 1.5fr 1fr;
            gap: 1.5rem;
          }
          .vm-logos-column {
            max-width: 500px;
            gap: 1.5rem;
          }
          .vm-logos-row {
            gap: 1.5rem;
          }
          .vm-logos-row img {
            max-width: 70px;
          }
          h2 {
            font-size: 1.8rem;
          }
          .section-header-video h3 {
            font-size: 2.5rem;
          }
          .v-m-box {
            padding: 1.5rem;
          }
        }

        @media (max-width: 768px) {
          .sejarah-content {
            padding: 8rem 0 4rem 0;
          }
          .grid-container {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .sejarah-img {
            order: -1;
            margin-bottom: 1rem;
          }
          .sejarah-text {
            text-align: justify;
          }
          .vm-logos-column {
            max-width: 320px;
            gap: 1rem;
          }
          .vm-logos-row {
            gap: 1rem;
          }
          .vm-logos-row img {
            flex: 0 0 calc(33.333% - 1rem);
            max-width: 65px;
          }
          h2 {
            font-size: 1.5rem;
          }
          .section-header-video h3.video-title {
            font-size: 1.6rem;
          }
          .video-container {
            border-radius: 12px;
          }
          .v-m-box {
            padding: 1.5rem;
            border-left: none;
            border-top: 6px solid var(--secondary);
          }
        }
      `}</style>
    </main>
  );
}
