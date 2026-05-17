"use client";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SapaKilat from "@/components/SapaKilat";
import AcademicPrograms from "@/components/AcademicPrograms";
import Admission from "@/components/Admission";
import Stats from "@/components/Stats";
import EducationLevels from "@/components/EducationLevels";
import Programs from "@/components/Programs";
import GlobalAlumni from "@/components/GlobalAlumni";
import AlumniDocumentation from "@/components/AlumniDocumentation";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <SapaKilat />
      <AcademicPrograms />
      <Stats />
      <EducationLevels />
      <Admission />
      
      <GlobalAlumni />
      <AlumniDocumentation />
      <Programs />
      <Footer />
    </main>
  );
}
