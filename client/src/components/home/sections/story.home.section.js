import Image from "next/image";
import Link from "next/link";
import ArrowIcon from "@/components/_shared/arrow-icon.component";
import { homeAsset } from "@/_assets/utils/home-assets.utils";

export default function StoryHomeSection() {
  return (
    <section className="story" aria-labelledby="story-title">
      <span className="story-year-bg" aria-hidden="true">1992</span>
      <div className="story-inner page-container">
        <div className="story-intro"><p className="eyebrow eyebrow--light">DEPUIS <span /></p><p className="story-date">1992</p><p className="story-tagline">Une histoire<br />familiale à Montauban.</p></div>
        <div className="story-chef"><Image src={homeAsset("chef")} alt="Le chef du Ventadour dresse une assiette" fill sizes="(max-width: 760px) 85vw, 29vw" /></div>
        <div className="story-copy"><p className="eyebrow eyebrow--light">L’ESPRIT VENTADOUR <span /></p><h2 id="story-title">Des mains,<br /><em>une histoire.</em></h2><p>Depuis 1992, Le Ventadour accueille ses convives dans un lieu chargé d’histoire, où la cuisine est une affaire de passion, de transmission et de rencontres.</p><Link href="/contact" className="story-link">Notre histoire <ArrowIcon size={18} /></Link></div>
        <div className="story-sign"><Image src={homeAsset("enseigne")} alt="L’enseigne Le Ventadour sur la brique" fill sizes="(max-width: 760px) 45vw, 20vw" /></div>
        <Image src={homeAsset("phrase-section-chef")} alt="Plus qu’une table, une histoire de famille." width={470} height={157} className="story-handwritten" />
        <Image src={homeAsset("feuille-section-chef")} alt="" width={280} height={310} className="story-leaf" aria-hidden="true" />
      </div>
    </section>
  );
}
