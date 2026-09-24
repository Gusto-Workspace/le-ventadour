import Link from "next/link";

export default function BrandComponent({ footer = false, active = false }) {
  return (
    <Link href="/" className={`brand${footer ? " brand--footer" : ""}${active ? " brand--current" : ""}`} aria-label="Le Ventadour, accueil" aria-current={active ? "page" : undefined}>
      <span>Le Ventadour</span>
      <small>RESTAURANT{footer ? " & TRAITEUR" : ""}</small>
    </Link>
  );
}
