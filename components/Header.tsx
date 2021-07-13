import { useContext } from "react";
import { ZKSyncDataContext } from "../context/ZKSyncDataContext";
import Link from "next/link";

export default function Header() {
  const { zkData } = useContext(ZKSyncDataContext);

  return (
    <div className="flex justify-between py-5 px-3">
      <Link href="/" passHref={true}>
        <a className="text-2xl font-bold">Gitcoin Dance</a>
      </Link>
      {zkData.data && zkData.data.overallTotal && (
        <div>
          Total Collected: ${zkData.data.overallTotal?.toFixed(2) ?? "0"}
        </div>
      )}
    </div>
  );
}
