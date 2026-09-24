import Image from "next/image";
import Link from "next/link";
import ArrowIcon from "@/components/_shared/arrow-icon.component";
import { homeAsset } from "@/_assets/utils/home-assets.utils";

export default function CuisineHomeSection() {
  return (
    <section id="cuisine" className="cuisine" aria-labelledby="cuisine-title">
      <div className="cuisine-inner page-container">
        <p className="cuisine-side-note">DES PRODUITS<br />DE SAISON,<br />TOUJOURS<span /></p>
        <div className="cuisine-fish"><Image src={homeAsset("plat-poisson")} alt="Poisson rôti et garniture de saison" fill sizes="(max-width: 760px) 90vw, 34vw" /></div>
        <div className="cuisine-copy"><p className="eyebrow eyebrow--line">LE GOÛT DU MARCHÉ</p><h2 id="cuisine-title">Une cuisine<br /><em>vraie et<br />inventive.</em></h2><p>Chaque semaine, notre menu évolue au rythme du marché. Des produits frais, une cuisine de saison, des assiettes précises et généreuses.</p><Link href="/carte-menus" className="button button--dark">Voir la carte & menus <span><ArrowIcon size={22} /></span></Link></div>
        <div className="cuisine-dessert"><Image src={homeAsset("dessert")} alt="Dessert aux fruits rouges" fill sizes="(max-width: 760px) 55vw, 18vw" /></div>
        <blockquote>“Le plaisir<br />des belles choses<br />simplement.”<span /></blockquote>
        <Image src={homeAsset("feuille-section-cuisine")} alt="" width={480} height={480} className="cuisine-leaf" aria-hidden="true" />
      </div>
    </section>
  );
}
