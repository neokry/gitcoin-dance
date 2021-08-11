import { useRouter } from "next/dist/client/router";
import { useContext, useEffect, useState } from "react";
import MatchupCard from "../../../components/MatchupCard";
import { TournamentDataContext } from "../../../context/TournamentDataContext";
import { Fragment } from "react";
import Layout from "../../../components/Layout";
import useRound from "../../../hooks/useRound";
import { ZKSyncDataContext } from "../../../context/ZKSyncDataContext";
import usePlayer from "../../../hooks/usePlayer";

export default function Matchup() {
  const router = useRouter();
  let { round, player } = router.query;
  const [opponentId, setOpponentId] = useState(-1);

  const playerId = parseInt(player as string);
  const roundNumber = parseInt(round as string);
  const initialRound = parseInt(process.env.NEXT_PUBLIC_INITIAL_ROUND ?? "");

  const { tournament } = useContext(TournamentDataContext);
  const { zkData } = useContext(ZKSyncDataContext);
  const pinfo1 = usePlayer(playerId, roundNumber);
  const pinfo2 = usePlayer(opponentId, roundNumber);

  useEffect(() => {
    if (opponentId > 0) pinfo2.getPlayerFunds();
  }, [opponentId, pinfo2]);

  useEffect(() => {
    if (!tournament.data) return;
    //Finds the current NFTs opponent for the round
    switch (roundNumber) {
      case initialRound:
        if (playerId % 2 == 0) setOpponentId(playerId + 1);
        else setOpponentId(playerId - 1);
        break;
      case 0:
        break;
      default:
        const roundData = data.roundHistory?.filter(
          (x) => x.round.toNumber() == roundNumber + 1
        );

        if (!roundData || roundData.length < 1) return;
        const winners = roundData[0].bracketWinners.slice(
          0,
          Math.pow(2, roundNumber)
        );

        let oponentIndex;
        const playerIndex = winners.findIndex((x) => x == playerId);
        if (playerIndex % 2 == 0) oponentIndex = playerIndex + 1;
        else oponentIndex = playerIndex - 1;
        setOpponentId(winners[oponentIndex]);
        break;
    }
  }, [tournament])

  if (!tournament.data) return <Fragment />;
  const { data } = tournament;

  const isCurrentRound = () => {
    return roundNumber === data.currentRound?.toNumber();
  };



  return (
    <Layout>
      {/* Displays the two NFTs in a matchup */}
      <div className="container block py-8 mx-auto px-10 md:flex md:justify-around lg:py-16 xl:px-0">
        <div className="w-100 lg:w-1/2">
          <MatchupCard
            playerIndex={playerId}
            isCurrentRound={isCurrentRound()}
            roundNumber={roundNumber}
            isWinning={pinfo1.funds > pinfo2.funds}
          />
        </div>
        <div className="my-14 md:mb-0 md:mt-12 md:w-28 lg:40 lg:mt-32">
          <div className="primary-color text-center versus-side">
            <span className="font-light text-center text-5xl italic">vs.</span>
          </div>
          {/*
            <p className="text-center mt-6 md:mt-3">
              <span className="text-indigo-900 text-indigo m-3 text-sm md:block">Ends in</span>
              <span className="text-white border border-white p-2 italic font-light md:block md:w-20 md:mx-auto">01:02:55</span>
            </p> 
          */}
        </div>
        {opponentId !== -1 && (
          <div className="w-100 lg:w-1/2">
            <MatchupCard
              playerIndex={opponentId}
              isCurrentRound={isCurrentRound()}
              roundNumber={roundNumber}
              isWinning={pinfo2.funds > pinfo1.funds}
            />
          </div>
        )}
      </div>
    </Layout>
  );
}
