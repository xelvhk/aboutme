// Simple CMS adapter to provide projects/blog data to pages
// Currently proxies to local static lists and can be replaced by real backend later

import { projects as staticProjects } from "../helpers/projectsList";
import generatedBlog from "./blog.generated.json";

const sampleBlogPosts = [];

// Storage helpers
const STORAGE_KEYS = {
    projects: 'cms.projects.v4',
    posts: 'cms.posts',
    githubCache: 'cms.github.projects.cache.v8'
};

const GITHUB_USER = process.env.REACT_APP_GITHUB_USER || 'xelvhk';
const GITHUB_CACHE_TTL_MS = 6 * 60 * 60 * 1000;
const PROJECT_DESCRIPTION_RU = {
    vasya_ai: 'Локальный AI-ассистент для desktop-задач: голосовые команды, автоматизация и развитие агентных сценариев.',
    vasya_ai_landing: 'Статическая landing page для презентации vasya_ai: фокус на продуктовой подаче, сценариях использования и понятном frontend-оформлении.',
    aboutme: 'Портфолио в стиле персональной desktop OS с автосинхронизацией GitHub-проектов и блогом из Markdown.',
    tajnyj_ded_bot: 'Telegram-бот для жеребьевки Тайного Санты с приватным распределением участников.',
    attendance_bot: 'Telegram-бот для учета посещаемости, реализованный на Aiogram.',
    'python-tasks-taskbot': 'Telegram-бот для личных задач и продуктивности: учет задач, ежедневные сценарии и автоматизация рутины.',
    taskflow_orchestrator: 'Backend-сервис для асинхронной оркестрации задач на FastAPI, Celery, PostgreSQL и Redis.',
    ai_predictor: 'Streamlit-приложение для анализа архивов лотерей, проверки качества данных и экспериментальных ML-рекомендаций.',
    'ai-predictor': 'Streamlit-приложение для анализа архивов лотерей, проверки качества данных и экспериментальных ML-рекомендаций.',
    'js-marvel': 'Веб-приложение на JavaScript для поиска персонажей Marvel, пагинации и работы с внешним API.',
    'login-form-with-animation': 'Анимированная форма авторизации с упором на UI/UX и микроанимации.',
    'rock_paper_scissors_bot': 'Telegram-бот с игрой «камень, ножницы, бумага» на Python и Aiogram.',
    radar_bot: 'Telegram-бот для практики backend-логики на Python и разработки на Aiogram.',
    helper_bot: 'Виртуальный Telegram-помощник на Aiogram для простых пользовательских сценариев.',
    finance_manager_bot: 'Telegram-бот для учета личных финансов и практики автоматизации повседневных задач.',
    'php-package': 'Учебный PHP-пакет с акцентом на структуру библиотеки, автозагрузку и повторное использование кода.',
    blog: 'Простой блог на PHP, Apache и SQLite с базовой серверной логикой и хранением данных.',
    farmgame: 'Статическая промо-страница с тематическим визуальным стилем и адаптивной версткой.',
    fashion_store_with_React: 'Frontend-проект витрины магазина на React с компонентным подходом и адаптивным UI.',
    diff_strings: 'Python-утилита для сравнения строк и практики алгоритмического мышления.',
    sql_queries: 'Набор учебных SQL-запросов для практики выборок, фильтрации и работы с данными.',
    'hexlet-laravel-blog': 'Учебный Laravel-блог для практики MVC, маршрутизации и серверной разработки на PHP.',
    'hexlet-php': 'Учебный репозиторий по PHP с базовыми задачами и практикой языка.',
    'hexlet-phpunit': 'Учебный проект по PHPUnit и тестированию PHP-кода.',
    'hexlet-my-first-workflow': 'Учебный репозиторий для практики GitHub Actions и базовой CI-автоматизации.',
    'php-project-45': 'Учебный CLI-проект на PHP с фокусом на архитектуру консольного приложения.',
    'php-tests': 'Учебный репозиторий для практики тестирования и качества PHP-кода.',
    'http-queries': 'Учебный проект по HTTP-протоколу и сетевым запросам.',
};
const PINNED_REPOS = new Set([
    "vasya_ai",
    "tajnyj_ded_bot",
    "aboutme",
]);
const PROJECT_PREVIEW_FILES = {
    'ai-predictor': 'ai_predictor.svg',
    fashion_store_with_react: 'fashion_store_with_React.svg',
};
const PROJECT_TOPIC_FALLBACKS = {
    vasya_ai: ['python', 'ai', 'automation'],
    vasya_ai_landing: ['html', 'css', 'landing'],
    aboutme: ['react', 'portfolio', 'markdown'],
    tajnyj_ded_bot: ['python', 'telegram', 'aiogram'],
    attendance_bot: ['python', 'telegram', 'aiogram'],
    'python-tasks-taskbot': ['python', 'telegram', 'tasks'],
    taskflow_orchestrator: ['fastapi', 'postgresql', 'redis'],
    ai_predictor: ['python', 'streamlit', 'ml'],
    'ai-predictor': ['python', 'streamlit', 'ml'],
    'js-marvel': ['javascript', 'api', 'frontend'],
    'login-form-with-animation': ['frontend', 'css', 'animation'],
    'rock_paper_scissors_bot': ['python', 'telegram', 'game'],
    radar_bot: ['python', 'telegram', 'aiogram'],
    helper_bot: ['python', 'telegram', 'assistant'],
    finance_manager_bot: ['python', 'telegram', 'finance'],
    'php-package': ['php', 'package', 'library'],
    blog: ['php', 'sqlite', 'backend'],
    farmgame: ['html', 'css', 'landing'],
    fashion_store_with_react: ['react', 'frontend', 'ui'],
    diff_strings: ['python', 'algorithms', 'cli'],
    sql_queries: ['sql', 'database', 'queries'],
    'hexlet-laravel-blog': ['php', 'laravel', 'mvc'],
    'hexlet-php': ['php', 'learning', 'practice'],
    'hexlet-phpunit': ['php', 'testing', 'phpunit'],
    'hexlet-my-first-workflow': ['github-actions', 'ci', 'automation'],
    'php-project-45': ['php', 'cli', 'architecture'],
    'php-tests': ['php', 'testing', 'quality'],
    'http-queries': ['http', 'networking', 'requests'],
};

function normalizeRepoName(value) {
    return String(value || '').trim().toLowerCase();
}

function getProjectKey(project) {
    const githubUrl = String(project?.gitHubLink || project?.html_url || '').trim().toLowerCase();
    const match = githubUrl.match(/github\.com\/[^/]+\/([^/?#]+)/);
    if (match?.[1]) {
        return normalizeRepoName(match[1].replace(/\.git$/, ''));
    }
    return normalizeRepoName(project?.title || project?.name);
}

function getProjectPreviewUrl(repoName) {
    const key = normalizeRepoName(repoName);
    if (!key) return '';
    const fileName = PROJECT_PREVIEW_FILES[key] || `${key}.svg`;
    return `${process.env.PUBLIC_URL || ''}/project-previews/${encodeURIComponent(fileName)}`;
}

function getProjectTopicsFallback(repo) {
    const key = normalizeRepoName(repo?.name || repo?.title);
    const fallbackTopics = PROJECT_TOPIC_FALLBACKS[key] || [];
    const languageTopic = repo?.language ? [String(repo.language).trim().toLowerCase()] : [];
    return Array.from(new Set([...fallbackTopics, ...languageTopic])).filter(Boolean);
}

function readFromStorage(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return fallback;
        return JSON.parse(raw);
    } catch (e) {
        return fallback;
    }
}

function writeToStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        // ignore quota errors in this simple adapter
    }
}

function ensureIds(items, prefix) {
    return items.map((item, index) => ({
        id: item.id || `${prefix}-${index}-${Date.now()}`,
        ...item,
    }));
}

function getRussianDescription(repo) {
    const key = String(repo?.name || '').toLowerCase();
    if (PROJECT_DESCRIPTION_RU[key]) {
        return PROJECT_DESCRIPTION_RU[key];
    }

    const parts = ['Проект из GitHub-портфолио.'];
    if (repo?.language) {
        parts.push(`Основной язык: ${repo.language}.`);
    }
    parts.push('Код и детали реализации доступны в репозитории.');
    return parts.join(' ');
}

function buildProjectCase(repo) {
    const repoName = repo?.name || "project";
    const language = repo?.language || "stack";
    const description = repo?.description || "Repository implementation details";

    return {
        problem_en: `Need to implement "${repoName}" with clear structure and practical delivery value.`,
        solution_en: `Implemented using ${language} with repository-first workflow, modular code updates, and iterative improvements.`,
        result_en: `Published and documented project with working codebase: ${description}.`,
        problem_ru: `Нужно реализовать "${repoName}" с понятной структурой и практической ценностью результата.`,
        solution_ru: `Реализация выполнена на ${language} с репозиторий-ориентированным подходом, модульными изменениями и итеративными улучшениями.`,
        result_ru: `Получен опубликованный и документированный проект с рабочей кодовой базой: ${description}.`,
    };
}

function formatGithubRepo(repo) {
    const skills = [];
    const repoTopics = Array.isArray(repo.topics)
        ? repo.topics.filter(Boolean).map((topic) => String(topic).trim().toLowerCase())
        : [];
    const topics = repoTopics.length > 0 ? repoTopics : getProjectTopicsFallback(repo);

    if (repo.language) {
        skills.push(repo.language);
    }

    if (topics.length > 0) {
        topics.slice(0, 3).forEach((topic) => skills.push(topic));
    }

    const projectCase = buildProjectCase(repo);

    return {
        id: `gh-${repo.id}`,
        title: repo.name || '',
        title_en: repo.name || '',
        title_ru: repo.name || '',
        description: repo.description || '',
        description_en: repo.description || '',
        description_ru: getRussianDescription(repo),
        skills: skills.join(', '),
        topics,
        gitHubLink: repo.html_url || '',
        liveLink: repo.homepage || '',
        img: getProjectPreviewUrl(repo.name),
        pinned: PINNED_REPOS.has(String(repo.name || "").toLowerCase()),
        ...projectCase,
        type: 'site',
    };
}

function shouldIncludeGithubRepo(repo) {
    if (!repo || repo.fork || !repo.name) return false;
    if (repo.name === 'xelvhk') return false;
    return true;
}

function mergeWithManualProjects(githubProjects) {
    const existing = readFromStorage(STORAGE_KEYS.projects, []);
    const githubKeys = new Set(githubProjects.map(getProjectKey).filter(Boolean));
    const manualProjects = existing.filter((project) => {
        if (String(project.id || '').startsWith('gh-')) return false;
        const key = getProjectKey(project);
        return !key || !githubKeys.has(key);
    });
    return [...githubProjects, ...manualProjects];
}

async function loadGithubProjects() {
    const cached = readFromStorage(STORAGE_KEYS.githubCache, null);
    if (cached && Array.isArray(cached.projects) && cached.updatedAt) {
        const isFresh = Date.now() - cached.updatedAt < GITHUB_CACHE_TTL_MS;
        if (isFresh) {
            return cached.projects;
        }
    }

    const response = await fetch(
        `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`,
        { headers: { Accept: 'application/vnd.github+json' } }
    );

    if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
    }

    const repos = await response.json();
    const projects = Array.isArray(repos)
        ? repos
            .filter(shouldIncludeGithubRepo)
            .sort((a, b) => new Date(b.pushed_at || b.updated_at) - new Date(a.pushed_at || a.updated_at))
            .slice(0, 12)
            .map(formatGithubRepo)
        : [];

    writeToStorage(STORAGE_KEYS.githubCache, {
        updatedAt: Date.now(),
        projects,
    });

    return projects;
}

// Seed initial data into localStorage once (idempotent)
function seedIfEmpty() {
    const existingProjects = readFromStorage(STORAGE_KEYS.projects, null);
    if (!existingProjects) {
        const seeded = ensureIds(staticProjects || [], 'project');
        writeToStorage(STORAGE_KEYS.projects, seeded);
    }

    const existingPosts = readFromStorage(STORAGE_KEYS.posts, null);
    if (!existingPosts) {
        const seeded = ensureIds(sampleBlogPosts || [], 'post');
        writeToStorage(STORAGE_KEYS.posts, seeded);
    }
}

seedIfEmpty();

export const cms = {
    // Projects
    async getProjects() {
        const fallbackProjects = readFromStorage(STORAGE_KEYS.projects, []);

        try {
            const githubProjects = await loadGithubProjects();
            const mergedProjects = mergeWithManualProjects(githubProjects);
            writeToStorage(STORAGE_KEYS.projects, mergedProjects);
            return mergedProjects;
        } catch (error) {
            return fallbackProjects;
        }
    },
    addProject(project) {
        const projects = readFromStorage(STORAGE_KEYS.projects, []);
        const newProject = {
            ...project,
            id: `project-${Date.now()}`,
            type: project.type || 'site',
        };
        projects.push(newProject);
        writeToStorage(STORAGE_KEYS.projects, projects);
        return newProject;
    },
    updateProject(id, updates) {
        const projects = readFromStorage(STORAGE_KEYS.projects, []);
        const idx = projects.findIndex(p => p.id === id);
        if (idx !== -1) {
            projects[idx] = { ...projects[idx], ...updates };
            writeToStorage(STORAGE_KEYS.projects, projects);
            return projects[idx];
        }
        return null;
    },
    deleteProject(id) {
        const projects = readFromStorage(STORAGE_KEYS.projects, []);
        const filtered = projects.filter(p => p.id !== id);
        writeToStorage(STORAGE_KEYS.projects, filtered);
        return true;
    },

    // Blog posts
    getBlogPosts() {
        const storedPosts = readFromStorage(STORAGE_KEYS.posts, []);
        const manualPosts = storedPosts.filter((post) => {
            const id = String(post.id || "");
            const title = String(post.title || post.title_en || post.title_ru || "").toLowerCase();
            if (id.startsWith("obs-")) return false;
            if (id === "hello-world") return false;
            if (title === "hello, world!" || title === "привет, мир!") return false;
            return true;
        });
        const generatedPosts = Array.isArray(generatedBlog?.posts) ? generatedBlog.posts : [];
        const fallbackPosts = generatedPosts.length > 0 ? [] : sampleBlogPosts;

        const mergedPosts = [...generatedPosts, ...manualPosts, ...fallbackPosts]
            .sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0));

        return mergedPosts.map((post) => ({
            ...post,
            author: 'xelvhk',
        }));
    },
    addBlogPost(post) {
        const posts = readFromStorage(STORAGE_KEYS.posts, []);
        const newPost = {
            ...post,
            id: post.id || `post-${Date.now()}`,
            publishedAt: post.publishedAt || new Date().toISOString().slice(0, 10),
            author: post.author || 'xelvhk',
            tags: Array.isArray(post.tags) ? post.tags : [],
        };
        posts.unshift(newPost);
        writeToStorage(STORAGE_KEYS.posts, posts);
        return newPost;
    },
    updateBlogPost(id, updates) {
        const posts = readFromStorage(STORAGE_KEYS.posts, []);
        const idx = posts.findIndex(p => p.id === id);
        if (idx !== -1) {
            posts[idx] = { ...posts[idx], ...updates };
            writeToStorage(STORAGE_KEYS.posts, posts);
            return posts[idx];
        }
        return null;
    },
    deleteBlogPost(id) {
        const posts = readFromStorage(STORAGE_KEYS.posts, []);
        const filtered = posts.filter(p => p.id !== id);
        writeToStorage(STORAGE_KEYS.posts, filtered);
        return true;
    },
};
