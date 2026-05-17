"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Sistem Login sedang dalam tahap pengembangan!");
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
          
          <form onSubmit={handleLogin} className="login-form">
            <input 
              type="text" 
              className="form-input" 
              placeholder="Username, E-Mail, atau HP Siswa" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value.toLowerCase())}
            />
            
            <input 
              type="password" 
              className="form-input" 
              placeholder="Password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
            <button type="submit" className="btn-login">
              Log In
            </button>
          </form>

          <div className="card-footer">
            <Link href="/login/santri" className="switch-link">Switch to Santri Login</Link>
            <Link href="#" className="forgot-link">Lupa Password?</Link>
            <p className="register-text">
              Belum punya akun ? <Link href="/pendaftaran" className="register-link">Buat Akun.</Link>
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
      `}</style>
    </main>
  );
}
