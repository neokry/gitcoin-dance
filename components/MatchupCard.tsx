import { NFTDataContext } from "@zoralabs/nft-components";
import { useContext, useState } from "react";
import { TournamentDataContext } from "../context/TournamentDataContext";
import { Fragment } from "react";
import { NFTDataProvider } from "@zoralabs/nft-components";
import { CheckoutManager } from "zksync-checkout";
import { ethers } from "ethers";
import useSWR from "swr";

export type ZKSyncToken = {
  id: number;
  address: string;
  symbol: string;
  decimals: number;
};

export type MatchupCardProps = {
  playerIndex: number;
};

export default function MatchupCard({ playerIndex }: MatchupCardProps) {
  const { tournament } = useContext(TournamentDataContext);
  const swr = useSWR("https://api.zksync.io/api/v0.1/tokens");

  if (!tournament.data || !swr.data) return <Fragment />;
  const { data } = tournament;
  const tokenList: ZKSyncToken[] = swr.data;

  //ZKSync checkout
  const checkout = async (amount: string, tokenId: number) => {
    const token = tokenList.find((x) => x.id == tokenId);

    if (!tournament.data || !tournament.data.wallets || !token) return;

    const checkoutManager = new CheckoutManager("rinkeby");
    const address = tournament.data.wallets[playerIndex];

    const transaction = [
      {
        to: address,
        token: token.symbol,
        amount: ethers.utils.parseUnits(amount, token.decimals).toHexString(),
        description: "Gitcoin dance off vote",
      },
    ];

    const txHashes = await checkoutManager.zkSyncBatchCheckout(
      transaction,
      token.symbol
    );

    const receipt = await checkoutManager.wait(txHashes, "COMMIT");
  };

  return (
    <NFTDataProvider
      id={data.tokenIds ? data.tokenIds[playerIndex].toString() : ""}
      contract={data.tokenAddresses ? data.tokenAddresses[playerIndex] : ""}
    >
      <Content checkout={checkout} tokenList={tokenList} />
    </NFTDataProvider>
  );
}

const Content = ({
  checkout,
  tokenList,
}: {
  checkout: (amount: string, tokenId: number) => void;
  tokenList: ZKSyncToken[];
}) => {
  const {
    nft: { data },
    metadata: { metadata },
  } = useContext(NFTDataContext);

  const [amount, setAmount] = useState("");
  const [tokenId, setTokenId] = useState("0");

  if (!data || !metadata) return <Fragment />;

  return (
    <div className="m-4">
      <div>
        <img
          className="w-full h-96 object-cover"
          src={
            data && "zoraNFT" in data ? data.zoraNFT.contentURI : metadata.image
          }
          alt="image"
        />

        <h1 className="">{metadata.name}</h1>
        <p>created by: {data.nft.creator}</p>
        <p>{metadata.description}</p>
      </div>
      <form
        className="mt-4 flex"
        onSubmit={(e) => {
          e.preventDefault();
          checkout(amount, parseInt(tokenId));
        }}
      >
        <select
          value={tokenId}
          onChange={(e) => {
            setTokenId(e.target.value);
          }}
        >
          {tokenList.map((token) => (
            <option key={token.id} value={token.id}>
              {token.symbol}
            </option>
          ))}
        </select>
        <input
          type="number"
          className="mx-2"
          placeholder="Amount"
          onChange={(e) => {
            setAmount(e.target.value);
          }}
          value={amount}
          name="amount"
        />
        <button type="submit">Vote</button>
      </form>
    </div>
  );
};
