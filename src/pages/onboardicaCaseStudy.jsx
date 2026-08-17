import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import '../styles/onboardicaCaseStudy.css';

const assetBase = `${process.env.PUBLIC_URL || ''}/case-studies/onboardica`;

const screenshots = [
  ['01-login-and-setup.png', 'Login screen and setup wizard with demo account shortcuts.'],
  ['02-manager-dashboard.png', 'Training manager dashboard with funnel, risk, mentor load, and analytics.'],
  ['03-employee-workspace.png', 'Employee workspace with progress, XP, assessment, Telegram linking, and AI tutor boundary.'],
  ['04-mentor-review.png', 'Mentor workspace with assigned newcomers and practical review queue.'],
  ['05-manager-after-review.png', 'Manager view after review, showing updated progress and readiness signals.'],
  ['06-api-docs.png', 'FastAPI OpenAPI documentation for the demo API surface.'],
];

const proofItems = [
  ['Backend', 'FastAPI, SQLAlchemy, Alembic, PostgreSQL target, tenant/RBAC tests.'],
  ['Frontend', 'Role-aware Next.js demo for manager, employee, mentor, setup, empty, and negative states.'],
  ['Operations', 'Docker Compose, production-style Nginx profile, health/readiness, backup and rollback docs.'],
  ['Verification', 'CI, make check, Compose smoke, and browser smoke were green on the release proof pass.'],
  ['Security hygiene', '.demo seed data only, no real PII, generated artifact scanning, private source repository.'],
  ['Integrations', 'Telegram delivery path plus honest Moodle and AI tutor provider boundaries.'],
];

const OnboardicaCaseStudy = () => (
  <section>
    <div className="about-page-background">
      <Container>
        <Row className="text-background onboardica-case">
          <Col md={12}>
            <div className="onboardica-case-hero">
              <div>
                <p className="onboardica-case-eyebrow">Sanitized case study</p>
                <h1 className="onboardica-case-title">Onboardica</h1>
                <p className="onboardica-case-lead">
                  Self-hosted SaaS MVP for employee onboarding, mentoring, gamification,
                  Telegram notifications, and readiness analytics. The source repository is
                  private, so this page is the public proof artifact: screenshots, scope,
                  architecture, and verification summary without exposing private code or local data.
                </p>
              </div>
              <img
                className="onboardica-case-preview"
                src={`${process.env.PUBLIC_URL || ''}/project-previews/onboardica.svg`}
                alt="Onboardica dashboard-style project preview"
              />
            </div>

            <div className="onboardica-case-section">
              <h2>Product Result</h2>
              <p>
                Onboardica turns onboarding from a static checklist into an operational flow:
                managers configure routes and inspect analytics, employees complete learning and
                practical work, mentors review submissions, and readiness changes are visible in
                the dashboard. The demo is seed-data driven, but backed by real API endpoints and
                a PostgreSQL-first Docker path.
              </p>
            </div>

            <div className="onboardica-case-section">
              <h2>Evidence Snapshot</h2>
              <div className="onboardica-case-grid">
                {proofItems.map(([title, body]) => (
                  <div className="onboardica-case-proof" key={title}>
                    <strong>{title}</strong>
                    <span>{body}</span>
                  </div>
                ))}
              </div>
              <p className="onboardica-case-note">
                Verification status: CI, production-style Compose smoke, and browser smoke were
                green in the local proof pass. Private source can be shared on request for review.
              </p>
            </div>

            <div className="onboardica-case-section">
              <h2>Architecture And Boundaries</h2>
              <ul>
                <li>FastAPI modular monolith with service-layer domain logic and tenant-scoped APIs.</li>
                <li>Next.js role-aware web demo for training manager, employee, mentor, and setup flows.</li>
                <li>PostgreSQL, Redis, Nginx, and Telegram bot service in Docker Compose.</li>
                <li>Moodle and AI tutor are explicit provider interfaces with mock implementations for the MVP.</li>
                <li>Seed data uses fictional `.demo` accounts; no real personal data is used in the public proof.</li>
              </ul>
            </div>

            <div className="onboardica-case-section">
              <h2>Screenshots</h2>
              <div className="onboardica-case-gallery">
                {screenshots.map(([file, caption]) => (
                  <figure className="onboardica-case-shot" key={file}>
                    <img src={`${assetBase}/${file}`} alt={caption} loading="lazy" decoding="async" />
                    <figcaption>{caption}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  </section>
);

export default OnboardicaCaseStudy;
