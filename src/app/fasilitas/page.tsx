import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function FasilitasPage() {
  return (
    <main>
      <Navbar />
      <div style={{ padding: "150px 0", textAlign: "center" }}>
        <div className="container">
          <h1 style={{ fontSize: "3rem", color: "#002147", marginBottom: "1.5rem" }}>Fasilitas</h1>
          <p style={{ fontSize: "1.2rem", maxWidth: "800px", margin: "0 auto", color: "#666" }}>
            Halaman ini sedang dalam pengembangan untuk menyajikan informasi fasilitas modern di Al-Azhar.
          </p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
