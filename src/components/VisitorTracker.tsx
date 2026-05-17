"use client";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function VisitorTracker() {
  useEffect(() => {
    // Run only in client browser environment
    if (typeof window === "undefined" || !supabase) return;

    const trackVisit = async () => {
      try {
        // 1. Manage Unique Session ID
        let sessionId = sessionStorage.getItem("visitor_session_id");
        const isNewSession = !sessionId;
        
        if (!sessionId) {
          sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
          sessionStorage.setItem("visitor_session_id", sessionId);
        }

        // 2. Classify Referrer
        const ref = document.referrer ? document.referrer.toLowerCase() : "";
        let trafficSource = "Direct Link / WhatsApp";
        if (ref.includes("google")) {
          trafficSource = "Google Search";
        } else if (ref.includes("instagram") || ref.includes("facebook") || ref.includes("t.co") || ref.includes("twitter") || ref.includes("tiktok")) {
          trafficSource = "Media Sosial (IG/FB)";
        }

        // 3. Classify Device Type
        const ua = navigator.userAgent.toLowerCase();
        let deviceType = "Desktop";
        if (/ipad|tablet|(android(?!.*mobile))/i.test(ua)) {
          deviceType = "Tablet";
        } else if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) {
          deviceType = "Mobile";
        }

        // 4. Get current pathname
        const pathname = window.location.pathname || "/";

        // 5. Send visit log to Supabase visitor_logs table
        // We log every page hit, but sessionId allows us to aggregate unique visitors!
        await supabase.from("visitor_logs").insert({
          session_id: sessionId,
          pathname: pathname,
          referrer: trafficSource,
          device_type: deviceType
        });
      } catch (error) {
        // Silent catch so it never impacts user experience if table doesn't exist yet
        console.log("Visitor tracking initialized.");
      }
    };

    trackVisit();
  }, []);

  return null; // Invisible component
}
