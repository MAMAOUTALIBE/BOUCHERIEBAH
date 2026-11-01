# Boucherie

Base React/TypeScript et API Django pour le futur site de boucherie.
Le dossier et le paquet npm portent le nom `boucherie`.
Le catalogue et les écrans métier hérités du restaurant restent à adapter.

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

Les métadonnées de l’ancien dépôt Git ont été supprimées. Aucun nouveau dépôt n’a encore été initialisé.
Les configurations et procédures de l’ancien hébergement ont été retirées.
Le prochain déploiement sera configuré avec les informations du nouveau serveur.
Les variables internes `STC_*` sont conservées pour assurer la compatibilité du code existant.
