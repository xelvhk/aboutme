import React, { useMemo, useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { cms } from '../data/cms';
import { useTranslation } from '../data/translations';
import '../components/blog/blog.css';

const Projects = () => {
	const { t, language } = useTranslation();
	const [projects, setProjects] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadProjects = async () => {
			try {
				const projectsData = await cms.getProjects();
				setProjects(projectsData);
			} catch (error) {
				console.error('Error loading projects:', error);
			} finally {
				setLoading(false);
			}
		};

		loadProjects();
	}, []);

	const grouped = useMemo(() => {
		const all = projects || [];
		return {
			sites: all.filter(p => (p.type || 'site') === 'site'),
			design: all.filter(p => p.type === 'design'),
		};
	}, [projects]);

	const getLocalized = (item, field) => {
		if (language === 'ru') {
			return item[`${field}_ru`] || item[`${field}_en`] || item[field] || '';
		}
		return item[`${field}_en`] || item[`${field}_ru`] || item[field] || '';
	};

	const noPreviewLabel = language === 'ru' ? 'Превью скоро' : 'Preview soon';

	if (loading) {
		return (
			<section>
				<div className='about-page-background'>
					<Container>
						<Row className='text-background'>
							<Col md={12}>
								<h3 className='about-me-text'>{t('projects.title')}</h3>
								<p className="blog-subtitle">{t('projects.loading')}</p>
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
							<h3 className='about-me-text'>{t('projects.title')}</h3>

							{grouped.sites && grouped.sites.length > 0 && (
								<>
									<Row className="blog-grid align-items-stretch">
										{grouped.sites.map((p, idx) => (
											<Col xs={12} md={6} lg={4} key={`site-${idx}`}>
												<Card className="project-card blog-card h-100">
													<div className="project-card-preview">
														{p.img ? (
															<img src={p.img} alt={getLocalized(p, 'title')} className="project-card-preview-image" />
														) : (
															<div className="project-card-preview-placeholder">
																<span>{noPreviewLabel}</span>
															</div>
														)}
													</div>
													<Card.Body className="blog-card-content">
														{getLocalized(p, 'description') && (
															<Card.Text className="blog-card-excerpt">{getLocalized(p, 'description')}</Card.Text>
														)}
														<div className="blog-card-tags mt-2">
															{p.skills && p.skills.split(',').slice(0,3).map((s, i) => (
																<Badge key={i} bg="light" text="dark" className="me-1">{s.trim()}</Badge>
															))}
														</div>
														{p.gitHubLink && (
															<a href={p.gitHubLink} target="_blank" rel="noreferrer" className="blog-back-btn" style={{marginTop: '1rem'}}>
																{t('projects.githubLink')}
															</a>
														)}
													</Card.Body>
												</Card>
											</Col>
										))}
									</Row>
								</>
							)}
{/* 
							{grouped.design && grouped.design.length > 0 && (
								<>
									<h4 className='blog-subtitle'>{t('projects.design') || 'Design'}</h4>
									<Row className="blog-grid">
										{grouped.design.map((p, idx) => (
											<Col md={6} lg={4} key={`design-${idx}`}>
												<Card className="project-card blog-card h-100">
													<div className="blog-card-inner">
														<Card.Body className="blog-card-content">
															<Card.Title className="blog-card-title">{getLocalized(p, 'title')}</Card.Title>
															{getLocalized(p, 'description') && (
																<Card.Text className="blog-card-excerpt">{getLocalized(p, 'description')}</Card.Text>
															)}
															<div className="blog-card-meta">
																<small className="text-muted">{t('projects.viewProject')}</small>
															</div>
															<div className="blog-card-tags mt-2">
																{p.skills && p.skills.split(',').slice(0,3).map((s, i) => (
																	<Badge key={i} bg="light" text="dark" className="me-1">{s.trim()}</Badge>
																))}
															</div>
															<div style={{display:'flex', justifyContent:'center', gap:'0.25rem', flexWrap:'wrap', marginTop:'1rem'}}>
																{p.behanceLink && (
																	<a href={p.behanceLink} target="_blank" rel="noreferrer" className="blog-back-btn">Behance</a>
																)}
																{p.figmaLink && (
																	<a href={p.figmaLink} target="_blank" rel="noreferrer" className="blog-back-btn">Figma</a>
																)}
															</div>
														</Card.Body>
														{p.img && (
															<div className="project-card-side d-none d-md-block">
																<img src={p.img} alt={getLocalized(p, 'title')} className="project-card-side-image" />
															</div>
														)}
													</div>
												</Card>
											</Col>
										))}
									</Row>
								</>
							)} */}

							{!projects || projects.length === 0 ? (
								<div className="text-center">
									<h4>{t('projects.noProjects')}</h4>
								</div>
							) : null}
						</Col>
					</Row>
				</Container>
			</div>
		</section>
	);
};

export default Projects;
