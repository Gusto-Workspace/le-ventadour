import Head from "next/head";
import HomePageComponent from "@/components/home/home.page.component";

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Le Ventadour — Restaurant & Traiteur à Montauban</title>
        <meta
          name="description"
          content="Au cœur de Montauban, Le Ventadour cultive depuis 1992 une cuisine de saison, généreuse et inventive."
        />
      </Head>
      <HomePageComponent />
    </>
  );
}
