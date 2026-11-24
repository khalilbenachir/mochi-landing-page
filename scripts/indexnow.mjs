// Tells IndexNow (Bing, Yandex, Seznam, Naver…) which pages changed, so they are
// recrawled within minutes instead of waiting for the next sitemap read.
//
//   node scripts/indexnow.mjs          → URLs whose sitemap <lastmod> is recent
//   node scripts/indexnow.mjs --all    → every URL in the sitemap (first run, big refreshes)
//   node scripts/indexnow.mjs --dry-run
//
// The key below is public by design: IndexNow verifies it at
// https://<host>/<key>.txt, which is served from public/.

const KEY = "00ec18f6a6adcf5b911b01d93aeac1a1";
const SITE_URL = (process.env.INDEXNOW_SITE_URL ?? "https://mochiii.app").replace(/\/$/, "");
const RECENT_DAYS = Number(process.env.INDEXNOW_RECENT_DAYS ?? 3);
const ENDPOINT = "https://api.indexnow.org/indexnow";
const MAX_URLS = 10_000;

const args = new Set(process.argv.slice(2));
const submitAll = args.has("--all");
const dryRun = args.has("--dry-run");

/** Reads every <url> entry of the sitemap as { loc, lastmod }. */
export function parseSitemap(xml) {
  return [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, block]) => ({
    loc: block.match(/<loc>\s*([^<\s]+)\s*<\/loc>/)?.[1],
    lastmod: block.match(/<lastmod>\s*([^<\s]+)\s*<\/lastmod>/)?.[1],
  }));
}

/** Keeps the URLs to submit: all of them, or only those modified in the last `days`. */
export function selectUrls(entries, { all, days, now = new Date() }) {
  const cutoff = now.getTime() - days * 24 * 60 * 60 * 1000;
  return entries
    .filter(({ loc }) => Boolean(loc))
    .filter(({ lastmod }) => all || (lastmod !== undefined && Date.parse(lastmod) >= cutoff))
    .map(({ loc }) => loc)
    .slice(0, MAX_URLS);
}

async function main() {
  const sitemapResponse = await fetch(`${SITE_URL}/sitemap.xml`);
  if (!sitemapResponse.ok) throw new Error(`Sitemap request failed: ${sitemapResponse.status}`);

  const urls = selectUrls(parseSitemap(await sitemapResponse.text()), { all: submitAll, days: RECENT_DAYS });
  if (urls.length === 0) {
    console.log(`IndexNow: no URL modified in the last ${RECENT_DAYS} days, nothing to submit.`);
    return;
  }

  const keyResponse = await fetch(`${SITE_URL}/${KEY}.txt`);
  if (!keyResponse.ok || (await keyResponse.text()).trim() !== KEY) {
    throw new Error(`Key file ${SITE_URL}/${KEY}.txt is not live yet.`);
  }

  console.log(`IndexNow: ${urls.length} URL(s)${dryRun ? " (dry run)" : ""}`);
  urls.forEach((url) => console.log(`  ${url}`));
  if (dryRun) return;

  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: new URL(SITE_URL).host,
      key: KEY,
      keyLocation: `${SITE_URL}/${KEY}.txt`,
      urlList: urls,
    }),
  });

  // 200 = accepted, 202 = accepted while the key is still being verified.
  if (response.status !== 200 && response.status !== 202) {
    throw new Error(`IndexNow rejected the submission: ${response.status} ${await response.text()}`);
  }
  console.log(`IndexNow: submitted (HTTP ${response.status}).`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
