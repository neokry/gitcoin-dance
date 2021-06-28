import { createContext } from "react";
import { useTournamentType } from "../hooks/useTournament";

export type TournamentDataContext = {
  tournament: useTournamentType;
};

export const TournamentDataContext = createContext<TournamentDataContext>({
  tournament: { loading: true, error: undefined, data: undefined },
});
