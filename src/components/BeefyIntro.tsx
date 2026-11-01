import {useCallback,useState} from 'react';
import {ArrowRight,Leaf,ShieldCheck,ShoppingBag} from 'lucide-react';
import {Modal} from './Modal';
import {BeefyLogo} from './BeefyLogo';
import './beefy-intro.css';

export function BeefyIntro(){
 const [open,setOpen]=useState(false);
 const close=useCallback(()=>setOpen(false),[]);
 const discover=()=>{
  setOpen(false);
  window.requestAnimationFrame(()=>document.getElementById('carte')?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'}));
 };
 return <>
  <div className="beefy-intro-link"><button type="button" onClick={()=>setOpen(true)}>L’esprit Beefy <ArrowRight size={16}/></button></div>
  {open&&<Modal title="L’esprit Beefy" onClose={close}>
   <section className="beefy-intro">
    <div className="beefy-intro-top"><BeefyLogo/><button type="button" onClick={close}>Passer</button></div>
    <div className="beefy-intro-copy"><span>LE GOÛT DES BELLES CHOSES</span><h2>De bonnes pièces.<br/>De beaux moments.</h2><p>Le plaisir d’une belle viande, choisie avec soin. Retrouvez vos pièces préférées et préparez votre prochain bon repas.</p></div>
    <div className="beefy-intro-values"><span><Leaf/><span>Pièces choisies</span></span><span><ShieldCheck/><span>Découpe soignée</span></span><span><ShoppingBag/><span>Commande facile</span></span></div>
    <div className="beefy-intro-photo"><img src="/images/beefy-hero.webp" alt="Pièces de bœuf et romarin sur une ardoise"/></div>
    <div className="beefy-intro-bottom"><span className="beefy-intro-dot" aria-hidden="true"/><button type="button" className="primary" onClick={discover}>Découvrir nos pièces <ArrowRight size={21}/></button></div>
   </section>
  </Modal>}
 </>;
}
