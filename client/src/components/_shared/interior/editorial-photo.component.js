import Image from "next/image";

export default function EditorialPhoto({ src, alt = "", label, className = "", sizes = "(max-width: 900px) 90vw, 45vw" }) {
  return (
    <div className={`editorial-photo${src ? "" : " editorial-photo--placeholder"}${className ? ` ${className}` : ""}`}>
      {src ? <Image src={src} alt={alt} fill sizes={sizes} /> : <span>{label || "Photographie à venir"}</span>}
    </div>
  );
}
