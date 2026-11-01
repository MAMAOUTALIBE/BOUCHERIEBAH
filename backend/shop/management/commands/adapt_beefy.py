"""Explicit local transition: back up the existing database, then archive old items."""
from datetime import datetime
from pathlib import Path
import os
import sqlite3
from django.conf import settings
from django.core.management import call_command
from django.core.management.base import BaseCommand, CommandError
from django.db import connection, transaction
from shop.models import Product, Restaurant
from .seed_demo import PRODUCTS

class Command(BaseCommand):
    help = 'Adapte la base locale à Beefy après sauvegarde SQLite privée ; conserve les commandes et clients.'

    def handle(self, *args, **options):
        if not settings.DEBUG or connection.vendor != 'sqlite':
            raise CommandError('Adaptation automatique réservée à la base SQLite locale de développement.')
        source = Path(connection.settings_dict['NAME'])
        if not source.is_file():
            raise CommandError('La base locale doit être créée et migrée avant adaptation.')
        directory = settings.BASE_DIR.parent / 'backups'
        directory.mkdir(mode=0o700, exist_ok=True)
        target = directory / ('before-beefy-' + datetime.now().strftime('%Y%m%d-%H%M%S-%f') + '.sqlite3')
        fd = os.open(target, os.O_CREAT | os.O_EXCL | os.O_WRONLY, 0o600)
        os.close(fd)
        try:
            with sqlite3.connect(source) as old, sqlite3.connect(target) as backup:
                old.backup(backup)
        except Exception:
            target.unlink(missing_ok=True)
            raise
        with transaction.atomic():
            call_command('seed_demo', verbosity=0)
            images = [row[5] for row in PRODUCTS]
            archived = Product.objects.exclude(image__in=images).filter(archived=False).update(archived=True, available=False)
            Restaurant.objects.filter(pk=1).update(name='Beefy')
        self.stdout.write(self.style.SUCCESS(f'Beefy adapté ; {archived} anciens articles archivés. Sauvegarde privée : {target.name}. Clients et commandes conservés.'))
