import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { TournamentFetcher, TournamentData } from "../data/TournamentFetcher";

export type useTournamentType = {
  loading: boolean;
  error?: string;
  data?: TournamentData;
};

export function useTournament(
  tournamentId: number,
  chainId: number
): useTournamentType {
  const [data, setData] = useState<TournamentData | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>("");

  const loadTournament = async (tournamentId: number, chainId: number) => {
    console.log("loading tournament");
    setLoading(true);
    const network = ethers.providers.getNetwork(chainId);
    const provider = new ethers.providers.InfuraProvider(
      network,
      process.env.NEXT_PUBLIC_INFURA_ID
    );
    const address = process.env.NEXT_PUBLIC_TOURNAMENT_ADDRESS ?? "";

    const fetcher: TournamentFetcher = new TournamentFetcher(
      provider,
      chainId,
      address,
      tournamentId
    );

    const { error, data } = await fetcher.fetchTournamentData();
    if (error) {
      setError(error);
      console.log(error);
    }
    if (data) {
      setData(data);
      console.log("tournamnet loaded");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (loading || data || error) return;
    loadTournament(tournamentId, chainId);
  }, [tournamentId, chainId, loading, data, error]);

  return { data, loading, error };
}
