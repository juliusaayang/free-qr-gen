import "@/src/styles/globals.css";
import type { AppPropsWithLayout } from "@/types/global";

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);
  return getLayout(<Component {...pageProps} />);
}
