export function FoodImage({image,alt='',className=''}:{image:string;alt?:string;className?:string}){
  const source=/^(https?:\/\/|\/)/.test(image)?image:`/images/${image}.${image.startsWith('beefy-')?'png':'jpg'}`;
  return <img className={`food-image ${className}`} src={source} alt={alt} loading="lazy" onError={event=>{const fallback='/images/beefy-ribeye.png';if(!event.currentTarget.src.endsWith(fallback))event.currentTarget.src=fallback;}}/>;
}
