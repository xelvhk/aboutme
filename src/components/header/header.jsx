import "../../styles/style.css";
import headerImg from "../../img/header-optimized.jpg";
import Text from "../Text";
import { useTranslation } from "../../data/translations";

const Header = () => {
    const { t, language } = useTranslation();
    const cvBasePath = process.env.PUBLIC_URL || "";
    const cvLink = language === 'ru'
        ? `${cvBasePath}/cv/alexey_khvedchenya_cv_ru.pdf`
        : `${cvBasePath}/cv/alexey_khvedchenya_cv_en.pdf`;
    const cvFileName = language === 'ru' ? 'alexey_khvedchenya_cv_ru.pdf' : 'alexey_khvedchenya_cv_en.pdf';
    return (
		<header className="header">
			<div className="header-wrapper">
				<div className="header-content">
					<h1 className="header-title">
						<strong>
							<span className='wave' role="img" aria-label="waving hand">👋</span>{t('header.greeting')}
						</strong>
						<Text /><strong>{t('header.role')}</strong>
					</h1>
					<a href={cvLink} className="btn" download={cvFileName}>
						{t('header.downloadCv')}
					</a>
				</div>
				<img
					src={headerImg}
					alt="Profile"
					className="header-image"
					loading="eager"
					fetchPriority="high"
					decoding="async"
					width="300"
				/>
			</div>
		</header>
	);
}

export default Header;
