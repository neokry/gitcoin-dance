import { Fragment, useContext } from "react";
import { TournamentDataContext } from "../context/TournamentDataContext";
import Link from "next/link";
import Thumbnail from "./Thumbnail";
import { NFTDataProvider } from "@zoralabs/nft-components";
import useRound from "../hooks/useRound";

export default function MatchupThumbnail({
  roundNumber,
  players,
  isLeading,
}: {
  roundNumber: number;
  players: number[];
  isLeading: boolean;
}) {
  const { tournament } = useContext(TournamentDataContext);
  const { isWinner } = useRound(roundNumber);
  const finalWinner = (id: number) => roundNumber == 1 && isWinner(id);

  if (!tournament.data) return <Fragment />;
  const { data } = tournament;

  const pid1 = players[0];
  const pid2 = players[1];

  const getGameClass = (id: number) =>
    isWinner(id) ? "game-win" : "game-loss";
  //const getGameClass = (id: number) => "";

  return (
    <Fragment>
      <li
        className={`relative flex flex-initial justify-center flex-col ${
          isLeading ? "items-start" : "items-end"
        } ${getGameClass(pid1)} py-10 tournament-bracket-item`}
      >
        {/* if team win add this calss name "game-win" else "game-loss */}
        <div className={`tournament-bracket-match w-48 ${getGameClass(pid1)}`}>
          {/* if team win add this calss name "team-win" else "team-loss"*/}
          <div className={`${finalWinner(pid1) ? "final-winner" : ""}`}>
            <h1 className="final-winner-text pb-4 text-white italic font-light text-sm md:text-lg text-center">
              YOU WIN!
            </h1>
            <NFTDataProvider
              key={roundNumber + "-" + pid1}
              id={data.tokenIds ? data.tokenIds[pid1].toString() : ""}
              contract={data.tokenAddresses ? data.tokenAddresses[pid1] : ""}
            >
              <Link href={`round/${roundNumber}/${pid1}`} passHref={true}>
                <a>
                  <Thumbnail isWinner={isWinner(pid1)} />
                </a>
              </Link>
            </NFTDataProvider>
          </div>
        </div>
        <div className="versus-main">
          <h1 className="primary-color italic font-light text-lg">VS.</h1>
        </div>
      </li>
      <li
        className={`relative flex flex-initial justify-center flex-col ${
          isLeading ? "items-start" : "items-end"
        } ${getGameClass(pid2)} py-10 tournament-bracket-item`}
      >
        {/* if team win add this calss name "game-win" else "game-loss */}
        <div className={`tournament-bracket-match w-48 ${getGameClass(pid2)}`}>
          {/* if team win add this calss name "team-win" else "team-loss"*/}
          <div className={`${finalWinner(pid2) ? "final-winner" : ""}`}>
            <h1 className="final-winner-text pb-4 text-white italic font-light text-sm md:text-lg text-center">
              YOU WIN!
            </h1>
            <NFTDataProvider
              key={roundNumber + "-" + pid2}
              id={data.tokenIds ? data.tokenIds[pid2].toString() : ""}
              contract={data.tokenAddresses ? data.tokenAddresses[pid2] : ""}
            >
              <Link href={`round/${roundNumber}/${pid2}`} passHref={true}>
                <a>
                  <Thumbnail isWinner={isWinner(pid2)} />
                </a>
              </Link>
            </NFTDataProvider>
          </div>
        </div>
      </li>
    </Fragment>
  );
}
