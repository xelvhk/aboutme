import { useTranslation } from "../data/translations";
import instagramPosts from "../data/aiStudioInstagram.json";

const instagramOrigin = "https://www.instagram.com";
const instagramProfile = `${instagramOrigin}/xelvhk_ai/`;
const instagramPostUrl = /^https:\/\/(?:www\.)?instagram\.com\/(p|reel)\/([a-z\d_-]+)\/?(?:[?#].*)?$/i;

const AiStudio = () => {
  const { t } = useTranslation();
  const posts = [...new Set(instagramPosts.flatMap((url) => {
    const match = instagramPostUrl.exec(url);
    return match ? [`${instagramOrigin}/${match[1].toLowerCase()}/${match[2]}/`] : [];
  }))];

  return (
    <main className="section">
      <div className="container">
        <h1 className="title-1">{t("aiStudio.title")}</h1>
        <p className="blog-subtitle">{t("aiStudio.subtitle")}</p>

        <section className="ai-studio-socials" aria-labelledby="ai-studio-instagram">
          <div className="ai-studio-profile">
            <h2 id="ai-studio-instagram">Instagram</h2>
            {posts.length === 0 && <p>{t("aiStudio.noPosts")}</p>}
            <a href={instagramProfile}>@xelvhk_ai</a>
          </div>

          {posts.length > 0 && (
            <ul className="ai-studio-grid">
              {posts.map((url, index) => (
                <li className="ai-studio-card" key={url}>
                  <iframe
                    className={url.includes("/reel/") ? "ai-studio-reel" : undefined}
                    src={`${url}embed/`}
                    title={`${t("aiStudio.embedTitle")} ${index + 1}`}
                    loading="lazy"
                    allowFullScreen
                  />
                  <a href={url} aria-label={`${t("aiStudio.openPost")} (${index + 1})`}>
                    {t("aiStudio.openPost")}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default AiStudio;
