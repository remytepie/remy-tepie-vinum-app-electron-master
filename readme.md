🍷 remy-tepie-vinum-app-electron-master

Application Electron + Vue 3 + Prisma (MySQL / MariaDB) permettant la gestion d’une cave à vins, incluant :

les vins

les mouvements (entrées / sorties)

les fournisseurs

les emplacements de stockage

Ce projet a été réalisé dans un cadre académique et respecte les consignes de remise et de disponibilité du code.

🚀 Technologies utilisées

Electron – Application desktop multiplateforme

Vue 3 – Interface utilisateur

Prisma ORM – Accès et gestion de la base de données

MySQL / MariaDB – Base de données relationnelle

📋 Prérequis

Avant l’installation, assurez-vous d’avoir :

Node.js ≥ 18

MySQL ou MariaDB ≥ 10.6

Git

📦 Installation (PowerShell)
1️⃣ Cloner le projet
git clone https://github.com/remytepie/remy-tepie-vinum-app-electron-master.git
cd remy-tepie-vinum-app-electron-master

2️⃣ Installer les dépendances
npm install

🗄️ Base de données
1️⃣ Création de la base
CREATE DATABASE cave_vins2;

2️⃣ Initialisation de la base (au choix)
Option A — Script SQL direct
mysql -u root -p cave_vins2 < src/main/repositories/prisma/script/script.sql

Option B — Prisma (recommandé)
npx prisma@6.17.1 db push --schema prisma/schema.prisma
npm run seed   # insertion de données de démonstration

⚙️ Configuration

Créer un fichier .env à la racine du projet :

DATABASE_URL="mysql://root:root@localhost:3306/cave_vins2"


Adapter les identifiants si nécessaire selon votre configuration locale.

▶️ Lancement de l’application
npm start


L’application Electron se lance automatiquement.

🧰 Commandes utiles
npm run seed       # Données de démonstration
npm run lint       # Vérification du code
npm run package    # Packaging Electron
npm run make       # Génération de l’exécutable
npx prisma@6.17.1 generate --schema prisma/schema.prisma

🗂️ Structure du projet
src/
 ├─ main/        # Process principal Electron + repositories Prisma
 ├─ preload/     # Bridge IPC (window.electronService)
 ├─ renderer/    # Interface utilisateur Vue 3
 ├─ shared/      # Types partagés
prisma/
 └─ schema.prisma          # Schéma Prisma
src/main/repositories/prisma/script/
 └─ script.sql             # Script SQL complet de la base
seed.js                    # Script de seed Prisma
