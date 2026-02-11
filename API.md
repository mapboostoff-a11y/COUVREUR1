# Documentation API

Ce projet utilise un backend **Express.js** pour gérer la configuration du site. L'API est accessible sous le préfixe `/api`.

## Endpoints

### 1. Récupérer la Configuration
Récupère la configuration JSON actuelle du site (depuis la base de données SQLite).

- **URL** : `/api/config`
- **Méthode** : `GET`
- **Réponse** :
  ```json
  {
    "meta": { ... },
    "theme": { ... },
    "sections": [ ... ]
  }
  ```
- **Codes d'erreur** :
  - `500` : Erreur serveur (DB inaccessible).

### 2. Mettre à Jour la Configuration (Hot Reload)
Sauvegarde une nouvelle configuration dans la base de données SQLite. Les changements sont immédiats (Hot Reload) si le frontend recharge les données.

- **URL** : `/api/config`
- **Méthode** : `POST`
- **Body** :
  ```json
  {
    "config": {
      "meta": { ... },
      "theme": { ... },
      "sections": [ ... ]
    }
  }
  ```
- **Réponse** :
  ```json
  {
    "success": true
  }
  ```

### 3. Publier (Sauvegarde Persistante)
Similaire à la mise à jour, mais conçu pour l'action "Publier" de l'interface admin. Met également à jour le fichier local `exempleenproduction.json` et tente une synchronisation Git si configuré.

- **URL** : `/api/publish`
- **Méthode** : `POST`
- **Body** :
  ```json
  {
    "config": { ... }
  }
  ```
- **Réponse** :
  ```json
  {
    "success": true,
    "message": "Published to Git successfully."
  }
  ```
  Ou si Git échoue :
  ```json
  {
    "success": true,
    "warning": "Saved locally, but Git failed.",
    "details": "..."
  }
  ```

### 4. Alias Legacy
Pour la compatibilité avec l'ancien code, l'endpoint suivant est redirigé :
- `GET /api/storage` -> Redirige vers `/api/config` (307 Temporary Redirect).
- `POST /api/storage` -> Traité comme `/api/config`.
