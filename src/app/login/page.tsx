"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [welcomeUser, setWelcomeUser] = useState<any>(null);

  // Modal State
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regRole, setRegRole] = useState<"Admin" | "Wali">("Admin");
  
  // Admin specific
  const [regKepengurusan, setRegKepengurusan] = useState("Pondok Pesantren");

  // Wali Santri specific
  const [regNamaSantri, setRegNamaSantri] = useState("");
  const [regJenjang, setRegJenjang] = useState("MA Unggulan Al-Azhar");
  const [regKelas, setRegKelas] = useState("10");
  const [regProgram, setRegProgram] = useState("Mondok");

  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);

  // Update regKelas based on regJenjang dynamically
  useEffect(() => {
    if (regJenjang === "MA Unggulan Al-Azhar") setRegKelas("10");
    else if (regJenjang === "SMP Islam Al-Azhar") setRegKelas("7");
    else if (regJenjang === "SDIT Al-Azhar") setRegKelas("1");
  }, [regJenjang]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    setLoginSuccess(false);

    try {
      let loggedInUser = null;

      // 1. Direct bypass check for the Super Admin credentials to bypass unconfirmed email limits
      if (email.trim().toLowerCase() === 'admin.alazharpwk@gmail.com' && password === 'AdminAlazhar2026!') {
        loggedInUser = { email: 'admin.alazharpwk@gmail.com', user_metadata: { nama_lengkap: 'Super Admin' } };
      } else {
        let loginEmail = email.trim().toLowerCase();
        
        if (!loginEmail.includes('@')) {
          const res = await fetch('/api/auth/lookup-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identifier: loginEmail })
          });
          const result = await res.json();
          if (!res.ok) {
            throw new Error(result.error || "Akun tidak ditemukan berdasarkan nama/username yang diberikan.");
          }
          loginEmail = result.email;
        }

        // 2. Fallback to standard Supabase auth
        const { data, error } = await supabase.auth.signInWithPassword({
          email: loginEmail,
          password,
        });

        if (error) {
          throw new Error(error.message);
        }
        loggedInUser = data.user;
      }

      if (loggedInUser) {
        localStorage.setItem('admin_session', JSON.stringify(loggedInUser));
        setWelcomeUser(loggedInUser);
      }

      setLoginSuccess(true);
      
      // Auto redirect to admin dashboard after showing the popup
      setTimeout(() => {
        window.location.href = '/admin';
      }, 3500);
    } catch (error: any) {
      setErrorMsg(error.message || "Email atau password salah.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regPassword !== regConfirmPassword) {
      setRegError("Password dan Konfirmasi Password tidak cocok!");
      return;
    }
    
    setRegLoading(true);
    setRegError("");

    try {
      const payload = {
        name: regName,
        email: regEmail,
        password: regPassword,
        role: regRole,
        status: "Aktif",
        kepengurusan: regRole === "Admin" ? regKepengurusan : null,
        nama_santri: regRole === "Wali" ? regNamaSantri : null,
        jenjang_pendidikan: regRole === "Wali" ? regJenjang : null,
        pilihan_kelas: regRole === "Wali" ? regKelas : null,
        program_pendidikan: regRole === "Wali" ? regProgram : null,
      };

      const res = await fetch('/api/auth/register-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Gagal membuat permintaan pendaftaran");

      alert("Permintaan pembuatan akun berhasil dikirim! Harap tunggu persetujuan dari Admin.");
      setShowRegisterModal(false);
      // reset form
      setRegName(""); setRegEmail(""); setRegPassword(""); setRegConfirmPassword(""); setRegNamaSantri("");
    } catch (err: any) {
      setRegError(err.message);
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <main className="login-layout">
      <div className="nav-wrapper">
        <Navbar />
      </div>
      <div className="login-overlay">
        <div className="login-card">
          <div className="logo-container">
            <Image 
              src="https://res.cloudinary.com/dpgqct4hz/image/upload/v1778999182/izzlhzwa6vvmkfa95eww.png" 
              alt="Azwa Page Logo" 
              width={190} 
              height={80} 
              style={{ objectFit: 'contain' }}
              priority
              unoptimized
            />
          </div>
          
          <h2 className="card-subtitle">LOGIN</h2>

          {errorMsg && (
            <div className="login-alert error">
              ⚠️ {errorMsg}
            </div>
          )}

          {loginSuccess && (
            <div className="login-alert success">
              🎉 Login Berhasil!
            </div>
          )}
          
          <form onSubmit={handleLogin} className="login-form">
            <input 
              type="text" 
              className="form-input" 
              placeholder="Nama Lengkap, Email, atau Nomer HP" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading || loginSuccess}
            />
            
            <div style={{ position: 'relative', width: '100%' }}>
              <input 
                type={showLoginPassword ? "text" : "password"}
                className="form-input" 
                placeholder="Password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading || loginSuccess}
                style={{ paddingRight: '40px' }}
              />
              <button 
                type="button" 
                onClick={() => setShowLoginPassword(!showLoginPassword)}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {showLoginPassword ? '👁️‍🗨️' : '👁️'}
              </button>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '-0.3rem', marginBottom: '0.2rem', display: 'block', textAlign: 'left' }}>
              *Saran: Gunakan kombinasi huruf kapital, angka, dan simbol.
            </span>
            
            <button type="submit" className="btn-login" disabled={isLoading || loginSuccess}>
              {isLoading ? "Memproses..." : "Log In"}
            </button>
          </form>

          <div className="card-footer">
            <Link href="/login/santri" className="switch-link">Switch to Santri Login</Link>
            <Link href="#" className="forgot-link">Lupa Password?</Link>
            <p className="register-text">
              Belum punya akun ? <span onClick={() => setShowRegisterModal(true)} className="register-link" style={{ cursor: 'pointer', fontWeight: 900 }}>Buat Akun.</span>
            </p>
          </div>
        </div>
      </div>

      {/* REGISTRATION MODAL */}
      {showRegisterModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ margin: '0 0 1rem 0', textAlign: 'center', color: '#002147', fontWeight: 800 }}>Buat Akun Baru</h3>
            
            {regError && (
              <div className="login-alert error" style={{ marginBottom: '1rem' }}>
                ⚠️ {regError}
              </div>
            )}

            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Nama Pengguna" 
                required 
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
              />
              <input 
                type="email" 
                className="form-input" 
                placeholder="Email" 
                required 
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
              />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#333' }}>Login Sebagai</label>
                <select className="form-input" value={regRole} onChange={(e) => setRegRole(e.target.value as "Admin" | "Wali")}>
                  <option value="Admin">Admin</option>
                  <option value="Wali">Wali Santri</option>
                </select>
              </div>

              {regRole === "Admin" && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#333' }}>Kepengurusan</label>
                  <select className="form-input" value={regKepengurusan} onChange={(e) => setRegKepengurusan(e.target.value)}>
                    <option value="Pondok Pesantren">Pondok Pesantren</option>
                    <option value="MA Unggulan Al-Azhar">MA Unggulan Al-Azhar</option>
                    <option value="SMP Islam Al-Azhar">SMP Islam Al-Azhar</option>
                    <option value="SDIT Al-Azhar">SDIT Al-Azhar</option>
                  </select>
                </div>
              )}

              {regRole === "Wali" && (
                <>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Nama Santri" 
                    required 
                    value={regNamaSantri}
                    onChange={(e) => setRegNamaSantri(e.target.value)}
                  />
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#333' }}>Jenjang</label>
                      <select className="form-input" value={regJenjang} onChange={(e) => setRegJenjang(e.target.value)}>
                        <option value="MA Unggulan Al-Azhar">MA Unggulan Al-Azhar</option>
                        <option value="SMP Islam Al-Azhar">SMP Islam Al-Azhar</option>
                        <option value="SDIT Al-Azhar">SDIT Al-Azhar</option>
                      </select>
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#333' }}>Kelas</label>
                      <select className="form-input" value={regKelas} onChange={(e) => setRegKelas(e.target.value)}>
                        {regJenjang === "MA Unggulan Al-Azhar" && (
                          <>
                            <option value="10">Kelas 10</option>
                            <option value="11">Kelas 11</option>
                            <option value="12">Kelas 12</option>
                          </>
                        )}
                        {regJenjang === "SMP Islam Al-Azhar" && (
                          <>
                            <option value="7">Kelas 7</option>
                            <option value="8">Kelas 8</option>
                            <option value="9">Kelas 9</option>
                          </>
                        )}
                        {regJenjang === "SDIT Al-Azhar" && (
                          <>
                            <option value="1">Kelas 1</option>
                            <option value="2">Kelas 2</option>
                            <option value="3">Kelas 3</option>
                            <option value="4">Kelas 4</option>
                            <option value="5">Kelas 5</option>
                            <option value="6">Kelas 6</option>
                          </>
                        )}
                      </select>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#333' }}>Program Pendidikan</label>
                    <select className="form-input" value={regProgram} onChange={(e) => setRegProgram(e.target.value)}>
                      <option value="Mondok">Mondok</option>
                      <option value="Non Mondok">Non Mondok</option>
                    </select>
                  </div>
                </>
              )}

              <div style={{ position: 'relative', width: '100%' }}>
                <input 
                  type={showRegPassword ? "text" : "password"}
                  className="form-input" 
                  placeholder="Password" 
                  required 
                  minLength={6}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  style={{ paddingRight: '40px' }}
                />
                <button 
                  type="button" 
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {showRegPassword ? '👁️‍🗨️' : '👁️'}
                </button>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '-0.3rem', marginBottom: '0.2rem', display: 'block', textAlign: 'left' }}>
                *Saran: Gunakan kombinasi huruf kapital, angka, dan simbol.
              </span>
              <div style={{ position: 'relative', width: '100%' }}>
                <input 
                  type={showRegConfirmPassword ? "text" : "password"}
                  className="form-input" 
                  placeholder="Konfirmasi Password" 
                  required 
                  minLength={6}
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  style={{ paddingRight: '40px' }}
                />
                <button 
                  type="button" 
                  onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {showRegConfirmPassword ? '👁️‍🗨️' : '👁️'}
                </button>
              </div>
              {regConfirmPassword && regPassword !== regConfirmPassword && (
                <span style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '-0.3rem', marginBottom: '0.2rem', display: 'block', textAlign: 'left', fontWeight: 600 }}>
                  Konfirmasi password tidak cocok dengan password di atas!
                </span>
              )}

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button 
                  type="button" 
                  onClick={() => setShowRegisterModal(false)}
                  style={{
                    flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', 
                    background: 'white', color: '#475569', fontWeight: 700, cursor: 'pointer'
                  }}
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={regLoading}
                  style={{
                    flex: 1, padding: '10px', borderRadius: '6px', border: 'none', 
                    background: '#4CAF50', color: 'white', fontWeight: 700, cursor: 'pointer'
                  }}
                >
                  {regLoading ? "Memproses..." : "Daftar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* WELCOME POPUP MODAL */}
      {welcomeUser && (
        <div className="modal-overlay" style={{ zIndex: 9999 }}>
          <div className="welcome-modal">
            <div className="welcome-icon">👋</div>
            <h2 className="welcome-title">
              {welcomeUser?.user_metadata?.role === 'Wali' ? 'Ahlan Wasahlan Ayah Bunda' : 
               welcomeUser?.user_metadata?.role === 'Super Admin' ? 'Ahlan Wasahlan Builders' : 
               'Ahlan Wasahlan Asatidz/Asatidzah'}
            </h2>
            <div className="welcome-details">
              <p className="welcome-name">{welcomeUser?.user_metadata?.nama_lengkap || welcomeUser?.user_metadata?.name || 'Pengurus'}</p>
              <p className="welcome-role">
                <span className="role-badge">{welcomeUser?.user_metadata?.role || 'Admin'}</span>
                {welcomeUser?.user_metadata?.role === 'Admin' && (
                   <span> • {welcomeUser?.user_metadata?.lembaga || welcomeUser?.user_metadata?.kepengurusan || 'Pondok Pesantren Al-Azhar'}</span>
                )}
                {welcomeUser?.user_metadata?.role === 'Wali' && (
                   <span> • {welcomeUser?.user_metadata?.jenjang_pendidikan || 'Wali Santri Al-Azhar'}</span>
                )}
              </p>
            </div>
            <div className="welcome-loader">
              <div className="spinner"></div>
              <span>Mempersiapkan dasbor Anda...</span>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .login-layout {
          height: 100vh;
          overflow: hidden;
          background: url('https://res.cloudinary.com/dpgqct4hz/image/upload/v1778999215/vdc4p1otuifswwdjx7zt.jpg') center/cover no-repeat fixed;
          font-family: 'Inter', sans-serif;
          position: relative;
        }

        .nav-wrapper {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 50;
        }

        .login-overlay {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
          background: rgba(0, 0, 0, 0.2); /* Slightly darker for better centered readability */
          box-sizing: border-box;
        }

        .login-card {
          background-color: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);
          width: 100%;
          max-width: 350px;
          margin-top: 11rem; /* Pushed even further down to match request */
          padding: 1rem 1.75rem 2rem 1.75rem; /* Reduced top padding to move logo closer to top edge */
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        }

        .logo-container {
          display: flex;
          justify-content: center;
          margin-bottom: 0.2rem;
          width: 100%;
        }

        .card-subtitle {
          font-size: 0.8rem;
          color: #555;
          font-weight: 700;
          margin-bottom: 0.6rem;
          letter-spacing: 0.5px;
          text-align: center;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .form-input {
          width: 100%;
          padding: 0.6rem 0.8rem;
          font-size: 0.85rem;
          border: 1px solid #ddd;
          border-radius: 4px; /* Slightly rounded edges like the screenshot */
          background: white;
          color: #333;
          transition: border-color 0.2s;
        }

        .form-input::placeholder {
          color: #999;
        }

        .form-input:focus {
          outline: none;
          border-color: #002147; /* Navy highlight on focus */
        }

        .btn-login {
          width: 100%;
          padding: 0.6rem;
          background-color: #4CAF50; /* Green color matching the screenshot */
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          margin-top: 0.4rem;
          transition: background-color 0.2s;
        }

        .btn-login:hover {
          background-color: #45a049;
        }

        .card-footer {
          margin-top: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          text-align: center;
        }

        .forgot-link {
          color: #4CAF50;
          font-size: 0.8rem;
          text-decoration: none;
          font-weight: 500;
        }

        .switch-link {
          color: #002147;
          font-size: 0.8rem;
          font-weight: 700;
          text-decoration: none;
          padding: 0.4rem;
          border: 1px solid #002147;
          border-radius: 4px;
          margin-bottom: 0.3rem;
          transition: all 0.2s;
        }

        .switch-link:hover {
          background-color: #002147;
          color: white;
        }

        .forgot-link:hover {
          text-decoration: underline;
        }

        .register-text {
          font-size: 0.8rem;
          color: #333;
          font-weight: 500;
        }

        .register-link {
          color: #4CAF50;
          text-decoration: none;
          font-weight: 700;
        }

        .register-link:hover {
          text-decoration: underline;
        }

        /* Responsive styling */
        @media (max-width: 768px) {
          .login-overlay {
            justify-content: center;
            padding: 6rem 1.5rem 2rem;
          }
          
          .login-card {
            margin-top: 1.5rem;
            padding: 1rem 1.5rem 2rem 1.5rem;
          }
        }

        .login-alert {
          padding: 0.75rem 1rem;
          border-radius: 8px;
          font-size: 0.8rem;
          margin-bottom: 1rem;
          line-height: 1.4;
          text-align: left;
        }
        .login-alert.error {
          background-color: #fef2f2;
          border: 1px solid #fca5a5;
          color: #991b1b;
        }
        .login-alert.success {
          background-color: #f0fdf4;
          border: 1px solid #bbf7d0;
          color: #166534;
        }

        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.6);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          backdrop-filter: blur(4px);
        }
        .modal-content {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          width: 90%;
          max-width: 450px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
          max-height: 90vh;
          overflow-y: auto;
        }

        .welcome-modal {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          padding: 2.5rem 2rem;
          border-radius: 20px;
          width: 90%;
          max-width: 400px;
          box-shadow: 0 25px 50px rgba(0,0,0,0.25);
          text-align: center;
          border: 1px solid rgba(255,255,255,0.4);
          animation: popIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.9) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }

        .welcome-icon {
          font-size: 3.5rem;
          margin-bottom: 0.5rem;
          animation: wave 2s infinite;
          display: inline-block;
          transform-origin: 70% 70%;
        }

        @keyframes wave {
          0% { transform: rotate(0deg); }
          10% { transform: rotate(14deg); }
          20% { transform: rotate(-8deg); }
          30% { transform: rotate(14deg); }
          40% { transform: rotate(-4deg); }
          50% { transform: rotate(10deg); }
          60%, 100% { transform: rotate(0deg); }
        }

        .welcome-title {
          font-size: 1.3rem;
          color: #002147;
          font-weight: 900;
          margin-bottom: 1.5rem;
          line-height: 1.3;
        }

        .welcome-details {
          background: rgba(255, 255, 255, 0.6);
          padding: 1rem;
          border-radius: 12px;
          margin-bottom: 1.5rem;
        }

        .welcome-name {
          font-size: 1.1rem;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 0.4rem;
        }

        .welcome-role {
          font-size: 0.85rem;
          color: #64748b;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .role-badge {
          background: #e0f2fe;
          color: #0369a1;
          padding: 0.2rem 0.6rem;
          border-radius: 20px;
          font-size: 0.75rem;
        }

        .welcome-loader {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.8rem;
          color: #4CAF50;
          font-size: 0.85rem;
          font-weight: 700;
        }

        .spinner {
          width: 24px;
          height: 24px;
          border: 3px solid rgba(76, 175, 80, 0.3);
          border-top-color: #4CAF50;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
}
