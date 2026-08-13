"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function MaintenanceGuard({ children }: { children: React.ReactNode }) {
  const [isMaintenance, setIsMaintenance] = useState<boolean | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Check if user is Super Admin
    const sessionData = localStorage.getItem('admin_session');
    if (sessionData) {
      try {
        const user = JSON.parse(sessionData);
        if (user?.email === 'admin.alazharpwk@gmail.com' || user?.user_metadata?.role === 'Super Admin') {
          setIsSuperAdmin(true);
        }
      } catch (e) {
        console.error("Failed to parse admin session", e);
      }
    }

    // Fetch maintenance status
    const checkMaintenance = async () => {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          setIsMaintenance(data.maintenanceMode);
        } else {
          setIsMaintenance(false);
        }
      } catch (error) {
        console.error("Error fetching maintenance state:", error);
        setIsMaintenance(false);
      }
    };

    checkMaintenance();

    // Set up polling to catch changes without refreshing
    const interval = setInterval(checkMaintenance, 5000);
    return () => clearInterval(interval);
  }, []);

  // Show nothing while checking initial state to avoid flickering
  if (isMaintenance === null) {
    return null; 
  }

  // If maintenance is on and user is NOT Super Admin, show maintenance screen
  if (isMaintenance && !isSuperAdmin) {
    if (pathname === "/") {
      return (
        <>
          <div style={{
            backgroundColor: '#ef4444',
            color: 'white',
            textAlign: 'center',
            padding: '12px 20px',
            fontWeight: 800,
            fontSize: '0.9rem',
            position: 'sticky',
            top: 0,
            zIndex: 99999,
            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
          }}>
            ⚠️ WEBSITE SEDANG DALAM MAINTENANCE
          </div>
          {children}
        </>
      );
    }

    return (
      <div style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at top right, #1e1b4b 0%, #020617 60%, #000000 100%)',
        fontFamily: 'Inter, sans-serif',
        padding: '2rem',
        textAlign: 'center',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Futuristic glowing orbs in background */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80vw',
          height: '80vw',
          background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 60%)',
          zIndex: 0,
          pointerEvents: 'none'
        }}></div>

        <div style={{ zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', maxWidth: '800px' }}>
          
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '1.5rem',
            marginBottom: '1rem',
            background: 'rgba(255, 255, 255, 0.03)',
            padding: '1.5rem 2rem',
            borderRadius: '24px',
            border: '1px solid rgba(255,255,255,0.05)',
            backdropFilter: 'blur(10px)'
          }}>
            {[
              "https://res.cloudinary.com/dpgqct4hz/image/upload/f_auto,q_auto/v1778999207/ntxuizh8mm8odxndbvs2.png",
              "https://res.cloudinary.com/dpgqct4hz/image/upload/f_auto,q_auto/v1778999209/ftxowvzkp4bix7mimh3v.png",
              "https://res.cloudinary.com/dpgqct4hz/image/upload/f_auto,q_auto/v1778999206/tseftzv1omefjsldurni.png",
              "https://res.cloudinary.com/dpgqct4hz/image/upload/f_auto,q_auto/v1778999208/vqmahfuz6iqrzg916oab.png",
              "https://res.cloudinary.com/dpgqct4hz/image/upload/f_auto,q_auto/v1778999210/xblypre0sq4suc8bjdld.png"
            ].map((src, idx) => (
              <div key={idx} style={{
                position: 'relative',
                width: '60px',
                height: '60px',
                filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.15))'
              }}>
                <Image 
                  src={src}
                  alt="Logo Lembaga"
                  fill
                  style={{ objectFit: 'contain' }}
                  unoptimized
                />
              </div>
            ))}
          </div>

          <div>
            <h1 style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 900,
              margin: '0 0 1rem 0',
              background: 'linear-gradient(135deg, #ffffff 0%, #94a3b8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-1px'
            }}>
              SISTEM DALAM PERBAIKAN
            </h1>
            <p style={{
              fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
              color: '#94a3b8',
              margin: '0 auto',
              lineHeight: 1.6,
              maxWidth: '600px'
            }}>
              Kami sedang melakukan peningkatan infrastruktur secara menyeluruh untuk memberikan pengalaman digital yang lebih futuristik dan optimal. Kembali lagi nanti ya, sobat!
            </p>
          </div>

          <button 
            onClick={() => window.location.href = '/'}
            style={{
              marginTop: '1rem',
              padding: '14px 32px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '9999px',
              fontSize: '1rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 0 30px rgba(59, 130, 246, 0.5)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.3)';
            }}
          >
            Klik untuk lihat Beranda
          </button>
        </div>
      </div>
    );
  }

  // Otherwise, render normally
  return <>{children}</>;
}
