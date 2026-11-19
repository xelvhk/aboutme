import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import AiStudio from './aiStudio';
import instagramPosts from '../data/aiStudioInstagram.json';

jest.mock('../data/aiStudioInstagram.json', () => []);

jest.mock('../data/translations', () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

afterEach(() => {
  instagramPosts.length = 0;
});

test('links to the Instagram profile when there are no posts', () => {
  const markup = renderToStaticMarkup(<AiStudio />);

  expect(markup).toContain('href="https://www.instagram.com/xelvhk_ai/"');
  expect(markup).toContain('aiStudio.noPosts');
  expect(markup).not.toContain('<iframe');
});

test('embeds configured public posts and reels and links to their originals', () => {
  instagramPosts.push(
    'https://www.instagram.com/reel/Reel_1/?igsh=example',
    'https://instagram.com/p/Post-2',
    'https://www.instagram.com.example.com/p/Fake/',
    'https://www.instagram.com/xelvhk_ai/'
  );

  const markup = renderToStaticMarkup(<AiStudio />);

  expect(markup.match(/<iframe/g)).toHaveLength(2);
  expect(markup).toContain('src="https://www.instagram.com/reel/Reel_1/embed/"');
  expect(markup).toContain('src="https://www.instagram.com/p/Post-2/embed/"');
  expect(markup).toContain('href="https://www.instagram.com/reel/Reel_1/"');
  expect(markup).not.toContain('igsh=');
  expect(markup).not.toContain('aiStudio.noPosts');
});
