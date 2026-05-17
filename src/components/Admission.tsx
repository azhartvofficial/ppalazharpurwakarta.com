"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const Admission = () => {
  return (
    <section className="admission-premium">


      <div className="container">
        <div className="admission-grid">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="admission-content"
          >
            <h2 className="admission-title">Ambil Langkah Pertama Menuju Masa Depan Anda</h2>
            <p className="admission-description">
              Temukan jalur masuk yang dirancang khusus untuk Anda. Pelajari persyaratan masuk 
              program pendaftaran santri baru, peluang beasiswa, serta cara memulai 
              pendaftaran Anda hari ini.
            </p>
            <Link href="/pendaftaran">
              <div className="admission-cta">
                Informasi Jalur Beasiswa <span className="arrow">›</span>
              </div>
            </Link>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="admission-image-wrapper"
          >
            <div className="main-image-box">
              <img 
                src="https://res.cloudinary.com/dpgqct4hz/image/upload/v1778999225/luk0g71ynw99bhtqfbe7.png" 
                alt="Santri Al Azhar Purwakarta" 
              />
            </div>
          </motion.div>
        </div>
      </div>
      
      <style jsx>{`
        .admission-premium {
          padding: 1rem 0 2rem 0;
          background: #ffffff;
          position: relative;
          overflow: hidden;
          /* Abstract Background Pattern - More Visible */
          background-image: 
            radial-gradient(at 0% 0%, rgba(0, 33, 71, 0.06) 0px, transparent 50%),
            radial-gradient(at 100% 100%, rgba(255, 140, 0, 0.06) 0px, transparent 50%),
            url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23003366' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .motto-wrapper {
          display: flex;
          justify-content: center;
          width: 100%;
          margin-bottom: 0;
          position: relative;
          padding: 1rem 0;
        }

        .admission-badge {
          display: inline-block;
          padding: 0.3rem 1rem;
          background: #f5f5f5;
          color: #666;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          position: relative;
          z-index: 1;
        }

        .admission-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5rem;
          align-items: center;
        }

        .admission-title {
          font-family: var(--font-custom), serif;
          font-size: 3.5rem;
          color: #003366;
          line-height: 1.1;
          margin-bottom: 2rem;
          font-weight: 400;
        }

        .admission-description {
          font-size: 1.1rem;
          line-height: 1.7;
          color: #555;
          margin-bottom: 3rem;
          max-width: 550px;
        }

        .admission-cta {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 1.1rem 2.6rem;
          background: #f0f7ff;
          color: #0077b6;
          border-radius: 12px;
          font-weight: 700;
          font-size: 1.05rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
          text-decoration: none;
        }

        .admission-cta:hover {
          background: #0077b6;
          color: white;
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(0, 119, 182, 0.15);
        }

        .main-image-box {
          width: 100%;
          height: 600px; /* Increased height */
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .main-image-box img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
        }
        
        @media (max-width: 992px) {
          .admission-grid { 
            grid-template-columns: 1.2fr 0.8fr; 
            gap: 2rem; 
            text-align: left; 
          }
          .admission-description { 
            margin-left: 0; 
            margin-right: 0; 
          }
          .main-image-box { 
            height: 350px;
            width: 100%;
          }
          .admission-title { font-size: 2.5rem; }
        }

        @media (max-width: 768px) {
          .admission-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
            text-align: center !important;
          }
          .admission-content {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
          }
          .admission-title { 
            font-size: 1.8rem; 
            margin-bottom: 1rem !important;
          }
          .admission-description { 
            font-size: 0.9rem; 
            margin-bottom: 1.5rem;
            text-align: center !important;
            margin: 0 auto 1.5rem auto !important;
          }
          .main-image-box { height: 250px; border-radius: 20px; }
          .admission-cta { 
            padding: 0.8rem 1.8rem !important; 
            font-size: 0.85rem !important;
            white-space: nowrap !important;
            display: inline-flex !important;
            justify-content: center !important;
            align-items: center !important;
            margin: 0 auto !important;
            width: fit-content !important;
          }
        }

        @media (max-width: 480px) {
          .admission-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          .admission-title { font-size: 1.4rem !important; }
          .admission-description { font-size: 0.8rem !important; margin-bottom: 1.2rem !important; }
          .main-image-box { height: 220px !important; }
          .admission-cta { 
            padding: 0.7rem 1.4rem !important; 
            font-size: 0.8rem !important; 
            white-space: nowrap !important;
            width: fit-content !important;
          }
          .admission-premium { padding: 1rem 0 2rem 0 !important; }
        }
      `}</style>
    </section>
  );
};

export default Admission;
