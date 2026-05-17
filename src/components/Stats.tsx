"use client";

export default function Stats() {
  const stats = [
    { label: "SANTRI AKTIF", value: "1.200+" },
    { label: "TENAGA PENGAJAR", value: "85" },
    { label: "PROGRAM STUDI", value: "12" },
    { label: "ALUMNI", value: "5.000+" },
  ];

  return (
    <section className="stats">
      <div className="container">
        <div className="grid grid-4">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .stats {
          padding: 4rem 0 2rem 0;
          background: var(--white);
          border-bottom: 1px solid #eee;
        }

        .stat-item {
          text-align: center;
          padding: 1rem;
        }

        .stat-value {
          font-size: 3rem;
          font-weight: 800;
          color: var(--primary);
          margin-bottom: 0.5rem;
        }

        .stat-label {
          font-size: 0.8rem;
          letter-spacing: 2px;
          font-weight: 700;
          color: var(--text-light);
        }

        @media (max-width: 768px) {
          .stats { padding: 1rem 0; }
          .grid-4 { 
            grid-template-columns: repeat(2, 1fr); 
            gap: 1rem;
          }
          .stat-item { padding: 0.5rem; }
          .stat-value { font-size: 2rem; }
        }
      `}</style>
    </section>
  );
}
