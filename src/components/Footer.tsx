"use client";
import localFont from "next/font/local";
import Link from "next/link";

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
            <p className="footer-desc">“Profesional dan sinergi menuju lembaga modern <br /> untuk mencapai berkah dan ridho ilahi”</p>
            
            {/* Lapor PUSPAR - Desktop */}
            <div className="puspar-btn-desktop">
              <Link href="/lapor-puspar" className="puspar-report-btn">
                <div className="puspar-icon-wrapper">
                  <span className="blink-indicator"></span>
                  <span className="puspar-icon">📢</span>
                </div>
                <div className="puspar-text">
                  <span className="puspar-title">Lapor PUSPAR</span>
                  <span className="puspar-sub">Pusat Pengaduan & Aspirasi Santri</span>
                </div>
              </Link>
            </div>
          </div>
          
          <div className="footer-col">
            <h5>TENTANG KAMI</h5>
            <ul>
              <li><Link href="/profil/alazhapurwakarta">Al-Azhar Purwakarta</Link></li>
              <li><Link href="/profil/sistem-pendidikan">Sistem Pendidikan</Link></li>
              <li><Link href="/profil/pendiri">Profil Pendiri</Link></li>
              <li><Link href="/azhar-tv">Media Azhar TV</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>JENJANG</h5>
            <ul style={{ marginBottom: '2rem' }}>
              <li><Link href="/unit/sdit">SDIT Al-Azhar</Link></li>
              <li><Link href="/unit/smp">SMP Islam Al-Azhar</Link></li>
              <li><Link href="/unit/ma">MA Unggulan Al-Azhar</Link></li>
            </ul>
            
            <h5>INFORMASI</h5>
            <ul>
              <li><Link href="/informasi">Tahap Pendaftaran</Link></li>
              <li><Link href="/jelajahi/beasiswa">Jalur Beasiswa</Link></li>
            </ul>

            {/* Lapor PUSPAR - Mobile */}
            <div className="puspar-btn-mobile">
              <Link href="/lapor-puspar" className="puspar-report-btn">
                <div className="puspar-icon-wrapper">
                  <span className="blink-indicator"></span>
                  <span className="puspar-icon">📢</span>
                </div>
                <div className="puspar-text">
                  <span className="puspar-title">Lapor PUSPAR</span>
                  <span className="puspar-sub">Pusat Pengaduan & Aspirasi Santri</span>
                </div>
              </Link>
            </div>
          </div>

          <div className="footer-col contact-col">
            <h5>ALAMAT & KONTAK</h5>
            <div className="contact-item">
              <span className="contact-label">Alamat Lengkap</span>
              <p>
                <a 
                  href="https://share.google/DBFhjX2zTVpdCkv90" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ color: '#3b82f6', textDecoration: 'none' }}
                  onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                  onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                >
                  Gang Coklat, Kp. Warungkandang RT.19/RW.04 Desa Sindangsari Kecamatan Plered, Kab. Purwakarta Jawa Barat
                </a>
              </p>
            </div>
            <div className="contact-item">
              <span className="contact-label">Kontak Whatsaap</span>
              <p>
                <a 
                  href="https://api.whatsapp.com/send/?phone=6281289852035&text=Assalamualaikum+Ustadz%2FPengurus+PPDB+Al-Azhar+Purwakarta.+Mohon+informasinya+mengenai+syarat+pendaftaran%2C+rincian+biaya%2C+dan+brosur+terbaru+untuk+tahun+ajaran+ini.+Terima+kasih&type=phone_number&app_absent=0" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ color: '#3b82f6', textDecoration: 'none' }}
                  onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                  onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                >
                  0895-0455-0090 <br />( Cecep Rahmat, M. Ag )
                </a>
              </p>
            </div>
            <div className="contact-item">
              <span className="contact-label">Email</span>
              <p>abah.rahmat86@gmail.com</p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="copyright">
            &copy; Copyright Media Azhar TV | Pondok Pesantren Al Azhar Purwakarta 2026
          </div>
          <div className="social-section">
            <p className="social-text">Ikuti akun media sosial resmi kami:</p>
            <div className="social-links">
              <a href="https://www.facebook.com/ponpes.alazharpurwakarra" target="_blank" rel="noopener noreferrer">Facebook</a>
              <a href="https://www.instagram.com/azhar_tv_" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href="https://www.youtube.com/@Tvazhar" target="_blank" rel="noopener noreferrer">YouTube</a>
              <a href="https://alazharpwk.cazh.id/ppdb/ponpes-al-azhar-purwakarta" target="_blank" rel="noopener noreferrer">Cazh</a>
            </div>
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

        .contact-item {
          margin-bottom: 1.2rem;
        }

        .contact-label {
          display: block;
          font-size: 0.65rem;
          color: var(--secondary);
          font-weight: 800;
          letter-spacing: 1px;
          margin-bottom: 0.1rem;
          text-transform: uppercase;
        }

        .contact-item p {
          margin-top: 0;
          margin-bottom: 0 !important;
          line-height: 1.5;
        }

        .footer-bottom {
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.8rem;
        }

        .social-section {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.5rem;
        }

        .social-text {
          font-size: 0.75rem;
          color: #ffcc00;
          letter-spacing: 0.5px;
          align-self: flex-start;
        }

        .social-links {
          display: flex;
          gap: 1.5rem;
        }

        .social-links a:hover {
          color: #ff8c00;
        }

        /* Lapor PUSPAR Button */
        .puspar-btn-mobile {
          display: none;
        }

        .puspar-btn-desktop {
          margin-top: 2rem;
        }

        .puspar-report-btn {
          display: inline-flex;
          align-items: center;
          background: rgba(15, 23, 42, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 0.75rem 1.25rem;
          border-radius: 15px;
          text-decoration: none;
          color: white;
          gap: 1.2rem;
          position: relative;
          transition: all 0.3s ease;
        }

        .puspar-report-btn:hover {
          background: rgba(15, 23, 42, 0.8);
          border-color: rgba(255, 140, 0, 0.5);
          transform: translateY(-2px);
        }

        .puspar-icon-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          background: linear-gradient(135deg, #ff8c00, #ffcc00);
          border-radius: 12px;
          flex-shrink: 0;
          box-shadow: 0 4px 15px rgba(255, 140, 0, 0.3);
        }

        .blink-indicator {
          position: absolute;
          top: -3px;
          right: -3px;
          width: 12px;
          height: 12px;
          background-color: #ef4444;
          border-radius: 50%;
          border: 2px solid #001529;
          box-shadow: 0 0 10px rgba(239, 68, 68, 0.8);
          animation: blink 1.5s infinite;
        }

        @keyframes blink {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
          100% { opacity: 1; transform: scale(1); }
        }

        .puspar-icon {
          font-size: 1.5rem;
        }

        .puspar-text {
          display: flex;
          flex-direction: column;
        }

        .puspar-title {
          font-weight: 700;
          color: #ffffff;
          font-size: 1.05rem;
          letter-spacing: 0.5px;
        }

        .puspar-sub {
          font-size: 0.8rem;
          color: #ffcc00;
        }

        @media (max-width: 768px) {
          .footer-top { grid-template-columns: 1fr; gap: 3rem; margin-bottom: 2rem; }
          .footer-bottom { 
            flex-direction: column-reverse; 
            gap: 1.5rem; 
            text-align: center; 
            border-top: none;
            padding-top: 0;
          }
          .copyright {
            width: 100%;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            padding-top: 1.5rem;
          }
          .social-section { 
            align-items: center; 
            width: 100%; 
          }
          .social-text {
            align-self: center;
          }
          .puspar-btn-desktop {
            display: none;
          }
          .puspar-btn-mobile {
            display: block;
            margin-top: 1.5rem;
          }
        }
      `}</style>
    </footer>
  );
}
