import styles from "./page.module.css";
import Image from "next/image";
import { notoSans } from "./layout";
import { Metadata } from "next";
import CustomButton from "@components/CustomButton/CustomButton";
import { defaultMetadata } from "@utils/utils";

export const metadata: Metadata = defaultMetadata;

export default function Home() {
  return <section className={styles.home__Wrap}>
    <section className={styles.intro__Wrap}>
      <h1 className={`${styles.banner__Text} ${notoSans.className}`}>
        <span>Thullo brings all your tasks, teammates, and tools together</span>
        <span className={styles.slogan__Txt}>Keep everything in the same place—even if your team isn't.</span>
      </h1>

      <CustomButton
        className={styles.get__Started__Btn}
        useLink={true}
        linkLocation="/auth/login"
        title="Get Started"
        padding="1rem 1.4rem"
        fontSize="1rem"
        width="max-content"
        fontWeight="400"
      />
    </section>

    <Image
      alt="landing illustration"
      src={'/landing.svg'}
      width={550}
      height={550}
      className={styles.banner__Img}
      priority
    />
  </section>
}
