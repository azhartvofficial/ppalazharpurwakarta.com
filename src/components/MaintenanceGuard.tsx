"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function MaintenanceGuard({ children }: { children: React.ReactNode }) {
  const [isMaintenance, setIsMaintenance] = useState<boolean | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    // Check if user is Super Admin
    const sessionData = localStorage.getItem('admin_session');
    if (sessionData) {
      try {
        const user = JSON.parse(sessionData);
        if (user?.email === 'admin.alazharpwk@gmail.com') {
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
    return (
      <div style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc',
        fontFamily: 'Inter, sans-serif',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '3rem',
          borderRadius: '16px',
          boxShadow: '0 10px 40px rgba(0, 33, 71, 0.08)',
          maxWidth: '500px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem'
        }}>
          <Image 
            src="https://res.cloudinary.com/dpgqct4hz/image/upload/v1778999207/ntxuizh8mm8odxndbvs2.png" 
            alt="Logo Al-Azhar" 
            width={180} 
            height={90} 
            style={{ objectFit: 'contain' }}
            priority
            unoptimized
          />
          <h1 style={{
            fontSize: '1.5rem',
            color: '#002147',
            fontWeight: 800,
            margin: '0.5rem 0'
          }}>
            MAINTENANCE MODE
          </h1>
          <p style={{
            fontSize: '1rem',
            color: '#475569',
            lineHeight: 1.6,
            fontWeight: 500
          }}>
            Website Sedang Dalam Perbaikan, Kembali lagi nanti yah sobat.
          </p>
          
          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            backgroundColor: '#fff8f1',
            border: '1px solid #ffedd5',
            borderRadius: '8px',
            fontSize: '0.85rem',
            color: '#c2410c',
            fontWeight: 600
          }}>
            Sistem sedang diperbarui untuk pengalaman yang lebih baik.
          </div>
        </div>
      </div>
    );
  }

  // Otherwise, render normally
  return <>{children}</>;
}
