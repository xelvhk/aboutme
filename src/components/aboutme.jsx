import React from 'react';
import { Container, Row, Col } from 'react-bootstrap'
import Marquee from "react-fast-marquee";
import { skillsData } from '../data/SkillsData';
import { skillsImage } from '../utils/SkillsImage';
import { useTranslation } from '../data/translations';
import "../styles/style.css";
import Timeline from "../components/timeline";

function Aboutme() {
    const { t } = useTranslation();
    const events = t('about.experienceItems');
    
    return (
        <div className='about-page-background'>
            <Container>
                <Row className='text-background justify-content-center'>
                    <Col xs={12} lg={10} xl={8}>
                        <h3 className='about-me-text'>{t('about.title')}</h3>
                        <p className='about-me-details'>{t('about.description')}</p>
                        <div className="skills-container">
                            <h3 className='about-me-text'>{t('about.experience')}</h3>
                            <Timeline events={events} />
                            <h3 className='about-me-text'>{t('about.skills')}</h3>
                            <div className="skill--scroll">
                                {skillsData && skillsData.length > 0 ? (
                                    <Marquee
                                        gradient={false}
                                        speed={90}
                                        pauseOnClick={true}
                                        delay={0}
                                        play={true}
                                        direction="right"
                                    >
                                        {skillsData.map((skill, id) => {
                                            const skillImg = skillsImage(skill);
                                            return skillImg ? (
                                                <div className="skill-box" key={`${skill}-${id}`} >
                                                    <img className='skill-image' src={skillImg} alt={skill} />
                                                    <p>{skill}</p>
                                                </div>
                                            ) : null;
                                        })}
                                    </Marquee>
                                ) : (
                                    <p>No skills data available.</p>
                                )}
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Aboutme;
