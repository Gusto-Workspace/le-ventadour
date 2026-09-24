import Image from "next/image";
import Link from "next/link";
import { homeAsset } from "@/_assets/utils/home-assets.utils";

export default function CateringHomeSection() {
  return (
    <section className="catering" aria-labelledby="catering-title">
      <div className="catering-inner page-container">
        <div className="catering-copy">
          <p className="eyebrow catering-eyebrow">TRAITEUR</p>
          <h2 id="catering-title">Vos événements<br /><em>en bonne compagnie.</em></h2>
          <p>La même exigence et le même goût du détail, à vos côtés pour vos réceptions, réunions ou événements privés et professionnels.</p>
          <Link href="/traiteur" className="button button--dark">Découvrir notre offre traiteur <span>↗</span></Link>
        </div>
        <div className="catering-first">
          <Image src={homeAsset("traiteur-01")} alt="Bouchées préparées pour une réception" fill sizes="(max-width: 900px) 90vw, 45vw" />
        </div>
        <div className="catering-categories">
          <span>RÉCEPTIONS</span>
          <span>SÉMINAIRES</span>
          <span>MARIAGES</span>
          <span>ÉVÉNEMENTS PRIVÉS</span>
        </div>
        <div className="catering-second">
          <Image src={homeAsset("traiteur-02")} alt="Verrines et pièces cocktail du Ventadour" fill sizes="(max-width: 900px) 75vw, 34vw" />
        </div>
        <Image src={homeAsset("phrase-section-traiteur")} alt="Le goût du partage" width={470} height={157} className="catering-handwritten" />
        <p className="catering-vertical" aria-hidden="true"><span>CUISINE DE SAISON</span><i /><span>TOUJOURS PLUS LOIN ENSEMBLE</span></p>
        <Image src={homeAsset("section-traiteur-xvii")} alt="" width={1448} height={1086} className="catering-century" aria-hidden="true" />
        <Image src={homeAsset("feuille-section-traiteur")} alt="" width={340} height={340} className="catering-leaf" aria-hidden="true" />
      </div>
    </section>
  );
}
