import { Noto_Sans, Poppins } from "next/font/google";
import "./globals.css";
import NextTopLoader from 'nextjs-toploader';
import NavigationBar from "@components/NavigationBar/NavigationBar";
import SessionWrapper from "@components/SessionWrapper/SessionWrapper";
import { Toaster } from 'sonner';
import AppContextProvider from "@contexts/AppContext";

const poppins = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700', '900'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
});

export const notoSans = Noto_Sans({
  weight: ['100', '200', '300', '400', '500', '600', '700', '900'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SessionWrapper>
        <AppContextProvider>
          <body className={poppins.className}>
            <Toaster
              richColors
              position="top-right"
            />

            <NextTopLoader
              color="#2F80ED"
              zIndex={99999}
            />

            <NavigationBar />

            <main className="main__Layout">
              {children}
            </main>

          </body>
        </AppContextProvider>
      </SessionWrapper>
    </html>
  );
}
