import {BeefyMark} from './BeefyLogo';
import type {Category} from '../types';
import './CategoryList.css';

function CutIcon({kind}:{kind:'steak'|'stew'|'mince'|'organs'}) {
 const paths={
  steak:<><path d="M5 12c1-3 5-3 8-5s7-1 7 3-5 6-10 6-7-1-5-4Z"/><path d="M5 13v4c1 3 11 3 15-2v-5M11 11l2-1m3 0h.01"/></>,
  stew:<><path d="M5 12c0-4 14-4 14 0v5c-2 4-12 4-14 0Z"/><path d="M5 13c3 3 11 3 14 0M8 10l2-2 3 2-2 2Zm6-1 2-1 2 2-2 2Zm-6 5 2-2 3 1-2 2Zm5-1 3-2 2 2-2 2Z"/></>,
  mince:<><path d="m5 10 2-1 1-3 3 1 2-2 2 2 3 1v3l2 2-1 5c-4 2-10 2-14 0l-1-5Z"/><path d="m8 10 2 1-2 2 2 2-2 2m5-8-2 2 3 2-2 2 2 2m3-6-1 2 2 2-2 2"/></>,
  organs:<><path d="M9 5c-1 4-5 6-5 10s4 6 7 3l1-4M15 5c1 4 5 6 5 10s-4 6-7 3l-1-4M9 5c2 0 3 3 3 5 0-2 1-5 3-5M12 10v4"/></>,
 };
 return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[kind]}</svg>;
}
const cutKinds:Record<string,'steak'|'stew'|'mince'|'organs'>={Steaks:'steak','À mijoter':'stew',Haché:'mince',Abats:'organs'};
interface CategoryListProps {categories:{name:Category;image:string}[];category:Category;setCategory:(category:Category)=>void;}
export function CategoryList({categories,category,setCategory}:CategoryListProps){
 return <div className="categories category-strip" role="group" aria-label="Catégories">{categories.map((item,i)=><button type="button" className={`category${category===item.name?' active':''}`} aria-pressed={category===item.name} key={item.name} onClick={()=>setCategory(item.name)}><span className="category-image">{i===0?<BeefyMark/>:<CutIcon kind={cutKinds[item.name]??'steak'}/>}</span><span className="category-label">{item.name}</span></button>)}</div>;
}
