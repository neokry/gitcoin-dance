import "tailwindcss/tailwind.css";
import { TournamentDataProvider } from "../context/TournamnetDataProvider";
import { ZKSyncDataProvider } from "../context/ZKSyncDataProvider";
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
        <TournamentDataProvider tournamentId={4} chainId={4}>
          <ZKSyncDataProvider chainId={4}>
            <Component {...pageProps} />
          </ZKSyncDataProvider>
        </TournamentDataProvider>
      </MediaConfiguration>
    </SWRConfig>
  );
}

const zkSyncWrapper = () => {};

export default MyApp;
