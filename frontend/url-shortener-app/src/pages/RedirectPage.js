import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { log } from "../middleware/logger";

const RedirectPage = () => {
  const { shortcode } = useParams();

  useEffect(() => {
    const fetchRedirect = async () => {
      try {
        log("info", "redirect", `Redirecting shortcode: ${shortcode}`);

        // Simulated lookup - replace with actual API call in real app
        const mockDB = {
          abc123: "https://example.com",
          xyz789: "https://openai.com",
        };

        const targetUrl = mockDB[shortcode];

        if (targetUrl) {
          log("info", "click", `Click recorded on: ${shortcode}`);
          setTimeout(() => {
            window.location.href = targetUrl;
          }, 1000);
        } else {
          log("error", "redirect", `Shortcode not found: ${shortcode}`);
          alert("Invalid or expired link.");
        }
      } catch (err) {
        log("error", "redirect", `Redirection error: ${err.message}`);
        alert("Redirection failed.");
      }
    };

    fetchRedirect();
  }, [shortcode]);

  return <div>Redirecting...</div>;
};

export default RedirectPage;
