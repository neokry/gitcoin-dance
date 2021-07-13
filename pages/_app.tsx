import "tailwindcss/tailwind.css";
import { TournamentDataProvider } from "../context/TournamnetDataProvider";
import { ZKSyncDataProvider } from "../context/ZKSyncDataProvider";
import { MediaConfiguration, Networks } from "@zoralabs/nft-components";
import { SWRConfig } from "swr";
import type { AppProps } from "next/app";
import axios from "axios";

const tournamentId: number = parseInt(
  process.env.NEXT_PUBLIC_TOURNAMENT_ID ?? "1"
);
const chainId: number = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID ?? "4");

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        refreshInterval: 0,
        fetcher: (resource, init) =>
          axios.get(resource, init).then((x) => x.data),
      }}
    >
      <MediaConfiguration
        networkId={chainId === 4 ? Networks.RINKEBY : Networks.MAINNET}
      >
        <TournamentDataProvider tournamentId={tournamentId} chainId={chainId}>
          <ZKSyncDataProvider chainId={chainId}>
            <Component {...pageProps} />
          </ZKSyncDataProvider>
        </TournamentDataProvider>
      </MediaConfiguration>
    </SWRConfig>
  );
}

const zkSyncWrapper = () => {};

export default MyApp;
