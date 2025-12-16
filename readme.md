🍷 remy-tepie-vinum-app-electron-master

Application Electron + Vue 3 + Prisma (MySQL / MariaDB) pour la gestion de vins, mouvements, fournisseurs et emplacements.

🚀 Technologies

Electron

Vue 3

Prisma ORM

MySQL / MariaDB

📋 Prérequis

Node.js ≥ 18

MySQL / MariaDB ≥ 10.6

Git

📦 Installation (PowerShell)
1️⃣ Cloner le projet
git clone <votre_repo> remy-tepie-vinum-app-electron-master
cd remy-tepie-vinum-app-electron-master

2️⃣ Installer les dépendances
npm install

🗄️ Base de données
1️⃣ Créer la base
CREATE DATABASE cave_vins2;

2️⃣ Initialiser la base (au choix)
Option A — Script SQL direct
mysql -u root -p cave_vins2 < src/main/repositories/prisma/script/script.sql

Option B — Prisma (recommandé)
npx prisma@6.17.1 db push --schema prisma/schema.prisma
npm run seed   # données de démonstration

⚙️ Configuration

Créer un fichier .env à la racine du projet :

DATABASE_URL="mysql://root:root@localhost:3306/cave_vins2"

▶️ Lancement de l’application
npm start

🧰 Commandes utiles
npm run seed
npm run lint
npm run package
npm run make
npx prisma@6.17.1 generate --schema prisma/schema.prisma

🗂️ Structure du projet
src/
 ├─ main/        # Process principal Electron + repositories Prisma
 ├─ preload/     # Bridge IPC (window.electronService)
 ├─ renderer/    # Interface Vue 3
 ├─ shared/      # Types partagés
prisma/
 └─ schema.prisma          # Schéma Prisma
src/main/repositories/prisma/script/
 └─ script.sql             # Script SQL complet
seed.js                    # Seed Prisma

