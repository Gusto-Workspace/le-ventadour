import Image from "next/image";
import Link from "next/link";
import ArrowIcon from "@/components/_shared/arrow-icon.component";
import { homeAsset } from "@/_assets/utils/home-assets.utils";

export default function LocationHomeSection({ contact }) {
  const address = contact.addressText;
  return (
    <section className="location" aria-labelledby="location-title">
      <div className="location-inner page-container">
        <div className="location-photo"><Image src={homeAsset("montauban-tarn")} alt="Montauban et le pont sur le Tarn" fill sizes="(max-width: 760px) 100vw, 53vw" /></div>
        <div className="location-copy"><p className="eyebrow">NOTRE ADRESSE</p><h2 id="location-title">Sur les quais<br /><em>du Tarn.</em></h2>{address && <p>Retrouvez-nous au {address}, à deux pas du centre historique de Montauban, dans un cadre unique.</p>}<Link href="/contact" className="button button--dark">Nous trouver <span><ArrowIcon size={22} /></span></Link><div className="location-words"><span>TARN</span><span>PATRIMOINE</span><span>GASTRONOMIE</span><span>ART DE VIVRE</span></div></div>
        <Image src={homeAsset("feuille-section-montauban-tarn")} alt="" width={340} height={430} className="location-leaf" aria-hidden="true" />
      </div>
    </section>
  );
}
