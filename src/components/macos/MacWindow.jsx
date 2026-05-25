import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../../data/translations";

const MacWindow = ({ title, children }) => {
  const navigate = useNavigate();
  const { language, switchLanguage } = useTranslation();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const locale = language === "ru" ? "ru-RU" : "en-US";
  const dateLabel = now.toLocaleString(locale, {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="mac-shell">
      <div className="mac-topbar">
        <div className="mac-topbar-left">xelvhk OS</div>
        <div className="mac-topbar-center">{title}</div>
        <div className="mac-topbar-right">
          <button
            type="button"
            className={`mac-lang-btn ${language === "ru" ? "is-active" : ""}`}
            onClick={() => switchLanguage("ru")}
            aria-label="Switch to Russian"
          >
            RU
          </button>
          <button
            type="button"
            className={`mac-lang-btn ${language === "en" ? "is-active" : ""}`}
            onClick={() => switchLanguage("en")}
            aria-label="Switch to English"
          >
            EN
          </button>
          <span>{dateLabel}</span>
        </div>
      </div>

      <main className="mac-window-stage">
        <section className="mac-window mac-window-enter">
          <header className="mac-window-header">
            <div className="mac-traffic-lights">
              <button className="mac-dot mac-dot-red" type="button" onClick={() => navigate("/")} aria-label="Close window" />
              <span className="mac-dot mac-dot-yellow" />
              <span className="mac-dot mac-dot-green" />
            </div>
            <span className="mac-window-title">{title}</span>
          </header>
          <div className="mac-window-content">{children}</div>
        </section>
      </main>
    </div>
  );
};

export default MacWindow;
