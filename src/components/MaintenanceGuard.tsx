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
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0f172a',
        fontFamily: 'Inter, sans-serif',
        padding: '2rem',
        textAlign: 'center',
        color: 'white'
      }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 800,
          margin: '0 0 1rem 0'
        }}>
          Website sedang dalam perbaikan
        </h1>
        <p style={{
          fontSize: '1rem',
          color: '#94a3b8',
          margin: 0
        }}>
          kembali lain kali sobat
        </p>
      </div>
    );
  }

  // Otherwise, render normally
  return <>{children}</>;
}
