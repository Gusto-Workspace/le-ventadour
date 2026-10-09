import HomePageComponent from "@/components/home/home.page.component";
import SeoHead from "@/components/_shared/seo/seo-head.component";

export default function HomePage() {
  return (
    <>
      <SeoHead title="Le Ventadour — Restaurant & Traiteur à Montauban" description="Au cœur de Montauban, Le Ventadour cultive depuis 1992 une cuisine de saison, généreuse et inventive." path="/" />
      <HomePageComponent />
    </>
  );
}
