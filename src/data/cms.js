// Simple CMS adapter to provide projects/blog data to pages
// Currently proxies to local static lists and can be replaced by real backend later

import { projects as staticProjects } from "../helpers/projectsList";
import generatedBlog from "./blog.generated.json";

const sampleBlogPosts = [];

// Storage helpers
const STORAGE_KEYS = {
    projects: 'cms.projects',
    posts: 'cms.posts',
    githubCache: 'cms.github.projects.cache.v2'
};

const GITHUB_USER = process.env.REACT_APP_GITHUB_USER || 'xelvhk';
const GITHUB_CACHE_TTL_MS = 6 * 60 * 60 * 1000;
const PROJECT_DESCRIPTION_RU = {
    vasya_ai: 'Локальный AI-ассистент для desktop-задач: голосовые команды, автоматизация и развитие агентных сценариев.',
    attendance_bot: 'Telegram-бот для учета посещаемости, реализованный на Aiogram.',
    js_marvel: 'Веб-приложение с персонажами Marvel и загрузкой данных из внешнего API.',
    'login-form-with-animation': 'Анимированная форма авторизации с упором на UI/UX и микроанимации.',
    'http-queries': 'Учебный проект по HTTP-протоколу и сетевым запросам.',
};
const PINNED_REPOS = new Set([
    "vasya_ai",
    "attendance_bot",
    "js_marvel",
    "aboutme",
    "python-tasks-taskbot",
]);

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
    const topics = Array.isArray(repo.topics)
        ? repo.topics.filter(Boolean).map((topic) => String(topic).trim().toLowerCase())
        : [];

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
        pinned: PINNED_REPOS.has(String(repo.name || "").toLowerCase()),
        ...projectCase,
        type: 'site',
    };
}

function shouldIncludeGithubRepo(repo) {
    if (!repo || repo.fork || !repo.name) return false;
    if (repo.name === 'aboutme' || repo.name === 'xelvhk') return false;
    return true;
}

function mergeWithManualProjects(githubProjects) {
    const existing = readFromStorage(STORAGE_KEYS.projects, []);
    const manualProjects = existing.filter((project) => !String(project.id || '').startsWith('gh-'));
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
