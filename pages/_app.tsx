import "tailwindcss/tailwind.css";
import "../styles/globals.scss";
import { TournamentDataProvider } from "../context/TournamnetDataProvider";
import { ZKSyncDataProvider } from "../context/ZKSyncDataProvider";
import { MediaConfiguration, Networks } from "@zoralabs/nft-components";
import { SWRConfig } from "swr";
import type { AppProps } from "next/app";
import axios from "axios";
import Head from "next/head";
import { Fragment } from "react";

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
            <Fragment>
              <Head>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Montserrat" />
                <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Poppins" />
                <link href="https://fonts.cdnfonts.com/css/gobold" rel="stylesheet" />
              </Head>
              <Component {...pageProps} />
            </Fragment>
          </ZKSyncDataProvider>
        </TournamentDataProvider>
      </MediaConfiguration>
    </SWRConfig>
  );
}

const zkSyncWrapper = () => {};

export default MyApp;
