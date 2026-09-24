import Link from "next/link";

export default function RendezvousHomeSection() {
  return <section className="rendezvous" aria-labelledby="rendezvous-title"><div className="rendezvous-inner page-container"><h2 id="rendezvous-title">On se retrouve<br /><em>à table ?</em></h2><span className="rendezvous-rule" /><div><p>Une réservation, une question ou un événement ?<br />Notre équipe vous répond avec plaisir.</p><Link href="/reservations" className="button button--white">Réserver maintenant <span>↗</span></Link></div></div></section>;
}
