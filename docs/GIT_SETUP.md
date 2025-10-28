# Git Setup Guide for SlideMaker

## Current Situation

- ✅ **Root .gitignore created** - Covers entire project
- ✅ **Frontend .gitignore exists** - React default (can keep or remove)
- ⚠️ **Not a git repository yet** - Need to initialize

## Option 1: Keep Both .gitignore Files (Recommended)

This is the standard approach:

```bash
# Root .gitignore handles:
- Backend Python files (venv, __pycache__, etc.)
- OS files (.DS_Store, Thumbs.db)
- IDE files (.vscode, .idea)
- Project-wide patterns

# Frontend .gitignore handles:
- Frontend-specific patterns (already has good defaults)
- Can be more specific to React/Node.js
```

**Action:** Keep both! They work together and don't conflict.

## Option 2: Use Only Root .gitignore

If you prefer one file:

```bash
# Delete frontend .gitignore
cd frontend
rm .gitignore

# Root .gitignore already covers all frontend needs
```

## Initialize Git Repository

```bash
# 1. Navigate to project root
cd /c/Users/kirag/Documents/harsh/slideMaker

# 2. Initialize git
git init

# 3. Check what will be ignored
git status

# 4. Add all files (respecting .gitignore)
git add .

# 5. Check what's staged
git status

# 6. Make initial commit
git commit -m "Initial commit: SlideMaker with international layout support"

# 7. (Optional) Create GitHub repo and push
# git remote add origin https://github.com/yourusername/slidemaker.git
# git branch -M main
# git push -u origin main
```

## What Will Be Ignored

### ✅ Ignored (Good - these shouldn't be in git)
- `backend/venv/` - Virtual environment (huge, user-specific)
- `backend/__pycache__/` - Python bytecode (auto-generated)
- `frontend/node_modules/` - NPM packages (huge, auto-installed)
- `frontend/build/` - Build output (auto-generated)
- `.vscode/` - Editor settings (user-specific)
- `.DS_Store` - macOS metadata
- `*.log` - Log files
- `.env` - Environment secrets

### ✅ Tracked (Good - these should be in git)
- All `.py` source files
- All `.js` and `.jsx` files
- `requirements.txt` - Python dependencies
- `package.json` - Node dependencies
- All `.md` documentation files
- `setup.bat` and `start.bat` - Setup scripts
- All CSS files
- All configuration files
- `docs/` folder contents

## Verify Before Committing

```bash
# See what git will track
git add --dry-run .

# See what's ignored
git status --ignored

# Check specific folder
git check-ignore -v backend/venv
# Should show: .gitignore:22:backend/venv/
```

## Common Git Commands

```bash
# Check status
git status

# Add specific files
git add backend/app.py
git add frontend/src/

# Add all changes
git add .

# Commit changes
git commit -m "Your commit message"

# View commit history
git log --oneline

# Create a branch
git checkout -b feature/new-feature

# Push to GitHub
git push origin main
```

## Recommended First Commit Structure

```bash
# 1. Initialize
git init

# 2. Add everything
git add .

# 3. Check what's staged (should NOT include venv/, node_modules/, etc.)
git status

# 4. Commit
git commit -m "Initial commit: SlideMaker v1.0

Features:
- Dynamic layout detection (works with any language)
- Multi-slide workflow
- Theme preservation
- Content validation
- Comprehensive documentation

Tech Stack:
- Frontend: React 19
- Backend: Flask 3.0, python-pptx
- Documentation: 60+ test cases, architecture guide"
```

## .gitignore Priority

If both root and frontend .gitignore exist:

```
Priority order:
1. Patterns in .gitignore (root) apply to entire project
2. Patterns in frontend/.gitignore apply only to frontend folder
3. More specific patterns override general ones
```

## Recommendation

**Keep both .gitignore files!**

- Root `.gitignore` → Handles backend, OS, IDE, project-wide
- Frontend `.gitignore` → Handles React-specific patterns

This is standard practice and causes no conflicts.

## Quick Start Commands

```bash
# From project root
cd /c/Users/kirag/Documents/harsh/slideMaker

# Initialize and commit
git init
git add .
git commit -m "Initial commit: SlideMaker with international support"

# Create GitHub repo (on github.com), then:
git remote add origin YOUR_REPO_URL
git branch -M main
git push -u origin main
```

## Files That Will Be Tracked (Sample)

```
slideMaker/
├── .gitignore                    ✅ Tracked
├── README.md                     ✅ Tracked
├── setup.bat                     ✅ Tracked
├── start.bat                     ✅ Tracked
├── backend/
│   ├── app.py                    ✅ Tracked
│   ├── requirements.txt          ✅ Tracked
│   ├── venv/                     ❌ Ignored (too large)
│   └── __pycache__/              ❌ Ignored (auto-generated)
├── frontend/
│   ├── package.json              ✅ Tracked
│   ├── package-lock.json         ✅ Tracked
│   ├── src/                      ✅ Tracked (all files)
│   ├── public/                   ✅ Tracked (all files)
│   ├── node_modules/             ❌ Ignored (too large)
│   ├── build/                    ❌ Ignored (auto-generated)
│   └── .gitignore                ✅ Tracked (helpful to keep)
└── docs/
    ├── ARCHITECTURE.md           ✅ Tracked
    ├── TESTING_GUIDE.md          ✅ Tracked
    └── *.md                      ✅ Tracked (all docs)
```

## Troubleshooting

### "I accidentally committed node_modules or venv"

```bash
# Remove from git but keep files
git rm -r --cached backend/venv
git rm -r --cached frontend/node_modules

# Commit the removal
git commit -m "Remove venv and node_modules from tracking"
```

### "Git is tracking my .env file with secrets"

```bash
# Remove from git immediately
git rm --cached .env

# Make sure .gitignore has:
# .env
# .env.*

# Commit
git commit -m "Remove .env from tracking"

# Rotate any exposed secrets!
```

### "How do I check what's being ignored?"

```bash
# See all ignored files
git status --ignored

# Check specific file
git check-ignore -v backend/venv/
```

## Next Steps

1. ✅ Root .gitignore created
2. ✅ Read this guide
3. ⏳ Decide: Keep both .gitignore or just root (recommend both)
4. ⏳ Initialize git repository
5. ⏳ Make first commit
6. ⏳ (Optional) Push to GitHub

You're all set! 🚀
