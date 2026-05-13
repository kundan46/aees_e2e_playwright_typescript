# Git Workflow Guide: Push & Pull Steps

This guide outlines the standard workflow for managing changes in this repository using Git.

## 1. Check Current Status
Before making changes or committing, always check the state of your repository.
```bash
git status
```

## 2. Prepare Changes (Push)

### Step A: Stage Changes
Add the files you want to include in your next commit.
- To add all changes:
  ```bash
  git add .
  ```
- To add specific files:
  ```bash
  git add path/to/file.ts
  ```

### Step B: Commit Changes
Create a snapshot of your staged changes with a descriptive message.
```bash
git commit -m "feat: description of your changes"
```

### Step C: Push to GitHub
Send your local commits to the remote repository.
```bash
git push origin main
```

---

## 3. Update Local Code (Pull)

### Step A: Pull Latest Changes
Before starting new work, always pull the latest changes from GitHub to avoid conflicts.
```bash
git pull origin main
```

---

## 4. Best Practices

### .gitignore
Ensure temporary files, sensitive data, and dependencies are not tracked.
- Common ignores: `node_modules/`, `*.png`, `.env`, `playwright-report/`.

### Branching
For larger features, create a new branch:
```bash
git checkout -b feature/new-test-suite
```

### Handling Conflicts
If `git pull` results in a conflict:
1. Open the conflicted files.
2. Look for `<<<<<<< HEAD`, `=======`, and `>>>>>>>`.
3. Resolve the code and remove the markers.
4. `git add <file>` and `git commit`.
