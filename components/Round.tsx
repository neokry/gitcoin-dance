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
      console.log(players);
      break;
  }

  return (
    <div className="overflow-x-scroll width-100vh px-4 xl:px-0">
      <div className="flex xl:flex-row">
        <div className="block tournament-bracket-round w-3/4 xl:w-auto xl:flex-auto">
          <ul className="flex flex-col justify-center w-full h-full xl:flex-wrap">
            <li className="relative flex flex-initial justify-center flex-col items-start py-10 tournament-bracket-item"> {/* if team win add this calss name "game-win" else "game-loss */}
              <div className="tournament-bracket-match w-48"> {/* if team win add this calss name "team-win" else "team-loss"*/}
                <NFTDataProvider key={roundNumber + "-" + 0}
                  id={data.tokenIds ? data.tokenIds[0].toString() : ""}
                  contract={data.tokenAddresses ? data.tokenAddresses[0] : ""}>
                  <Link href={`round/${roundNumber}/${0}`} passHref={true}>
                    <a>
                      <Thumbnail isWinner={isWinner(0)} />
                    </a>
                  </Link>
                </NFTDataProvider>
              </div>
              <div className="versus-main">
                <h1 className="primary-color italic font-light text-lg">VS</h1>
              </div>
            </li>
            <li className="relative flex flex-initial justify-center flex-col items-start py-10 tournament-bracket-item"> {/* if team win add this calss name "game-win" else "game-loss */}
              <div className="tournament-bracket-match w-48"> {/* if team win add this calss name "team-win" else "team-loss"*/}
                <NFTDataProvider key={roundNumber + "-" + 1}
                  id={data.tokenIds ? data.tokenIds[1].toString() : ""}
                  contract={data.tokenAddresses ? data.tokenAddresses[1] : ""}>
                  <Link href={`round/${roundNumber}/${1}`} passHref={true}>
                    <a>
                      <Thumbnail isWinner={isWinner(1)} />
                    </a>
                  </Link>
                </NFTDataProvider>
              </div>
            </li>
            <li className="relative flex flex-initial justify-center flex-col items-start py-10 tournament-bracket-item"> {/* if team win add this calss name "game-win" else "game-loss */}
              <div className="tournament-bracket-match w-48"> {/* if team win add this calss name "team-win" else "team-loss"*/}
                <NFTDataProvider key={roundNumber + "-" + 2}
                  id={data.tokenIds ? data.tokenIds[2].toString() : ""}
                  contract={data.tokenAddresses ? data.tokenAddresses[2] : ""}>
                  <Link href={`round/${roundNumber}/${2}`} passHref={true}>
                    <a>
                      <Thumbnail isWinner={isWinner(2)} />
                    </a>
                  </Link>
                </NFTDataProvider>
              </div>
              <div className="versus-main">
                <h1 className="primary-color italic font-light text-lg">VS</h1>
              </div>
            </li>
            <li className="relative flex flex-initial justify-center flex-col items-start py-10 tournament-bracket-item"> {/* if team win add this calss name "game-win" else "game-loss */}
              <div className="tournament-bracket-match w-48"> {/* if team win add this calss name "team-win" else "team-loss"*/}
                <NFTDataProvider key={roundNumber + "-" + 3}
                  id={data.tokenIds ? data.tokenIds[3].toString() : ""}
                  contract={data.tokenAddresses ? data.tokenAddresses[3] : ""}>
                  <Link href={`round/${roundNumber}/${3}`} passHref={true}>
                    <a>
                      <Thumbnail isWinner={isWinner(3)} />
                    </a>
                  </Link>
                </NFTDataProvider>
              </div>
            </li>
          </ul>
        </div>
        <div className="block tournament-bracket-round w-3/4 xl:w-auto xl:flex-auto">
          <ul className="flex flex-col justify-around w-full h-full xl:flex-wrap">
            <li className="relative flex flex-initial justify-center flex-col items-center py-10 tournament-bracket-item"> {/* if team win add this calss name "game-win" else "game-loss */}
              <div className="tournament-bracket-match w-48 justify-center"> {/* if team win add this calss name "team-win" else "team-loss"*/}
                <div className="w-32 h-24 xl:w-52 xl:h-36 2xl:w-72 2xl:h-56 flex justify-center items-center bg-body">
                  <div className="">
                    <h1 className="primary-color italic font-light text-sm md:text-lg xl:text-2xl opacity-40 text-center">WINNER <br />MATCHUP 1</h1>
                  </div>
                </div>
              </div>
              {/* <div className="versus-main left-44 bottom-56">
                <h1 className="primary-color italic font-light text-lg">VS</h1>
              </div> */}
            </li>
            <li className="relative flex flex-initial justify-center flex-col items-center py-10 tournament-bracket-item"> {/* if team win add this calss name "game-win" else "game-loss */}
              <div className="tournament-bracket-match w-48 justify-center"> {/* if team win add this calss name "team-win" else "team-loss"*/}
                <div className="w-32 h-24 xl:w-52 xl:h-36 2xl:w-72 2xl:h-56 flex justify-center items-center bg-body">
                  <div className="">
                    <h1 className="primary-color italic font-light text-sm md:text-lg xl:text-2xl opacity-40 text-center">WINNER <br />MATCHUP 2</h1>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div className="block tournament-bracket-round w-3/4 xl:w-auto xl:flex-auto">
          <ul className="flex flex-col justify-center w-full h-full xl:flex-wrap">
            <li className="relative flex flex-initial justify-center flex-col items-center py-10"> {/* if team win add this calss name "win" */}
              <div className="tournament-bracket-match w-48 justify-center"> {/* if team win add this calss name "team-win" else "team-loss"*/}
                <div className="w-32 h-24 xl:w-52 xl:h-36 2xl:w-72 2xl:h-56 flex justify-center items-center bg-body">
                  <div className="">
                    <h1 className="primary-color italic font-light text-sm md:text-lg xl:text-2xl opacity-40 text-center">FINALIST 1</h1>
                  </div>
                </div>
              </div>
              {/* <div className="versus-main left-44">
                <h1 className="primary-color italic font-light text-lg">VS</h1>
              </div> */}
            </li>
            <li className="relative flex flex-initial justify-center flex-col items-center py-10 tournament-item-right"> {/* if team win add this calss name "win" */}
              <div className="tournament-bracket-match w-48 justify-center"> {/* if team win add this calss name "team-win" else "team-loss"*/}
                <div className="w-32 h-24 xl:w-52 xl:h-36 2xl:w-72 2xl:h-56 flex justify-center items-center bg-body">
                  <div className="">
                    <h1 className="primary-color italic font-light text-sm md:text-lg xl:text-2xl opacity-40 text-center">FINALIST 2</h1>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div className="block tournament-bracket-round w-3/4 xl:w-auto xl:flex-auto">
          <ul className="flex flex-col justify-around w-full h-full xl:flex-wrap">
            <li className="relative flex flex-initial justify-center flex-col items-center py-10 tournament-bracket-item"> {/* if team win add this calss name "win" */}
              <div className="tournament-bracket-match w-48 justify-center"> {/* if team win add this calss name "team-win" else "team-loss"*/}
                <div className="w-32 h-24 xl:w-52 xl:h-36 2xl:w-72 2xl:h-56 flex justify-center items-center bg-body">
                  <div>
                    <h1 className="primary-color italic font-light text-sm md:text-lg xl:text-2xl opacity-40 text-center">WINNER <br />MATCHUP 3</h1>
                  </div>
                </div>
              </div>
              {/* <div className="versus-main left-44 bottom-56">
                <h1 className="primary-color italic font-light text-lg">VS</h1>
              </div> */}
            </li>
            <li className="relative flex-initial justify-center flex-col items-center py-10 tournament-bracket-item flex"> {/* if team win add this calss name "win" */}
              <div className="tournament-bracket-match w-48 justify-center"> {/* if team win add this calss name "team-win" else "team-loss"*/}
                <div className="w-32 h-24 xl:w-52 xl:h-36 2xl:w-72 2xl:h-56 flex justify-center items-center bg-body">
                  <div>
                    <h1 className="primary-color italic font-light text-sm md:text-lg xl:text-2xl opacity-40 text-center">WINNER <br />MATCHUP 4</h1>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div className="block tournament-bracket-round w-3/4 xl:w-auto xl:flex-auto">
          <ul className="flex flex-col justify-center w-full h-full xl:flex-wrap">
            <li className="relative flex flex-initial justify-center flex-col items-end py-10 tournament-bracket-item"> {/* if team win add this calss name "game-win" else "game-loss */}
              <div className="tournament-bracket-match w-48 justify-end"> {/* if team win add this calss name "team-win" else "team-loss"*/}
                <NFTDataProvider key={roundNumber + "-" + 3}
                  id={data.tokenIds ? data.tokenIds[3].toString() : ""}
                  contract={data.tokenAddresses ? data.tokenAddresses[3] : ""}>
                  <Link href={`round/${roundNumber}/${3}`} passHref={true}>
                    <a>
                      <Thumbnail isWinner={isWinner(4)} />
                    </a>
                  </Link>
                </NFTDataProvider>
              </div>
              <div className="versus-main left-60">
                <h1 className="primary-color italic font-light text-lg">VS</h1>
              </div>
            </li>
            <li className="relative flex flex-initial justify-center flex-col items-end py-10 tournament-bracket-item"> {/* if team win add this calss name "game-win" else "game-loss */}
              <div className="tournament-bracket-match w-48 justify-end"> {/* if team win add this calss name "team-win" else "team-loss"*/}
                <NFTDataProvider key={roundNumber + "-" + 5}
                  id={data.tokenIds ? data.tokenIds[5].toString() : ""}
                  contract={data.tokenAddresses ? data.tokenAddresses[5] : ""}>
                  <Link href={`round/${roundNumber}/${5}`} passHref={true}>
                    <a>
                      <Thumbnail isWinner={isWinner(5)} />
                    </a>
                  </Link>
                </NFTDataProvider>
              </div>
            </li>
            <li className="relative flex flex-initial justify-center flex-col items-end py-10 tournament-bracket-item"> {/* if team win add this calss name "game-win" else "game-loss" */}
              <div className="tournament-bracket-match w-48 justify-end"> {/* if team win add this calss name "team-win" else "team-loss"*/}
                <NFTDataProvider key={roundNumber + "-" + 6}
                  id={data.tokenIds ? data.tokenIds[6].toString() : ""}
                  contract={data.tokenAddresses ? data.tokenAddresses[6] : ""}>
                  <Link href={`round/${roundNumber}/${6}`} passHref={true}>
                    <a>
                      <Thumbnail isWinner={isWinner(6)} />
                    </a>
                  </Link>
                </NFTDataProvider>
              </div>
              <div className="versus-main left-60">
                <h1 className="primary-color italic font-light text-lg">VS</h1>
              </div>
            </li>
            <li className="relative flex flex-initial justify-center flex-col items-end py-10 tournament-bracket-item"> {/* if team win add this calss name "game-win" else "game-loss */}
              <div className="tournament-bracket-match w-48 justify-end"> {/* if team win add this calss name "team-win" else "team-loss"*/}
                <NFTDataProvider key={roundNumber + "-" + 7}
                  id={data.tokenIds ? data.tokenIds[7].toString() : ""}
                  contract={data.tokenAddresses ? data.tokenAddresses[7] : ""}>
                  <Link href={`round/${roundNumber}/${7}`} passHref={true}>
                    <a>
                      <Thumbnail isWinner={isWinner(7)} />
                    </a>
                  </Link>
                </NFTDataProvider>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    // <div className="flex">
    //   Generates  NFT thumbnails for the current round
    //   {players.map((playerIndex) => (
    //     <NFTDataProvider
    //       key={roundNumber + "-" + playerIndex}
    //       id={data.tokenIds ? data.tokenIds[playerIndex].toString() : ""}
    //       contract={data.tokenAddresses ? data.tokenAddresses[playerIndex] : ""}
    //     >
    //       <Link href={`round/${roundNumber}/${playerIndex}`} passHref={true}>
    //         <a>
    //           <Thumbnail isWinner={isWinner(playerIndex)} />
    //         </a>
    //       </Link>
    //     </NFTDataProvider>
    //   ))} 
    // </div>
  );
}
