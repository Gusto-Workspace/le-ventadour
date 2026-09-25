import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import BrandComponent from "@/components/_shared/brand/brand.component";
import ArrowIcon from "@/components/_shared/arrow-icon.component";
import { useRestaurant } from "@/contexts/restaurant.context";
import { hasVisibleNews } from "@/_assets/utils/news.utils";

let hasResolvedInitialNavCheck = false;

const nav = [
  ["Accueil", "/"],
  ["Traiteur", "/traiteur"],
  ["Carte & Menus", "/carte-menus"],
  ["Actualités", "/news"],
  ["Contact", "/contact"],
];

export default function NavComponent() {
  const [open, setOpen] = useState(false);
  const [newsCheckResolved, setNewsCheckResolved] = useState(hasResolvedInitialNavCheck);
  const { pathname } = useRouter();
  const { restaurant, loading } = useRestaurant();
  const menuItems = nav.filter(([label]) => label !== "Actualités" || (newsCheckResolved && hasVisibleNews(restaurant)));

  useEffect(() => {
    if (newsCheckResolved) return undefined;
    if (restaurant || !loading) {
      const frame = window.requestAnimationFrame(() => {
        hasResolvedInitialNavCheck = true;
        setNewsCheckResolved(true);
      });
      return () => window.cancelAnimationFrame(frame);
    }
    const fallback = window.setTimeout(() => {
      hasResolvedInitialNavCheck = true;
      setNewsCheckResolved(true);
    }, 500);
    return () => window.clearTimeout(fallback);
  }, [loading, newsCheckResolved, restaurant]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onEscape = (event) => event.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  return (
    <>
      <header className={`site-header page-container${newsCheckResolved ? "" : " site-header--pending"}`} aria-hidden={!newsCheckResolved}>
        <BrandComponent active={pathname === "/"} />
        <nav className="desktop-nav" aria-label="Navigation principale">
          {menuItems.map(([label, href]) => <Link href={href} key={href} aria-current={pathname === href ? "page" : undefined}>{label}</Link>)}
          <Link href="/reservations" className="nav-booking">Réserver</Link>
        </nav>
        <button className="menu-toggle" type="button" aria-expanded={open} aria-controls="mobile-menu" aria-label="Ouvrir le menu" onClick={() => setOpen(true)}>
          <span /><span />
        </button>
      </header>
      <div className={`drawer-scrim${open ? " is-open" : ""}`} onClick={() => setOpen(false)} aria-hidden="true" />
      <aside id="mobile-menu" className={`mobile-drawer${open ? " is-open" : ""}`} aria-hidden={!open}>
        <div className="drawer-top"><BrandComponent /><button type="button" aria-label="Fermer le menu" onClick={() => setOpen(false)}>×</button></div>
        <nav aria-label="Navigation mobile">
          {menuItems.map(([label, href], i) => <Link href={href} key={href} aria-current={pathname === href ? "page" : undefined} tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}><small>0{i + 1}</small>{label}<span aria-hidden="true"><ArrowIcon size={18} /></span></Link>)}
        </nav>
        <Link href="/reservations" className="button button--rust" tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}>Réserver une table <span><ArrowIcon size={22} /></span></Link>
      </aside>
    </>
  );
}
