import "./footer.css";
import { useTranslation } from '../../data/translations';

import telegram from './../../img/icons/telegram.svg';
import linkedIn from './../../img/icons/linkedIn.svg';
import gitHub from './../../img/icons/gitHub.svg';

const Footer = () => {
	const { t } = useTranslation();
	const currentYear = new Date().getFullYear();
    return (
		<footer className="footer">
			<div className="container">
				<div className="footer-wrapper">
					<h3 className="about-me-text">{t('contacts.title')}</h3>
					<ul className="social">

						<li className="social-item">
							<a href="https://t.me/hex_lex" target="_blank" rel="noreferrer">
								<img src={telegram} alt="Telegram" />
							</a>
						</li>

						<li className="social-item">
							<a href="https://github.com/xelvhk" target="_blank" rel="noreferrer">
								<img src={gitHub} alt="GitHub" />
							</a>
						</li>
						<li className="social-item">
							<a href="#!" target="_blank" rel="noreferrer">
								<img src={linkedIn} alt="LinkedIn" />
							</a>
						</li>
					</ul>
					<div className="copyright">
						<p>© {currentYear} <a href="https://github.com/xelvhk">xelvhk.github.io</a></p>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
