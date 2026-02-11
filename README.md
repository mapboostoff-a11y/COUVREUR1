# Générateur de Landing Pages React

Une solution professionnelle et entièrement personnalisable pour la création de sites vitrines, propulsée par **React**, **TypeScript**, **Tailwind CSS** et une configuration **JSON** centralisée.

## ✨ Fonctionnalités Clés

- **Architecture Modulaire** : Conception basée sur des sections indépendantes et réutilisables (Hero, Services, Témoignages, etc.).
- **Pilotage par JSON** : L'intégralité du contenu, du thème et des paramètres est contrôlée par un schéma JSON strict et typé.
- **Interface d'Administration Complète** :
  - Authentification sécurisée (Simulée pour le dév).
  - Réorganisation des sections par Glisser-Déposer (Drag-and-Drop).
  - Éditeur de propriétés JSON en temps réel avec validation instantanée.
  - Aperçu en Direct multi-supports (Bureau, Tablette, Mobile).
  - Génération de site par IA (Intégration Backend Agno).
- **Performance** : Chargement différé (Lazy loading) des composants, optimisation des assets.
- **SEO Ready** : Gestion dynamique des balises méta et support Open Graph.

## 📂 Structure du Projet

```
src/
├── admin/           # Logique spécifique à l'administration
├── components/
│   ├── admin/       # Composants UI de l'admin (Éditeur, Liste, Sidebar)
│   ├── renderer/    # Moteur de rendu dynamique des sections
│   ├── sections/    # Composants individuels (Hero, Features, etc.)
│   └── ui/          # Composants UI génériques (Boutons, Inputs)
├── data/            # Configuration par défaut et données initiales
├── layouts/         # Wrappers de mise en page (Public, Admin)
├── pages/           # Pages de routage
├── store/           # Gestion d'état global avec Zustand
├── types/           # Définitions TypeScript & Schémas Zod
└── lib/             # Utilitaires et helpers
```

## 🚀 Démarrage Rapide

1.  **Installation des dépendances :**
    ```bash
    pnpm install
    ```

2.  **Lancement du serveur de développement :**
    ```bash
    pnpm dev
    ```
    *Ceci lance à la fois le frontend (Vite) et le backend (Express) via un middleware.*

3.  **Lancement en Production (Local/VPS) :**
    ```bash
    pnpm build
    pnpm start
    ```

4.  **Lancement des tests :**
    ```bash
    pnpm test
    ```

## 📖 Utilisation

### Vue Publique
Accédez à `http://localhost:5173/` pour voir le rendu final de la landing page générée.

### Interface d'Administration
1.  Accédez à `http://localhost:5173/login`.
2.  Connectez-vous avec n'importe quel email et le mot de passe : `password`.
3.  Utilisez la **Poignée** à gauche des cartes pour réorganiser les sections.
4.  Cliquez sur une section pour éditer ses propriétés JSON dans le panneau de droite.
5.  Activez/Désactivez la visibilité d'une section avec l'icône **Oeil**.
6.  Ajoutez de nouvelles sections via le bouton **+** flottant ou dans la barre latérale.

## ⚙️ Configuration & Extension

Le modèle de données central est défini dans `src/types/schema.ts`.
La configuration initiale se trouve dans `src/data/default-config.ts`.
La persistance est assurée par **SQLite** (`site-data.db`).

### Ajouter une Nouvelle Section
Pour étendre les capacités du builder :
1.  Créez le composant React dans `src/components/sections/`.
2.  Définissez son schéma Zod dans `src/types/schema.ts`.
3.  Ajoutez le type à l'union discriminée `SectionSchema`.
4.  Mettez à jour le `SectionRenderer` pour gérer le nouveau type.

## 🛠 Stack Technique
-   **Core** : React 19, TypeScript, Vite
-   **Backend** : Express.js, Node.js
-   **Database** : SQLite (better-sqlite3)
-   **Styles** : Tailwind CSS 4
-   **State** : Zustand
-   **Routing** : React Router DOM
-   **Drag & Drop** : dnd-kit
-   **Validation** : Zod, React Hook Form

## ☁️ Déploiement (Vercel)

Le projet est prêt pour Vercel.
1.  Installez Vercel CLI : `npm i -g vercel`
2.  Déployez : `vercel`
3.  Le fichier `vercel.json` configure automatiquement les fonctions serverless pour l'API Express.

*Note : Sur Vercel, la base de données SQLite est réinitialisée à chaque déploiement (système de fichiers éphémère). Pour la production sur Vercel, envisagez une base de données externe ou un VPS.*
# COUVREUR1
