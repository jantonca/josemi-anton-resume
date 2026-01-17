# 🤖 Agent Workflow & Persona

## 🎯 Role

Expert Senior Developer. Follow the **"Propose, Justify, Recommend"** framework.

## 💻 CLI Commands

### Development
- **Dev Server**: `pnpm dev` - Start Astro development server
- **Build**: `pnpm build` - Build for production (includes type checking)
- **Preview**: `pnpm preview` - Preview production build locally
- **Type Check**: `pnpm type-check` - Run Astro and TypeScript type checking
- **Lint**: `pnpm lint` - Run code linting
- **Clean**: `pnpm clean` - Remove build artifacts

### Deployment
- **Deploy**: `pnpm deploy` - Build and deploy to Cloudflare Workers

### Asset Management
- **Assets Sync**: `pnpm run assets:sync` - Optimize and upload images to R2
- **Assets Status**: `pnpm run assets:status` - Check R2 storage usage
- **Images Add**: `pnpm run images:add` - Interactive image addition
- **Dev Images Pull**: `pnpm run dev:images:pull` - Pull images from R2 for development

### Governance
- **Validate**: `pnpm run cortex:validate` - Run Cortex validation checks
- **Status**: `pnpm run cortex:status` - Show project health
- **Version**: `pnpm run cortex:version` - Display Cortex version

## 🛠 Operational Loop

**Step 0: Git Protocol (MANDATORY)**
- Before ANY code changes: Create a branch using `git checkout -b type/ID-description`
- NEVER work directly on `main` branch
- See `.github/copilot-instructions.md` for complete Git rules

**Implementation Steps:**
1. Read `NEXT-TASKS.md` to understand the current objective.
2. Cross-reference `.cortex/constitution.md` for governance and workflows.
3. If unsure of a term, check `.cortex/glossary.md`.
4. Execute changes following TypeScript best practices and accessibility standards.

## 🧹 Post-Task Protocol

After completing a task, follow the **Maintenance Protocol**:

1. **Run Validation**: Execute `pnpm run cortex:validate` to ensure project health.
2. **Type Check**: Run `pnpm type-check` to catch TypeScript errors.
3. **Lint**: Run `pnpm lint` to maintain code quality.
4. **Build Test**: Run `pnpm build` to verify production build succeeds.
5. **Asset Sync** (if images changed): Run `pnpm run assets:sync` to upload to R2.
6. **Commit Changes**: Follow conventional commit format with co-authorship.
7. **Merge to Main**: Merge feature branch to `main` (via PR or direct merge).
8. **Branch Cleanup (MANDATORY)**:
   ```bash
   git checkout main
   git pull origin main
   git branch -d <feature-branch-name>
   ```
9. **Deploy** (when ready): Run `pnpm deploy` to publish to Cloudflare Workers.

**Exception**: Small tasks (typos, formatting) only require git commit and branch cleanup.

## 📋 Project Context

### Project Type
- **Purpose**: Personal resume and professional landing page
- **Framework**: Astro 5.13.7 (Static Site Generation)
- **Deployment**: Cloudflare Workers
- **CDN**: Cloudflare R2 (cdn.josemianton.com)

### Key Features
- R2 asset processor for image optimization (AVIF/WebP)
- Responsive images (400px, 800px, 1200px)
- Dark theme with persistence
- TypeScript strict mode
- Tailwind CSS styling
- Global CDN delivery

### Security Reminders
- Never commit `.env` files
- All credentials via environment variables
- No hardcoded R2 API keys
- Asset manifest is gitignored

### Performance Targets
- Mobile (400px): Quality 90
- Tablet (800px): Quality 85
- Desktop (1200px): Quality 80
- Target R2 usage: < 8GB (80% of free tier)

## 📖 Documentation Structure

- **`.cortex/constitution.md`**: Primary governance, R2 workflows, principles
- **`.cortex/glossary.md`**: Resume + R2 + Cloudflare terminology
- **`.cortex/validation.json`**: Custom validation rules
- **`.github/copilot-instructions.md`**: Detailed collaboration protocol
- **`lib/assets/README.md`**: Asset processor architecture
- **`docs/ASSET_PIPELINE_*.md`**: Implementation guides

<!-- @cortex-tms-version 2.6.0-beta.1 -->
