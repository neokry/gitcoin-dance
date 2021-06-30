import "tailwindcss/tailwind.css";
import { TournamentDataProvider } from "../context/TournamnetDataProvider";
import { MediaConfiguration, Networks } from "@zoralabs/nft-components";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MediaConfiguration networkId={Networks.RINKEBY}>
      <TournamentDataProvider tournamentId={3} chainId={4}>
        <Component {...pageProps} />
      </TournamentDataProvider>
    </MediaConfiguration>
  );
}
export default MyApp;
