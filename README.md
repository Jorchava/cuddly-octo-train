# Beat-em-up Demo (PixiJS + TypeScript)

A simple **2D beat-em-up extract** (Yie-Ar KungFu early stuff of the beat'em ups) built with [PixiJS](https://pixijs.com/) and TypeScript. At that time it was v5-v6 but did some upgrades to use v8  
This project was created as a technical demo to showcase **game loop design, entity systems, collision handling, and project structure**.

---

## 🎮 Features

- **Player movement** (arrow keys / WASD)  
- **Basic attack system** (player can damage enemy with hitbox)  
- **Enemy AI**: enemy chases player while alive  
- **Collision system**: player hitbox detects overlap with enemy  
- **Health system**: entities take damage, knockback, and can die  
- **HUD / Health bar** for visual feedback  
- **Entity lifecycle management**: safe cleanup to avoid null reference errors  
- **Project structured by responsibility**:
  - `entities/` → Player, Enemy, BaseEntity  
  - `systems/` → Collision handling  
  - `ui/` → HUD components like health bar  
  - `core/` → Input handling (keyboard)  
  - `main.ts` → Game loop, spawning, high-level orchestration  

---

## 🛠️ Tech Stack

- [PixiJS](https://pixijs.com/) → 2D rendering  
- [TypeScript](https://www.typescriptlang.org/) → strong typing & maintainability  
- [Vite](https://vitejs.dev/) (or any bundler of choice) → fast local dev server  
- Project is organized in a way similar to larger games (entities/systems separation).  

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/jorchava/web-games/beat-em-up.git
cd beat-em-up

### 2. Install the dependencies
```bash
npm install

### 3. Run locally
```bash
npm run dev