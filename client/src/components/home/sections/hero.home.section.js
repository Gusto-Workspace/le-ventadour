import Image from "next/image";
import Link from "next/link";
import NavComponent from "@/components/_shared/nav/nav.component";
import ArrowIcon from "@/components/_shared/arrow-icon.component";
import { homeAsset } from "@/_assets/utils/home-assets.utils";

export default function HeroHomeSection() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <NavComponent />
      <div className="hero-inner page-container">
        <div className="hero-copy">
          <p className="eyebrow hero-eyebrow">CUISINE DE SAISON À MONTAUBAN</p>
          <h1 id="hero-title">Le goût<br /><em>des saisons.</em></h1>
          <span className="small-rule" />
          <p className="hero-intro">Au cœur d’un bâtiment du XVII<sup>e</sup> siècle,<br className="desktop-break" /> Le Ventadour cultive une cuisine vivante,<br className="desktop-break" /> inspirée par le marché et la région.</p>
          <div className="hero-actions">
            <Link href="/reservations" className="button button--rust">Réserver une table <span><ArrowIcon direction="right" size={22} /></span></Link>
            <a href="#cuisine" className="text-link">Découvrir notre cuisine</a>
          </div>
          <div className="hero-values" aria-label="Nos engagements">
            <div className="hero-value">
              <Image src={homeAsset("picto-1")} alt="" aria-hidden="true" width={64} height={64} />
              <span className="hero-value-label">PRODUITS<br />LOCAUX</span>
            </div>
            <span className="hero-value-divider" aria-hidden="true" />
            <div className="hero-value">
              <Image src={homeAsset("picto-2")} alt="" aria-hidden="true" width={64} height={64} />
              <span className="hero-value-label">CUISINE<br />DE SAISON</span>
            </div>
            <span className="hero-value-divider" aria-hidden="true" />
            <div className="hero-value">
              <Image src={homeAsset("picto-3")} alt="" aria-hidden="true" width={64} height={64} />
              <span className="hero-value-label">VINS DE<br />NOS RÉGIONS</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-arch"><Image src={homeAsset("hero-restaurant")} alt="La salle voûtée en briques du Ventadour" fill priority sizes="(max-width: 760px) 92vw, 43vw" /></div>
        </div>
        <div className="hero-aside">
          <div className="hero-keywords"><span>TERROIR</span><i /><span>PARTAGE</span><i /><span>SAVEURS</span></div>
          <Image src={homeAsset("phrase-section-hero-nav")} alt="Montauban depuis 1992" width={300} height={100} className="hero-handwritten" />
        </div>
        <span className="hero-century" aria-hidden="true">XVII</span>
      </div>
      <Image src={homeAsset("feuille-section-hero-nav")} alt="" width={500} height={440} className="hero-leaf" aria-hidden="true" />
    </section>
  );
}
