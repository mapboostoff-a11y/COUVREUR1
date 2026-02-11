# Documentation Base de Données

Le projet utilise **SQLite** (via `better-sqlite3`) pour stocker la configuration du site de manière persistante en local et performante.

## Configuration

- **Fichier de base de données** : `site-data.db` (à la racine du projet).
- **Initialisation** : Automatique au démarrage du serveur si le fichier n'existe pas.
- **Seeding** : Si la base est vide, elle est pré-remplie avec le contenu de `exempleenproduction.json`.

## Schéma

La base de données contient une seule table principale : `site_config`.

```sql
CREATE TABLE IF NOT EXISTS site_config (
    key TEXT PRIMARY KEY,
    value TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Champs
- `key` : Identifiant unique de la configuration (actuellement utilisé : `'current_config'`).
- `value` : La configuration complète du site au format JSON (stringified).
- `updated_at` : Date de la dernière modification.

## Migration et Seeding

Le script de seeding se trouve dans `server/db/seed.js`. Il est exécuté automatiquement par le routeur API au démarrage.

Pour forcer le seeding manuellement (si nécessaire en dev) :
```bash
node server/db/seed.js
```

## Sauvegarde et Restauration

Puisque la base de données est un simple fichier (`site-data.db`), la sauvegarde consiste simplement à copier ce fichier.
En cas de déploiement sur Vercel, ce fichier est éphémère. Pour une persistance en production serverless, il est recommandé de passer à une base de données externe (ex: Turso, Supabase) ou d'utiliser un VPS avec un volume persistant.
