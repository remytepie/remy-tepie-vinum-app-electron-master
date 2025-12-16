# remy-tepie-vinum-app-electron-master – Vinum (Electron + Vue + Prisma)

Application Electron (Vue 3 + Vite) pour piloter une cave : vins, mouvements, fournisseurs, emplacements. DB MySQL/MariaDB via Prisma. Legacy todos supprimés.

## Prerequis
- Node.js 18+
- MySQL/MariaDB 10.6+
- Git

## Installation rapide (PowerShell)
```powershell
git clone <votre_repo> remy-tepie-vinum-app-electron-master
cd remy-tepie-vinum-app-electron-master
npm install
Base de donnees
Creer la base :
sql

CREATE DATABASE cave_vins2;
Option SQL directe :
powershell

mysql -u root -p cave_vins2 < src/main/repositories/prisma/script/script.sql
Option Prisma :

powershell

npx prisma@6.17.1 db push --schema prisma/schema.prisma
npm run seed   # si besoin de données demo
Fichier .env à la racine :
env

DATABASE_URL="mysql://root:root@localhost:3306/cave_vins2"
Lancement
powershell

npm start
Une fenêtre Electron s’ouvre (DevTools actifs).

Commandes utiles
powershell

npm run seed
npm run lint
npm run package
npm run make
npx prisma@6.17.1 generate --schema prisma/schema.prisma
Structure
src/main : process principal + repositories Prisma
src/preload : bridge IPC (window.electronService)
src/renderer : UI Vue 3
src/shared : types partagés
prisma/schema.prisma : schéma (domaine vins)
src/main/repositories/prisma/script/script.sql : script SQL complet
seed.js : seed Prisma (vins uniquement)

