import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { Client } from '@notionhq/client';

const args = new Set(process.argv.slice(2));
const includeDrafts = args.has('--include-drafts');

const notionToken = process.env.NOTION_TOKEN;
const databaseId = process.env.NOTION_DATABASE_ID;

if (!notionToken || !databaseId) {
  console.error('Missing NOTION_TOKEN or NOTION_DATABASE_ID in environment.');
  console.error('Example: NOTION_TOKEN=... NOTION_DATABASE_ID=... node scripts/notion-fetch.mjs');
  process.exit(1);
}

const notion = new Client({ auth: notionToken, notionVersion: '2025-09-03' });

const outFile = path.resolve('src/data/posts.json');

const richTextToPlain = (rich = []) => rich.map(rt => rt.plain_text || '').join('');

const richTextToSegments = (rich = []) => rich.map(rt => ({
  text: rt.plain_text || '',
  href: rt.href || null,
  annotations: rt.annotations || {}
}));

const slugify = (text = '') => text
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9\s-]/g, '')
  .replace(/\s+/g, '-')
  .replace(/-+/g, '-');

const fileToUrl = (file) => {
  if (!file) return null;
  if (file.type === 'external') return file.external.url;
  if (file.type === 'file') return file.file.url;
  return null;
};

const getCoverUrls = (page, coverProp) => {
  if (coverProp?.files?.length) {
    return coverProp.files.map(fileToUrl).filter(Boolean);
  }
  if (page.cover) {
    const url = fileToUrl(page.cover);
    return url ? [url] : [];
  }
  return [];
};

const fetchAllBlocks = async (blockId) => {
  const blocks = [];
  let cursor = undefined;
  while (true) {
    const res = await notion.blocks.children.list({ block_id: blockId, start_cursor: cursor });
    blocks.push(...res.results);
    if (!res.has_more) break;
    cursor = res.next_cursor;
  }
  return blocks;
};

const normalizeBlocks = (blocks) => {
  const normalized = [];
  for (const block of blocks) {
    const { type } = block;
    if (!type) continue;

    if (type === 'paragraph') {
      normalized.push({ type, rich_text: richTextToSegments(block.paragraph.rich_text) });
      continue;
    }
    if (type === 'heading_1' || type === 'heading_2' || type === 'heading_3') {
      normalized.push({ type, rich_text: richTextToSegments(block[type].rich_text) });
      continue;
    }
    if (type === 'bulleted_list_item' || type === 'numbered_list_item') {
      normalized.push({ type, rich_text: richTextToSegments(block[type].rich_text) });
      continue;
    }
    if (type === 'quote') {
      normalized.push({ type, rich_text: richTextToSegments(block.quote.rich_text) });
      continue;
    }
    if (type === 'code') {
      normalized.push({
        type,
        language: block.code.language,
        rich_text: richTextToSegments(block.code.rich_text)
      });
      continue;
    }
    if (type === 'image') {
      const img = block.image;
      const url = img.type === 'external' ? img.external.url : img.file?.url;
      normalized.push({ type, url, caption: richTextToSegments(img.caption || []) });
      continue;
    }

    // Unsupported blocks are skipped for now
  }
  return normalized;
};

const extractPlainFromBlocks = (blocks = []) => {
  let text = '';
  for (const block of blocks) {
    if (!block.rich_text) continue;
    text += block.rich_text.map(seg => seg.text).join(' ') + ' ';
  }
  return text.trim();
};

const estimateReadingTime = (text) => {
  const words = text.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return minutes;
};

const fetchDataSourceId = async () => {
  const db = await notion.databases.retrieve({ database_id: databaseId });
  const dataSourceId = db?.data_sources?.[0]?.id;
  if (!dataSourceId) {
    throw new Error('No data source found for the provided database ID.');
  }
  return dataSourceId;
};

const fetchPosts = async () => {
  const dataSourceId = await fetchDataSourceId();
  const pages = [];
  let cursor = undefined;
  while (true) {
    const res = await notion.dataSources.query({
      data_source_id: dataSourceId,
      start_cursor: cursor,
      sorts: [{ property: 'PublishedAt', direction: 'descending' }]
    });
    pages.push(...res.results);
    if (!res.has_more) break;
    cursor = res.next_cursor;
  }

  const posts = [];
  for (const page of pages) {
    const props = page.properties || {};

    const titleProp = props.Title || props.title;
    const slugProp = props.Slug || props.slug;
    const publishedProp = props.Published || props.published;
    const publishedAtProp = props.PublishedAt || props.publishedAt || props.Date;
    const excerptProp = props.Excerpt || props.excerpt;
    const tagsProp = props.Tags || props.tags;
    const coverProp = props.Cover || props.cover;

    const title = titleProp?.title ? richTextToPlain(titleProp.title) : 'Untitled';
    let slug = slugProp?.rich_text ? richTextToPlain(slugProp.rich_text) : '';
    if (!slug) slug = slugify(title);

    const isPublished = publishedProp?.checkbox ?? false;
    if (!includeDrafts && !isPublished) continue;

    const publishedAt = publishedAtProp?.date?.start || null;
    const excerpt = excerptProp?.rich_text ? richTextToPlain(excerptProp.rich_text) : '';
    const tags = tagsProp?.multi_select ? tagsProp.multi_select.map(t => t.name) : [];
    const coverUrls = getCoverUrls(page, coverProp);
    const coverUrl = coverUrls[0] || null;

    const blocks = normalizeBlocks(await fetchAllBlocks(page.id));
    const plain = extractPlainFromBlocks(blocks);
    const readingTime = estimateReadingTime(plain);

    posts.push({
      id: page.id,
      title,
      slug,
      published: isPublished,
      publishedAt,
      excerpt,
      tags,
      coverUrl,
      coverUrls,
      readingTime,
      blocks
    });
  }

  return posts;
};

const main = async () => {
  const posts = await fetchPosts();
  const payload = {
    generatedAt: new Date().toISOString(),
    source: 'notion',
    includeDrafts,
    posts
  };

  await fs.mkdir(path.dirname(outFile), { recursive: true });
  await fs.writeFile(outFile, JSON.stringify(payload, null, 2), 'utf-8');

  console.log(`Wrote ${posts.length} posts to ${outFile}`);
};

main().catch(err => {
  console.error('Failed to fetch Notion posts:', err);
  process.exit(1);
});
