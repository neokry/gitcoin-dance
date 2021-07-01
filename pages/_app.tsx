import "tailwindcss/tailwind.css";
import { TournamentDataProvider } from "../context/TournamnetDataProvider";
import { MediaConfiguration, Networks } from "@zoralabs/nft-components";
import { SWRConfig } from "swr";
import type { AppProps } from "next/app";
import axios from "axios";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        refreshInterval: 0,
        fetcher: (resource, init) =>
          axios.get(resource, init).then((x) => x.data),
      }}
    >
      <MediaConfiguration networkId={Networks.RINKEBY}>
        <TournamentDataProvider tournamentId={3} chainId={4}>
          <Component {...pageProps} />
        </TournamentDataProvider>
      </MediaConfiguration>
    </SWRConfig>
  );
}
export default MyApp;
