"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";

export default function SantriLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    setLoginSuccess(false);

    try {
      // In Supabase, users register with E-Mail. If they enter their email/NIS in the field,
      // we attempt to log in using that.
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      setLoginSuccess(true);
      alert(`Selamat datang kembali, Santri Al-Azhar! Anda berhasil login.`);
    } catch (error: any) {
      setErrorMsg(error.message || "E-Mail atau password salah.");
    } finally {
      setIsLoading(false);
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
              src="https://res.cloudinary.com/dpgqct4hz/image/upload/v1778999207/ntxuizh8mm8odxndbvs2.png" 
              alt="Santri Login Logo" 
              width={140} 
              height={70} 
              style={{ objectFit: 'contain' }}
              priority
              unoptimized
            />
          </div>
          
          <h2 className="card-subtitle">LOGIN SANTRI</h2>

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
              placeholder="Alamat E-Mail Santri" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading || loginSuccess}
            />
            
            <input 
              type="password" 
              className="form-input" 
              placeholder="Password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading || loginSuccess}
            />
            
            <button type="submit" className="btn-login" disabled={isLoading || loginSuccess}>
              {isLoading ? "Memproses..." : "Log In Santri"}
            </button>
          </form>

          <div className="card-footer">
            <Link href="/login" className="switch-link">Switch to Azwa Login</Link>
            <Link href="#" className="forgot-link">Lupa Password?</Link>
            <p className="register-text">
              Santri Baru? <Link href="/pendaftaran" className="register-link">Daftar Disini.</Link>
            </p>
          </div>
        </div>
      </div>

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
          background: rgba(0, 0, 0, 0.25);
          box-sizing: border-box;
        }

        .login-card {
          background-color: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          width: 100%;
          max-width: 350px;
          margin-top: 11rem; /* Pushed even further down to match request */
          padding: 1.2rem 1.75rem 2rem 1.75rem;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .logo-container {
          display: flex;
          justify-content: center;
          margin-bottom: 0.5rem;
          width: 100%;
        }

        .card-subtitle {
          font-size: 0.85rem;
          color: #002147;
          font-weight: 800;
          margin-bottom: 0.8rem;
          letter-spacing: 1px;
          text-align: center;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .form-input {
          width: 100%;
          padding: 0.65rem 0.8rem;
          font-size: 0.85rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          background: white;
          color: #333;
          transition: all 0.2s;
        }

        .form-input:focus {
          outline: none;
          border-color: #002147;
          box-shadow: 0 0 0 2px rgba(0, 33, 71, 0.1);
        }

        .btn-login {
          width: 100%;
          padding: 0.65rem;
          background-color: #002147;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          margin-top: 0.5rem;
          transition: background-color 0.2s;
        }

        .btn-login:hover {
          background-color: #001a38;
        }

        .card-footer {
          margin-top: 1.2rem;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          text-align: center;
        }

        .switch-link {
          color: #ff8c00;
          font-size: 0.8rem;
          font-weight: 700;
          text-decoration: none;
          padding: 0.4rem;
          border: 1px solid #ff8c00;
          border-radius: 4px;
          margin-bottom: 0.3rem;
          transition: all 0.2s;
        }

        .switch-link:hover {
          background-color: #ff8c00;
          color: white;
        }

        .forgot-link {
          color: #555;
          font-size: 0.8rem;
          text-decoration: none;
        }

        .register-text {
          font-size: 0.8rem;
          color: #333;
        }

        .register-link {
          color: #002147;
          font-weight: 700;
          text-decoration: none;
        }

        @media (max-width: 768px) {
          .login-overlay {
            justify-content: center;
            padding: 6rem 1.5rem 2rem;
          }
          
          .login-card {
            margin-top: 1.5rem;
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
      `}</style>
    </main>
  );
}
