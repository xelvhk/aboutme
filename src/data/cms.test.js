const STORAGE_KEYS = {
  projects: 'cms.projects.v2',
  githubCache: 'cms.github.projects.cache.v6',
};

describe('cms.getProjects integration', () => {
  beforeEach(() => {
    jest.resetModules();
    localStorage.clear();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('merges GitHub projects with manual local projects and drops stale gh-* entries', async () => {
    localStorage.setItem(
      STORAGE_KEYS.projects,
      JSON.stringify([
        { id: 'gh-legacy', title: 'Old GH item', type: 'site' },
        { id: 'project-manual-1', title: 'Manual item', type: 'site' },
      ])
    );

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          id: 101,
          name: 'vasya_ai',
          description: 'Local AI assistant',
          language: 'Python',
          topics: ['ai', 'fastapi'],
          html_url: 'https://github.com/xelvhk/vasya_ai',
          homepage: '',
          fork: false,
          pushed_at: '2026-04-24T08:00:00Z',
        },
        {
          id: 102,
          name: 'aboutme',
          description: 'Portfolio site',
          language: 'JavaScript',
          topics: ['react'],
          html_url: 'https://github.com/xelvhk/aboutme',
          homepage: '',
          fork: false,
          pushed_at: '2026-04-23T08:00:00Z',
        },
        {
          id: 103,
          name: 'forked-project',
          description: 'Should be filtered out',
          language: 'TypeScript',
          topics: ['tools'],
          html_url: 'https://github.com/xelvhk/forked-project',
          homepage: '',
          fork: true,
          pushed_at: '2026-04-22T08:00:00Z',
        },
      ],
    });

    const { cms } = require('./cms');
    const result = await cms.getProjects();

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(3);

    expect(result[0]).toMatchObject({
      id: 'gh-101',
      title: 'vasya_ai',
      type: 'site',
      topics: ['ai', 'fastapi'],
      pinned: true,
    });
    expect(result[1]).toMatchObject({
      id: 'gh-102',
      title: 'aboutme',
      type: 'site',
      topics: ['react'],
      pinned: true,
    });
    expect(result[2]).toMatchObject({
      id: 'project-manual-1',
      title: 'Manual item',
      type: 'site',
    });

    const savedProjects = JSON.parse(localStorage.getItem(STORAGE_KEYS.projects));
    expect(savedProjects.map((item) => item.id)).toEqual(['gh-101', 'gh-102', 'project-manual-1']);
  });

  test('pins only selected flagship repositories', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          id: 101,
          name: 'vasya_ai',
          description: 'Local AI assistant',
          language: 'Python',
          topics: ['ai'],
          html_url: 'https://github.com/xelvhk/vasya_ai',
          fork: false,
          pushed_at: '2026-04-24T08:00:00Z',
        },
        {
          id: 102,
          name: 'tajnyj_ded_bot',
          description: 'Secret Santa bot',
          language: 'Python',
          topics: ['telegram'],
          html_url: 'https://github.com/xelvhk/tajnyj_ded_bot',
          fork: false,
          pushed_at: '2026-04-23T08:00:00Z',
        },
        {
          id: 103,
          name: 'aboutme',
          description: 'Portfolio',
          language: 'JavaScript',
          topics: ['react'],
          html_url: 'https://github.com/xelvhk/aboutme',
          fork: false,
          pushed_at: '2026-04-22T08:00:00Z',
        },
        {
          id: 104,
          name: 'attendance_bot',
          description: 'Attendance bot',
          language: 'Python',
          topics: ['telegram'],
          html_url: 'https://github.com/xelvhk/attendance_bot',
          fork: false,
          pushed_at: '2026-04-21T08:00:00Z',
        },
      ],
    });

    const { cms } = require('./cms');
    const result = await cms.getProjects();

    expect(result.filter((item) => item.pinned).map((item) => item.title)).toEqual([
      'vasya_ai',
      'tajnyj_ded_bot',
      'aboutme',
    ]);
  });

  test('deduplicates manual projects that point to the same GitHub repository', async () => {
    localStorage.setItem(
      STORAGE_KEYS.projects,
      JSON.stringify([
        {
          id: 'project-vasya-legacy',
          title: 'vasya_ai',
          gitHubLink: 'https://github.com/xelvhk/vasya_ai',
          pinned: true,
          type: 'site',
        },
        { id: 'project-manual-2', title: 'Manual item', type: 'site' },
      ])
    );

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          id: 101,
          name: 'vasya_ai',
          description: 'Local AI assistant',
          language: 'Python',
          topics: ['ai', 'fastapi'],
          html_url: 'https://github.com/xelvhk/vasya_ai',
          homepage: '',
          fork: false,
          pushed_at: '2026-04-24T08:00:00Z',
        },
      ],
    });

    const { cms } = require('./cms');
    const result = await cms.getProjects();

    expect(result.map((item) => item.id)).toEqual(['gh-101', 'project-manual-2']);
    expect(result.filter((item) => item.title === 'vasya_ai')).toHaveLength(1);
    expect(result[0].img).toBe('/project-previews/vasya_ai.svg');
  });

  test('deduplicates manual projects by title when GitHub URL is absent', async () => {
    localStorage.setItem(
      STORAGE_KEYS.projects,
      JSON.stringify([
        { id: 'project-title-duplicate', title: 'vasya_ai', pinned: true, type: 'site' },
      ])
    );

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          id: 101,
          name: 'vasya_ai',
          description: 'Local AI assistant',
          language: 'Python',
          topics: ['ai', 'fastapi'],
          html_url: 'https://github.com/xelvhk/vasya_ai',
          homepage: '',
          fork: false,
          pushed_at: '2026-04-24T08:00:00Z',
        },
      ],
    });

    const { cms } = require('./cms');
    const result = await cms.getProjects();

    expect(result.map((item) => item.id)).toEqual(['gh-101']);
  });

  test('returns local fallback projects when GitHub request fails', async () => {
    localStorage.setItem(
      STORAGE_KEYS.projects,
      JSON.stringify([{ id: 'project-manual-2', title: 'Local fallback', type: 'site' }])
    );

    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({}),
    });

    const { cms } = require('./cms');
    const result = await cms.getProjects();

    expect(result).toEqual([{ id: 'project-manual-2', title: 'Local fallback', type: 'site' }]);
  });
});
