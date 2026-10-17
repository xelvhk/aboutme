import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import Projects from './projects';
import { cms } from '../data/cms';

jest.mock('../data/cms', () => ({ cms: { getProjects: jest.fn() } }));
jest.mock('../data/translations', () => ({
  useTranslation: () => ({ t: (key) => key, language: 'en' }),
}));

let container;
let root;
global.IS_REACT_ACT_ENVIRONMENT = true;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  cms.getProjects.mockResolvedValue([
    { id: 1, title: 'Pinned React', description: 'Pinned React UI', topics: ['react'], pinned: true, type: 'site' },
    { id: 2, title: 'Pinned Python', description: 'Pinned Python API', topics: ['python'], pinned: true, type: 'site' },
    { id: 3, title: 'Regular React', description: 'Regular React UI', topics: ['react'], type: 'site' },
  ]);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  jest.clearAllMocks();
});

test('filters pinned and regular projects together and shows an empty state', async () => {
  await act(async () => {
    root.render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><Projects /></MemoryRouter>);
  });

  await act(async () => {
    [...container.querySelectorAll('button')].find((button) => button.textContent === 'react').click();
  });

  expect(container.textContent).toContain('Pinned React UI');
  expect(container.textContent).toContain('Regular React UI');
  expect(container.textContent).not.toContain('Pinned Python API');

  await act(async () => {
    [...container.querySelectorAll('button')].find((button) => button.textContent === 'projects.categoryTelegram').click();
  });

  expect(container.textContent).not.toContain('Pinned React UI');
  expect(container.textContent).not.toContain('Regular React UI');
  expect(container.textContent).toContain('projects.noProjects');
});
