"use client";
import localFont from "next/font/local";

const frizQuadrata = localFont({
  src: "../Font/friz-quadrata-std-medium-5870338ec7ef8.otf",
  variable: "--font-friz",
});

export default function Footer() {
  return (
    <footer id="kontak" className="footer">
      <div className="container">
        <div className="footer-top grid grid-4">
          <div className="footer-brand">
            <h3 className={`logo-main ${frizQuadrata.className}`}>
              PESANTREN <br /> AL-AZHAR
            </h3>
            <h4 className="logo-sub">PURWAKARTA</h4>
            <p className="logo-tagline">TAKHOSSUS TAHFIDZ QUR'AN DAN BAHASA ARAB</p>
            <p className="footer-desc">Membentuk pemimpin masa depan dengan karakter Islami dan integritas intelektual.</p>
          </div>
          
          <div className="footer-col">
            <h5>INSTITUSI</h5>
            <ul>
              <li><a href="#">Tentang Kami</a></li>
              <li><a href="#">Visi & Misi</a></li>
              <li><a href="#">Struktur Organisasi</a></li>
              <li><a href="#">Pimpinan</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>AKADEMIK</h5>
            <ul>
              <li><a href="#">Pendidikan SMP</a></li>
              <li><a href="#">Pendidikan SMA</a></li>
              <li><a href="#">Tahfidz Qur'an</a></li>
              <li><a href="#">Ekstrakurikuler</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>KONTAK</h5>
            <p>Jl. Terusan Ibrahim Singadilaga No. 1, Purwakarta</p>
            <p>T. +62 264 1234567</p>
            <p>E. info@alazhapurwakarta.com</p>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="copyright">
            &copy; 2026 Pondok Pesantren Al Azhar Purwakarta.
          </div>
          <div className="social-links">
            <a href="#">Facebook</a>
            <a href="#">Instagram</a>
            <a href="#">YouTube</a>
            <a href="#">LinkedIn</a>
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer {
          background: #001529;
          color: rgba(255, 255, 255, 0.8);
          padding: 6rem 0 2rem;
        }

        .footer-top {
          margin-bottom: 4rem;
        }

        .logo-main {
          color: white;
          font-size: 1.8rem;
          line-height: 1;
          margin-bottom: 0.2rem;
          font-weight: normal;
        }

        .logo-sub {
          color: var(--secondary);
          font-size: 1.3rem;
          font-weight: 800;
          letter-spacing: 2px;
          margin-bottom: 0.3rem;
        }

        .logo-tagline {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 1px;
          margin-bottom: 1.5rem !important;
        }

        h5 {
          color: white;
          font-size: 0.9rem;
          font-weight: 800;
          letter-spacing: 1px;
          margin-bottom: 1.5rem;
        }

        ul li {
          margin-bottom: 0.8rem;
        }

        ul li a {
          font-size: 0.9rem;
        }

        ul li a:hover {
          color: var(--secondary);
        }

        .footer-desc, .footer-col p {
          font-size: 0.9rem;
          line-height: 1.8;
          margin-bottom: 1rem;
        }

        .footer-bottom {
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.8rem;
        }

        .social-links {
          display: flex;
          gap: 1.5rem;
        }

        .social-links a:hover {
          color: white;
        }

        @media (max-width: 768px) {
          .footer-top { grid-template-columns: 1fr; gap: 3rem; }
          .footer-bottom { flex-direction: column; gap: 1.5rem; text-align: center; }
        }
      `}</style>
    </footer>
  );
}
