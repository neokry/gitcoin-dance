import { useRouter } from "next/dist/client/router";
import { useContext } from "react";
import MatchupCard from "../../../components/MatchupCard";
import { TournamentDataContext } from "../../../context/TournamentDataContext";
import { Fragment } from "react";
import Layout from "../../../components/Layout";

export default function Matchup() {
  const router = useRouter();
  let { round, player } = router.query;

  const playerId = parseInt(player as string);
  const roundNumber = parseInt(round as string);
  const initialRound = parseInt(process.env.NEXT_PUBLIC_INITIAL_ROUND ?? "");

  const { tournament } = useContext(TournamentDataContext);
  if (!tournament.data) return <Fragment />;
  const { data } = tournament;

  const isCurrentRound = () => {
    return roundNumber === data.currentRound?.toNumber();
  };

  let opponentId;

  switch (roundNumber) {
    case initialRound:
      if (playerId % 2 == 0) opponentId = playerId + 1;
      else opponentId = playerId - 1;
      break;
    case 0:
      opponentId = null;
      break;
    default:
      const roundData = data.roundHistory?.filter(
        (x) => x.round.toNumber() == roundNumber + 1
      );

      if (!roundData || roundData.length < 1) return <Fragment />;
      const winners = roundData[0].bracketWinners.slice(
        0,
        Math.pow(2, roundNumber)
      );

      let oponentIndex;
      const playerIndex = winners.findIndex((x) => x == playerId);
      if (playerIndex % 2 == 0) oponentIndex = playerIndex + 1;
      else oponentIndex = playerIndex - 1;
      opponentId = winners[oponentIndex];
      break;
  }

  return (
    <Layout>
      <div className="flex items-center justify-around">
        <div className="m-4 w-1/2">
          <MatchupCard
            playerIndex={playerId}
            isCurrentRound={isCurrentRound()}
            roundNumber={roundNumber}
          />
        </div>
        {opponentId !== null && (
          <div className="m-4 w-1/2">
            <MatchupCard
              playerIndex={opponentId}
              isCurrentRound={isCurrentRound()}
              roundNumber={roundNumber}
            />
          </div>
        )}
      </div>
    </Layout>
  );
}
