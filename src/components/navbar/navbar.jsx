import { NavLink } from 'react-router-dom';
import BtnDarkMode from '../btnDarkMode/btnDarkMode.jsx';
import LanguageSwitcher from '../languageSwitcher/languageSwitcher.jsx';
import { useTranslation } from '../../data/translations';
import './navbar.css';
import logo from '../../img/logo.png'

const Navbar = () => {
	const { t } = useTranslation();
	const activeLink = 'nav-list__link nav-list__link--active';
	const normalLink = 'nav-list__link';

	return (
		<nav className="nav">
			<div className="container">
				<div className="nav-row">
					<NavLink to="/" className="logo">
						<img src={logo} alt='logo' />
					</NavLink>

					<ul className="nav-list">
						<li className="nav-list__item">
							<NavLink
								to="/"
								className={({ isActive }) =>
									isActive ? activeLink : normalLink
								}
							>
								{t('nav.home')}
							</NavLink>
						</li>

						<li className="nav-list__item">
							<NavLink
								to="/projects"
								className={({ isActive }) =>
									isActive ? activeLink : normalLink
								}
							>
								{t('nav.projects')}
							</NavLink>
						</li>
						<li className="nav-list__item">
							<NavLink
								to="/blog"
								className={({ isActive }) =>
									isActive ? activeLink : normalLink
								}
							>
								{t('nav.blog')}
							</NavLink>
						</li>
					</ul>
					
					<div className="nav-controls">
						<LanguageSwitcher />
						<BtnDarkMode />
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
