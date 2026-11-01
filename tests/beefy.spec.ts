import {expect,test} from '@playwright/test';
import {randomUUID} from 'node:crypto';

const fitsViewport=()=>document.documentElement.scrollWidth<=innerWidth;
test.beforeEach(async({page},testInfo)=>{if(testInfo.project.name==='desktop')await page.setViewportSize({width:1440,height:1000});});

test('Beefy : accueil, images et catégories sans débordement',async({page},testInfo)=>{
  const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('/');
  await expect(page.locator('.brand')).toContainText('Beefy');
  await expect(page.locator('.product-card').first()).toBeVisible();
  await expect(page.locator('.categories').getByRole('button')).toHaveCount(5);
  for(const label of ['Tout','Steaks','À mijoter','Haché','Abats']){
    const categoryButton=page.locator('.categories').getByRole('button',{name:label,exact:true});
    await expect(categoryButton).toBeVisible();
    await categoryButton.click();
    await expect(page.getByRole('region',{name:'La sélection Beefy'})).toBeVisible();
  }
  await page.locator('.categories').getByRole('button',{name:'Tout',exact:true}).click();
  await page.locator('.product-card').last().scrollIntoViewIfNeeded();
  await expect.poll(()=>page.locator('.product-card img').evaluateAll(images=>images.every(image=>(image as HTMLImageElement).complete&&(image as HTMLImageElement).naturalWidth>0&&!image.getAttribute('src')?.includes('burger')))).toBe(true);
  expect(await page.evaluate(fitsViewport)).toBe(true);
  await page.locator('.categories').getByRole('button',{name:'Haché',exact:true}).click();
  await expect(page.locator('.product-card')).toHaveCount(1);
  await expect(page.locator('.product-card')).toContainText(/haché/i);
  await page.locator('.categories').getByRole('button',{name:'Tout',exact:true}).click();
  const search=page.getByRole('textbox',{name:/Rechercher/});
  await search.fill('entrecote');
  await expect(page.locator('.product-card')).toHaveCount(1);
  await expect(page.locator('.product-card')).toContainText(/Entrecôte/);
  await page.getByRole('button',{name:'Afficher les filtres',exact:true}).click();
  await page.getByRole('combobox',{name:'Trier les produits'}).selectOption('price-desc');
  await expect(page.getByRole('combobox',{name:'Trier les produits'})).toHaveValue('price-desc');
  await search.fill('aucune-viande-xyz');
  await expect(page.locator('.product-card')).toHaveCount(0);
  await expect(page.locator('.empty')).toBeVisible();
  await search.fill('');
  await page.getByRole('combobox',{name:'Trier les produits'}).selectOption('popular');
  await page.getByRole('button',{name:'Afficher les filtres',exact:true}).click();
  await search.blur();await page.evaluate(()=>scrollTo(0,0));
  await page.screenshot({path:testInfo.outputPath('beefy-home.png'),fullPage:true});
  expect(errors).toEqual([]);
});

test('Beefy : fiche et panier calculent deux portions de 1 kg',async({page},testInfo)=>{
  const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('/');
  const card=page.locator('.product-card').filter({has:page.getByRole('heading',{name:/Entrecôte/})});
  await card.locator('.card-add').click();
  const detail=page.getByRole('dialog');
  await expect(detail).toContainText(/1 kg/);
  await detail.getByRole('button',{name:'Augmenter la quantité',exact:true}).click();
  await expect(detail).toContainText(/2 kg/);
  await page.screenshot({path:testInfo.outputPath('beefy-detail.png'),fullPage:true});
  await detail.getByRole('button',{name:/Ajouter/}).click();
  await expect(detail).toHaveCount(0);
  if((page.viewportSize()?.width??1280)<=760)await page.getByRole('navigation',{name:'Navigation principale'}).getByRole('button',{name:/Panier/}).click();
  else await page.getByRole('button',{name:/Mon panier/}).first().click();
  const basket=page.getByRole('dialog');
  await expect(basket.locator('.cart-item')).toHaveCount(1);
  await expect(basket.locator('.cart-item')).toContainText(/Entrecôte/);
  await expect(basket.locator('.cart-item')).toContainText(/32,40/);
  await basket.locator('.cart-item').getByRole('button',{name:/Réduire/}).click();
  await expect(basket.locator('.cart-item')).toContainText(/16,20/);
  expect(await page.evaluate(fitsViewport)).toBe(true);
  await page.screenshot({path:testInfo.outputPath('beefy-cart.png'),fullPage:true});
  await page.keyboard.press('Escape');await expect(basket).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('Beefy : création de compte et reconnexion',async({page})=>{
  const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
  const email=`beefy-qa-${randomUUID()}@example.com`,password='Beefy-QA!64x9';
  await page.goto('/');
  await page.getByRole('button',{name:/^(Mon compte|Compte|Profil)$/}).first().click();
  await page.getByRole('button',{name:'Créer un compte',exact:true}).click();
  await page.getByLabel('Nom complet',{exact:true}).fill('Camille Beefy');
  await page.getByLabel('Adresse e-mail',{exact:true}).fill(email);
  await page.getByLabel('Mot de passe',{exact:true}).fill(password);
  await page.getByRole('button',{name:'Créer mon compte',exact:true}).click();
  await expect(page.getByRole('button',{name:'Se déconnecter',exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Se déconnecter',exact:true}).click();
  await page.getByLabel('Adresse e-mail',{exact:true}).fill(email);
  await page.getByLabel('Mot de passe',{exact:true}).fill(password);
  await page.getByRole('button',{name:'Se connecter',exact:true}).click();
  await expect(page.getByRole('button',{name:'Se déconnecter',exact:true})).toBeVisible();
  expect(await page.evaluate(fitsViewport)).toBe(true);
  expect(errors).toEqual([]);
});


test('Beefy : introduction et commande de démonstration complète',async({page},testInfo)=>{
  await page.goto('/');
  await page.getByRole('button',{name:'L’esprit Beefy',exact:true}).click();
  const intro=page.getByRole('dialog',{name:'L’esprit Beefy',exact:true});
  await expect(intro).toContainText('De bonnes pièces.');
  await page.screenshot({path:testInfo.outputPath('beefy-intro.png'),fullPage:false});
  await intro.getByRole('button',{name:'Découvrir nos pièces',exact:true}).click();
  await expect(intro).toHaveCount(0);
  const card=page.locator('.product-card').filter({has:page.getByRole('heading',{name:'Entrecôte',exact:true})});
  await card.locator('.card-add').click();
  await page.getByRole('dialog').getByRole('button',{name:/Ajouter/}).click();
  if((page.viewportSize()?.width??1280)<=760)await page.getByRole('navigation',{name:'Navigation principale'}).getByRole('button',{name:/Panier/}).click();
  else await page.getByRole('button',{name:/Mon panier/}).first().click();
  await page.getByRole('button',{name:'Passer commande',exact:true}).click();
  await page.getByLabel('Nom complet',{exact:true}).fill('Camille Beefy');
  await page.getByLabel('Adresse e-mail',{exact:true}).fill(`beefy-order-${randomUUID()}@example.com`);
  await page.getByLabel('Téléphone',{exact:true}).fill('0612345678');
  await page.getByRole('button',{name:'Valider la commande de démonstration',exact:true}).click();
  await expect(page.locator('.order-card')).toHaveCount(1);
  await expect(page.locator('.order-card')).toContainText('Entrecôte');
  await expect(page.locator('.order-card')).toContainText('16,20');
  expect(await page.evaluate(fitsViewport)).toBe(true);
  await page.screenshot({path:testInfo.outputPath('beefy-order.png'),fullPage:false});
});
