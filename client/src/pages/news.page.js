import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import ArrowIcon from "@/components/_shared/arrow-icon.component";
import InteriorLayout from "@/components/_shared/interior/interior-layout.component";
import EditorialPhoto from "@/components/_shared/interior/editorial-photo.component";
import { homeAsset } from "@/_assets/utils/home-assets.utils";
import { useRestaurant } from "@/contexts/restaurant.context";
import { formatNewsDate, getNewsExcerpt, getNewsImage, getNewsLabel, getVisibleNews } from "@/_assets/utils/news.utils";

function NewsMedia({ item, className = "" }) {
  const image = getNewsImage(item);
  return <div className={`ventadour-news-image ${className}`}>
    <img src={image} alt={item?.title || "Actualité du Ventadour"} loading="lazy" />
  </div>;
}

function NewsCopy({ item, index, onOpen }) {
  const excerpt = getNewsExcerpt(item.description);
  return <div className="ventadour-news-copy">
    <p className="eyebrow interior-eyebrow">{getNewsLabel(item, index)}</p>
    {formatNewsDate(item.published_at) ? <time dateTime={new Date(item.published_at).toISOString()}>{formatNewsDate(item.published_at)}</time> : null}
    <h2>{item.title}</h2>
    {excerpt ? <p>{excerpt}</p> : null}
    <button type="button" className="ventadour-news-read" onClick={onOpen}>Lire l’actualité <ArrowIcon size={18} /></button>
  </div>;
}

export default function NewsPage() {
  const router = useRouter();
  const { restaurant, loading, error } = useRestaurant();
  const news = useMemo(() => getVisibleNews(restaurant), [restaurant]);
  const [selected, setSelected] = useState(null);
  const [missingArticle, setMissingArticle] = useState(false);
  const requestedId = Array.isArray(router.query.article) ? router.query.article[0] : router.query.article;

  const closeArticle = useCallback(() => {
    setSelected(null);
    setMissingArticle(false);
    if (requestedId) {
      const query = { ...router.query };
      delete query.article;
      router.replace({ pathname: router.pathname, query }, undefined, { shallow: true, scroll: false });
    }
  }, [requestedId, router]);

  useEffect(() => {
    if (!router.isReady || loading || !requestedId) return;
    const found = news.find((item) => String(item?._id) === String(requestedId));
    setSelected(found || null);
    setMissingArticle(!found);
  }, [loading, news, requestedId, router.isReady]);

  useEffect(() => {
    if (!selected) return undefined;
    const previousOverflow = document.body.style.overflow;
    const previousPadding = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
    const onEscape = (event) => { if (event.key === "Escape") closeArticle(); };
    document.addEventListener("keydown", onEscape);
    return () => { document.body.style.overflow = previousOverflow; document.body.style.paddingRight = previousPadding; document.removeEventListener("keydown", onEscape); };
  }, [closeArticle, selected]);

  return <InteriorLayout title="Actualités" description="Les nouvelles et les rendez-vous du Ventadour à Montauban.">
    <section className="inside-intro ventadour-news-intro page-container" aria-labelledby="news-title">
      <div className="inside-intro-copy"><p className="eyebrow interior-eyebrow">ACTUALITÉS</p><h1 id="news-title">Au fil<br /><em>des saisons.</em></h1><span className="small-rule" /><p className="ventadour-news-intro-description">Les nouvelles, les rencontres et les moments qui font vivre notre maison.</p></div>
      <div className="ventadour-news-photo-pair" aria-label="Photographies du restaurant">
        <EditorialPhoto className="ventadour-news-photo-main" src={homeAsset("hero-restaurant")} alt="La salle du Ventadour" sizes="(max-width: 900px) 88vw, 42vw" />
        <EditorialPhoto className="ventadour-news-photo-overlap" src={homeAsset("traiteur-02")} alt="Des verrines préparées au Ventadour" sizes="(max-width: 900px) 54vw, 27vw" />
      </div>
    </section>
    <section className="ventadour-news-feed page-container" aria-label="Les actualités du Ventadour" aria-live="polite">
      {loading ? <p className="api-data-message" role="status">Chargement des actualités…</p> : null}
      {!loading && !error && !news.length ? <p className="ventadour-news-empty">Aucune actualité n’est publiée pour le moment.</p> : null}
      {missingArticle ? <p className="api-data-message" role="alert">Cette actualité est introuvable ou n’est plus publiée.</p> : null}
      {news.map((item, index) => <article className={`ventadour-news-entry${index === 0 ? " ventadour-news-entry--lead" : ""}`} key={item._id || `${item.title}-${index}`}>
        <NewsMedia item={item} />
        <NewsCopy item={item} index={index} onOpen={() => { setMissingArticle(false); setSelected(item); }} />
      </article>)}
    </section>
    <section className="inside-outro" aria-labelledby="news-outro-title"><div className="inside-outro-inner page-container"><div><p className="eyebrow eyebrow--light">À TABLE</p><h2 id="news-outro-title">On se retrouve<br /><em>au Ventadour.</em></h2></div><div><p>Prolongez la découverte autour d’une table.</p><Link href="/reservations" className="button button--white">Réserver une table <span><ArrowIcon size={22} /></span></Link></div></div></section>
    {selected ? <div className="ventadour-news-modal" role="dialog" aria-modal="true" aria-labelledby="news-article-title">
      <button type="button" className="ventadour-news-modal-backdrop" onClick={closeArticle} aria-label="Fermer l’actualité" />
      <article><button type="button" className="ventadour-news-modal-close" onClick={closeArticle} aria-label="Fermer l’actualité">×</button><p className="eyebrow">{getNewsLabel(selected, 0)} · {formatNewsDate(selected.published_at) || "Actualité"}</p><h2 id="news-article-title">{selected.title}</h2><NewsMedia item={selected} />{selected.description ? <div className="ventadour-news-modal-body" dangerouslySetInnerHTML={{ __html: selected.description }} /> : null}</article>
    </div> : null}
  </InteriorLayout>;
}
