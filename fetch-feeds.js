/**
 * fetch-feeds.js
 * Grabs positive-news RSS feeds, turns each item into an Eleventy Markdown post.
 * Run locally with:  node fetch-feeds.js
 * GitHub Action will run it automatically each day.
 */
import fs          from "fs";
import path        from "path";
import Parser      from "rss-parser";        // npm install rss-parser
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FEEDS     = JSON.parse(fs.readFileSync(path.join(__dirname, "feeds.json")));
const OUT_DIR   = path.join(__dirname, "src/posts");
const parser    = new Parser({ timeout: 10000 });     // 10-second fetch timeout
const utcNow    = new Date();
const DAY_MS    = 24 * 60 * 60 * 1000;

// ensure output folder exists
fs.mkdirSync(OUT_DIR, { recursive: true });

/** Helper: sanitize filename */
const slugify = str =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);

const fetchAll = async () => {
  const seen = new Set();         // dedupe by original link
  for (const { url, category } of FEEDS) {
    try {
      const feed = await parser.parseURL(url);
      feed.items.forEach(item => {
        if (!item.link || seen.has(item.link)) return;
        seen.add(item.link);

        const pubDate = item.isoDate ? new Date(item.isoDate) : utcNow;
        if (utcNow - pubDate > DAY_MS) return;              // older than 24 h – skip

        const title   = item.title?.trim() || "Untitled";
        const excerpt = (item.contentSnippet || item.content || "")
                          .replace(/\s+/g, " ")
                          .split(" ").slice(0, 60).join(" ") + "…";

        // basic image scrape
        const img = item.enclosure?.url ||
                    (item.media && item.media.content && item.media.content.url) ||
                    "";

        const y = pubDate.getUTCFullYear();
        const m = String(pubDate.getUTCMonth() + 1).padStart(2, "0");
        const d = String(pubDate.getUTCDate()).padStart(2, "0");

        const fileName = `${y}-${m}-${d}-${slugify(title)}.md`;
        const filePath = path.join(OUT_DIR, fileName);

        const frontMatter = `---
title: "${title.replace(/"/g, "'")}"
date: ${pubDate.toISOString()}
category: ${category}
externalLink: "${item.link}"
image: "${img}"
excerpt: "${excerpt.replace(/"/g, "'")}"
---`;

        fs.writeFileSync(filePath, frontMatter);
        console.log("✓", title);
      });
    } catch (err) {
      console.error("Feed failed:", url, err.message);
    }
  }
};

fetchAll();
