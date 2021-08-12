import { useEffect, useState } from "react";
import { ZKData, ZKSyncFetcher } from "../data/ZKSyncFetcher";

export type useZKDataType = {
  loading: boolean;
  error?: string;
  data?: ZKData;
};

export function useZKData(accounts: string[], chainId: number): useZKDataType {
  const [data, setData] = useState<ZKData | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const loadZKData = async (accounts: string[], chainId: number) => {
    setLoading(true);

    const fetcher = new ZKSyncFetcher();
    await fetcher.connect(chainId);

    try {
      const data = await fetcher.fetchZKData(accounts);
      setData(data);
    } catch (err) {
      setError(err);
      console.log("err", err);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (loading || data || error || accounts.length === 0) return;
    loadZKData(accounts, chainId);
  }, [accounts, chainId, loading, data, error]);

  return { data, loading, error };
}
