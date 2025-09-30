# Beat-em-up Demo (PixiJS + TypeScript)

A simple **2D beat-em-up extract** (Yie-Ar KungFu-like ish early stuff of the beat'em ups) built with [PixiJS](https://pixijs.com/) and TypeScript. At that time the project was v5 and vanilla JS but did some upgrades to use v8 and TS 
This project was created as a technical demo version of a project worked some years ago to showcase **game loop design, entity systems, collision handling, PixiJS(WebGL) Javascript game engine and project structure**.

---

## 🎮 Features

- **Player movement** (arrow keys / WASD)  
- **Basic attack system** (player can damage enemy with hitbox: S, Space bar + Z jump attack combo, Q, Z, and Arrow down long press + Z dive kick attack combo)  
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

- **Next features:** 
1. ~~Assets~~ 
2. Initial screen with music and in game music 
3. Game over screen / retry
4. Collision unit test
5. ~~Custom shader (WebGL) / Fix the old tv CRT Filter~~
6. AI and weapongs for different enemies 
7. Explore json atlases for assets switch

---

## 🛠️ Tech Stack

- [PixiJS](https://pixijs.com/) → 2D rendering  
- [TypeScript](https://www.typescriptlang.org/) → strong typing & maintainability  
- [Vite](https://vitejs.dev/) (or any bundler of choice) → fast local dev server  
- Project is organized in a way similar to larger games (entities/systems separation).  

---

## 📦 Project Structure

```
/public
  /assets
    /player
    /enemy
/src
  /core
    Keyboard.ts
  /entities
    Player.ts
    Enemy.ts
  /systems
    CollisionSystems.ts
  /ui
    HealthBar.ts
  main.ts
index.html
styles.css
README.md

```

---

## 📝 License

Shield: [![CC BY 4.0][cc-by-shield]][cc-by]

This work is licensed under a
[Creative Commons Attribution 4.0 International License][cc-by].

[![CC BY 4.0][cc-by-image]][cc-by]

[cc-by]: http://creativecommons.org/licenses/by/4.0/
[cc-by-image]: https://i.creativecommons.org/l/by/4.0/88x31.png
[cc-by-shield]: https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg

---

## 🚀 Getting Started

### Clone the repository, install dependencies and run
```bash
git clone https://github.com/Jorchava/cuddly-octo-train.git

cd cuddly-octo-train/

npm install

npm run dev