# SEO manual follow-up checklist

External steps that cannot be done from this repository. Nothing here is
automated or performed by code changes — each item is a manual action in an
external dashboard. This checklist records work to do; it does not claim that
the live domain or any external dashboard has been inspected or changed.

## 1. Google Search Console

- [ ] Add the **Domain property** `josemianton.com` (not a URL-prefix property)
      and verify it with the DNS TXT record provided by Google, via Cloudflare.
      A Domain property covers all protocols and subdomains, including the apex
      domain and `www`.
- [ ] Submit `https://www.josemianton.com/sitemap-index.xml` under **Sitemaps**.
- [ ] Use **URL Inspection** on `https://www.josemianton.com/` after setup and,
      if it is not indexed, request initial indexing once.
- [ ] Monitor the **Pages** report for persistent discovery, crawl or indexing
      problems and investigate the reported cause. Routine updates should be
      discovered through the sitemap and normal recrawling rather than repeated
      manual indexing requests.

## 2. Bing Webmaster Tools

- [ ] Register at bing.com/webmasters (can import sites/signals from Google
      Search Console).
- [ ] Submit `https://www.josemianton.com/sitemap-index.xml`.
- [ ] Use the URL submission tool for the homepage once.

## 3. Cloudflare dashboard

- [ ] **Apex → www redirect:** check the live response for both
      `josemianton.com` and `www.josemianton.com`. If the apex serves the same
      content with `200`, add a Cloudflare Redirect Rule from the apex to
      `https://www.josemianton.com`, using `301` and preserving the path and
      query. The canonical tag helps consolidate signals, but does not replace
      the redirect.
- [ ] **AI Crawl Control:** review the current crawl settings for the zone and
      confirm which AI crawlers are allowed or blocked.
- [ ] **Search-oriented crawler controls:** decide whether to allow
      `OAI-SearchBot`, `PerplexityBot`, and `Claude-SearchBot` based on the
      desired visibility in AI-assisted search. Check current vendor guidance
      before changing zone controls.
- [ ] **Training and data-collection controls:** make a separate policy choice
      for crawlers such as `GPTBot` and `ClaudeBot`. `CCBot` is Common Crawl's
      collection/archive crawler; its corpus can feed downstream datasets, but
      allowing it is not required for direct AI-search visibility.
- [ ] Confirm no zone-level **X-Robots-Tag** or WAF/rate-limit rule is
      challenging verified search crawlers. The zone can add headers or rules
      that repository inspection cannot reveal.

## 4. External profile consistency

Reciprocal links confirm identity to search engines and recruiters:

- [ ] LinkedIn: profile website field links to `https://josemianton.com`
      (or `https://www.josemianton.com`) with the same job title used on the
      site ("Senior Frontend Engineer").
- [ ] GitHub: profile README or bio website field links to the site.
- [ ] SEEK: headline/summary consistent with "Senior Frontend Engineer,
      Sydney".
- [ ] Confirm each external profile uses the same name spelling and job title
      as the site so entity matching stays unambiguous.

## Repo-side status

- `robots.txt`: `User-agent: * / Allow: /` + sitemap declaration permits
  general crawling; no per-crawler additions are needed in the repository.
- No `noindex`, `X-Robots-Tag`, or duplicate canonicals in the repo.
- Sitemap: `lastmod` removed (it was a build timestamp that changed on every
  deploy); the sitemap lists canonical URLs without unsupported freshness
  signals.
- The metadata references
  `https://cdn.josemianton.com/images/profile.jpg`; confirm the deployed asset
  separately when performing the live checks.
