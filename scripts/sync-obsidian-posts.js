#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");

const REPO_ROOT = path.resolve(__dirname, "..");
const DEFAULT_POSTS_DIR = "/Users/oksana/Documents/Obsidian Vault/03_Knowledge/Posts";
const POSTS_DIR = process.env.OBSIDIAN_POSTS_DIR || DEFAULT_POSTS_DIR;
const OUTPUT_FILE = path.join(REPO_ROOT, "src", "data", "blog.generated.json");

function walkMdFiles(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  entries.forEach((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkMdFiles(full, acc);
      return;
    }
    if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
      acc.push(full);
    }
  });
  return acc;
}

function safeRead(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    return "";
  }
}

function parseFrontmatter(raw) {
  if (!raw.startsWith("---")) {
    return { meta: {}, body: raw.trim() };
  }

  const end = raw.indexOf("\n---", 3);
  if (end === -1) {
    return { meta: {}, body: raw.trim() };
  }

  const frontmatter = raw.slice(3, end).trim();
  const body = raw.slice(end + 4).trim();
  const meta = {};
  let currentListKey = null;

  frontmatter.split("\n").forEach((lineRaw) => {
    const line = lineRaw.trimEnd();
    if (!line.trim() || line.trim().startsWith("#")) return;

    const listMatch = line.match(/^\s*-\s+(.+)$/);
    if (listMatch && currentListKey) {
      if (!Array.isArray(meta[currentListKey])) meta[currentListKey] = [];
      meta[currentListKey].push(listMatch[1].trim().replace(/^["']|["']$/g, ""));
      return;
    }

    const keyValMatch = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!keyValMatch) return;

    const key = keyValMatch[1].trim();
    let value = keyValMatch[2].trim();
    currentListKey = null;

    if (!value) {
      currentListKey = key;
      meta[key] = [];
      return;
    }

    value = value.replace(/^["']|["']$/g, "");
    if (value.startsWith("[") && value.endsWith("]")) {
      meta[key] = value
        .slice(1, -1)
        .split(",")
        .map((item) => item.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
      return;
    }

    if (value === "true" || value === "false") {
      meta[key] = value === "true";
      return;
    }

    meta[key] = value;
  });

  return { meta, body };
}

function normalizeTags(tags) {
  if (Array.isArray(tags)) return tags.map((t) => String(t).trim()).filter(Boolean);
  if (typeof tags === "string") {
    return tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }
  return [];
}

function toSlug(input) {
  return String(input || "")
    .toLowerCase()
    .replace(/\.md$/i, "")
    .replace(/[^a-z0-9а-яё_-]+/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function guessDate(fileName, metaDate) {
  if (metaDate) return metaDate;
  const match = fileName.match(/(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : new Date().toISOString().slice(0, 10);
}

function firstSentence(text) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return "";
  const sentence = clean.split(/[.!?](\s|$)/)[0] || clean;
  return sentence.slice(0, 80).trim();
}

function excerpt(text, max = 180) {
  const clean = text
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/`{1,3}[^`]*`{1,3}/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_>~-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max).trim()}...`;
}

function detectLang(relativePath, meta) {
  if (meta.lang) return String(meta.lang).toLowerCase();
  const normalized = relativePath.replace(/\\/g, "/");
  if (normalized.startsWith("ru/")) return "ru";
  if (normalized.startsWith("en/")) return "en";
  return "en";
}

function keyFromRelative(relativePath, meta) {
  if (meta.slug) return toSlug(meta.slug);
  const normalized = relativePath.replace(/\\/g, "/");
  const parts = normalized.split("/");
  if (parts.length > 1 && (parts[0] === "ru" || parts[0] === "en")) {
    return toSlug(parts.slice(1).join("/"));
  }
  return toSlug(normalized);
}

function buildBilingualPosts(items) {
  const grouped = new Map();
  const duplicateKeys = [];

  items.forEach((item) => {
    const prev = grouped.get(item.key) || { key: item.key };
    if (prev[item.lang]) {
      duplicateKeys.push(`${item.key}:${item.lang}`);
    }
    prev[item.lang] = item;
    grouped.set(item.key, prev);
  });

  const posts = [];
  for (const group of grouped.values()) {
    const ru = group.ru;
    const en = group.en;
    const base = ru || en;
    if (!base) continue;

    const tags = Array.from(new Set(normalizeTags([...(ru?.tags || []), ...(en?.tags || [])])));
    const date = guessDate(base.fileName, ru?.date || en?.date);
    const titleRu = ru?.title || en?.title || "Новый пост";
    const titleEn = en?.title || ru?.title || "New post";
    const contentRu = ru?.content || en?.content || "";
    const contentEn = en?.content || ru?.content || "";

    posts.push({
      id: `obs-${base.key}`,
      slug: base.key,
      source: "obsidian",
      sourceFile: base.relativePath.replace(/\\/g, "/"),
      title: titleEn,
      title_en: titleEn,
      title_ru: titleRu,
      excerpt: excerpt(contentEn || contentRu),
      excerpt_en: en?.excerpt || excerpt(contentEn || contentRu),
      excerpt_ru: ru?.excerpt || excerpt(contentRu || contentEn),
      content: contentEn || contentRu,
      content_en: contentEn,
      content_ru: contentRu,
      author: "xelvhk",
      publishedAt: date,
      tags,
      featured: Boolean(ru?.featured || en?.featured),
      image: ru?.image || en?.image || "",
      has_ru: Boolean(ru),
      has_en: Boolean(en),
    });
  }

  return {
    posts: posts.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)),
    duplicateKeys,
  };
}

function stablePayload(payload) {
  const { generatedAt, ...stable } = payload;
  return stable;
}

function readExistingPayload() {
  try {
    return JSON.parse(fs.readFileSync(OUTPUT_FILE, "utf8"));
  } catch (error) {
    return null;
  }
}

function writePayloadIfChanged(payload) {
  const existing = readExistingPayload();
  if (existing && JSON.stringify(stablePayload(existing)) === JSON.stringify(stablePayload(payload))) {
    console.log(`Generated ${payload.posts.length} posts -> ${OUTPUT_FILE} (unchanged)`);
    if (payload.reason) console.log(payload.reason);
    return;
  }

  fs.writeFileSync(OUTPUT_FILE, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  console.log(`Generated ${payload.posts.length} posts -> ${OUTPUT_FILE}`);
  if (payload.reason) console.log(payload.reason);
}

function main() {
  let posts = [];
  let reason = "";

  if (!fs.existsSync(POSTS_DIR)) {
    reason = `Posts dir not found: ${POSTS_DIR}`;
    if (fs.existsSync(OUTPUT_FILE)) {
      console.log(`Skipped blog sync -> ${OUTPUT_FILE} (kept existing generated data)`);
      console.log(reason);
      return;
    }
  } else {
    const files = walkMdFiles(POSTS_DIR);
    const parsed = files.map((absolutePath) => {
      const raw = safeRead(absolutePath);
      const { meta, body } = parseFrontmatter(raw);
      const relativePath = path.relative(POSTS_DIR, absolutePath);
      const fileName = path.basename(absolutePath);
      const lang = detectLang(relativePath, meta);
      const key = keyFromRelative(relativePath, meta);
      const inferredTitle = firstSentence(body) || fileName.replace(/\.md$/i, "");
      return {
        key,
        lang,
        fileName,
        relativePath,
        title: meta.title || inferredTitle,
        excerpt: meta.excerpt || excerpt(body),
        content: body,
        tags: normalizeTags(meta.tags),
        date: meta.date || meta.publishedAt,
        featured: Boolean(meta.featured),
        image: meta.cover || meta.image || "",
        draft: Boolean(meta.draft),
      };
    });

    const built = buildBilingualPosts(parsed.filter((p) => !p.draft));
    posts = built.posts;
    if (built.duplicateKeys.length > 0) {
      reason = `Duplicate slug/lang detected: ${built.duplicateKeys.join(", ")}`;
    }
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    sourceDir: POSTS_DIR,
    count: posts.length,
    reason,
    posts,
  };

  writePayloadIfChanged(payload);
}

main();
