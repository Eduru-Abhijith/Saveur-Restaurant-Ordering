/**
 * Footer — Saveur Restaurant Ordering System
 * Author : E.Abhijith | Daaku_Maharaaj
 * © 2026 All rights reserved.
 */

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-left">
          <span className="footer-brand">🍴 Saveur</span>
          <span className="footer-tagline">Fine Dining Experience</span>
        </div>

        <div className="footer-center">
          <span className="footer-built">
            Crafted with ❤️ by&nbsp;
            <span className="footer-author">E.Abhijith</span>
            <span className="footer-handle"> · Daaku_Maharaaj</span>
          </span>
        </div>

        <div className="footer-right">
          <span className="footer-copy">© 2026 E.Abhijith · Daaku_Maharaaj</span>
        </div>
      </div>

      {/* Hidden watermark — visible in page source as proof of authorship */}
      {/* AUTHOR: E.Abhijith | GAMING: Daaku_Maharaaj | PROJECT: Saveur Restaurant Ordering System */}
    </footer>
  );
}
