import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { Fetcher, TournamentData } from "../data/Fetcher";

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
  const [error, setError] = useState("");

  const loadTournament = async (tournamentId: number, chainId: number) => {
    setLoading(true);
    const network = ethers.providers.getNetwork(chainId);
    const provider = ethers.getDefaultProvider(network, {
      infura: process.env.NEXT_PUBLIC_INFURA_ID,
    });
    const address = process.env.NEXT_PUBLIC_TOURNAMENT_ADDRESS ?? "";

    const fetcher: Fetcher = new Fetcher(
      provider,
      chainId,
      address,
      tournamentId
    );

    const { error, data } = await fetcher.fetchTournamentData();
    if (error) setError(error);
    if (data) setData(data);
    setLoading(false);
  };

  useEffect(() => {
    if (loading || data) return;
    loadTournament(tournamentId, chainId);
  }, [tournamentId, chainId, loading, data]);

  return { data, loading, error };
}
