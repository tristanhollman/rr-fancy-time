import styles from "@/styles/Page.module.css";
import dynamic from "next/dynamic";
import { Inter } from "next/font/google";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

// The default NoSSR method does not work for the Globe scene that's using the external `react-globe.gl` library.
// So we have to fall back to the next.js way of disabling ssr.
const Scene = dynamic(() => import("@/components/globe/GlobeScene"), {
  ssr: false,
});

export default function Globe() {
  return (
    <>
      <Head>
        <title>Fancy Globe</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <Scene />
      </main>
    </>
  );
}
