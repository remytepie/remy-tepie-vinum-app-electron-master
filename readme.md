# Vinum - Gestion de cave Electron + Vue + Prisma

Application de bureau Electron (Vue 3 + Vite) pour piloter une cave : gestion des vins, mouvements de stock, fournisseurs et emplacements, avec MySQL/MariaDB via Prisma.

## Prerequis rapides

- Node.js 18+
- MySQL ou MariaDB 10.6+
- Git

## Installation express (PowerShell)

```powershell
git clone <votre_repo> vinum-app-electron
cd vinum-app-electron
npm install
npx prisma generate --schema prisma/schema.prisma
npm start
```

### Base de donnees

1) Creer la base :
```sql
CREATE DATABASE cave_vins2;
```
2) Charger le schema + donnees demo :
```powershell
mysql -u root -p cave_vins2 < src/main/repositories/prisma/script/script.sql
```
3) Renseigner `.env` a la racine :
```env
DATABASE_URL="mysql://root:root@localhost:3306/cave_vins2"
```

### Seed Prisma (optionnel)

```powershell
npm run seed
```

## Structure cle

- `src/main` : process principal Electron + repositories Prisma.
- `src/preload` : bridge IPC expose dans `window.electronService`.
- `src/renderer` : UI Vue 3.
- `src/shared` : types partages.
- `prisma/schema.prisma` : schema Prisma (domaine vins).
- `src/main/repositories/prisma/script/script.sql` : script SQL complet.
- `seed.js` : seed Prisma (vins uniquement).

## Commandes utiles

```powershell
npm start          # Lancer l'app en dev
npm run seed       # Peupler la base via Prisma
npm run lint       # Lint TypeScript
npm run package    # Builder les artefacts (Forge)
npm run make       # Generer les installateurs/archives (Forge)
npx prisma generate --schema prisma/schema.prisma  # Regenerer le client Prisma
```
