import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import BrandComponent from "@/components/_shared/brand/brand.component";

const nav = [
  ["Traiteur", "/traiteur"],
  ["Carte & Menus", "/carte-menus"],
  ["Contact", "/contact"],
];

export default function NavComponent() {
  const [open, setOpen] = useState(false);
  const { pathname } = useRouter();

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
      <header className="site-header page-container">
        <BrandComponent active={pathname === "/"} />
        <nav className="desktop-nav" aria-label="Navigation principale">
          {nav.map(([label, href]) => <Link href={href} key={href} aria-current={pathname === href ? "page" : undefined}>{label}</Link>)}
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
          {nav.map(([label, href], i) => <Link href={href} key={href} aria-current={pathname === href ? "page" : undefined} tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}><small>0{i + 1}</small>{label}<span>↗</span></Link>)}
        </nav>
        <Link href="/reservations" className="button button--rust" tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}>Réserver une table <span>↗</span></Link>
        <p>23 quai Villebourbon<br />82000 Montauban</p>
      </aside>
    </>
  );
}
