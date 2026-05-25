import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "../../data/translations";

const apps = [
  { labelKey: "nav.projects", to: "/projects", emoji: "🧩" },
  { labelKey: "nav.aiStudio", to: "/ai-studio", emoji: "🎬" },
  { labelKey: "nav.blog", to: "/blog", emoji: "📝" },
];

const MacDesktop = () => {
  const { t, language, switchLanguage } = useTranslation();
  const experience = t("about.experienceItems");
  const skills = t("about.skillsList");
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
        <div className="mac-topbar-center">{language === "ru" ? "Рабочий стол" : "Desktop"}</div>
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

      <main className="mac-desktop">
        <section className="mac-desktop-layout">
          <section className="mac-desktop-icons">
            {apps.map((app, idx) => (
              <NavLink
                key={app.to}
                to={app.to}
                className="mac-app-icon"
                style={{ "--app-index": idx }}
              >
                <span className="mac-app-emoji" aria-hidden="true">{app.emoji}</span>
                <span className="mac-app-label">{t(app.labelKey)}</span>
              </NavLink>
            ))}
          </section>

          <section className="mac-widgets" aria-label="About widgets">
            <article className="mac-widget">
              <h3 className="mac-widget-title">{t("about.title")}</h3>
              <p className="mac-widget-text">{t("about.description")}</p>
            </article>

            <article className="mac-widget">
              <h3 className="mac-widget-title">{t("about.experience")}</h3>
              <ul className="mac-widget-list">
                {Array.isArray(experience) && experience.slice(0, 3).map((item) => (
                  <li key={`${item.date}-${item.title}`}>
                    <strong>{item.title}</strong>
                    <span>{item.date}</span>
                    <span>{item.place}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="mac-widget">
              <h3 className="mac-widget-title">{t("about.skills")}</h3>
              <p className="mac-widget-tags">
                {Array.isArray(skills) ? skills.slice(0, 7).join(" · ") : ""}
              </p>
            </article>
          </section>
        </section>

        <nav className="mac-dock" aria-label="Dock">
          {apps.map((app, idx) => (
            <NavLink
              key={`dock-${app.to}`}
              to={app.to}
              className="mac-dock-item"
              style={{ "--dock-index": idx }}
            >
              <span className="mac-dock-emoji" aria-hidden="true">{app.emoji}</span>
            </NavLink>
          ))}
        </nav>
      </main>
    </div>
  );
};

export default MacDesktop;
