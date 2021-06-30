import { Fragment, useContext, useEffect } from "react";
import { TournamentDataContext } from "../context/TournamentDataContext";
import Round from "../components/Round";

export default function Home() {
  const initialRound = parseInt(process.env.NEXT_PUBLIC_INITIAL_ROUND ?? "");
  const { tournament } = useContext(TournamentDataContext);
  if (!tournament.data) return <Fragment />;
  const { data } = tournament;
  const roundCount = initialRound + 1 - (data.currentRound?.toNumber() ?? 3);

  return (
    <div>
      {Array(roundCount)
        .fill(0)
        .map((_, i) => (
          <Round roundNumber={initialRound - i} key={i} />
        ))}
    </div>
  );
}
