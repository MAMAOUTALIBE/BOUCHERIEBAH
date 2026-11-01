"""Regression checks for the Beefy catalogue and fixed-weight checkout contract."""
import uuid
from decimal import Decimal
from django.core.management import call_command
from django.test import TestCase, override_settings
from rest_framework.test import APIClient
from .models import Category, Product

@override_settings(DEMO_MODE=True, PAYMENT_MODE='simulation', EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend')
class BeefyCatalogueTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        call_command('seed_demo', verbosity=0)

    def setUp(self):
        self.client = APIClient()
        self.client.get('/api/auth/csrf/')
        self.ribeye = Product.objects.get(image='beefy-ribeye')

    def order(self, quantity=2, product=None):
        return self.client.post('/api/orders/', {
            'mode':'À emporter', 'paymentMethod':'simulation',
            'items':[{'productId':(product or self.ribeye).pk, 'quantity':quantity, 'choices':[]}],
            'customer':{'name':'Client Beefy', 'email':'beefy@example.test', 'phone':'0612345678'},
        }, format='json', HTTP_IDEMPOTENCY_KEY=uuid.uuid4().hex)

    def test_catalogue_is_meat_only_with_expected_kg_prices(self):
        response = self.client.get('/api/products/')
        self.assertEqual(response.status_code, 200)
        products = {p['name']:p for p in response.data}
        self.assertEqual(len(products), 5)
        self.assertEqual(products['Entrecôte']['price'], 16.2)
        self.assertEqual(products['Faux-filet']['price'], 14.9)
        self.assertEqual(products['Bœuf haché']['price'], 9.5)
        self.assertTrue(all(not p['optionGroups'] for p in products.values()))
        self.assertTrue(all('1 kg' in p['description'] for p in products.values()))
        self.assertEqual(self.client.get('/api/restaurant/').data['name'], 'Beefy')

    def test_reseeding_keeps_administrator_changes(self):
        Product.objects.filter(pk=self.ribeye.pk).update(name='Entrecôte du boucher', price=Decimal('19.20'))
        call_command('seed_demo', verbosity=0)
        self.ribeye.refresh_from_db()
        self.assertEqual(self.ribeye.name, 'Entrecôte du boucher')
        self.assertEqual(self.ribeye.price, Decimal('19.20'))
        self.assertEqual(Product.objects.count(), 5)

    def test_archived_catalogue_and_categories_are_hidden(self):
        legacy = Category.objects.create(name='Ancien restaurant', position=20)
        product = Product.objects.create(name='Ancien burger', category=legacy, description='Historique',
                                         price=Decimal('10.00'), archived=True)
        self.assertNotIn(product.pk, [p['id'] for p in self.client.get('/api/products/').data])
        self.assertEqual({c['name'] for c in self.client.get('/api/categories/').data},
                         {'Steaks', 'À mijoter', 'Haché', 'Abats'})
        Category.objects.create(name='Sélection du boucher', position=10)
        self.assertIn('Sélection du boucher', [c['name'] for c in self.client.get('/api/categories/').data])
        self.assertFalse(product.is_available())
        self.assertGreaterEqual(self.order(product=product).status_code, 400)

    def test_two_kg_uses_server_price_and_preserves_historical_snapshot(self):
        response = self.order()
        self.assertEqual(response.status_code, 201, response.data)
        self.assertEqual(response.data['subtotal'], 32.4)
        self.assertEqual(response.data['total'], 32.4)
        Product.objects.filter(pk=self.ribeye.pk).update(archived=True, available=False, price=Decimal('100'))
        from .models import Order
        line = Order.objects.get(pk=response.data['id']).lines.get()
        self.assertEqual(line.name, 'Entrecôte')
        self.assertEqual(line.quantity, 2)
        self.assertEqual(line.unit_price, Decimal('16.20'))
        self.assertEqual(line.total, Decimal('32.40'))

    def test_fractional_weight_is_rejected_for_fixed_one_kg_packs(self):
        self.assertEqual(self.order(quantity=0.5).status_code, 400)
