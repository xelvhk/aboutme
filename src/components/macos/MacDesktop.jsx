import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "../../data/translations";

const apps = [
  { labelKey: "nav.projects", to: "/projects", emoji: "🧩" },
  { labelKey: "nav.aiStudio", to: "/ai-studio", emoji: "🎬" },
  { labelKey: "nav.blog", to: "/blog", emoji: "📝" },
];

const quickApps = [
  { label: "GitHub", href: "https://github.com/xelvhk", emoji: "🐙" },
  { label: "Telegram", href: "https://t.me/hex_lex", emoji: "✈️" },
  { label: "Email", href: "mailto:khlex93@gmail.com", emoji: "✉️" },
];

const NOTE_STORAGE_KEY = "xelvhk.quickNotes.v1";
const STICKER_THEME_STORAGE_KEY = "xelvhk.stickerTheme.v1";

const notesRu = [
  { id: "building", title: "Сейчас делаю", text: "Vasya AI + macOS портфолио", sticker: "🤖" },
  { id: "focus", title: "Фокус недели", text: "Мобильный UX и кейсы проектов", sticker: "🎯" },
  { id: "backlog", title: "Идеи", text: "AI Studio, автопостинг, мини-демо", sticker: "💡" },
];

const notesEn = [
  { id: "building", title: "Now building", text: "Vasya AI + macOS portfolio", sticker: "🤖" },
  { id: "focus", title: "Focus this week", text: "Mobile UX and project cases", sticker: "🎯" },
  { id: "backlog", title: "Idea backlog", text: "AI Studio, auto-posting, mini demos", sticker: "💡" },
];

const defaultPositions = {
  building: { x: 18, y: 16 },
  focus: { x: 236, y: 34 },
  backlog: { x: 106, y: 164 },
};

const stickerThemes = [
  { id: "classic", label: "Classic" },
  { id: "tech", label: "Tech" },
  { id: "astra", label: "Astra" },
];

const themeStickers = {
  classic: { building: "🤖", focus: "🎯", backlog: "💡" },
  tech: { building: "🧠", focus: "⚙️", backlog: "📡" },
  astra: { building: "⭐", focus: "⭐", backlog: "⭐" },
};

const MacDesktop = () => {
  const { t, language, switchLanguage } = useTranslation();
  const experience = t("about.experienceItems");
  const skills = t("about.skillsList");
  const [now, setNow] = useState(() => new Date());
  const [astraMode, setAstraMode] = useState(false);
  const [astraToastVisible, setAstraToastVisible] = useState(false);
  const [brandClicks, setBrandClicks] = useState(0);
  const [notePositions, setNotePositions] = useState(defaultPositions);
  const [draggedNoteId, setDraggedNoteId] = useState(null);
  const [stickerTheme, setStickerTheme] = useState("classic");
  const noteBoardRef = useRef(null);
  const dragOffsetRef = useRef({ dx: 0, dy: 0 });
  const notes = useMemo(() => (language === "ru" ? notesRu : notesEn), [language]);
  const stickersByTheme = themeStickers[stickerTheme] || themeStickers.classic;

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (brandClicks === 0) return undefined;
    const resetTimer = setTimeout(() => setBrandClicks(0), 2200);
    return () => clearTimeout(resetTimer);
  }, [brandClicks]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(NOTE_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        setNotePositions((prev) => ({ ...prev, ...parsed }));
      }
    } catch (error) {
      console.warn("Quick notes state read failed", error);
    }
  }, []);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(STICKER_THEME_STORAGE_KEY);
      if (savedTheme && stickerThemes.some((x) => x.id === savedTheme)) {
        setStickerTheme(savedTheme);
      }
    } catch (error) {
      console.warn("Sticker theme read failed", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(NOTE_STORAGE_KEY, JSON.stringify(notePositions));
    } catch (error) {
      console.warn("Quick notes state write failed", error);
    }
  }, [notePositions]);

  useEffect(() => {
    try {
      localStorage.setItem(STICKER_THEME_STORAGE_KEY, stickerTheme);
    } catch (error) {
      console.warn("Sticker theme write failed", error);
    }
  }, [stickerTheme]);

  const locale = language === "ru" ? "ru-RU" : "en-US";
  const dateLabel = now.toLocaleString(locale, {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
  const compactDateLabel = now.toLocaleString(locale, {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
  const astraToastText = language === "ru" ? "Astra Linux mode enabled" : "Astra Linux mode enabled";

  const handleBrandClick = () => {
    const next = brandClicks + 1;
    setBrandClicks(next);
    if (next >= 5) {
      setAstraMode((prev) => !prev);
      setAstraToastVisible(true);
      setBrandClicks(0);
      setTimeout(() => setAstraToastVisible(false), 1800);
    }
  };

  const canDragNotes = () => window.matchMedia("(min-width: 901px)").matches;

  const clampPosition = (x, y) => {
    const board = noteBoardRef.current;
    if (!board) return { x, y };
    const pad = 8;
    const maxX = Math.max(pad, board.clientWidth - 196);
    const maxY = Math.max(pad, board.clientHeight - 124);
    return {
      x: Math.min(maxX, Math.max(pad, x)),
      y: Math.min(maxY, Math.max(pad, y)),
    };
  };

  const onPointerMove = useCallback((event) => {
    if (!draggedNoteId || !noteBoardRef.current) return;
    const rect = noteBoardRef.current.getBoundingClientRect();
    const nextX = event.clientX - rect.left - dragOffsetRef.current.dx;
    const nextY = event.clientY - rect.top - dragOffsetRef.current.dy;
    const clamped = clampPosition(nextX, nextY);
    setNotePositions((prev) => ({ ...prev, [draggedNoteId]: clamped }));
  }, [draggedNoteId]);

  const stopDragging = useCallback(() => setDraggedNoteId(null), []);

  useEffect(() => {
    if (!draggedNoteId) return undefined;
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", stopDragging);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", stopDragging);
    };
  }, [draggedNoteId, onPointerMove, stopDragging]);

  return (
    <div className={`mac-shell ${astraMode ? "astra-mode" : ""}`}>
      <div className="mac-topbar">
        <button type="button" className="mac-topbar-left mac-brand-btn" onClick={handleBrandClick}>xelvhk OS</button>
        <div className="mac-topbar-center">
          <span>{language === "ru" ? "Рабочий стол" : "Desktop"}</span>
          <span className="mac-topbar-mobile-date">{compactDateLabel}</span>
        </div>
        <div className="mac-topbar-right">
          <select
            className="mac-sticker-theme"
            value={stickerTheme}
            onChange={(e) => setStickerTheme(e.target.value)}
            aria-label={language === "ru" ? "Тема стикеров" : "Sticker theme"}
          >
            {stickerThemes.map((theme) => (
              <option key={theme.id} value={theme.id}>
                {theme.label}
              </option>
            ))}
          </select>
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
          <span className="mac-date-label mac-date-label-full">{dateLabel}</span>
          <span className="mac-date-label mac-date-label-compact">{compactDateLabel}</span>
        </div>
      </div>
      {astraToastVisible && (
        <div className="mac-astra-toast" role="status" aria-live="polite">
          {astraToastText}
        </div>
      )}

      <main className="mac-desktop">
        <section className="mac-desktop-layout">
          <section className="mac-left-column">
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

              {quickApps.map((app, idx) => (
                <a
                  key={app.href}
                  href={app.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mac-app-icon mac-app-icon-external"
                  style={{ "--app-index": apps.length + idx }}
                >
                  <span className="mac-app-emoji" aria-hidden="true">{app.emoji}</span>
                  <span className="mac-app-label">{app.label}</span>
                </a>
              ))}
            </section>

            <section className="mac-note-board-wrap" aria-label="Quick notes">
              <h3 className="mac-note-board-title">{language === "ru" ? "Быстрые заметки" : "Quick Notes"}</h3>
              <div className="mac-note-board" ref={noteBoardRef}>
                {notes.map((note) => {
                  const pos = notePositions[note.id] || defaultPositions[note.id] || { x: 14, y: 14 };
                  const isDragging = draggedNoteId === note.id;
                  return (
                    <article
                      key={note.id}
                      className={`mac-note mac-note-${stickerTheme} ${isDragging ? "is-dragging" : ""}`}
                      style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
                      onPointerDown={(event) => {
                        if (!canDragNotes()) return;
                        const rect = event.currentTarget.getBoundingClientRect();
                        dragOffsetRef.current = {
                          dx: event.clientX - rect.left,
                          dy: event.clientY - rect.top,
                        };
                        setDraggedNoteId(note.id);
                        event.currentTarget.setPointerCapture(event.pointerId);
                      }}
                    >
                      <span className="mac-note-sticker" aria-hidden="true">{stickersByTheme[note.id] || note.sticker}</span>
                      <strong>{note.title}</strong>
                      <p>{note.text}</p>
                    </article>
                  );
                })}
              </div>
            </section>
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
                {Array.isArray(skills) ? skills.join(" · ") : ""}
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
