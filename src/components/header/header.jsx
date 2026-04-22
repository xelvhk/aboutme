import "../../styles/style.css";
import headerImg from "../../img/header.png";
import Text from "../Text";
import { useTranslation } from "../../data/translations";

const Header = () => {
    const { t, language } = useTranslation();
    const cvLink = language === 'ru'
        ? 'https://drive.google.com/file/d/11N1tYl0YUpNYo9m7xcRGUAVTqmmCv4At/view?usp=sharing'
        : 'https://drive.google.com/file/d/1RK_EtUna60rkWKykeUFqukpZ3BGp--F9/view?usp=sharing';
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
					<a href={cvLink} className="btn">
						{t('header.downloadCv')}
					</a>
				</div>
				<img src={headerImg} alt="Profile" className="header-image" />
			</div>
		</header>
	);
}

export default Header;