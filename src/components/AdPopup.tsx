"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

export default function AdPopup() {
  const [adUrl, setAdUrl] = useState<string | null>(null);
  const [showAd, setShowAd] = useState(false);

  useEffect(() => {
    // Cek apakah user sudah melihat iklan di sesi ini
    const hasSeenAd = sessionStorage.getItem("hasSeenAd");
    if (hasSeenAd) return;

    const fetchAd = async () => {
      try {
        const { data, error } = await supabase
          .from("popup_ads")
          .select("*")
          .eq("status", "published")
          .order("created_at", { ascending: false })
          .limit(1);

        if (error) {
          console.error("Error fetching ad:", error);
          return;
        }

        if (data && data.length > 0) {
          const ad = data[0];
          
          // Cek masa berlaku
          if (ad.expires_at) {
            const expiresDate = new Date(ad.expires_at);
            if (expiresDate < new Date()) {
              // Jika sudah lewat masa berlaku, jangan tampilkan
              return;
            }
          }

          setAdUrl(ad.image_url);
          // Kasih jeda sedikit biar website muncul dulu sebelum popup
          setTimeout(() => {
            setShowAd(true);
          }, 1500);
        }
      } catch (err) {
        console.error("Error:", err);
      }
    };

    fetchAd();
  }, []);

  const closeAd = () => {
    setShowAd(false);
    sessionStorage.setItem("hasSeenAd", "true");
  };

  return (
    <AnimatePresence>
      {showAd && adUrl && (
        <div 
          onClick={closeAd}
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            width: '100vw', 
            height: '100vh', 
            background: 'rgba(0,0,0,0.7)', 
            backdropFilter: 'blur(5px)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            zIndex: 999999, 
            padding: '2rem' 
          }}
        >
          <motion.div 
            onClick={(e) => e.stopPropagation()} 
            initial={{ opacity: 0, scale: 0.8, y: 50 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            style={{ 
              position: 'relative',
              width: '100%', 
              maxWidth: '450px',
              borderRadius: '20px',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
              overflow: 'hidden'
            }}
          >
            {/* Close Button */}
            <button 
              onClick={closeAd}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'rgba(255,255,255,0.9)',
                color: '#0f172a',
                border: 'none',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                zIndex: 10,
                transition: 'transform 0.2s ease, background 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.background = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.9)';
              }}
            >
              &times;
            </button>

            {/* Image */}
            <img 
              src={adUrl} 
              alt="Pengumuman" 
              style={{ 
                width: '100%', 
                height: 'auto',
                display: 'block',
                maxHeight: '85vh',
                objectFit: 'contain',
                background: '#fff'
              }} 
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
