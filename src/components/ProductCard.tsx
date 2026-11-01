import {Heart,Plus} from 'lucide-react';
import {euro,type Product} from '../types';
import {FoodImage} from './FoodImage';
import './ProductCard.css';
interface ProductCardProps {product:Product;favorite:boolean;largeImage?:boolean;onFavorite:()=>void;onOpen:()=>void;}
export function ProductCard({product,favorite,onFavorite,onOpen}:ProductCardProps){
 const unavailable=product.available===false;
 return <article className={`product-card beefy-product${unavailable?' unavailable':''}`}>
  <button type="button" className="card-media" onClick={onOpen} aria-label={`Découvrir ${product.name}`}><FoodImage image={product.image} alt={product.name}/></button>
  <button type="button" className={`card-favorite${favorite?' is-favorite':''}`} aria-label={`${favorite?'Retirer':'Ajouter'} ${product.name} ${favorite?'des':'aux'} favoris`} aria-pressed={favorite} onClick={onFavorite}><Heart size={17} fill={favorite?'currentColor':'none'}/></button>
  <div className="card-body">{product.badge&&<span className="beefy-card-badge">{product.badge}</span>}<h3 className="card-title"><button type="button" onClick={onOpen}>{product.name}</button></h3><p className="card-text">{unavailable?'Temporairement indisponible':(product.summary||product.description).replace(/(\d) (?=k?g\b)/g,'$1\u00a0')}</p><div className="card-footer"><strong className="card-price">{euro(product.price)}<small>/ kg</small></strong><button type="button" className="card-add" aria-label={`Ajouter ${product.name}`} disabled={unavailable} onClick={onOpen}><Plus size={24}/></button></div></div>
 </article>;
}
