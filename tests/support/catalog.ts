import {expect,type APIRequestContext} from '@playwright/test';

/** Resolve a real available Beefy product rather than an obsolete restaurant ID. */
export async function availableProductId(request:APIRequestContext):Promise<number>{
 const response=await request.get('/api/products/');
 expect(response.ok()).toBe(true);
 const products=await response.json() as {id:number;available?:boolean;promotional?:boolean}[];
 const product=products.find(item=>item.available!==false&&!item.promotional);
 if(!product)throw new Error('Le catalogue de recette doit contenir un produit disponible.');
 return product.id;
}
