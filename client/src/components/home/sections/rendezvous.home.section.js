import Link from "next/link";
import ArrowIcon from "@/components/_shared/arrow-icon.component";

export default function RendezvousHomeSection({ href = "/reservations", buttonText = "Réserver maintenant" }) {
  return <section className="rendezvous" aria-labelledby="rendezvous-title"><div className="rendezvous-inner page-container"><h2 id="rendezvous-title">On se retrouve<br /><em>à table ?</em></h2><span className="rendezvous-rule" /><div><p>Une réservation, une question ou un événement ?<br />Notre équipe vous répond avec plaisir.</p><Link href={href} className="button button--white">{buttonText} <span><ArrowIcon size={22} /></span></Link></div></div></section>;
}
