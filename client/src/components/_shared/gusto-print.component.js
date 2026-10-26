import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

export function useGustoPrintMode() {
  const router = useRouter();
  return {
    printMode: router.isReady && router.query.gustoPrint === "1",
    autoPrint: router.isReady && router.query.autoprint === "1",
  };
}

// Same print URL and readiness contract as L’Ambassade and Les Artistes.
export default function GustoPrint({ printMode, autoPrint, loading, error, hasContent, title, children }) {
  const ready = !loading && !error && hasContent;
  const triggered = useRef(false);
  const documentRef = useRef(null);
  useEffect(() => {
    if (!printMode || !autoPrint || !ready || triggered.current) return;
    let cancelled = false;
    const run = async () => {
      if (document.fonts?.ready) await document.fonts.ready;
      await Promise.all(Array.from(documentRef.current?.querySelectorAll("img") || [], (image) => image.decode().catch(() => {})));
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (cancelled || triggered.current) return;
        triggered.current = true;
        window.print();
      }));
    };
    run();
    return () => { cancelled = true; };
  }, [printMode, autoPrint, ready]);

  return <>
    {printMode && <Head><meta name="robots" content="noindex,nofollow" /></Head>}
    <main ref={documentRef} className={`gusto-print-mode${printMode ? " gusto-print-preview" : ""}`} data-gusto-print-ready={ready ? "true" : "false"}>
      <div className="gusto-print-toolbar" data-gusto-no-print>
        <button type="button" disabled={!ready} onClick={() => window.print()}>Imprimer</button>
      </div>
      <header className="gusto-print-masthead">
        <div><p className="eyebrow">CARTE & MENUS</p><h1>{title}<em>côté Bistrot.</em></h1></div>
        <Image className="gusto-print-botanical" src="/img/carte-menus/hero-leaves.webp" alt="" width={180} height={180} priority unoptimized aria-hidden="true" />
      </header>
      {loading ? <p>Chargement de la carte…</p> : error ? <p>Impossible de charger la carte.</p> : !hasContent ? <p>La carte ne contient actuellement aucun plat ou menu publié.</p> : children}
    </main>
  </>;
}
