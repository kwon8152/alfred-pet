// =========================================================
//  Alfred Journal — GitHub-as-CMS minimal blog
//  - Lists markdown posts from /posts/ via GitHub Contents API
//  - Renders an individual post with marked.js
//  - Frontmatter: minimal YAML subset (title, date, excerpt,
//    cover, author, tags, lang, draft)
// =========================================================

const REPO_OWNER = 'kwon8152';
const REPO_NAME = 'alfred-pet';
const REPO_BRANCH = 'master';
const POSTS_DIR = 'posts';

// ----- Frontmatter parser (minimal, no external lib) -----
function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) return { meta: {}, body: raw };
  const metaBlock = m[1];
  const body = m[2];
  const meta = {};
  metaBlock.split(/\r?\n/).forEach(line => {
    const kv = line.match(/^([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
    if (!kv) return;
    const key = kv[1].trim();
    let val = kv[2].trim();
    // strip surrounding quotes
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    // array: [a, b, c]
    if (val.startsWith('[') && val.endsWith(']')) {
      val = val.slice(1, -1).split(',').map(s => s.trim()).filter(Boolean);
    }
    // boolean
    if (val === 'true') val = true;
    else if (val === 'false') val = false;
    meta[key] = val;
  });
  return { meta, body };
}

// ----- Helpers -----
function fmtDate(s, lang) {
  if (!s) return '';
  const d = new Date(s);
  if (isNaN(d)) return s;
  if (lang === 'en') {
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

function readingTime(text, lang) {
  // count Korean chars + English words
  const koChars = (text.match(/[ㄱ-힝]/g) || []).length;
  const enWords = (text.match(/[A-Za-z]+/g) || []).length;
  // 600 KR chars/min, 250 EN words/min
  const minutes = Math.max(1, Math.round(koChars / 600 + enWords / 250));
  return lang === 'en' ? `${minutes} min read` : `${minutes}분 분량`;
}

function tBlog(key, fallback) {
  try {
    const cur = (typeof I18n !== 'undefined' && I18n.current) || 'ko';
    return (translations[cur] && translations[cur][key]) || fallback;
  } catch (_) {
    return fallback;
  }
}

function rawUrl(filename) {
  return `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${REPO_BRANCH}/${POSTS_DIR}/${filename}`;
}

function slugFromFilename(name) {
  return name.replace(/\.md$/i, '');
}

// ----- 1) Blog index page -----
async function renderBlogIndex(container) {
  const lang = (typeof I18n !== 'undefined' && I18n.current) || 'ko';
  container.innerHTML = `<p class="blog-loading">${tBlog('blog.loading', '글 목록을 불러오는 중...')}</p>`;

  let files;
  try {
    const apiUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${POSTS_DIR}?ref=${REPO_BRANCH}`;
    const res = await fetch(apiUrl, { headers: { Accept: 'application/vnd.github+json' } });
    if (!res.ok) throw new Error('api ' + res.status);
    files = await res.json();
  } catch (e) {
    container.innerHTML = `<p class="blog-error">${tBlog('blog.error', '글 목록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.')}</p>`;
    return;
  }

  // filter: .md, exclude underscore prefix (templates / drafts)
  const mdFiles = files.filter(f =>
    f.type === 'file' &&
    /\.md$/i.test(f.name) &&
    !f.name.startsWith('_') &&
    f.name.toLowerCase() !== 'readme.md'
  );

  if (mdFiles.length === 0) {
    container.innerHTML = `<p class="blog-empty">${tBlog('blog.empty', '아직 발행된 글이 없습니다.')}</p>`;
    return;
  }

  // fetch all posts' raw content in parallel for metadata + excerpt
  const posts = await Promise.all(mdFiles.map(async f => {
    try {
      const r = await fetch(rawUrl(f.name), { cache: 'no-cache' });
      if (!r.ok) return null;
      const text = await r.text();
      const { meta, body } = parseFrontmatter(text);
      if (meta.draft === true) return null;
      return {
        slug: slugFromFilename(f.name),
        filename: f.name,
        meta,
        body,
      };
    } catch (_) {
      return null;
    }
  }));

  const validPosts = posts
    .filter(Boolean)
    .sort((a, b) => {
      const da = new Date(a.meta.date || 0).getTime();
      const db = new Date(b.meta.date || 0).getTime();
      return db - da;
    });

  if (validPosts.length === 0) {
    container.innerHTML = `<p class="blog-empty">${tBlog('blog.empty', '아직 발행된 글이 없습니다.')}</p>`;
    return;
  }

  container.innerHTML = validPosts.map((p, i) => {
    const cover = p.meta.cover || '/images/eticat-hero.jpg';
    const title = p.meta.title || p.slug;
    const date = fmtDate(p.meta.date, lang);
    const excerpt = p.meta.excerpt || p.body.replace(/[#>*`_!\[\]\(\)]/g, '').trim().slice(0, 120) + '…';
    const tags = Array.isArray(p.meta.tags) ? p.meta.tags : (p.meta.tags ? [p.meta.tags] : []);
    const delayClass = i < 4 ? ` reveal-delay-${i}` : '';
    return `
      <article class="post-card reveal${delayClass}">
        <a href="post.html?slug=${encodeURIComponent(p.slug)}" class="post-card-link">
          <div class="post-card-cover">
            <img src="${cover}" alt="${title}" loading="lazy" />
          </div>
          <div class="post-card-body">
            <p class="post-card-meta">
              <time datetime="${p.meta.date || ''}">${date}</time>
              ${tags.length ? ` · <span class="post-card-tags">${tags.join(' · ')}</span>` : ''}
            </p>
            <h3 class="post-card-title">${title}</h3>
            <p class="post-card-excerpt">${excerpt}</p>
            <span class="post-card-more">${tBlog('blog.readMore', '읽기 →')}</span>
          </div>
        </a>
      </article>
    `;
  }).join('');

  // trigger reveal animation for cards just added
  if (window.IntersectionObserver) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    container.querySelectorAll('.reveal').forEach(el => io.observe(el));
  } else {
    container.querySelectorAll('.reveal').forEach(el => el.classList.add('in-view'));
  }
}

// ----- 2) Single post page -----
async function renderBlogPost(container, slug) {
  const lang = (typeof I18n !== 'undefined' && I18n.current) || 'ko';
  if (!slug || !/^[\w\-.]+$/.test(slug)) {
    container.innerHTML = `<p class="blog-error">${tBlog('blog.invalidSlug', '잘못된 글 주소입니다.')}</p>`;
    return;
  }

  container.innerHTML = `<p class="blog-loading">${tBlog('blog.loading', '글을 불러오는 중...')}</p>`;

  let raw;
  try {
    const r = await fetch(rawUrl(slug + '.md'), { cache: 'no-cache' });
    if (!r.ok) throw new Error('raw ' + r.status);
    raw = await r.text();
  } catch (_) {
    container.innerHTML = `
      <p class="blog-error">${tBlog('blog.notFound', '글을 찾을 수 없습니다.')}</p>
      <p><a href="index.html" class="btn btn-ghost">${tBlog('blog.backToList', '← 목록으로')}</a></p>
    `;
    return;
  }

  const { meta, body } = parseFrontmatter(raw);
  const title = meta.title || slug;
  const date = fmtDate(meta.date, lang);
  const cover = meta.cover || '';
  const author = meta.author || '알프래드';
  const tags = Array.isArray(meta.tags) ? meta.tags : (meta.tags ? [meta.tags] : []);

  // update document head for SEO + social
  document.title = `${title} — Alfred Journal`;
  const setMeta = (sel, attr, val) => {
    const el = document.querySelector(sel);
    if (el) el.setAttribute(attr, val);
  };
  if (meta.excerpt) {
    setMeta('meta[name="description"]', 'content', meta.excerpt);
    setMeta('meta[property="og:description"]', 'content', meta.excerpt);
    setMeta('meta[name="twitter:description"]', 'content', meta.excerpt);
  }
  setMeta('meta[property="og:title"]', 'content', title);
  setMeta('meta[name="twitter:title"]', 'content', title);
  if (cover) {
    const absCover = cover.startsWith('http') ? cover : `https://alfred.pet${cover}`;
    setMeta('meta[property="og:image"]', 'content', absCover);
    setMeta('meta[name="twitter:image"]', 'content', absCover);
  }
  setMeta('meta[property="og:type"]', 'content', 'article');

  // configure marked
  if (typeof marked !== 'undefined') {
    marked.setOptions({ gfm: true, breaks: false, headerIds: true, mangle: false });
  }
  const html = (typeof marked !== 'undefined')
    ? marked.parse(body)
    : `<pre>${body.replace(/[<>&]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]))}</pre>`;

  container.innerHTML = `
    <header class="post-header reveal">
      <p class="post-meta">
        <time datetime="${meta.date || ''}">${date}</time>
        ${author ? ` · <span>${author}</span>` : ''}
        ${tags.length ? ` · <span class="post-tags">${tags.join(' · ')}</span>` : ''}
        · <span>${readingTime(body, lang)}</span>
      </p>
      <h1 class="post-title">${title}</h1>
      ${meta.excerpt ? `<p class="post-lede">${meta.excerpt}</p>` : ''}
      ${cover ? `<div class="post-cover"><img src="${cover}" alt="${title}" /></div>` : ''}
    </header>
    <div class="post-body reveal reveal-delay-1">${html}</div>
    <footer class="post-footer reveal reveal-delay-2">
      <a href="index.html" class="btn btn-ghost">${tBlog('blog.backToList', '← 목록으로')}</a>
      <a href="/#contact" class="btn btn-primary">${tBlog('blog.contactCta', '알프래드에 연락하기')}</a>
    </footer>
  `;

  if (window.IntersectionObserver) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -4% 0px' });
    container.querySelectorAll('.reveal').forEach(el => io.observe(el));
  } else {
    container.querySelectorAll('.reveal').forEach(el => el.classList.add('in-view'));
  }
}

// ----- Bootstrap -----
document.addEventListener('DOMContentLoaded', () => {
  const indexMount = document.getElementById('blog-list');
  if (indexMount) {
    renderBlogIndex(indexMount);
  }
  const postMount = document.getElementById('blog-post');
  if (postMount) {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug');
    renderBlogPost(postMount, slug);
  }
});
