import StaticSakuraScene from "@/components/sakura-static/StaticSakuraScene";
import styles from "@/styles/Page.module.css";
import { NoSsr } from "@mui/material";
import { Inter } from "next/font/google";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>Fancy Time</title>
        <meta
          name="description"
          content="Fancy Time application for a mini hackaton."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="./favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <NoSsr>
          <StaticSakuraScene />
        </NoSsr>
      </main>
    </>
  );
}
