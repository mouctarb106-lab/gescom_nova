# GESCOM NOVA PRO — gestion multiboutique

Interface responsive en français, conçue pour Android et PC. La version locale permet de tester les modules et conserve les données dans le navigateur.

## Modules inclus
- Tableau de bord et alertes de stock
- Articles, prix d'achat/vente, seuils d'alerte
- Ventes avec plusieurs articles par facture, déduction automatique du stock, modes de paiement et impression/PDF
- Achats fournisseurs avec entrée de stock
- Clients et fournisseurs
- Plusieurs boutiques et transferts de stock
- Utilisateurs locaux avec rôles
- Mouvements de caisse, rapports, estimation de marge brute
- Export CSV, sauvegarde/restauration JSON, journal d'activité
- Point d'API Cloudflare Pages Functions et table Neon pour synchroniser une sauvegarde JSON par tenant

## Test local
Ouvrir `index.html` dans un navigateur moderne. Compte local initial : `admin@gescom.local` / `admin123`. Changez ce mot de passe avant toute utilisation réelle. Les comptes sont locaux à cet appareil.

## Déploiement conseillé : GitHub → Cloudflare Pages → Neon
1. Créer une base de données Neon PostgreSQL.
2. Dans Neon SQL Editor, exécuter `docs/neon_schema.sql`.
3. Importer le dossier du projet dans un dépôt GitHub.
4. Dans Cloudflare, créer un projet Pages connecté au dépôt GitHub. Framework preset : `None`, Build command : vide, Build output directory : `.`.
5. Dans les variables d'environnement Cloudflare Pages, définir `DATABASE_URL` avec la chaîne de connexion Neon.
6. Déployer le site. Vérifier `https://VOTRE-SITE.pages.dev/api/health`.
7. Dans GESCOM, ouvrir « Cloud & synchronisation » et renseigner `https://VOTRE-SITE.pages.dev/api`.

## Limite de synchronisation — lire avant production
Le code inclut l'API de snapshots Neon (`GET/PUT /api/sync`) mais l'écran de synchronisation automatique et l'authentification multi-tenant sécurisée ne sont pas encore reliés. L'API actuelle est un socle de test et ne doit pas être exposée à des données commerciales sensibles avant ajout d'une vraie authentification côté serveur, autorisations par entreprise, journal serveur, sauvegardes et gestion de conflits. Les données de navigateur ne sont pas automatiquement partagées entre appareils tant que ce raccordement n'est pas terminé.

## Monnaie
Le paramétrage par défaut est le franc CFA (XOF).
