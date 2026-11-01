"""Create the Beefy demo catalogue without overwriting administrator edits."""
from datetime import time
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.db import transaction
from shop.models import Restaurant, OpeningHour, Category, Product
from shop.sequences import lock_seeded_tables, repair_crm_sequences

# Each item is a fixed 1 kg pack. Integer quantities therefore remain valid.
PRODUCTS = [
    ('Entrecôte', 'Steaks', 'Une pièce de bœuf généreusement persillée, tendre et savoureuse. Idéale à saisir à la poêle ou au gril. Conditionnement : 1 kg.', 'Une belle pièce à griller · 1 kg', '16.20', 'beefy-ribeye', 'LA SÉLECTION'),
    ('Faux-filet', 'Steaks', 'Un morceau de bœuf au goût affirmé, à griller ou à poêler selon votre cuisson préférée. Conditionnement : 1 kg.', 'Tendre et savoureux · 1 kg', '14.90', 'beefy-sirloin', ''),
    ('Bœuf haché', 'Haché', 'Du bœuf haché pour vos steaks maison, boulettes et recettes du quotidien. À cuire à cœur. Conditionnement : 1 kg.', 'Pour toutes vos recettes · 1 kg', '9.50', 'beefy-mince', ''),
    ('Bœuf à mijoter', 'À mijoter', 'Des morceaux de bœuf découpés pour vos cuissons lentes, bourguignons et plats mijotés. Conditionnement : 1 kg.', 'Le goût des cuissons lentes · 1 kg', '12.90', 'beefy-stew', ''),
    ('Foie de bœuf', 'Abats', 'Du foie de bœuf en tranches, à cuisiner à la poêle avec des oignons et des herbes. Conditionnement : 1 kg.', 'Découpé en tranches · 1 kg', '8.90', 'beefy-organs', ''),
]
CATEGORIES = ['Steaks', 'À mijoter', 'Haché', 'Abats']

class Command(BaseCommand):
    help = 'Crée le catalogue Beefy manquant, sans écraser les modifications de l’administration.'

    @transaction.atomic
    def handle(self, *args, **options):
        lock_seeded_tables()
        restaurant, created = Restaurant.objects.get_or_create(pk=1, defaults={
            'name': 'Beefy', 'delivery_postal_codes': ['75011', '75010', '75012', '75020'],
        })
        if created:
            OpeningHour.objects.bulk_create([
                OpeningHour(restaurant=restaurant, weekday=i, opens=time(9), closes=time(20))
                for i in range(7)
            ])
        categories = {name: Category.objects.get_or_create(name=name, defaults={'position':i})[0]
                      for i, name in enumerate(CATEGORIES)}
        for position, (name, category, description, summary, price, image, badge) in enumerate(PRODUCTS):
            Product.objects.get_or_create(image=image, defaults={
                'name':name, 'category':categories[category], 'description':description,
                'summary':summary, 'price':Decimal(price), 'badge':badge, 'rating':'',
                'position':position, 'allergens':[], 'vegetarian':False,
            })
        repair_crm_sequences()
        self.stdout.write(self.style.SUCCESS('Catalogue Beefy prêt : portions de 1 kg, données existantes conservées.'))
