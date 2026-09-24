import Link from "next/link";
import Image from "next/image";
import InteriorLayout from "@/components/_shared/interior/interior-layout.component";
import EditorialPhoto from "@/components/_shared/interior/editorial-photo.component";
import { homeAsset } from "@/_assets/utils/home-assets.utils";
import { aLaCarte, menus } from "@/_assets/data/editorial.data";

function MenuTemplateSections({ sections, showAllergens = false }) {
  return (
    <div className="menu-template-sections">
      {sections.map((section, sectionIndex) => (
        <div className="menu-template-course" key={section.id || `${section.title}-${sectionIndex}`}>
          <div className="menu-template-course-heading">
            <p className="menu-template-course-index"><span>{String(sectionIndex + 1).padStart(2, "0")}</span><i /></p>
            <h3>{section.title}</h3>
          </div>
          <div className="menu-template-course-items">
            {section.items.map((item, itemIndex) => (
              <div className="menu-template-item" key={item.id || `${item.name}-${itemIndex}`}>
                <p>{item.name}</p>
                {showAllergens && item.allergens?.length > 0 && <small className="menu-template-allergens">( allergène {item.allergens.join(", ")} )</small>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function MenuTemplate({ menu, index }) {
  const menuName = menu.title.replace(/^menu\s+/i, "").trim();
  const menuId = menu.id || `menu-${index + 1}`;
  const imageSrc = menu.image?.startsWith("/") ? menu.image : menu.image ? homeAsset(menu.image) : null;

  return (
    <section id={menuId} className={`printed-menu menu-template${index % 2 === 1 ? " menu-template--white" : ""}`} aria-labelledby={`${menuId}-title`}>
      <div className="printed-menu-inner menu-template-inner page-container">
        <div className="printed-menu-editorial menu-template-editorial">
          <div className="printed-menu-heading menu-template-heading">
            {menu.eyebrow && <p className="eyebrow">{menu.eyebrow}</p>}
            <h2 id={`${menuId}-title`}><span>Menu</span><em>{menuName}</em></h2>
            {menu.price != null && <p className="menu-formula-price">{menu.price} €</p>}
            {(menu.period || menu.subtitle) && <p className="printed-menu-period">{menu.period || menu.subtitle}</p>}
            {menu.description && <><span className="small-rule" /><p className="printed-menu-description">{menu.description}</p></>}
            {menu.notes?.length > 0 && <div className="printed-menu-notes">{menu.notes.map((note, noteIndex) => <p key={note.id || noteIndex}>{note.text || note}</p>)}</div>}
          </div>
          {imageSrc && (
            <div className="printed-menu-photo-wrap">
              <span className="printed-menu-photo-backdrop" aria-hidden="true" />
              <EditorialPhoto className="printed-menu-photo" src={imageSrc} alt={menu.imageAlt || ""} sizes="(max-width: 1000px) 82vw, 32vw" />
              {menu.imageLabel && <span className="printed-menu-photo-label" aria-hidden="true">{menu.imageLabel}</span>}
            </div>
          )}
        </div>
        <div className="menu-template-content">
          <MenuTemplateSections sections={menu.sections} showAllergens={menu.showAllergens} />
        </div>
      </div>
      <Image src={homeAsset("feuille-section-cuisine")} alt="" width={480} height={480} className="printed-menu-leaf" aria-hidden="true" />
      {menu.price != null && <span className="printed-menu-number" aria-hidden="true">{menu.price}</span>}
    </section>
  );
}

export default function CarteMenusPage() {
  return (
    <InteriorLayout title="Carte & Menus" description="Le Ventadour côté Bistrot : David Aranda, cuisine de saison, Menu Bistrot, Menu Ventadour et carte à Montauban.">
      <section className="inside-intro inside-intro--menu page-container" aria-labelledby="menu-page-title">
        <div className="inside-intro-copy">
          <p className="eyebrow interior-eyebrow">CARTE & MENUS</p>
          <h1 id="menu-page-title">Le Ventadour<br /><em>côté Bistrot.</em></h1>
          <span className="small-rule" />
          <p>Une cuisine régionale, vivante et inventive, dessinée par le marché et servie dans la chaleur des voûtes de briques.</p>
          <a className="button button--rust" href="#menu-bistrot">Découvrir les menus <span>→</span></a>
        </div>
        <div className="editorial-arch-visual">
          <div className="editorial-photo editorial-arch-photo">
            <Image src="/img/carte-menus/hero-photo.png" alt="Une assiette de saison dans la salle du Ventadour" fill priority sizes="(max-width: 900px) 92vw, (max-width: 1250px) 46vw, 43vw" />
          </div>
          <span className="editorial-arch-leaves" aria-hidden="true">
            <Image src="/img/carte-menus/hero-leaves.png" alt="" fill sizes="(max-width: 600px) 28vw, 18vw" />
          </span>
          <span className="editorial-arch-badge" aria-hidden="true">
            <Image src="/img/carte-menus/hero-badge.png" alt="" fill sizes="(max-width: 600px) 24vw, 13vw" />
          </span>
        </div>
      </section>

      <section className="chef-editorial" aria-labelledby="chef-title">
        <span className="story-year-bg chef-editorial-year" aria-hidden="true">1992</span>
        <div className="chef-editorial-inner page-container">
          <EditorialPhoto className="chef-editorial-photo" src={homeAsset("chef")} alt="David Aranda à la cuisine" sizes="(max-width: 900px) 75vw, 31vw" />
          <div className="chef-editorial-copy">
            <p className="eyebrow eyebrow--light">LE CHEF <span /></p>
            <h2 id="chef-title">La main de<br /><em>David Aranda.</em></h2>
            <p>Chef du Ventadour depuis 1992 et Maître Restaurateur, David Aranda fait évoluer une cuisine régionale au gré des saisons. Sa formule Côté Bistrot donne chaque semaine une nouvelle place aux produits frais du marché.</p>
            <p>Ici, les entrées, plats et desserts sont travaillés sur place à partir de produits bruts. Le goût du fait maison guide aussi bien la table du midi que les réceptions.</p>
          </div>
        </div>
      </section>

      <section className="menu-philosophy page-container" aria-labelledby="philosophy-title">
        <div className="menu-philosophy-head">
          <p className="eyebrow interior-eyebrow">LA CUISINE DU VENTADOUR</p>
          <h2 id="philosophy-title">Le produit d’abord.<br /><em>Le plaisir toujours.</em></h2>
        </div>
        <div className="menu-philosophy-body">
          <p>Des produits régionaux et de saison, des assiettes renouvelées, une cuisine qui reste fidèle au goût. C’est tout l’esprit du Ventadour, dans un lieu de briques face au Pont Vieux.</p>
          <EditorialPhoto className="menu-philosophy-photo" src={homeAsset("plat-poisson")} alt="Assiette de poisson et garniture de saison" sizes="(max-width: 900px) 90vw, 52vw" />
          <span className="menu-philosophy-side">FRAÎCHEUR <i /> SAISON <i /> FAIT MAISON</span>
        </div>
      </section>

      {menus.map((menu, index) => <MenuTemplate menu={menu} index={index} key={`${menu.id || menu.title}-${index}`} />)}

      <section id="notre-carte" className="a-la-carte" aria-labelledby="carte-title">
        <div className="a-la-carte-inner page-container">
          <div className="a-la-carte-heading">
            <p className="eyebrow interior-eyebrow">À LA CARTE</p>
            <h2 id="carte-title">Notre <em>Carte</em></h2>
          </div>
          <div className="a-la-carte-list">
            {aLaCarte.map((item) => (
              <div className="a-la-carte-item" key={item.name}>
                <p>{item.name}</p>
                <span>{item.price} €</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="inside-outro" aria-labelledby="menu-outro-title">
        <div className="inside-outro-inner page-container">
          <div><p className="eyebrow eyebrow--light">À TABLE</p><h2 id="menu-outro-title">À bientôt<br /><em>au Ventadour.</em></h2></div>
          <div><p>Une question ou une envie particulière ? L’équipe du Ventadour se tient à votre écoute.</p><Link href="/reservations" className="button button--white">Réserver une table <span>↗</span></Link><Link href="/contact" className="inside-outro-link">Nous contacter ↗</Link></div>
        </div>
      </section>
    </InteriorLayout>
  );
}
