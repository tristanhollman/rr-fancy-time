import SakuraScene from "@/components/sakura-tree/SakuraScene";
import styles from "@/styles/Page.module.css";
import { NoSsr } from "@mui/material";
import { Inter } from "next/font/google";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export default function Sakura() {
  return (
    <>
      <Head>
        <title>Fancy Sakura Petals</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <NoSsr>
          <SakuraScene />
        </NoSsr>
      </main>
    </>
  );
}
