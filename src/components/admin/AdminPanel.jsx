import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, Modal, Tab, Tabs } from 'react-bootstrap';
import { cms } from '../../data/cms';
import './AdminPanel.css';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('projects');
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [editingBlogPost, setEditingBlogPost] = useState(null);

  // Project form state
  const [projectForm, setProjectForm] = useState({
    title_en: '',
    title_ru: '',
    description_en: '',
    description_ru: '',
    skills: '',
    img: '',
    imgBig: '',
    gitHubLink: '',
    liveLink: '',
    featured: false
  });

  // Blog form state (bilingual)
  const [blogForm, setBlogForm] = useState({
    title_en: '',
    title_ru: '',
    excerpt_en: '',
    excerpt_ru: '',
    content_en: '',
    content_ru: '',
    author: 'Alex Kh',
    tags: '',
    image: '',
    featured: false
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const projectsData = await cms.getProjects();
    setProjects(projectsData);
    setBlogPosts(cms.getBlogPosts());
  };

  const handleProjectSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...projectForm,
      // legacy fields for compatibility
      title: projectForm.title_en || projectForm.title_ru || '',
      description: projectForm.description_en || projectForm.description_ru || '',
    };
    if (editingProject) {
      cms.updateProject(editingProject.id, payload);
    } else {
      cms.addProject(payload);
    }
    loadData();
    resetProjectForm();
    setShowProjectModal(false);
  };

  const handleBlogSubmit = (e) => {
    e.preventDefault();
    const blogData = {
      ...blogForm,
      // legacy fields for compatibility (used by lists and existing renderers)
      title: blogForm.title_en || blogForm.title_ru || '',
      excerpt: blogForm.excerpt_en || blogForm.excerpt_ru || '',
      content: blogForm.content_en || blogForm.content_ru || '',
      tags: blogForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };
    
    if (editingBlogPost) {
      cms.updateBlogPost(editingBlogPost.id, blogData);
    } else {
      cms.addBlogPost(blogData);
    }
    loadData();
    resetBlogForm();
    setShowBlogModal(false);
  };

  const resetProjectForm = () => {
    setProjectForm({
      title_en: '',
      title_ru: '',
      description_en: '',
      description_ru: '',
      skills: '',
      img: '',
      imgBig: '',
      gitHubLink: '',
      liveLink: '',
      featured: false
    });
    setEditingProject(null);
  };

  const resetBlogForm = () => {
    setBlogForm({
      title_en: '',
      title_ru: '',
      excerpt_en: '',
      excerpt_ru: '',
      content_en: '',
      content_ru: '',
      author: 'Alex Kh',
      tags: '',
      image: '',
      featured: false
    });
    setEditingBlogPost(null);
  };

  const editProject = (project) => {
    setProjectForm({
      ...project,
      title_en: project.title_en || project.title || '',
      title_ru: project.title_ru || '',
      description_en: project.description_en || project.description || '',
      description_ru: project.description_ru || '',
    });
    setEditingProject(project);
    setShowProjectModal(true);
  };

  const editBlogPost = (post) => {
    setBlogForm({
      ...post,
      title_en: post.title_en || post.title || '',
      title_ru: post.title_ru || '',
      excerpt_en: post.excerpt_en || post.excerpt || '',
      excerpt_ru: post.excerpt_ru || '',
      content_en: post.content_en || post.content || '',
      content_ru: post.content_ru || '',
      tags: (post.tags || []).join(', ')
    });
    setEditingBlogPost(post);
    setShowBlogModal(true);
  };

  const handleBlogImageUpload = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result || '';
      setBlogForm((prev) => ({ ...prev, image: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const deleteProject = (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      cms.deleteProject(id);
      loadData();
    }
  };

  const deleteBlogPost = (id) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      cms.deleteBlogPost(id);
      loadData();
    }
  };

  return (
    <div className="admin-panel">
      <Container>
        <Row>
          <Col>
            <h1 className="admin-title">Content Management System</h1>
            <p className="admin-subtitle">Manage your portfolio projects and blog posts</p>
          </Col>
        </Row>
        <Row>
          <Col className="d-flex justify-content-end">
            <Button 
              variant="secondary" 
              onClick={() => navigate('/')}
            >
              Exit Admin
            </Button>
          </Col>
        </Row>

        <Row>
          <Col>
            <Tabs
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)}
              className="admin-tabs"
            >
              <Tab eventKey="projects" title="Projects">
                <div className="admin-section">
                  <div className="admin-header">
                    <h2>Projects ({projects.length})</h2>
                    <Button 
                      variant="primary" 
                      onClick={() => {
                        resetProjectForm();
                        setShowProjectModal(true);
                      }}
                    >
                      Add New Project
                    </Button>
                  </div>
                  
                  <Row>
                    {projects.map((project) => (
                      <Col md={6} lg={4} key={project.id} className="mb-4">
                        <Card className="admin-card">
                          <Card.Img 
                            variant="top" 
                            src={project.img} 
                            style={{ height: '200px', objectFit: 'cover' }}
                          />
                          <Card.Body>
                            <Card.Title>{project.title}</Card.Title>
                            <Card.Text className="text-muted">
                              {project.skills}
                            </Card.Text>
                            <div className="admin-actions">
                              <Button 
                                variant="outline-primary" 
                                size="sm" 
                                onClick={() => editProject(project)}
                              >
                                Edit
                              </Button>
                              <Button 
                                variant="outline-danger" 
                                size="sm" 
                                onClick={() => deleteProject(project.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </div>
              </Tab>

              <Tab eventKey="blog" title="Blog Posts">
                <div className="admin-section">
                  <div className="admin-header">
                    <h2>Blog Posts ({blogPosts.length})</h2>
                    <Button 
                      variant="primary" 
                      onClick={() => {
                        resetBlogForm();
                        setShowBlogModal(true);
                      }}
                    >
                      Add New Post
                    </Button>
                  </div>
                  
                  <Row>
                    {blogPosts.map((post) => (
                      <Col md={6} lg={4} key={post.id} className="mb-4">
                        <Card className="admin-card">
                          <Card.Body>
                            <Card.Title>{post.title}</Card.Title>
                            <Card.Text className="text-muted">
                              {post.excerpt}
                            </Card.Text>
                            <Card.Text className="text-muted small">
                              Published: {new Date(post.publishedAt).toLocaleDateString()}
                            </Card.Text>
                            <div className="admin-actions">
                              <Button 
                                variant="outline-primary" 
                                size="sm" 
                                onClick={() => editBlogPost(post)}
                              >
                                Edit
                              </Button>
                              <Button 
                                variant="outline-danger" 
                                size="sm" 
                                onClick={() => deleteBlogPost(post.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </div>
              </Tab>
            </Tabs>
          </Col>
        </Row>

        {/* Project Modal */}
        <Modal show={showProjectModal} onHide={() => setShowProjectModal(false)} size="lg" scrollable>
          <Modal.Header closeButton>
            <Modal.Title>
              {editingProject ? 'Edit Project' : 'Add New Project'}
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleProjectSubmit}>
            <Modal.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Title (EN)</Form.Label>
                    <Form.Control
                      type="text"
                      value={projectForm.title_en}
                      onChange={(e) => setProjectForm({...projectForm, title_en: e.target.value})}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Title (RU)</Form.Label>
                    <Form.Control
                      type="text"
                      value={projectForm.title_ru}
                      onChange={(e) => setProjectForm({...projectForm, title_ru: e.target.value})}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Description (EN)</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={projectForm.description_en}
                      onChange={(e) => setProjectForm({...projectForm, description_en: e.target.value})}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Description (RU)</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={projectForm.description_ru}
                      onChange={(e) => setProjectForm({...projectForm, description_ru: e.target.value})}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Skills</Form.Label>
                    <Form.Control
                      type="text"
                      value={projectForm.skills}
                      onChange={(e) => setProjectForm({...projectForm, skills: e.target.value})}
                      placeholder="e.g., React, HTML, CSS"
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                />
              </Form.Group>

                             <Row>
                 <Col md={6}>
                   <Form.Group className="mb-3">
                     <Form.Label>Image URL</Form.Label>
                     <Form.Control
                       type="url"
                       value={projectForm.img}
                       onChange={(e) => setProjectForm({...projectForm, img: e.target.value})}
                       placeholder="https://example.com/image.jpg or import from src/img/projects/"
                     />
                     <Form.Text className="text-muted">
                       Use full URL or import from src/img/projects/ directory
                     </Form.Text>
                   </Form.Group>
                 </Col>
                 <Col md={6}>
                   <Form.Group className="mb-3">
                     <Form.Label>Big Image URL</Form.Label>
                     <Form.Control
                       type="url"
                       value={projectForm.imgBig}
                       onChange={(e) => setProjectForm({...projectForm, imgBig: e.target.value})}
                       placeholder="https://example.com/image-big.jpg or import from src/img/projects/"
                     />
                     <Form.Text className="text-muted">
                       Use full URL or import from src/img/projects/ directory
                     </Form.Text>
                   </Form.Group>
                 </Col>
               </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>GitHub Link</Form.Label>
                    <Form.Control
                      type="url"
                      value={projectForm.gitHubLink}
                      onChange={(e) => setProjectForm({...projectForm, gitHubLink: e.target.value})}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Live Link</Form.Label>
                    <Form.Control
                      type="url"
                      value={projectForm.liveLink}
                      onChange={(e) => setProjectForm({...projectForm, liveLink: e.target.value})}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Featured Project"
                  checked={projectForm.featured}
                  onChange={(e) => setProjectForm({...projectForm, featured: e.target.checked})}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowProjectModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {editingProject ? 'Update' : 'Add'} Project
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>

        {/* Blog Modal */}
        <Modal show={showBlogModal} onHide={() => setShowBlogModal(false)} size="xl" scrollable>
          <Modal.Header closeButton>
            <Modal.Title>
              {editingBlogPost ? 'Edit Blog Post' : 'Add New Blog Post'}
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleBlogSubmit}>
            <Modal.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Title (EN)</Form.Label>
                    <Form.Control
                      type="text"
                      value={blogForm.title_en}
                      onChange={(e) => setBlogForm({...blogForm, title_en: e.target.value})}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Title (RU)</Form.Label>
                    <Form.Control
                      type="text"
                      value={blogForm.title_ru}
                      onChange={(e) => setBlogForm({...blogForm, title_ru: e.target.value})}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Author</Form.Label>
                    <Form.Control
                      type="text"
                      value={blogForm.author}
                      onChange={(e) => setBlogForm({...blogForm, author: e.target.value})}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Tags (comma-separated)</Form.Label>
                    <Form.Control
                      type="text"
                      value={blogForm.tags}
                      onChange={(e) => setBlogForm({...blogForm, tags: e.target.value})}
                      placeholder="React, JavaScript, Tutorial"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Excerpt (EN)</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={blogForm.excerpt_en}
                      onChange={(e) => setBlogForm({...blogForm, excerpt_en: e.target.value})}
                      placeholder="Brief description of the post"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Excerpt (RU)</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={blogForm.excerpt_ru}
                      onChange={(e) => setBlogForm({...blogForm, excerpt_ru: e.target.value})}
                      placeholder="Краткое описание поста"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={8}>
                  <Form.Group className="mb-3">
                    <Form.Label>Image URL</Form.Label>
                    <Form.Control
                      type="url"
                      value={blogForm.image || ''}
                      onChange={(e) => setBlogForm({ ...blogForm, image: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                    <Form.Text className="text-muted">
                      You can paste an external URL or upload a local image.
                    </Form.Text>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Upload Image</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleBlogImageUpload(e.target.files?.[0])}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {blogForm.image && (
                <div className="blog-image-preview mb-3">
                  <img src={blogForm.image} alt="Preview" style={{ maxWidth: '100%', borderRadius: 8 }} />
                </div>
              )}

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Content EN (Markdown)</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={10}
                      value={blogForm.content_en}
                      onChange={(e) => setBlogForm({...blogForm, content_en: e.target.value})}
                      placeholder="Write your blog post content in English. Markdown is supported."
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Content RU (Markdown)</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={10}
                      value={blogForm.content_ru}
                      onChange={(e) => setBlogForm({...blogForm, content_ru: e.target.value})}
                      placeholder="Напишите текст поста на русском. Поддерживается Markdown."
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={8}>
                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      label="Featured Post"
                      checked={blogForm.featured}
                      onChange={(e) => setBlogForm({...blogForm, featured: e.target.checked})}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}></Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowBlogModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {editingBlogPost ? 'Update' : 'Add'} Post
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Container>
    </div>
  );
};

export default AdminPanel;
