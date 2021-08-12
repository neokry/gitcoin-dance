import { useContext } from "react";
import { TournamentDataContext } from "../context/TournamentDataContext";

export default function useRound(roundNumber: number): { players: number[], isWinner: (playerId: number) => boolean | null } {
  const { tournament } = useContext(TournamentDataContext);
  const initialRound = parseInt(process.env.NEXT_PUBLIC_INITIAL_ROUND ?? "");
  const playerCount = parseInt(process.env.NEXT_PUBLIC_PLAYER_COUNT ?? "");
  const roundSize = Math.pow(2, roundNumber);

  const { data } = tournament;

  //Checks is player has won the round
  const isWinner = (playerId: number): boolean | null => {
    if (!data) return null;
    const currentRound = data.currentRound?.toNumber();

    if (roundNumber === 1 && currentRound === 0) {
      if (!data?.bracketWinners) return null;
      return playerId === data.bracketWinners[0];
    } else {
      const roundData = data?.roundHistory?.filter(
        (x) => x.round.toNumber() == roundNumber
      );

      if (!roundData || roundData.length < 1) return null;
      const winners = roundData[0].bracketWinners.slice(
        0,
        Math.pow(2, roundNumber - 1)
      );
      return winners.find((x) => x == playerId) !== undefined;
    }
  };


  //Gets players in the current round
  let players: number[] = [];
  switch (roundNumber) {
    case initialRound:
      players = Array(playerCount)
        .fill(0)
        .map((_, i) => i);
      break;
    case 0:
      if (!data?.bracketWinners) break;
      players = [data.bracketWinners[0]];
      break;
    default:
      const roundData = data?.roundHistory?.filter(
        (x) => x.round.toNumber() == roundNumber + 1
      );
      if (!roundData || roundData.length < 1) break;
      players = roundData[0].bracketWinners.slice(0, roundSize);
      break;
  }

  return { players, isWinner }
}