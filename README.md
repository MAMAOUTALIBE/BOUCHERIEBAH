# Beefy — boucherie en ligne

Site de boucherie React/TypeScript et API Django pour Beefy.
Le dossier reste `boucherie` ; le paquet npm porte le nom `beefy`.
Catalogue Beefy : entrecôte, faux-filet, bœuf haché, morceaux à mijoter et abats. Les prix sont indiqués au kilogramme et chaque article correspond à une portion de 1 kg. Les visuels sont illustratifs ; les prix et les coordonnées de démonstration sont à confirmer avant toute publication.

## Démarrage local

Prérequis : Node.js 22+, Python 3.13 ou 3.14 et npm.

```sh
python3 scripts/setup.py
npm run dev:all
```

- Site : http://localhost:5173
- Espace gérant : http://localhost:5173/crm/
- Administration : http://localhost:5173/admin/

Le fichier `.env`, les bases, les médias et les accès locaux sont privés.
Les accès administrateur locaux sont dans `.runtime/admin-credentials.txt`.

## Docker local

```sh
python3 scripts/setup.py
docker compose up --build -d
```

Site : http://localhost:8080. `compose.yaml` et les fichiers Docker/Nginx conservés servent au lancement local.

## Vérification

```sh
npm run check
python3 -m unittest discover -s tests -p 'test_operations.py' -v
```

## Nouveau départ

Le projet est versionné dans le dépôt Git `MAMAOUTALIBE/BOUCHERIEBAH`, sur la branche `main`.
Les configurations et procédures de l’ancien hébergement ont été retirées.
Le prochain déploiement sera configuré avec les informations du nouveau serveur.
Les variables internes `STC_*` sont conservées pour assurer la compatibilité du code existant.

## Adapter une ancienne base locale

Après les migrations, exécuter `backend/.venv/bin/python backend/manage.py adapt_beefy`.
Cette commande réservée au développement SQLite crée une sauvegarde privée dans `backups/`, ajoute les produits Beefy manquants, archive les anciens articles et change le nom en Beefy. Elle conserve clients, commandes et lignes historiques. Le réensemencement `seed_demo` conserve les modifications de l’administration.

Les articles archivés restent dans la base pour l’historique et ne sont plus commandables. Pour revenir en arrière, arrêter les services locaux et restaurer la sauvegarde SQLite correspondante. Aucun déploiement et aucun commit ne sont effectués par ces commandes.
