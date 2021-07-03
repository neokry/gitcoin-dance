import { useContext } from "react";
import { Network } from "zksync/build/types";
import { useZKData } from "../hooks/useZKData";
import { TournamentDataContext } from "./TournamentDataContext";
import { ZKSyncDataContext } from "./ZKSyncDataContext";

export type ZKDataProviderProps = {
  chainId: number;
  children: React.ReactNode;
};

export const ZKSyncDataProvider = ({
  chainId,
  children,
}: ZKDataProviderProps) => {
  const { tournament } = useContext(TournamentDataContext);
  const zkData = useZKData(tournament.data?.wallets ?? [], chainId);

  return (
    <ZKSyncDataContext.Provider value={{ zkData: zkData }}>
      {children}
    </ZKSyncDataContext.Provider>
  );
};
