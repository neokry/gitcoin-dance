import { Fragment, useContext, useEffect } from "react";
import { TournamentDataContext } from "../context/TournamentDataContext";
import Round from "../components/Round";
import Layout from "../components/Layout";

//Main page of the app, displays NFT thumbnails and overall round structure
export default function Home() {
  const initialRound = parseInt(process.env.NEXT_PUBLIC_INITIAL_ROUND ?? "");
  const { tournament } = useContext(TournamentDataContext);
  if (!tournament.data) return <Fragment />;
  const { data } = tournament;
  const roundCount = initialRound + 1 - (data.currentRound?.toNumber() ?? 3);

  return (
    <Layout>
      <div className="container mx-auto px-3 md:px-14 md:py-0 lg:px-10 xl:px-0">
        {/* Generates each round for tournament */}
        {/* {Array(roundCount)
          .fill(0)
          .map((_, i) => (
            <Round roundNumber={initialRound - i} key={i} />
          ))} */}
          <Round roundNumber={3} key={3} />
      </div>
    </Layout>
  );
}
