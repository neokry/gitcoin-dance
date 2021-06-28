import { useTournament } from "../hooks/useTournament";
import { TournamentDataContext } from "./TournamentDataContext";

export type TournamentDataProviderProps = {
  tournamentId: number;
  chainId: number;
  children: React.ReactNode;
};

export const TournamentDataProvider = ({
  tournamentId,
  chainId,
  children,
}: TournamentDataProviderProps) => {
  const tournament = useTournament(tournamentId, chainId);

  return (
    <TournamentDataContext.Provider value={{ tournament: tournament }}>
      {children}
    </TournamentDataContext.Provider>
  );
};
