"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Admission from "@/components/Admission";

export default function PendaftaranPage() {
  return (
    <main>
      <Navbar />
      <div style={{ paddingTop: '80px' }}>
        <Admission />
      </div>
      <Footer />
    </main>
  );
}
