# Obsidian Blog Frontmatter Template

Папка для постов:

- `03_Knowledge/Posts/ru/`
- `03_Knowledge/Posts/en/`

Файлы с одинаковым именем в `ru` и `en` объединяются в один билингвальный пост на сайте.

## RU template

```md
---
title: "Заголовок поста"
date: "2026-05-26"
tags: [ai, portfolio, devlog]
featured: false
draft: false
image: ""
---

Текст поста на русском...
```

## EN template

```md
---
title: "Post title"
date: "2026-05-26"
tags: [ai, portfolio, devlog]
featured: false
draft: false
image: ""
---

Post text in English...
```

## Notes

- `date` — формат `YYYY-MM-DD`.
- `tags` — массив или строка через запятую.
- `draft: true` — пост не попадет на сайт.
- `image` — URL или относительный путь до изображения.
- Если `title` не указан, заголовок будет взят из первой строки текста.
