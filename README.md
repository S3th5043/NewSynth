# Synthesise AI — macOS Step-by-Step Guide

A detailed guide to get the app running on macOS (Apple Silicon or Intel).

## 0) Check your shell and architecture
- macOS default shell is zsh. Confirm with:
```bash
echo $SHELL
uname -m   # arm64 (Apple Silicon) or x86_64 (Intel)
```

## 1) Install Homebrew (if not installed)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```
- Add brew to PATH (Apple Silicon):
```bash
echo 'eval "$(${HOMEBREW_PREFIX:-/opt/homebrew}/bin/brew shellenv)"' >> ~/.zshrc
source ~/.zshrc
brew --version
```
- For Intel Macs, replace `/opt/homebrew` with `/usr/local`.

## 2) Install Node.js 18 LTS
Recommended: nvm (Node Version Manager).
```bash
brew install nvm
mkdir -p ~/.nvm
cat << 'EOF' >> ~/.zshrc
export NVM_DIR="$HOME/.nvm"
[ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && . "/opt/homebrew/opt/nvm/nvm.sh"
[ -s "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm" ] && . "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm"
EOF
source ~/.zshrc

nvm install 18
nvm use 18
node -v
npm -v
```
Alternative (Homebrew):
```bash
brew install node@18
echo 'export PATH="/opt/homebrew/opt/node@18/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
node -v
```

## 3) Clone and enter the repository
```bash
# Replace URL with your repo if different
git clone https://github.com/your-org/your-repo.git
cd your-repo
```

## 4) Install dependencies (clean install recommended)
```bash
rm -rf node_modules package-lock.json .next || true
npm install
```

## 5) Set up environment (optional)
This project runs without secrets. If you add integrations later, create `.env.local`:
```bash
cp .env.example .env.local  # if provided; otherwise create it manually
```

## 6) Start the app in development
```bash
npm run dev
```
Navigate to http://localhost:3000.

- Auth demo: open `/login` → enter any email → enter any 4‑digit code
- Dashboard: `/dashboard`
- Create product: `/dashboard/create`
- Products: `/dashboard/products`

## 7) Build and run in production
```bash
npm run build
npm run start
```
Server listens on http://localhost:3000.

## 8) Useful scripts
```bash
npm run dev    # Dev server with HMR
npm run build  # Production build
npm run start  # Start production server
npm run lint   # Lint codebase
```

## 9) macOS tips and troubleshooting
- Port already in use:
```bash
lsof -i :3000 | awk 'NR>1 {print $2}' | xargs kill -9
```
- Clear caches and reinstall deps:
```bash
rm -rf node_modules package-lock.json .next
npm install
```
- Apple Silicon vs Intel paths:
  - Apple Silicon: `/opt/homebrew`
  - Intel: `/usr/local`
- Allow incoming connections if macOS prompts.

## 10) Editor and tooling
- VS Code extensions: ESLint, Tailwind CSS IntelliSense
- iTerm2 or Apple Terminal for shell
- nvm for Node management

## 11) Feature tour (quick start)
- Hero/marketing site: `/`
- Sticky header + sections: Homepage
- Auth + onboarding: `/login` → redirects to `/dashboard`
- Product creation: `/dashboard/create` → Ebook wizard steps
- Knowledge base: integrated in Ebook step 2
- Products management: `/dashboard/products`

## 12) Common issues
- Node version mismatch: ensure Node ≥ 18.
- pnpm/yarn mixups: this repo uses npm; remove lockfiles from other managers.
- Corporate proxy: set `npm config set proxy/https-proxy` if needed.

## 13) Filing issues
Include:
- macOS version (e.g., 14.4 Sonoma)
- Chip (M1/M2 or Intel) and Node/npm versions
- Steps to reproduce and logs from Terminal
