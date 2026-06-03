import "@/src/styles/globals.css";
import type { AppPropsWithLayout } from "@/types/global";
import ErrorBoundary from "@/components/global/ErrorBoundary";

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <ErrorBoundary>
      {getLayout(<Component {...pageProps} />)}
    </ErrorBoundary>
  );
}
