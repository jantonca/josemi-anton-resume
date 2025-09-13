# 🔒 Security Guidelines for R2 Asset Processor

## Critical Security Rules

### ✅ What's Safe to Commit

- `lib/assets/*.js` - All JavaScript files (no secrets)
- `lib/assets/*.md` - Documentation files
- `.env.example` - Template with placeholder values
- `wrangler.toml` - Worker config (no secrets)
- `public/images/*` - Source images

### ❌ NEVER Commit These Files

- `.env` - Contains actual API keys
- `public/assets-manifest.json` - Contains file hashes (not secret but unnecessary)
- Any file with actual API keys or tokens

## Environment Variables

All sensitive data MUST be in environment variables:

```env
# Required - get from Cloudflare Dashboard
CF_ACCOUNT_ID=your-account-id
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
R2_BUCKET_NAME=your-bucket-name
```

## Pre-Commit Checklist

Before every commit, run these checks:

```bash
# 1. Check git status - no .env file should appear
git status

# 2. Search for accidental secrets
grep -r "your-actual-account-id" .
grep -r "your-actual-api-key" .

# 3. Verify .gitignore is working
ls -la .env  # Should exist locally
git ls-files .env  # Should return nothing (not tracked)

# 4. Check for hardcoded values
grep -r "25a61ab" lib/  # Your account ID
grep -r "josemianton-com" lib/ --exclude="*.md"  # Your bucket
```

## How to Share This Code Safely

### Option 1: Public Repository
1. Use `.env.example` with placeholders
2. Document required environment variables
3. Never include actual credentials
4. Use the setup script for configuration

### Option 2: Private Sharing
1. Share the `lib/assets/` folder
2. Share `.env.example` (not `.env`)
3. Provide credentials separately (encrypted email, password manager)

## If You Accidentally Commit Secrets

**IMMEDIATELY:**

1. **Rotate the compromised credentials** in Cloudflare Dashboard
2. **Remove from history:**
   ```bash
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch .env" \
     --prune-empty --tag-name-filter cat -- --all
   ```
3. **Force push** (if already pushed):
   ```bash
   git push --force --all
   ```
4. **Create new API tokens** in Cloudflare

## R2 API Token Best Practices

When creating R2 API tokens in Cloudflare:

1. **Use minimal permissions** - Only "R2 Token" with read/write to specific bucket
2. **Set IP restrictions** if possible
3. **Rotate regularly** (every 90 days)
4. **Use different tokens** for dev/staging/production
5. **Name tokens clearly** - e.g., "resume-site-dev-r2-token"

## Code Security Features

This module implements several security best practices:

- ✅ No default credentials
- ✅ Environment variable validation
- ✅ Error messages don't leak secrets
- ✅ Manifest doesn't contain sensitive data
- ✅ All config via environment variables
- ✅ Setup script doesn't store credentials in code

## Testing Security

Test that secrets are properly protected:

```bash
# Test 1: Code should fail without env vars
unset CF_ACCOUNT_ID
npm run assets:sync  # Should error

# Test 2: Check for leaks in output
npm run assets:sync 2>&1 | grep -i "secret\|key\|token"  # Should be empty

# Test 3: Verify gitignore
echo "test" >> .env
git status  # .env should NOT appear
```

---

**Remember:** When in doubt, don't commit it. It's better to be overly cautious with credentials.