import { useCallback, useEffect, useRef, useState } from "react";

const SECRET_CODE = "daaku";
const KONAMI_SEQUENCE = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a",
];
const EDITABLE_SELECTOR = "input, textarea, select, [contenteditable='true']";

export default function EasterEgg() {
  const [isOpen, setIsOpen] = useState(false);
  const typedKeys = useRef("");
  const konamiKeys = useRef([]);
  const logoClicks = useRef(0);
  const clickResetTimer = useRef(null);
  const openEasterEgg = useCallback(() => setIsOpen(true), []);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
        return;
      }

      if (event.target instanceof HTMLElement && event.target.closest(EDITABLE_SELECTOR)) {
        typedKeys.current = "";
        konamiKeys.current = [];
        return;
      }

      if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
        typedKeys.current = `${typedKeys.current}${event.key.toLowerCase()}`.slice(-SECRET_CODE.length);
        if (typedKeys.current === SECRET_CODE) {
          typedKeys.current = "";
          openEasterEgg();
        }
      }

      konamiKeys.current = [...konamiKeys.current, event.key].slice(-KONAMI_SEQUENCE.length);
      if (KONAMI_SEQUENCE.every((key, index) => key === konamiKeys.current[index])) {
        konamiKeys.current = [];
        openEasterEgg();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openEasterEgg]);

  useEffect(() => {
    const logo = document.querySelector(".brand");
    if (!logo) return undefined;

    function handleLogoClick() {
      logoClicks.current += 1;
      window.clearTimeout(clickResetTimer.current);
      if (logoClicks.current >= 5) {
        logoClicks.current = 0;
        openEasterEgg();
        return;
      }
      clickResetTimer.current = window.setTimeout(() => {
        logoClicks.current = 0;
      }, 1500);
    }

    logo.addEventListener("click", handleLogoClick);
    return () => {
      logo.removeEventListener("click", handleLogoClick);
      window.clearTimeout(clickResetTimer.current);
    };
  }, [openEasterEgg]);

  if (!isOpen) return null;

  return (
    <div className="ee-overlay" onClick={() => setIsOpen(false)}>
      <section
        className="ee-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ee-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button className="ee-close" onClick={() => setIsOpen(false)} aria-label="Close credits">
          ✕
        </button>

        <div className="ee-header">
          <h2 id="ee-title" className="ee-glitch" data-text="Daaku_Maharaaj">
            Daaku_Maharaaj
          </h2>
          <div className="ee-subtitle">You found the studio signature</div>
        </div>

        <div className="ee-card">
          <div className="ee-avatar" aria-hidden="true">👾</div>
          <div className="ee-info">
            <p className="ee-label">PROJECT AUTHOR</p>
            <p className="ee-name">E.Abhijith</p>
            <p className="ee-label ee-handle-label">GAMING HANDLE</p>
            <p className="ee-game-name">Daaku_Maharaaj</p>
          </div>
        </div>

        <div className="ee-badge-row">
          <span className="ee-badge">Saveur</span>
          <span className="ee-badge">React + Vite</span>
          <span className="ee-badge">Restaurant ordering demo</span>
        </div>

        <p className="ee-disclaimer">
          Created by <strong>E.Abhijith</strong> as a restaurant-ordering project.
          Please credit the author when sharing or presenting this work.
        </p>

        <div className="ee-secret-hint">
          Type <code>daaku</code> outside a text field, tap the logo five times,
          or enter the Konami code ↑↑↓↓←→←→BA.
        </div>

        <div className="ee-copyright">
          © 2026 E.Abhijith · Daaku_Maharaaj
        </div>
      </section>
    </div>
  );
}
