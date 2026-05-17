"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function BeritaPage() {
  const news = [
    { title: "Kunjungan Ulama dari Al-Azhar Mesir", category: "Acara", date: "28 April 2026", excerpt: "Pondok Pesantren Al Azhar Purwakarta mendapat kehormatan menerima kunjungan delegasi..." },
    { title: "Pendaftaran Santri Baru Gelombang 2 Dibuka", category: "Pengumuman", date: "26 April 2026", excerpt: "Segera daftarkan putra-putri Anda untuk bergabung bersama kami di tahun ajaran 2026/2027..." },
    { title: "Juara Umum Lomba Tahfidz Tingkat Provinsi", category: "Prestasi", date: "24 April 2026", excerpt: "Santri SMA Al Azhar kembali menorehkan prestasi membanggakan di tingkat Jawa Barat..." },
  ];

  return (
    <main>
      <Navbar />
      <section className="news-section">
        <div className="container">
          <div className="section-header">
            <h1>Berita & <span className="accent-text">Artikel</span></h1>
            <p>Update terbaru mengenai kegiatan, prestasi, dan pengumuman pondok pesantren.</p>
          </div>

          <div className="news-grid grid grid-3">
            {news.map((item, index) => (
              <div key={index} className="news-card fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="news-category">{item.category}</div>
                <div className="news-content">
                  <span className="date">{item.date}</span>
                  <h3>{item.title}</h3>
                  <p>{item.excerpt}</p>
                  <a href="#" className="read-more">Baca Selengkapnya &rarr;</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />

      <style jsx>{`
        .news-section {
          padding: 120px 0 80px;
          background: var(--white);
        }

        .section-header {
          text-align: center;
          margin-bottom: 5rem;
        }

        h1 {
          font-size: 3.5rem;
          color: var(--primary);
        }

        .accent-text {
          color: var(--secondary);
        }

        .news-card {
          background: var(--white);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: var(--shadow);
          border: 1px solid #eee;
          transition: var(--transition);
        }

        .news-card:hover {
          transform: translateY(-5px);
          border-color: var(--primary);
        }

        .news-category {
          background: var(--primary);
          color: white;
          padding: 0.5rem 1.5rem;
          display: inline-block;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .news-content {
          padding: 2rem;
        }

        .date {
          font-size: 0.85rem;
          color: var(--text-light);
          display: block;
          margin-bottom: 0.8rem;
        }

        h3 {
          font-size: 1.4rem;
          color: var(--primary);
          margin-bottom: 1rem;
          line-height: 1.4;
        }

        p {
          color: var(--text-light);
          margin-bottom: 1.5rem;
          font-size: 0.95rem;
        }

        .read-more {
          color: var(--primary);
          font-weight: 700;
        }
      `}</style>
    </main>
  );
}
