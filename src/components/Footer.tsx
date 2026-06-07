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
            <h5>AKADEMIK</h5>
            <ul>
              <li><Link href="/unit/sdit">SDIT Al-Azhar</Link></li>
              <li><Link href="/unit/smp">SMP Islam Al-Azhar</Link></li>
              <li><Link href="/unit/ma">MA Unggulan Al-Azhar</Link></li>
            </ul>
          </div>

          <div className="footer-col contact-col">
            <h5>ALAMAT & KONTAK</h5>
            <div className="contact-item">
              <span className="contact-label">Alamat Lengkap</span>
              <p>Gang Coklat, Kp. Warungkandang RT.19/RW.04 Desa Sindangsari Kecamatan Plered, Kab. Purwakarta Jawa Barat</p>
            </div>
            <div className="contact-item">
              <span className="contact-label">Kontak Whatsaap</span>
              <p>
                <a href="https://api.whatsapp.com/send/?phone=081289852035" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
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
          color: white;
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
        }
      `}</style>
    </footer>
  );
}
