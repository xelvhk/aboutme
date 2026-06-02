# aboutme

Портфолио разработчика с автосинхронизацией GitHub-проектов, двуязычным контентом (RU/EN) и деплоем на GitHub Pages.

## Проблема
- Портфолио быстро устаревает, если обновлять проекты вручную.
- Блог и проекты часто требуют дублирования контента в разных местах.
- Нужен единый UX для desktop и mobile без ручной пересборки структуры.

## Стек
- React 18, React Router
- React Bootstrap
- CMS-адаптер на LocalStorage
- Синхронизация с GitHub API + локальный fallback
- GitHub Pages (`gh-pages`)

## Setup
```bash
git clone https://github.com/xelvhk/aboutme.git
cd aboutme
npm install
cp .env.example .env
npm start
```

`.env.example`:
```env
REACT_APP_GITHUB_USER=xelvhk
```

## Архитектура
- `src/components/macos/*`: desktop shell, topbar, widgets, window system.
- `src/pages/projects.jsx`: список проектов из GitHub, фильтры по темам/категориям, pinned карточки.
- `src/components/blog/blog.jsx`: рендер markdown-постов с санитизацией.
- `src/data/cms.js`: адаптеры данных для GitHub + кеш LocalStorage.
- `scripts/sync-obsidian-posts.js`: синхронизация постов из Obsidian в `src/data/blog.generated.json`.

## Превью проектов
Карточки GitHub-проектов используют локальные изображения, если они есть.

Добавьте WebP-файл в `public/project-previews/` с названием репозитория:

```text
public/project-previews/vasya_ai.webp
public/project-previews/tajnyj_ded_bot.webp
public/project-previews/aboutme.webp
```

Если изображения нет или оно не загрузилось, карточка покажет стандартную заглушку.

## Demo
- Прод: [https://xelvhk.github.io/aboutme/](https://xelvhk.github.io/aboutme/)
- Home  
![Home screenshot](docs/screenshots/home.png)
- Projects  
![Projects screenshot](docs/screenshots/projects.png)
- Blog  
![Blog screenshot](docs/screenshots/blog.png)

## Roadmap
- [ ] Добавить server-backed admin panel для медиа и метаданных блога.
- [ ] Добавить visual regression snapshot checks в CI.
- [ ] Поднять Lighthouse mobile score (image pipeline + route-level code split).

## Статус
Active development

## CI
- `npm ci`
- `npm run build`

## Лицензия
GNU AGPLv3. См. [LICENSE](LICENSE).
