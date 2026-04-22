// Language context and hook
import { createContext, useContext, useState, useEffect } from 'react';

// Translation system for the portfolio site
export const translations = {
  en: {
    // Header
    header: {
      greeting: "Hello, I'm Alex",
      role: 'developer',
      downloadCv: 'Download CV'
    },
    // Navigation
    nav: {
      home: 'Home',
      projects: 'Projects',
      blog: 'Blog',
      admin: 'Admin'
    },
    
    // Home page
    home: {
      title: 'Portfolio',
      subtitle: 'Frontend Developer',
      description: 'I am a frontend developer with experience in creating modern and responsive web applications using React, JavaScript, and other modern technologies.'
    },
    
    // About Me page
    about: {
      title: 'About me',
      description: 'I’m a frontend developer and Python enthusiast with experience in React, JavaScript, and modern tooling. I build responsive interfaces, integrate APIs, and automate workflows with Aiogram bots. A background in information security and teaching helps me deliver reliable, clear, maintainable solutions.',
      skills: 'Skills',
      experience: 'Experience',
      experienceItems: [
        { date: '2024-09 — present', title: 'Information Security Engineer', place: 'NPP Radar MMS' },
        { date: '2023-08 — present', title: 'Computer science teacher', place: 'Hexlet College' },
        { date: '2021-09 — 2023-07', title: 'Deputy director for educational work', place: 'GBOU SOSH 20 SPB' },
        { date: '2019-09 — 2023-07', title: 'Computer science teacher', place: 'GBOU SOSH 20 SPB' },
      ],
      education: 'Education',
      currentWork: "I'm currently working with React, but studying blockchain and machine learning.",
      skillsList: [
        'HTML5',
        'CSS3',
        'JavaScript',
        'React',
        'Node.js',
        'Git',
        'Webpack',
        'Figma'
      ]
    },
    
    // Projects page
    projects: {
      title: 'Projects',
      subtitle: 'My recent work',
      viewProject: 'View Project',
      projectLink: 'Project link',
      githubLink: 'GitHub link',
      sites: 'Sites',
      design: 'Design',
      loading: 'Loading projects...',
      noProjects: 'No projects found'
    },
    
    // Blog page
    blog: {
      title: 'Blog',
      subtitle: 'Thoughts on web development, technology, and more',
      backToBlog: '← Back to Blog',
      readMore: 'Read More',
      loading: 'Loading blog posts...',
      noPosts: 'No blog posts found',
      publishedOn: 'Published on'
    },
    
    // Contacts
    contacts: {
      title: 'Contacts',
      subtitle: 'Feel free to reach out via social networks or email.'
    },
    
    // Admin panel
    admin: {
      title: 'Admin Panel',
      projects: 'Projects',
      blogPosts: 'Blog Posts',
      addNew: 'Add New',
      edit: 'Edit',
      delete: 'Delete',
      save: 'Save',
      cancel: 'Cancel',
      projectForm: {
        title: 'Project Title',
        description: 'Project Description',
        imageUrl: 'Image URL',
        projectUrl: 'Project URL',
        githubUrl: 'GitHub URL',
        technologies: 'Technologies (comma-separated)'
      },
      blogForm: {
        title: 'Post Title',
        excerpt: 'Post Excerpt',
        content: 'Post Content (Markdown)',
        tags: 'Tags (comma-separated)'
      }
    },
    
    // Common
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      close: 'Close'
    }
  },
  
  ru: {
    // Header
    header: {
      greeting: 'Привет, я Алексей',
      role: 'разработчик',
      downloadCv: 'Скачать резюме'
    },
    // Navigation
    nav: {
      home: 'Главная',
      projects: 'Проекты',
      blog: 'Блог',
      admin: 'Админ'
    },
    
    // Home page
    home: {
      title: 'Портфолио',
      subtitle: 'Frontend Разработчик',
      description: 'Я frontend разработчик с опытом создания современных и адаптивных веб-приложений с использованием React, JavaScript и других современных технологий.'
    },
    
    // About Me page
    about: {
      title: 'Обо мне',
      description: 'Я frontend‑разработчик и Python‑энтузиаст с опытом в React и JavaScript. Создаю адаптивные интерфейсы, интегрирую API и автоматизирую процессы с помощью ботов на Aiogram. Опыт в ИБ и преподавании помогает проектировать надёжные, понятные и поддерживаемые решения.',
      skills: 'Навыки',
      experience: 'Опыт работы',
      experienceItems: [
        { date: '09.2024 — н.в.', title: 'Инженер отдела защиты информации / Специалист сектора системного развития', place: 'АО «НПП «Радар ммс»' },
        { date: '08.2023 — н.в.', title: 'Преподаватель информатики', place: 'Колледж Хекслет' },
        { date: '09.2021 — 07.2023', title: 'Заместитель директора по учебно-воспитательной работе (ШИС)', place: 'ГБОУ СОШ №20 Санкт‑Петербург' },
        { date: '09.2019 — 07.2023', title: 'Учитель информатики', place: 'ГБОУ СОШ №20 Санкт‑Петербург' },
      ],
      education: 'Образование',
      currentWork: 'В настоящее время работаю с React, но изучаю блокчейн и машинное обучение.',
      skillsList: [
        'HTML5',
        'CSS3',
        'JavaScript',
        'React',
        'Node.js',
        'Git',
        'Webpack',
        'Figma'
      ]
    },
    
    // Projects page
    projects: {
      title: 'Проекты',
      subtitle: 'Мои последние работы',
      viewProject: 'Посмотреть проект',
      projectLink: 'Ссылка на проект',
      githubLink: 'Ссылка на GitHub',
      sites: 'Сайты',
      design: 'Дизайн',
      loading: 'Загрузка проектов...',
      noProjects: 'Проекты не найдены'
    },
    
    // Blog page
    blog: {
      title: 'Блог',
      subtitle: 'Размышления о веб-разработке, технологиях и многом другом',
      backToBlog: '← Назад к блогу',
      readMore: 'Читать далее',
      loading: 'Загрузка постов...',
      noPosts: 'Посты не найдены',
      publishedOn: 'Опубликовано'
    },
    
    // Contacts
    contacts: {
      title: 'Контакты',
      subtitle: 'Свяжитесь со мной в соцсетях или по электронной почте.'
    },
    
    // Admin panel
    admin: {
      title: 'Панель администратора',
      projects: 'Проекты',
      blogPosts: 'Посты блога',
      addNew: 'Добавить новый',
      edit: 'Редактировать',
      delete: 'Удалить',
      save: 'Сохранить',
      cancel: 'Отмена',
      projectForm: {
        title: 'Название проекта',
        description: 'Описание проекта',
        imageUrl: 'URL изображения',
        projectUrl: 'URL проекта',
        githubUrl: 'URL GitHub',
        technologies: 'Технологии (через запятую)'
      },
      blogForm: {
        title: 'Заголовок поста',
        excerpt: 'Краткое описание поста',
        content: 'Содержание поста (Markdown)',
        tags: 'Теги (через запятую)'
      }
    },
    
    // Common
    common: {
      loading: 'Загрузка...',
      error: 'Ошибка',
      success: 'Успешно',
      close: 'Закрыть'
    }
  }
};


const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('portfolio-language') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('portfolio-language', language);
  }, [language]);

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  const switchLanguage = (newLanguage) => {
    setLanguage(newLanguage);
  };

  return (
    <LanguageContext.Provider value={{ language, t, switchLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};


