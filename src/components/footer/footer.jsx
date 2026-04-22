import "./footer.css";
import { useTranslation } from '../../data/translations';

import instagram from './../../img/icons/instagram.svg';
import linkedIn from './../../img/icons/linkedIn.svg';
import gitHub from './../../img/icons/gitHub.svg';

const Footer = () => {
	const { t } = useTranslation();
    return (
		<footer className="footer">
			<div className="container">
				<div className="footer-wrapper">
					<h3 className="about-me-text">{t('contacts.title')}</h3>
					<ul className="social">

						<li className="social-item">
							<a href="https://instagram.com/days_of_nothing">
								<img src={instagram} alt="Link" />
							</a>
						</li>

						<li className="social-item">
							<a href="https://github.com/xelvhk">
								<img src={gitHub} alt="Link" />
							</a>
						</li>
						<li className="social-item">
							<a href="#!">
								<img src={linkedIn} alt="Link" />
							</a>
						</li>
					</ul>
					<div>
						<p>© 2024 <a href="https://github.com/xelvhk">xelvhk.github.io</a></p>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;