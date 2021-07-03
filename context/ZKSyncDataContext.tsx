import { createContext } from "react";
import { useZKDataType } from "../hooks/useZKData";

export type ZKSyncDataContext = {
  zkData: useZKDataType;
};

export const ZKSyncDataContext = createContext<ZKSyncDataContext>({
  zkData: { loading: true, error: undefined, data: undefined },
});
