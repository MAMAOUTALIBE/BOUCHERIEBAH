export function BeefyMark({className=''}:{className?:string}) {
  return <svg className={className} viewBox="0 0 64 52" fill="none" aria-hidden="true"><path d="M9 24C15 16 25 17 31 8C38-2 56 4 57 16C59 28 43 34 30 35C17 37 5 33 9 24Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round"/><path d="M8 26C2 41 21 48 38 43C52 40 59 30 57 17M18 25C25 26 38 24 43 17C48 10 40 8 37 13M23 20L29 17" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg>;
}
export function BeefyLogo(){return <span className="beefy-logo"><BeefyMark/><span>Beefy</span></span>;}
