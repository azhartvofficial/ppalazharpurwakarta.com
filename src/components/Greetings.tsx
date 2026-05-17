"use client";
import React from "react";

const Greetings = () => {
  return (
    <section className="greetings-section">
      <div className="container">
        <div className="section-header">
          <span className="subtitle">Mengenal Sosok di Balik Al-Azhar</span>
          <h2 className="title-main">Sapa Hangat Kami</h2>
        </div>

        <div className="greetings-grid">
          {/* Card 1: Pimpinan Pondok */}
          <div className="greeting-card">
            <div className="card-inner">
              <div className="image-wrapper">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop" alt="Pimpinan Pondok" />
                <div className="image-border"></div>
              </div>
              <div className="text-content">
                <div className="quote-icon">“</div>
                <p className="quote-text">
                  Pendidikan adalah cahaya yang menuntun santri menjadi pribadi yang tangguh, 
                  berilmu, dan memiliki kemuliaan akhlak untuk kejayaan Islam.
                </p>
                <div className="profile-info">
                  <h4>KH. Muhammad Azhar, M.Pd.</h4>
                  <span>Pimpinan Pondok Pesantren</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Ketua Yayasan */}
          <div className="greeting-card">
            <div className="card-inner">
              <div className="image-wrapper">
                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop" alt="Ketua Yayasan" />
                <div className="image-border"></div>
              </div>
              <div className="text-content">
                <div className="quote-icon">“</div>
                <p className="quote-text">
                  Kami berkomitmen membangun ekosistem pendidikan yang modern namun tetap 
                  menjaga nilai-nilai luhur kepesantrenan sebagai identitas utama.
                </p>
                <div className="profile-info">
                  <h4>H. Ahmad Fauzi, S.E.</h4>
                  <span>Ketua Yayasan Al-Azhar</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .greetings-section {
          padding: 0 0 5rem 0; /* Tightened top and bottom padding */
          background: linear-gradient(180deg, #f8faff 0%, #ffffff 100%);
          position: relative;
        }

        .section-header {
          text-align: center;
          margin-bottom: 1.5rem; /* Further reduced margin */
        }

        .subtitle {
          color: var(--secondary);
          text-transform: uppercase;
          letter-spacing: 2px;
          font-weight: 700;
          font-size: 0.9rem;
          display: block;
          margin-bottom: 1rem;
        }

        .title-main {
          font-family: var(--font-custom), sans-serif;
          font-size: 3rem;
          color: var(--primary);
          font-weight: 400;
        }

        .greetings-grid {
          display: flex;
          flex-direction: column;
          gap: 4rem;
          max-width: 1100px;
          margin: 0 auto;
        }

        .greeting-card {
          width: 100%;
        }

        .card-inner {
          background: white;
          padding: 3rem;
          border-radius: 40px;
          box-shadow: 0 20px 60px rgba(0, 33, 71, 0.05);
          display: flex;
          align-items: center;
          gap: 4rem;
          text-align: left;
          transition: transform 0.4s ease;
          border: 1px solid rgba(0, 33, 71, 0.03);
          overflow: hidden;
        }

        .greeting-card:nth-child(even) .card-inner {
          flex-direction: row-reverse;
          text-align: right;
        }

        .greeting-card:hover .card-inner {
          transform: scale(1.02);
          box-shadow: 0 30px 80px rgba(0, 33, 71, 0.08);
        }

        .image-wrapper {
          position: relative;
          width: 250px;
          height: 300px;
          flex-shrink: 0;
        }

        .image-wrapper img {
          width: 100%;
          height: 100%;
          border-radius: 30px;
          object-fit: cover;
          position: relative;
          z-index: 2;
          box-shadow: 0 15px 35px rgba(0,0,0,0.1);
        }

        .image-border {
          position: absolute;
          top: -15px;
          left: -15px;
          width: 100px;
          height: 100px;
          border-left: 5px solid var(--secondary);
          border-top: 5px solid var(--secondary);
          border-radius: 20px 0 0 0;
          z-index: 1;
        }

        .greeting-card:nth-child(even) .image-border {
          left: auto;
          right: -15px;
          border-left: none;
          border-right: 5px solid var(--secondary);
          border-radius: 0 20px 0 0;
        }

        .text-content {
          flex-grow: 1;
        }

        .quote-icon {
          font-size: 5rem;
          color: var(--secondary);
          opacity: 0.15;
          line-height: 1;
          font-family: serif;
          margin-bottom: -1.5rem;
        }

        .quote-text {
          font-style: italic;
          color: #4a5568;
          font-size: 1.25rem;
          line-height: 1.8;
          margin-bottom: 2rem;
          position: relative;
          z-index: 1;
        }

        .profile-info h4 {
          color: var(--primary);
          font-size: 1.6rem;
          font-weight: 800;
          margin-bottom: 0.4rem;
        }

        .profile-info span {
          color: var(--secondary);
          font-weight: 700;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        @media (max-width: 992px) {
          .card-inner, .greeting-card:nth-child(even) .card-inner {
            flex-direction: column;
            text-align: center;
            gap: 2rem;
            padding: 2.5rem;
          }
          .image-wrapper {
            width: 100%;
            max-width: 300px;
            height: 350px;
          }
          .title-main { font-size: 2.5rem; }
        }

        @media (max-width: 768px) {
          .greetings-section { padding: 5rem 0; }
          .profile-info h4 { font-size: 1.4rem; }
        }
      `}</style>
    </section>
  );
};

export default Greetings;
