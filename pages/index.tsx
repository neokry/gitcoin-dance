import { Fragment, useContext } from "react";
import { TournamentDataContext } from "../context/TournamentDataContext";
import Layout from "../components/Layout";
import MatchupThumbnail from "../components/MatchupThumbnail";
import useRound from "../hooks/useRound";

//Main page of the app, displays NFT thumbnails and overall round structure
export default function Home() {
  const initialRound = parseInt(process.env.NEXT_PUBLIC_INITIAL_ROUND ?? "");
  const { tournament } = useContext(TournamentDataContext);
  const roundTwo = useRound(2);
  const roundOne = useRound(1);
  if (!tournament.data) return <Fragment />;
  const { data } = tournament;
  const roundCount = initialRound + 1 - (data.currentRound?.toNumber() ?? 3);
  const currentRound = tournament.data?.currentRound?.toNumber() ?? 3

  return (
    <Layout>
      <div className="container mx-auto px-3 md:px-14 md:py-0 lg:px-10 xl:px-0">
        <div className="overflow-x-scroll width-100vh px-4 xl:px-0">
          {/* ROUND THREE LEADING */}
          <div className="flex xl:flex-row">
            <div className="block tournament-bracket-round w-3/4 xl:w-auto xl:flex-auto">
              <ul className="flex flex-col justify-center w-full h-full xl:flex-wrap">
                <MatchupThumbnail roundNumber={3} players={[0, 1]} isLeading={true} />
                <MatchupThumbnail roundNumber={3} players={[2, 3]} isLeading={true} />
              </ul>
            </div>

            {/* ROUND TWO LEADING */}
            <div className="block tournament-bracket-round w-3/4 xl:w-auto xl:flex-auto">
              <ul className="flex flex-col justify-around w-full h-full xl:flex-wrap">
                {currentRound < 3 ? (
                  <MatchupThumbnail roundNumber={2} players={[roundTwo.players[0], roundTwo.players[1]]} isLeading={true} />) : (<RoundTwoPlaceholderLeading />)}
              </ul>
            </div>

            {/* ROUND ONE */}
            <div className="block tournament-bracket-round w-3/4 xl:w-auto xl:flex-auto">
              <ul className="flex flex-col justify-center w-full h-full xl:flex-wrap">
                {currentRound < 2 ? (
                  <MatchupThumbnail roundNumber={1} players={[roundOne.players[0], roundOne.players[1]]} isLeading={true} />) : (<RoundOnePlaceholder />)}

              </ul>
            </div>

            {/* ROUND TWO TRAILING */}
            <div className="block tournament-bracket-round w-3/4 xl:w-auto xl:flex-auto">
              <ul className="flex flex-col justify-around w-full h-full xl:flex-wrap">
                {currentRound < 3 ? (
                  <MatchupThumbnail roundNumber={2} players={[roundTwo.players[2], roundTwo.players[3]]} isLeading={true} />) : (<RoundTwoPlaceholderTrailing />)}
              </ul>
            </div>

            {/* ROUND THREE TRAILING */}
            <div className="block tournament-bracket-round w-3/4 xl:w-auto xl:flex-auto">
              <ul className="flex flex-col justify-center w-full h-full xl:flex-wrap">
                <MatchupThumbnail roundNumber={3} players={[4, 5]} isLeading={false} />
                <MatchupThumbnail roundNumber={3} players={[6, 7]} isLeading={false} />
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function RoundOnePlaceholder() {
  return (
    <Fragment>
      <li className="relative flex flex-initial justify-center flex-col items-center py-10"> {/* if team win add this calss name "win" */}
        <div className="tournament-bracket-match w-48 justify-center"> {/* if team win add this calss name "team-win" else "team-loss"*/}
          <div className="w-32 h-24 xl:w-52 xl:h-36 2xl:w-72 2xl:h-56 flex justify-center items-center bg-body">
            <div className="">
              <h1 className="primary-color italic font-light text-sm md:text-lg xl:text-2xl opacity-40 text-center">FINALIST 1</h1>
            </div>
          </div>
        </div>
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
    </Fragment>
  )
}

function RoundTwoPlaceholderLeading() {
  return (
    <Fragment>
      <li className="relative flex flex-initial justify-center flex-col items-center py-10 tournament-bracket-item"> {/* if team win add this calss name "game-win" else "game-loss */}
        <div className="tournament-bracket-match w-48 justify-center"> {/* if team win add this calss name "team-win" else "team-loss"*/}
          <div className="w-32 h-24 xl:w-52 xl:h-36 2xl:w-72 2xl:h-56 flex justify-center items-center bg-body">
            <div className="">
              <h1 className="primary-color italic font-light text-sm md:text-lg xl:text-2xl opacity-40 text-center">WINNER <br />MATCHUP 1</h1>
            </div>
          </div>
        </div>
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
    </Fragment>
  )
}

function RoundTwoPlaceholderTrailing() {
  return (
    <Fragment>
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
    </Fragment>
  )
}
