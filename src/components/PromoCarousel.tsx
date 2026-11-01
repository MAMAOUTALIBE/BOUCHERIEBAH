import {ArrowRight} from 'lucide-react';
import {type Product} from '../types';
import './PromoCarousel.css';
interface PromoCarouselProps {products:Product[];onOrder:(productId:number)=>void;}
export function PromoCarousel({products,onOrder}:PromoCarouselProps){
 const product=products.find(p=>!p.promotional&&p.available!==false&&p.image.includes('ribeye'))??products.find(p=>!p.promotional&&p.available!==false);
 return <section className="promo-banner" aria-label="La sélection Beefy">
  <img className="promo-visual" src="/images/beefy-hero-v2.webp" alt="Pièces de bœuf sur une ardoise, accompagnées de romarin"/>
  <div className="promo-content"><span className="promo-eyebrow">LA SÉLECTION DU BOUCHER</span><h1 className="promo-title"><span>Le meilleur</span><span>du bœuf.</span></h1><p>Le goût des belles pièces.</p><button type="button" className="promo-order" disabled={!product} onClick={()=>product&&onOrder(product.id)}>Découvrir <ArrowRight size={18}/></button></div>
  <div className="beefy-seal"><span>SÉLECTION</span><strong>Beefy</strong><span>DU BOUCHER</span></div>
 </section>;
}
