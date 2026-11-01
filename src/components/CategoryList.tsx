import {BeefyMark} from './BeefyLogo';
import {Flame,Beef,UtensilsCrossed,CookingPot} from 'lucide-react';
import type {Category} from '../types';
import './CategoryList.css';
interface CategoryListProps {categories:{name:Category;image:string}[];category:Category;setCategory:(category:Category)=>void;}
export function CategoryList({categories,category,setCategory}:CategoryListProps){
 return <div className="categories category-strip" role="group" aria-label="Catégories">{categories.map((item,i)=>{const Icon=i===0?BeefyMark:i===1?Beef:i===2?CookingPot:i===3?Flame:UtensilsCrossed;return <button type="button" className={`category${category===item.name?' active':''}`} aria-pressed={category===item.name} key={item.name} onClick={()=>setCategory(item.name)}><span className="category-image"><Icon/></span><span className="category-label">{item.name==='Tout'?'Tout':item.name}</span></button>;})}</div>;
}
