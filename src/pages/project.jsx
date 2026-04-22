import {useParams} from "react-router-dom";
import BtnGitHub from "../components/btnGitHub/btnGitHub";
import {projects} from "./../helpers/projectsList";

const Project = () => {
	const {id} = useParams();
	const project = projects[id];

	// Handle case when project is not found
	if (!project) {
		return (
			<main className="section">
				<div className="container">
					<div className="project-details">
						<h1 className="title-1">Project Not Found</h1>
						<p>Sorry, the project you're looking for doesn't exist.</p>
					</div>
				</div>
			</main>
		);
	}

    return (
		<main className="section">
			<div className="container">
				<div className="project-details">
					<h1 className="title-1">{project.title}</h1>

					<img
						src={project.imgBig}
						alt={project.title}
						className="project-details-cover"
					/>

					<div className="project-details-desc">
						<p>Skills: {project.skills}</p>
					</div>

					{(project.type === 'site' && project.gitHubLink) && (
						<BtnGitHub link={project.gitHubLink} />
					)}
					{/* {project.type === 'design' && (
						<div style={{display:'flex', gap:'0.5rem', flexWrap:'wrap'}}>
							{project.behanceLink && (
								<a href={project.behanceLink} target="_blank" rel="noreferrer" className="btn-outline">Behance</a>
							)}
							{project.figmaLink && (
								<a href={project.figmaLink} target="_blank" rel="noreferrer" className="btn-outline">Figma</a>
							)}
						</div>
					)} */}
				</div>
			</div>
		</main>
	);
}


export default Project;