import GlobeScene from "@/components/globe/GlobeScene";
import styles from "@/styles/Home.module.css";
import { Inter } from "next/font/google";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

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
        <GlobeScene />
      </main>
    </>
  );
}
