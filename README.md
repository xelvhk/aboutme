# Alex Khvedchenia Portfolio

Персональное портфолио на React с автоподгрузкой проектов из GitHub и публикацией на GitHub Pages.

## Links
- Production: [https://xelvhk.github.io/aboutme/](https://xelvhk.github.io/aboutme/)
- Repository: [https://github.com/xelvhk/aboutme](https://github.com/xelvhk/aboutme)

## Stack
- React 18
- React Router
- React Bootstrap
- Typewriter Effect
- GitHub Pages (`gh-pages`)

## Features
- Главная страница с информацией обо мне
- Раздел Projects с автоподгрузкой репозиториев с GitHub
- Blog и локальный CMS-адаптер через `localStorage`
- Двуязычность (RU/EN)
- Темная тема

## Project Structure
```text
.
├── public/              # статические файлы CRA
├── src/
│   ├── components/      # UI-компоненты
│   ├── data/            # переводы, CMS-адаптер, данные
│   ├── pages/           # роуты/страницы
│   ├── styles/          # глобальные стили
│   └── utils/           # утилиты
├── ROADMAP.md
└── CHECKLIST.md
```

## Local Development
Requirements:
- Node.js 18+ (рекомендуется)
- npm 9+

Install dependencies:
```bash
npm install
```

Run dev server:
```bash
npm start
```

Build for production:
```bash
npm run build
```

## Deploy to GitHub Pages
Публикация настроена через `gh-pages`.

```bash
npm run deploy
```

Скрипт:
1. собирает проект (`npm run build`)
2. публикует `build/` в ветку `gh-pages`

## Branches
- `main` — исходники проекта (`src`, `public`, конфиги)
- `gh-pages` — ветка публикации (статический билд)

## Roadmap
- План работ: [`ROADMAP.md`](./ROADMAP.md)
- Контроль выполнения: [`CHECKLIST.md`](./CHECKLIST.md)
