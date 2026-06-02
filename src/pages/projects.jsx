import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { cms } from '../data/cms';
import { useTranslation } from '../data/translations';
import '../styles/projects.css';

const ProjectPreview = ({ src, alt, placeholder }) => {
	const [failed, setFailed] = useState(false);

	if (src && !failed) {
		return (
			<img
				src={src}
				alt={alt}
				className="project-card-preview-image"
				loading="lazy"
				decoding="async"
				onError={() => setFailed(true)}
			/>
		);
	}

	return (
		<div className="project-card-preview-placeholder">
			<span>{placeholder}</span>
		</div>
	);
};

const Projects = () => {
	const { t, language } = useTranslation();
	const [projects, setProjects] = useState([]);
	const [loading, setLoading] = useState(true);
	const [activeTopic, setActiveTopic] = useState('all');
	const [activeCategory, setActiveCategory] = useState('all');

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

	const getProjectTopics = (project) => {
		if (Array.isArray(project?.topics) && project.topics.length > 0) {
			return project.topics.map((topic) => String(topic).trim().toLowerCase()).filter(Boolean);
		}

		if (typeof project?.skills === 'string' && project.skills.trim()) {
			return project.skills
				.split(',')
				.map((skill) => skill.trim().toLowerCase())
				.filter(Boolean);
		}

		return [];
	};

	const topicOptions = useMemo(() => {
		const topics = new Set();
		(grouped.sites || []).forEach((project) => {
			getProjectTopics(project).forEach((topic) => topics.add(topic));
		});
		return Array.from(topics).sort((a, b) => a.localeCompare(b));
	}, [grouped.sites]);

	const categoryOptions = [
		{ key: 'all', label: t('projects.filterAll') },
		{ key: 'ai', label: t('projects.categoryAi') },
		{ key: 'backend', label: t('projects.categoryBackend') },
		{ key: 'frontend', label: t('projects.categoryFrontend') },
		{ key: 'automation', label: t('projects.categoryAutomation') },
		{ key: 'telegram', label: t('projects.categoryTelegram') },
	];

	const matchesCategory = useCallback((project, category) => {
		if (category === 'all') return true;
		const topics = getProjectTopics(project);
		const haystack = [
			...topics,
			String(project?.title || '').toLowerCase(),
			String(project?.description || '').toLowerCase(),
			String(project?.description_en || '').toLowerCase(),
			String(project?.description_ru || '').toLowerCase(),
			String(project?.skills || '').toLowerCase(),
		].join(' ');

		const checks = {
			ai: ['ai', 'llm', 'assistant', 'ml', 'machine learning'],
			backend: ['backend', 'fastapi', 'api', 'python', 'server'],
			frontend: ['frontend', 'react', 'javascript', 'html', 'css', 'ui'],
			automation: ['automation', 'workflow', 'bot', 'agent'],
			telegram: ['telegram', 'aiogram', 'tg'],
		};

		return (checks[category] || []).some((token) => haystack.includes(token));
	}, []);

	const filteredSites = useMemo(() => {
		let items = grouped.sites || [];
		if (activeCategory !== 'all') {
			items = items.filter((project) => matchesCategory(project, activeCategory));
		}
		if (activeTopic === 'all') {
			return items;
		}
		return items.filter((project) =>
			getProjectTopics(project).includes(activeTopic)
		);
	}, [activeTopic, activeCategory, grouped.sites, matchesCategory]);

	const pinnedSites = useMemo(() => (grouped.sites || []).filter((p) => Boolean(p.pinned)), [grouped.sites]);
	const regularSites = useMemo(() => filteredSites.filter((p) => !p.pinned), [filteredSites]);

	const getLocalized = (item, field) => {
		if (language === 'ru') {
			return item[`${field}_ru`] || item[`${field}_en`] || item[field] || '';
		}
		return item[`${field}_en`] || item[`${field}_ru`] || item[field] || '';
	};

	const noPreviewLabel = language === 'ru' ? 'Превью скоро' : 'Preview soon';
	const renderPreview = (project) => (
		<ProjectPreview
			src={project.img}
			alt={getLocalized(project, 'title')}
			placeholder={noPreviewLabel}
		/>
	);
	const getProjectTags = (project) => {
		const tags = getProjectTopics(project);
		if (tags.length > 0) {
			return tags.slice(0, 3);
		}
		return [language === 'ru' ? 'проект' : 'project'];
	};
	const renderTags = (project, extraTags = []) => (
		<div className="projects-card-tags">
			{extraTags.map((tag) => (
				<Badge key={`extra-${tag}`} bg="light" text="dark" className="me-1">{tag}</Badge>
			))}
			{getProjectTags(project).map((tag) => (
				<Badge key={tag} bg="light" text="dark" className="me-1">{tag}</Badge>
			))}
		</div>
	);
	const renderGithubLink = (project) => (
		project.gitHubLink ? (
			<div className="projects-card-actions">
				<a href={project.gitHubLink} target="_blank" rel="noreferrer" className="projects-link-btn">
					{t('projects.githubLink')}
				</a>
			</div>
		) : null
	);
	const getCase = (item, key) => {
		if (language === 'ru') {
			return item[`${key}_ru`] || item[`${key}_en`] || '';
		}
		return item[`${key}_en`] || item[`${key}_ru`] || '';
	};

	const renderSkeletonCards = () => (
		<Row className="blog-grid align-items-stretch">
			{Array.from({ length: 6 }).map((_, idx) => (
				<Col xs={12} md={6} lg={4} key={`skeleton-${idx}`}>
					<Card className="project-card projects-card h-100 project-skeleton-card">
						<div className="project-card-preview project-skeleton-preview" />
						<Card.Body className="projects-card-content">
							<div className="project-skeleton-line project-skeleton-line-lg" />
							<div className="project-skeleton-line project-skeleton-line-md" />
							<div className="project-skeleton-tags">
								<span className="project-skeleton-pill" />
								<span className="project-skeleton-pill" />
								<span className="project-skeleton-pill" />
							</div>
							<div className="project-skeleton-line project-skeleton-line-btn" />
						</Card.Body>
					</Card>
				</Col>
			))}
		</Row>
	);

	if (loading) {
		return (
			<section>
				<div className='about-page-background'>
					<Container>
						<Row className='text-background'>
							<Col md={12}>
								<h3 className='about-me-text'>{t('projects.title')}</h3>
									<p className="projects-subtitle">{t('projects.loading')}</p>
								{renderSkeletonCards()}
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
							<p className="projects-subtitle">{t('projects.subtitle')}</p>

							{grouped.sites && grouped.sites.length > 0 && (
								<>
									{pinnedSites.length > 0 && (
										<>
											<h4 className="projects-section-title">{t('projects.pinnedTitle')}</h4>
											<Row className="blog-grid align-items-stretch">
												{pinnedSites.slice(0, 6).map((p, idx) => (
													<Col xs={12} md={6} lg={4} key={`pinned-${idx}`}>
														<Card className="project-card projects-card h-100 is-pinned">
															<div className="project-card-preview">
																{renderPreview(p)}
															</div>
															<Card.Body className="projects-card-content">
																{getLocalized(p, 'description') && (
																	<Card.Text className="projects-card-excerpt">{getLocalized(p, 'description')}</Card.Text>
																)}
																{renderTags(p, ['Pinned'])}
																{renderGithubLink(p)}
															</Card.Body>
														</Card>
													</Col>
												))}
											</Row>
										</>
									)}

									<div className="projects-filter-block">
										<span className="projects-filter-label">{t('projects.categoryLabel')}</span>
										<div className="projects-filter-chips">
											{categoryOptions.map((cat) => (
												<button
													type="button"
													key={cat.key}
													className={`projects-filter-chip ${activeCategory === cat.key ? 'is-active' : ''}`}
													onClick={() => setActiveCategory(cat.key)}
												>
													{cat.label}
												</button>
											))}
										</div>
									</div>

									<div className="projects-filter-block">
										<span className="projects-filter-label">{t('projects.filterLabel')}</span>
										<div className="projects-filter-chips">
											<button
												type="button"
												className={`projects-filter-chip ${activeTopic === 'all' ? 'is-active' : ''}`}
												onClick={() => setActiveTopic('all')}
											>
												{t('projects.filterAll')}
											</button>
											{topicOptions.map((topic) => (
												<button
													type="button"
													key={topic}
													className={`projects-filter-chip ${activeTopic === topic ? 'is-active' : ''}`}
													onClick={() => setActiveTopic(topic)}
												>
													{topic}
												</button>
											))}
										</div>
									</div>

									<Row className="blog-grid align-items-stretch">
										{regularSites.map((p, idx) => (
											<Col xs={12} md={6} lg={4} key={`site-${idx}`}>
													<Card className="project-card projects-card h-100">
													<div className="project-card-preview">
														{renderPreview(p)}
													</div>
														<Card.Body className="projects-card-content">
															{getLocalized(p, 'description') && (
																<Card.Text className="projects-card-excerpt">{getLocalized(p, 'description')}</Card.Text>
															)}
															{(getCase(p, 'problem') || getCase(p, 'solution') || getCase(p, 'result')) && (
																<div className="projects-case">
																	{getCase(p, 'problem') && (
																		<p><strong>{t('projects.caseProblem')}:</strong> {getCase(p, 'problem')}</p>
																	)}
																	{getCase(p, 'solution') && (
																		<p><strong>{t('projects.caseSolution')}:</strong> {getCase(p, 'solution')}</p>
																	)}
																	{getCase(p, 'result') && (
																		<p><strong>{t('projects.caseResult')}:</strong> {getCase(p, 'result')}</p>
																	)}
																</div>
															)}
															{renderTags(p)}
															{renderGithubLink(p)}
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

							{projects.length > 0 && regularSites.length === 0 && pinnedSites.length === 0 ? (
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
