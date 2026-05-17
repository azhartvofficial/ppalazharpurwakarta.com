"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AzharLearnPage() {
  const courses = [
    { title: "Dasar-Dasar Ilmu Nahwu", author: "Ustadz Ahmad", level: "Beginner", icon: "📚" },
    { title: "Tahsin & Tajwid Al-Qur'an", author: "Ustadzah Fatimah", level: "All Levels", icon: "🎤" },
    { title: "Fiqh Ibadah Praktis", author: "K.H. Zainal", level: "Intermediate", icon: "⚖️" },
  ];

  return (
    <main>
      <Navbar />
      <section className="learn-section">
        <div className="container">
          <div className="section-header">
            <h1>Azhar <span className="accent-text">Learn</span></h1>
            <p>E-Learning platform resmi Pondok Pesantren Al Azhar Purwakarta.</p>
          </div>

          <div className="learn-cta glass fade-in-up">
            <div className="cta-content">
              <h2>Mulai Belajar Hari Ini</h2>
              <p>Akses ratusan materi pembelajaran pesantren kapan saja dan di mana saja.</p>
              <button className="btn btn-secondary">Mulai Belajar</button>
            </div>
          </div>

          <div className="course-grid grid grid-3">
            {courses.map((course, index) => (
              <div key={index} className="course-card">
                <div className="course-icon">{course.icon}</div>
                <h3>{course.title}</h3>
                <div className="course-meta">
                  <span>👤 {course.author}</span>
                  <span>📊 {course.level}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />

      <style jsx>{`
        .learn-section {
          padding: 120px 0 80px;
          background: #f0f4f8;
        }

        .section-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        h1 {
          font-size: 3.5rem;
          color: var(--primary);
        }

        .accent-text {
          color: var(--accent);
        }

        .learn-cta {
          background: linear-gradient(to right, var(--primary), var(--accent));
          color: white;
          padding: 4rem;
          border-radius: 30px;
          margin-bottom: 4rem;
          text-align: center;
        }

        .learn-cta h2 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .learn-cta p {
          margin-bottom: 2rem;
          opacity: 0.9;
        }

        .course-card {
          background: var(--white);
          padding: 2.5rem;
          border-radius: 20px;
          box-shadow: var(--shadow);
          text-align: center;
          transition: var(--transition);
        }

        .course-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }

        .course-icon {
          font-size: 3rem;
          margin-bottom: 1.5rem;
        }

        .course-card h3 {
          font-size: 1.3rem;
          margin-bottom: 1.5rem;
          color: var(--primary);
        }

        .course-meta {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          font-size: 0.85rem;
          color: var(--text-light);
          border-top: 1px solid #eee;
          padding-top: 1rem;
        }
      `}</style>
    </main>
  );
}
