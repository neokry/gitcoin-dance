import { useContext, Fragment, useEffect, useState } from "react";
import { TournamentDataContext } from "../context/TournamentDataContext";
import { NFTDataProvider } from "@zoralabs/nft-components";
import Thumbnail from "./Thumbnail";
import Link from "next/link";

export default function Round({ roundNumber }: { roundNumber: number }) {
  const { tournament } = useContext(TournamentDataContext);
  const initialRound = parseInt(process.env.NEXT_PUBLIC_INITIAL_ROUND ?? "");
  const playerCount = parseInt(process.env.NEXT_PUBLIC_PLAYER_COUNT ?? "");

  if (!tournament.data) return <Fragment />;

  const { data } = tournament;
  const roundSize = Math.pow(2, roundNumber);

  //Checks is player has won the round
  const isWinner = (playerId: number): boolean | null => {
    switch (roundNumber) {
      case 1:
        if (!data.bracketWinners) return null;
        return playerId === data.bracketWinners[0];
      case 0:
        return true;
      default:
        const roundData = data.roundHistory?.filter(
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
      if (!data.bracketWinners) break;
      players = [data.bracketWinners[0]];
      break;
    default:
      const roundData = data.roundHistory?.filter(
        (x) => x.round.toNumber() == roundNumber + 1
      );
      if (!roundData || roundData.length < 1) break;
      players = roundData[0].bracketWinners.slice(0, roundSize);
      break;
  }

  return (
    <div className="flex">
      {/* Generates NFT thumbnails for the current round */}
      {players.map((playerIndex) => (
        <NFTDataProvider
          key={roundNumber + "-" + playerIndex}
          id={data.tokenIds ? data.tokenIds[playerIndex].toString() : ""}
          contract={data.tokenAddresses ? data.tokenAddresses[playerIndex] : ""}
        >
          <Link href={`round/${roundNumber}/${playerIndex}`} passHref={true}>
            <a>
              <Thumbnail isWinner={isWinner(playerIndex)} />
            </a>
          </Link>
        </NFTDataProvider>
      ))}
    </div>
  );
}
