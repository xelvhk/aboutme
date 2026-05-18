import { useTranslation } from "../data/translations";

const AiStudio = () => {
  const { t } = useTranslation();
  const socials = ["YouTube", "Instagram", "TikTok", "Telegram"];

  return (
    <main className="section">
      <div className="container">
        <h1 className="title-1">{t("aiStudio.title")}</h1>
        <p className="blog-subtitle">{t("aiStudio.subtitle")}</p>

        <div className="ai-studio-coming-soon">
          <span className="ai-studio-pill">{t("aiStudio.inProgress")}</span>
        </div>

        <section className="ai-studio-socials">
          <h2 className="title-2">{t("aiStudio.socialBlockTitle")}</h2>
          <div className="ai-studio-grid">
            {socials.map((name) => (
              <article className="ai-studio-card" key={name}>
                <h3 className="ai-studio-card-title">{name}</h3>
                <button className="btn ai-studio-btn" type="button" disabled>
                  {t("aiStudio.buttonSoon")}
                </button>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default AiStudio;
