// Simple CMS adapter to provide projects/blog data to pages
// Currently proxies to local static lists and can be replaced by real backend later

import { projects as staticProjects } from "../helpers/projectsList";
import postImage from "../img/post.jpg";

const sampleBlogPosts = [
    {
        id: 'hello-world',
        title: 'Hello, world!',
        excerpt: 'My first post on blog.',
        content: `# Rebuilding my portfolio\n\nI recently rebuilt my portfolio using React and a few handy libraries...\n\n## Highlights\n- React 18\n- React Bootstrap\n- Custom i18n\n\n\`Code\` samples and more coming soon.`,
        author: 'Alex',
        publishedAt: '2024-06-01',
        tags: ['react', 'portfolio', 'i18n'],
        featured: true,
        image: postImage,
    },
];

// Storage helpers
const STORAGE_KEYS = {
    projects: 'cms.projects',
    posts: 'cms.posts',
    githubCache: 'cms.github.projects.cache'
};

const GITHUB_USER = 'xelvhk';
const GITHUB_CACHE_TTL_MS = 6 * 60 * 60 * 1000;

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

function formatGithubRepo(repo) {
    const skills = [];

    if (repo.language) {
        skills.push(repo.language);
    }

    if (Array.isArray(repo.topics) && repo.topics.length > 0) {
        repo.topics.slice(0, 3).forEach((topic) => skills.push(topic));
    }

    return {
        id: `gh-${repo.id}`,
        title: repo.name || '',
        title_en: repo.name || '',
        title_ru: repo.name || '',
        description: repo.description || '',
        description_en: repo.description || '',
        description_ru: repo.description || '',
        skills: skills.join(', '),
        gitHubLink: repo.html_url || '',
        liveLink: repo.homepage || '',
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
        return readFromStorage(STORAGE_KEYS.posts, []);
    },
    addBlogPost(post) {
        const posts = readFromStorage(STORAGE_KEYS.posts, []);
        const newPost = {
            ...post,
            id: post.id || `post-${Date.now()}`,
            publishedAt: post.publishedAt || new Date().toISOString().slice(0, 10),
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

