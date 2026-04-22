import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { cms } from '../../data/cms';
import { useTranslation } from '../../data/translations';
import "./blog.css";
import "../../styles/style.css";

const Blog = () => {
    const { t, language } = useTranslation();
    const [blogPosts, setBlogPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPost, setSelectedPost] = useState(null);

    useEffect(() => {
        const loadBlogPosts = () => {
            try {
                const posts = cms.getBlogPosts();
                setBlogPosts(posts);
            } catch (error) {
                console.error('Error loading blog posts:', error);
            } finally {
                setLoading(false);
            }
        };

        loadBlogPosts();
    }, []);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const renderMarkdown = (content) => {
        // Simple markdown rendering - in a real app, you'd use a proper markdown library
        return content
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
            .replace(/\*(.*)\*/gim, '<em>$1</em>')
            .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
            .replace(/`(.*?)`/gim, '<code>$1</code>')
            .replace(/\n/gim, '<br>');
    };

    if (loading) {
        return (
            <section>
                <div className='about-page-background'>
                    <Container>
                        <Row className='text-background'>
                            <Col md={12}>
                                <h3 className='about-me-text'>{t('blog.loading')}</h3>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </section>
        );
    }

    const getLocalized = (post, field) => {
        // prefer current language, fallback to the other, then legacy single field
        if (language === 'ru') {
            return post[`${field}_ru`] || post[`${field}_en`] || post[field] || '';
        }
        return post[`${field}_en`] || post[`${field}_ru`] || post[field] || '';
    };

    const noPreviewLabel = language === 'ru' ? 'Превью скоро' : 'Preview soon';

    if (selectedPost) {
        return (
            <section>
                <div className='about-page-background'>
                    <Container>
                        <Row className='text-background'>
                                                                    <Col md={12}>
                                            <button
                                                onClick={() => setSelectedPost(null)}
                                                className="blog-back-btn"
                                            >
                                                {t('blog.backToBlog')}
                                            </button>
                                
                                <Card className="blog-post-card">
                                    <Card.Body>
                                        <Card.Title className="blog-post-title">
                                            {getLocalized(selectedPost, 'title')}
                                        </Card.Title>
                                        
                                        <div className="blog-post-meta mb-3">
                                            <small className="text-muted">
                                                By {selectedPost.author} • {formatDate(selectedPost.publishedAt)}
                                            </small>
                                            
                                        </div>

                                        {selectedPost.tags && selectedPost.tags.length > 0 && (
                                            <div className="blog-post-tags mb-3">
                                                {selectedPost.tags.map((tag, index) => (
                                                    <Badge key={index} bg="secondary" className="me-1">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}

                                        <div 
                                            className="blog-post-content"
                                            dangerouslySetInnerHTML={{ 
                                                __html: renderMarkdown(getLocalized(selectedPost, 'content')) 
                                            }}
                                        />
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </section>
        );
    }

    return (
        <section>
            <div className='about-page-background'>
                <Container>
                    <Row className='text-background'>
                                                            <Col md={12}>
                                        <h3 className='about-me-text'>{t('blog.title')}</h3>
                                        <p className="blog-subtitle">{t('blog.subtitle')}</p>
                            
                            {blogPosts.length > 0 ? (
                                <Row className="blog-grid">
                                    {blogPosts.map((post) => (
                                        <Col md={6} lg={4} key={post.id}>
                                            <Card 
                                                className="blog-card h-100"
                                                onClick={() => setSelectedPost(post)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <div className="project-card-preview">
                                                    {post.image ? (
                                                        <img
                                                            src={post.image}
                                                            alt={getLocalized(post, 'title')}
                                                            className="project-card-preview-image"
                                                        />
                                                    ) : (
                                                        <div className="project-card-preview-placeholder">
                                                            <span>{noPreviewLabel}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <Card.Body className="blog-card-content">
                                                    <Card.Title className="blog-card-title">
                                                        {getLocalized(post, 'title')}
                                                    </Card.Title>
                                                    
                                                    <Card.Text className="blog-card-excerpt">
                                                        {getLocalized(post, 'excerpt')}
                                                    </Card.Text>
                                                    
                                                    <div className="blog-card-meta">
                                                        <small className="text-muted">
                                                            {formatDate(post.publishedAt)}
                                                        </small>
                                                        
                                                    </div>

                                                    {post.tags && post.tags.length > 0 && (
                                                        <div className="blog-card-tags mt-2">
                                                            {post.tags.slice(0, 3).map((tag, index) => (
                                                                <Badge key={index} bg="light" text="dark" className="me-1">
                                                                    {tag}
                                                                </Badge>
                                                            ))}
                                                            {post.tags.length > 3 && (
                                                                <Badge bg="light" text="dark">
                                                                    +{post.tags.length - 3}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    )}
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            ) : (
                                <div className="text-center">
                                    <h4>{t('blog.noPosts')}</h4>
                                    <p>Check back soon for new content!</p>
                                </div>
                            )}
                        </Col>
                    </Row>
                </Container>
            </div>
        </section>
    );
};

export default Blog;
