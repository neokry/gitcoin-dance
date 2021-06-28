import "../styles/globals.css";
import { TournamentDataProvider } from "../context/TournamnetDataProvider";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <TournamentDataProvider tournamentId={1} chainId={4}>
      <Component {...pageProps} />
    </TournamentDataProvider>
  );
}
export default MyApp;
