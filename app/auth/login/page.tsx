import styles from '../styles.module.css'
import Image from 'next/image'
import { defaultMetadata } from '@utils/utils';
import { Metadata } from 'next';
import LoginPageContents from './contents';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Login | Thullo",
};

const LoginPage = () => {
  return (
    <section className={styles.auth__Wrap}>
      <section className={styles.auth__Content}>
        <Image
          alt='thullo logo'
          src={'/Logo-small.svg'}
          width={40}
          height={40}
        />

        <h3 className={styles.title__Text}>
          <span>Sign In</span>
          <span className={styles.intro__Text}>Jump back right in to where you left off</span>
        </h3>

        <br />

        <LoginPageContents />
      </section>
    </section>
  )
}

export default LoginPage;