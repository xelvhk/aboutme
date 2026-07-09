import React, { useEffect, useMemo, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Badge } from "react-bootstrap";
import DOMPurify from "dompurify";
import { cms } from "../../data/cms";
import { useTranslation } from "../../data/translations";
import "./blog.css";

const Blog = () => {
  const { t, language } = useTranslation();
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [isEditorMinimized, setIsEditorMinimized] = useState(false);
  const [isEditorClosed, setIsEditorClosed] = useState(false);

  useEffect(() => {
    const loadBlogPosts = () => {
      try {
        const posts = cms.getBlogPosts();
        setBlogPosts(posts);
      } catch (error) {
        console.error("Error loading blog posts:", error);
      } finally {
        setLoading(false);
      }
    };
    loadBlogPosts();
  }, []);

  const formatDate = (dateString) => {
    const locale = language === "ru" ? "ru-RU" : "en-US";
    return new Date(dateString).toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  const getLocalized = (post, field) => {
    if (language === "ru") {
      return post[`${field}_ru`] || post[`${field}_en`] || post[field] || "";
    }
    return post[`${field}_en`] || post[`${field}_ru`] || post[field] || "";
  };

  const renderMarkdown = (content) => {
    const html = content
      .replace(/^# (.*$)/gim, "<h1>$1</h1>")
      .replace(/^## (.*$)/gim, "<h2>$1</h2>")
      .replace(/^### (.*$)/gim, "<h3>$1</h3>")
      .replace(/\*\*(.*)\*\*/gim, "<strong>$1</strong>")
      .replace(/\*(.*)\*/gim, "<em>$1</em>")
      .replace(/```([\s\S]*?)```/gim, "<pre><code>$1</code></pre>")
      .replace(/`(.*?)`/gim, "<code>$1</code>")
      .replace(/\n/gim, "<br>");
    return DOMPurify.sanitize(html);
  };

  const posts = useMemo(() => {
    return [...blogPosts].sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0));
  }, [blogPosts]);

  useEffect(() => {
    if (!selectedPostId && posts.length > 0) {
      setSelectedPostId(posts[0].id);
    }
  }, [posts, selectedPostId]);

  const selectedPost = posts.find((post) => post.id === selectedPostId) || null;

  const noPostsText = language === "ru" ? "Посты пока не найдены" : "No posts found yet";
  const explorerTitle = language === "ru" ? "Проводник" : "Explorer";
  const workspaceTitle = language === "ru" ? "Рабочая область" : "Workspace";
  const markdownHint = language === "ru" ? "Markdown Reader" : "Markdown Reader";
  const listLabel = language === "ru" ? "Посты" : "Posts";
  const langBadgeLabel = (post) => {
    const hasCurrent = language === "ru" ? Boolean(post.has_ru) : Boolean(post.has_en);
    if (hasCurrent) return language.toUpperCase();
    if (post.has_ru) return "RU";
    if (post.has_en) return "EN";
    return language.toUpperCase();
  };

  if (loading) {
    return (
      <section>
        <div className="about-page-background">
          <Container>
            <Row className="text-background">
              <Col md={12}>
                <h3 className="about-me-text">{t("blog.loading")}</h3>
              </Col>
            </Row>
          </Container>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="about-page-background">
        <Container>
          <Row className="text-background">
            <Col md={12}>
              <h3 className="about-me-text">{t("blog.title")}</h3>
              <p className="blog-subtitle">{t("blog.subtitle")}</p>

              <div className={`blog-ide ${isEditorClosed ? "editor-closed" : ""}`}>
                <aside className="blog-ide-sidebar" aria-label={explorerTitle}>
                  <div className="blog-ide-sidebar-head">
                    <span>{explorerTitle}</span>
                    <small>{listLabel}</small>
                  </div>

                  <div className="blog-ide-files">
                    {posts.length > 0 ? (
                      posts.map((post) => (
                        <button
                          key={post.id}
                          type="button"
                          onClick={() => {
                            setSelectedPostId(post.id);
                            setIsEditorMinimized(false);
                            setIsEditorClosed(false);
                          }}
                          className={`blog-file-item ${selectedPostId === post.id ? "is-active" : ""}`}
                        >
                          <span className="blog-file-dot" />
                          <div className="blog-file-meta">
                            <strong>{getLocalized(post, "title")}</strong>
                            <small>
                              {formatDate(post.publishedAt)}
                              <span className="blog-lang-badge">{langBadgeLabel(post)}</span>
                            </small>
                          </div>
                        </button>
                      ))
                    ) : (
                      <p className="blog-empty-list">{noPostsText}</p>
                    )}
                  </div>
                </aside>

                {!isEditorClosed && (
                <article className={`blog-ide-editor ${isEditorMinimized ? "is-minimized" : ""}`}>
                  <header className="blog-ide-editor-head">
                    <div className="blog-traffic">
                      <button
                        type="button"
                        className="blog-traffic-btn blog-traffic-btn-close"
                        aria-label={language === "ru" ? "Закрыть пост" : "Close post"}
                        onClick={() => {
                          setIsEditorClosed(true);
                          setIsEditorMinimized(false);
                        }}
                      />
                      <button
                        type="button"
                        className="blog-traffic-btn blog-traffic-btn-minimize"
                        aria-label={language === "ru" ? "Свернуть окно" : "Minimize window"}
                        onClick={() => setIsEditorMinimized(true)}
                      />
                      <button
                        type="button"
                        className="blog-traffic-btn blog-traffic-btn-restore"
                        aria-label={language === "ru" ? "Развернуть окно" : "Restore window"}
                        onClick={() => setIsEditorMinimized(false)}
                      />
                    </div>
                    <div className="blog-tab">
                      {selectedPost ? `${selectedPost.slug || selectedPost.id}.md` : "post.md"}
                    </div>
                    <div className="blog-head-right">{workspaceTitle}</div>
                  </header>

                  <div className="blog-terminal-panel">
                    {selectedPost ? (
                      <>
                        <div className="blog-terminal-meta">
                          <span>$ open {selectedPost.slug || selectedPost.id}.md</span>
                          <span>{markdownHint}</span>
                        </div>
                        <h2 className="blog-terminal-title">{getLocalized(selectedPost, "title")}</h2>
                        <div className="blog-terminal-submeta">
                          <span>
                            {t("blog.byAuthor")} {selectedPost.author}
                          </span>
                          <span>{formatDate(selectedPost.publishedAt)}</span>
                        </div>

                        {selectedPost.tags && selectedPost.tags.length > 0 && (
                          <div className="blog-terminal-tags">
                            {selectedPost.tags.map((tag) => (
                              <Badge key={`${selectedPost.id}-${tag}`} bg="light" text="dark">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <div
                          className="blog-terminal-content"
                          dangerouslySetInnerHTML={{ __html: renderMarkdown(getLocalized(selectedPost, "content")) }}
                        />
                      </>
                    ) : (
                      <p className="blog-empty-list">{noPostsText}</p>
                    )}
                  </div>
                </article>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </section>
  );
};

export default Blog;
