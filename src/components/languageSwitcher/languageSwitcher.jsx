import React from 'react';
import { useTranslation } from '../../data/translations';
import './languageSwitcher.css';

const LanguageSwitcher = () => {
  const { language, switchLanguage } = useTranslation();

  const toggleLanguage = () => {
    switchLanguage(language === 'en' ? 'ru' : 'en');
  };

  const btnNormal = 'lang-toggle-btn';
  const btnActive = 'lang-toggle-btn lang-toggle-btn--active';

  return (
    <button
      className={language === 'ru' ? btnActive : btnNormal}
      onClick={toggleLanguage}
      aria-label={`Switch language. Current: ${language.toUpperCase()}`}
    >
      <span className="lang-toggle-btn--label">EN</span>
      <span className="lang-toggle-btn--label">RU</span>
    </button>
  );
};

export default LanguageSwitcher;

