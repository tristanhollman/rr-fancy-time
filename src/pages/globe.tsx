import styles from "@/styles/Home.module.css";
import dynamic from "next/dynamic";
import { Inter } from "next/font/google";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

// The default NoSSR method does not work for the Globe scene that's using the external `globe` library.
// So we have to fall back to the next.js way of disabling ssr.
const Scene = dynamic(() => import("@/components/globe/GlobeScene"), {
  ssr: false,
});

export default function Globe() {
  return (
    <>
      <Head>
        <title>Fancy Globe</title>
        <meta
          name="description"
          content="Fancy Time application for a mini hackaton."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="./favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <Scene />
      </main>
    </>
  );
}
