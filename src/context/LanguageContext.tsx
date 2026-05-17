"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "ID" | "EN";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  ID: {
    // Navbar
    beranda: "Beranda",
    profil: "Profil",
    sejarah: "Al-Azhar Purwakarta",
    sistem: "Sistem Pendidikan",
    pendiri: "Pendiri Lembaga",
    tv: "Azhar Tv",
    sekolah: "Sekolah",
    fasilitas: "Fasilitas",
    learn: "Az-Learn",
    daftar: "Pendaftaran",
    info: "Informasi",
    informasi_pendaftaran: "Informasi Pendaftaran",
    jalur_beasiswa: "Jalur Beasiswa",
    beasiswa: "Beasiswa",
    login: "Masuk",
    portalSantri: "Portal Santri",
    portalGuru: "Portal Guru",
    lms: "LMS Al-Azhar",
    // Hero
    heroTitle1: "Mencetak Generasi Qur'ani dan Berwawasan Global",
    heroDesc1: "Pondok Pesantren Al-Azhar Purwakarta menggabungkan nilai-nilai tradisional dengan kurikulum modern untuk masa depan yang gemilang.",
    heroTitle2: "Pendidikan Berbasis Adab dan Ilmu Pengetahuan",
    heroDesc2: "Membentuk karakter santri yang cerdas secara intelektual dan memiliki akhlakul karimah.",
    heroTitle3: "Fasilitas Lengkap untuk Menunjang Kreativitas",
    heroDesc3: "Dukungan infrastruktur modern dan lingkungan asri demi kenyamanan belajar santri.",
    ctaDaftar: "DAFTAR SEKARANG",
    ctaJelajahi: "JELAJAHI AL-AZHAR"
  },
  EN: {
    // Navbar
    beranda: "Home",
    profil: "Profile",
    sejarah: "Al-Azhar Purwakarta",
    sistem: "Education System",
    pendiri: "Institution Founder",
    tv: "Azhar TV",
    sekolah: "Schools",
    fasilitas: "Facilities",
    learn: "Az-Learn",
    daftar: "Registration",
    info: "Information",
    informasi_pendaftaran: "Registration Info",
    jalur_beasiswa: "Scholarship Pathway",
    beasiswa: "Scholarship",
    login: "Login",
    portalSantri: "Student Portal",
    portalGuru: "Teacher Portal",
    lms: "Al-Azhar LMS",
    // Hero
    heroTitle1: "Developing Quranic Generation with Global Insight",
    heroDesc1: "Al-Azhar Purwakarta Islamic Boarding School combines traditional values with a modern curriculum for a bright future.",
    heroTitle2: "Education Based on Character and Knowledge",
    heroDesc2: "Shaping students who are intellectually smart and have noble characters.",
    heroTitle3: "Complete Facilities to Support Creativity",
    heroDesc3: "Support of modern infrastructure and a lush environment for student learning comfort.",
    ctaDaftar: "REGISTER NOW",
    ctaJelajahi: "EXPLORE AL-AZHAR"
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("ID");

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
