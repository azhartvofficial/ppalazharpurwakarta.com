"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { getCloudinaryUrl } from "@/utils/cloudinary";

const Preloader = () => {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(true); // Set to true by default to prevent layout/skeleton flash during initial load

  useEffect(() => {
    setLoading(true);
    setActive(true);

    let isMounted = true;
    const startTime = Date.now();
    let safetyTimeoutId: NodeJS.Timeout;
    let initDelayId: NodeJS.Timeout;
    const activeListeners: { img: HTMLImageElement; handler: () => void }[] = [];

    const finishLoading = () => {
      if (!isMounted) return;
      
      const elapsed = Date.now() - startTime;
      const minDisplayTime = 200; // 200ms min display for smooth UI transition
      const delay = Math.max(0, minDisplayTime - elapsed);

      setTimeout(() => {
        if (!isMounted) return;
        setActive(false);
        setTimeout(() => {
          if (isMounted) setLoading(false);
        }, 400); // Fades out in sync with opacity transition (0.4s)
      }, delay);
    };

    const verifyAllAssetsLoaded = () => {
      if (typeof window === 'undefined' || !isMounted) return;

      // 1. Gather all <img> elements on the page
      const imgElements = Array.from(document.querySelectorAll('img'));

      // 2. Gather background image URLs from computed styles (e.g. Hero slides)
      const bgImageUrls: string[] = [];
      const allElements = document.querySelectorAll('*');
      allElements.forEach(el => {
        const bg = window.getComputedStyle(el).backgroundImage;
        if (bg && bg !== 'none' && bg.startsWith('url(')) {
          const match = bg.match(/url\((['"]?)(.*?)\1\)/);
          if (match && match[2] && !match[2].startsWith('data:')) {
            bgImageUrls.push(match[2]);
          }
        }
      });

      const uniqueUrls = Array.from(new Set(bgImageUrls));
      const totalImages = imgElements.length + uniqueUrls.length;

      if (totalImages === 0) {
        finishLoading();
        return;
      }

      let loadedCount = 0;
      const checkCompletion = () => {
        if (loadedCount >= totalImages) {
          finishLoading();
          return true;
        }
        return false;
      };

      // Track normal images
      imgElements.forEach(img => {
        if (img.complete) {
          loadedCount++;
        } else {
          const onImgLoad = () => {
            img.removeEventListener('load', onImgLoad);
            img.removeEventListener('error', onImgLoad);
            loadedCount++;
            checkCompletion();
          };
          img.addEventListener('load', onImgLoad);
          img.addEventListener('error', onImgLoad);
          activeListeners.push({ img, handler: onImgLoad });
        }
      });

      // Track background images
      uniqueUrls.forEach(url => {
        const tempImg = new Image();
        tempImg.src = url;
        if (tempImg.complete) {
          loadedCount++;
        } else {
          tempImg.onload = () => {
            loadedCount++;
            checkCompletion();
          };
          tempImg.onerror = () => {
            loadedCount++;
            checkCompletion();
          };
        }
      });

      checkCompletion();
    };

    // Safety timeout: auto-resolve after max 4 seconds to prevent freezing on broken/slow links
    safetyTimeoutId = setTimeout(() => {
      finishLoading();
    }, 4000);

    // Give DOM 150ms to mount/render the page content, then check and track image states
    initDelayId = setTimeout(() => {
      verifyAllAssetsLoaded();
    }, 150);

    return () => {
      isMounted = false;
      clearTimeout(safetyTimeoutId);
      clearTimeout(initDelayId);
      activeListeners.forEach(({ img, handler }) => {
        img.removeEventListener('load', handler);
        img.removeEventListener('error', handler);
      });
    };
  }, [pathname]);

  if (!loading) return null;

  return (
    <div 
      className={`preloader-overlay ${active ? "active" : ""}`}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "#002147",
        backgroundImage: "url('/kaligrafi-bg.svg')",
        backgroundSize: "400px",
        backgroundRepeat: "repeat",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 99999,
        opacity: active ? 1 : 0,
        visibility: active ? "visible" : "hidden",
        transition: active ? "none" : "opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.4s"
      }}
    >
      <div className="loader-content">
        <div className="logo-wrapper">
          <div className="balls-container">
            <div className="ball-group group-1">
              <div className="ball ball-1"></div>
              <div className="trail trail-1"></div>
              <div className="trail trail-2"></div>
            </div>
            <div className="ball-group group-2">
              <div className="ball ball-2"></div>
              <div className="trail trail-1"></div>
              <div className="trail trail-2"></div>
            </div>
            <div className="ball-group group-3">
              <div className="ball ball-3"></div>
              <div className="trail trail-1"></div>
              <div className="trail trail-2"></div>
            </div>
          </div>
          <img 
            src={getCloudinaryUrl(pathname && pathname.startsWith("/login") ? "https://res.cloudinary.com/dpgqct4hz/image/upload/f_auto,q_auto/v1778999182/izzlhzwa6vvmkfa95eww.png" : "https://res.cloudinary.com/dpgqct4hz/image/upload/f_auto,q_auto/v1778999207/ntxuizh8mm8odxndbvs2.png")} 
            alt="Logo" 
            className="preloader-logo" 
            width={130}
            height={130}
          />
        </div>
      </div>

      <style jsx>{`
        .preloader-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #002147;
          background-image: url('/kaligrafi-bg.svg');
          background-size: 400px;
          background-position: center;
          background-repeat: repeat;
          display: flex;
          justifyContent: center;
          align-items: center;
          z-index: 9999;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.4s;
        }

        .preloader-overlay.active {
          opacity: 1;
          visibility: visible;
          transition: none; /* Instant entrance */
        }

        .logo-wrapper {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 250px;
          height: 250px;
          margin: 0 auto;
        }

        .preloader-logo {
          width: 130px; 
          height: 130px;
          aspect-ratio: 1;
          object-fit: contain;
          position: relative;
          z-index: 10;
          filter: drop-shadow(0 0 10px rgba(0,0,0,0.05));
          transform: scale(1) !important;
          animation: logoFadeIn 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards !important;
        }

        .balls-container {
          position: absolute;
          width: 100%;
          height: 100%;
          animation: rotateAll 3s linear infinite;
        }

        .ball-group {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
        }

        .ball, .trail {
          position: absolute;
          border-radius: 50%;
          background: #ffffff;
        }

        .ball {
          width: 12px;
          height: 12px;
          z-index: 15;
          box-shadow: 0 0 15px #ffffff, 0 0 30px #ffffff;
        }

        .trail {
          z-index: 14;
          filter: blur(2px);
        }

        .trail-1 { width: 10px; height: 10px; opacity: 0.6; }
        .trail-2 { width: 8px; height: 8px; opacity: 0.3; }

        /* Group 1 */
        .group-1 .ball { top: 0; left: 50%; transform: translateX(-50%); animation: orbit1 2s ease-in-out infinite alternate; }
        .group-1 .trail-1 { top: 0; left: 50%; transform: translateX(-50%); animation: orbit1 2s ease-in-out -0.1s infinite alternate; }
        .group-1 .trail-2 { top: 0; left: 50%; transform: translateX(-50%); animation: orbit1 2s ease-in-out -0.2s infinite alternate; }

        /* Group 2 */
        .group-2 .ball { bottom: 10%; left: 10%; animation: orbit2 2.5s ease-in-out infinite alternate; }
        .group-2 .trail-1 { bottom: 10%; left: 10%; animation: orbit2 2.5s ease-in-out -0.1s infinite alternate; }
        .group-2 .trail-2 { bottom: 10%; left: 10%; animation: orbit2 2.5s ease-in-out -0.2s infinite alternate; }

        /* Group 3 */
        .group-3 .ball { bottom: 10%; right: 10%; animation: orbit3 3s ease-in-out infinite alternate; }
        .group-3 .trail-1 { bottom: 10%; right: 10%; animation: orbit3 3s ease-in-out -0.1s infinite alternate; }
        .group-3 .trail-2 { bottom: 10%; right: 10%; animation: orbit3 3s ease-in-out -0.2s infinite alternate; }

        @keyframes rotateAll {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes orbit1 {
          from { transform: translateX(-50%) scale(1); }
          to { transform: translateX(-50%) scale(0.6); }
        }

        @keyframes orbit2 {
          from { transform: scale(1); }
          to { transform: scale(0.5); }
        }

        @keyframes orbit3 {
          from { transform: scale(1.2); }
          to { transform: scale(0.7); }
        }

        .loading-progress {
          width: 0;
          height: 100%;
          background: white;
          animation: load 2s ease-in-out forwards;
        }

        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }

        @keyframes shine {
          to { background-position: 200% center; }
        }

        @keyframes load {
          to { width: 100%; }
        }

        @keyframes logoFadeIn {
          from {
            opacity: 0;
            filter: drop-shadow(0 0 5px rgba(255,255,255,0.0)) blur(4px);
          }
          to {
            opacity: 1;
            filter: drop-shadow(0 0 10px rgba(255,255,255,0.15)) blur(0px);
          }
        }


      `}</style>
    </div>
  );
};

export default Preloader;
