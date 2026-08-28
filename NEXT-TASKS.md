# 📝 Next Tasks

## Current Status

✅ **Project Status**: Stable; maintenance refreshed in August 2026

## Completed

- [x] AI collaboration rules via AGENTS.md (+ inherited personal-ai-assistant rules)
- [x] R2 asset processor configuration (canonical core/cli/test layout, manifest v2)
- [x] CDN delivery via cdn.josemianton.com
- [x] TypeScript strict mode
- [x] Semantic structure, keyboard-operable controls, and descriptive image alt text
- [x] Tailwind v4 migration fixes (grid layouts, CSS-variable utilities)
- [x] Worker hardening (method checks, HEAD, directory markers, Save-Data downgrade)
- [x] Unit tests for the asset pipeline and Worker helpers

## Ongoing Maintenance

### Regular Tasks
- **Content Updates**: Update experience, skills, and projects as needed
- **Asset Optimization**: Run `pnpm run assets:sync` when adding new images
- **Dependencies**: Review quarterly (`pnpm outdated` and `pnpm audit --prod`)
- **API Keys**: Rotate R2 credentials quarterly
- **Storage Monitoring**: Check `pnpm run assets:status` monthly

### Before Each Deployment
1. Run `pnpm type-check` - Ensure no TypeScript errors
2. Run `pnpm lint` - Maintain code quality
3. Run `pnpm build` - Verify production build succeeds
4. Run `pnpm run assets:sync` - Upload latest optimized images
5. Run `pnpm preview` - Test production build locally
6. Run `pnpm deploy` - Deploy to Cloudflare Workers

## Future Enhancements (Optional)

### Content
- [ ] Add case studies or detailed project descriptions
- [ ] Include testimonials or recommendations
- [ ] Add blog section for technical articles
- [ ] Create downloadable resume PDF

### Technical
- [ ] Implement analytics (privacy-focused)
- [ ] Add contact form with spam protection
- [ ] Implement newsletter signup
- [ ] Add RSS feed for blog content
- [ ] Set up automated testing (Playwright/Cypress)

### Performance
- [ ] Optimize web fonts loading
- [ ] Implement service worker for offline support
- [ ] Add prefetching for critical resources
- [ ] Monitor Core Web Vitals

### Accessibility
- [ ] Add skip navigation links
- [ ] Add reduced motion preferences
- [ ] Test with screen readers (NVDA, JAWS, VoiceOver)

---

**Note**: This file tracks project tasks and priorities. Update it as new objectives emerge or are completed.
