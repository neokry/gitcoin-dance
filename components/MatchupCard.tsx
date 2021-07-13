import { NFTDataContext } from "@zoralabs/nft-components";
import { useContext, useState } from "react";
import { TournamentDataContext } from "../context/TournamentDataContext";
import { Fragment } from "react";
import { NFTDataProvider } from "@zoralabs/nft-components";
import { CheckoutManager } from "zksync-checkout";
import { ethers } from "ethers";
import useSWR from "swr";
import { ZKSyncDataContext } from "../context/ZKSyncDataContext";

export type ZKSyncToken = {
  id: number;
  address: string;
  symbol: string;
  decimals: number;
};

export type MatchupCardProps = {
  playerIndex: number;
  isCurrentRound: boolean;
  roundNumber: number;
};

export default function MatchupCard({
  playerIndex,
  isCurrentRound,
  roundNumber,
}: MatchupCardProps) {
  const { tournament } = useContext(TournamentDataContext);
  const { zkData } = useContext(ZKSyncDataContext);
  const swr = useSWR("https://api.zksync.io/api/v0.1/tokens");

  if (!tournament.data || !swr.data) return <Fragment />;
  const { data } = tournament;
  const tokenList: ZKSyncToken[] = swr.data;

  //pulls player score data from contract
  const getRoundScores = (queryRound: number) => {
    if (!tournament.data) return;
    const { roundHistory } = tournament.data;

    if (!roundHistory) return;
    const roundData = roundHistory.find(
      (x) => x.round.toNumber() === queryRound
    );

    if (!roundData) return;
    const { playersScores } = roundData;
    if (playersScores) return playersScores[playerIndex].toNumber();
  };

  let playerFunds = 0;
  if (zkData.data && data.wallets && isCurrentRound) {
    //Get players funds from zkSync
    const player = data.wallets[playerIndex];
    const playerTotal = zkData.data.accountsTotals?.find(
      (x) => x.address.toLowerCase().localeCompare(player.toLowerCase()) === 0
    );

    //Subtract current funds from prev round score
    if (tournament.data && tournament.data.currentBalances) {
      const balance = tournament.data.currentBalances[playerIndex];
      if (playerTotal)
        playerFunds = playerTotal.totalBalanceUSD - balance.toNumber();
    }
  } else if (tournament.data && roundNumber === 1) {
    const {
      data: { tournamentResult },
    } = tournament;
    if (tournamentResult && tournamentResult.playersScores)
      playerFunds = tournamentResult.playersScores[playerIndex].toNumber();
  } else {
    //get round score from contract
    playerFunds = getRoundScores(roundNumber) ?? 0;
  }

  if (playerFunds < 0) playerFunds = 0;

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
      <Content
        checkout={checkout}
        tokenList={tokenList}
        isCurrentRound={isCurrentRound}
        playerFunds={playerFunds}
      />
    </NFTDataProvider>
  );
}

//Content must be wrapped to pull cached nft data
const Content = ({
  checkout,
  tokenList,
  isCurrentRound,
  playerFunds,
}: {
  checkout: (amount: string, tokenId: number) => void;
  tokenList: ZKSyncToken[];
  isCurrentRound: boolean;
  playerFunds: number;
}) => {
  const {
    nft: { data },
    metadata: { metadata },
  } = useContext(NFTDataContext);

  const [amount, setAmount] = useState("");
  const [tokenId, setTokenId] = useState("0");
  const addressSlice = 4;

  if (!data || !metadata) return <Fragment />;
  const { creator } = data.nft;

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

        <div className="flex justify-between">
          <div>
            <h1 className="">{metadata.name}</h1>
            {creator && (
              <p>
                created by:{" "}
                {creator.slice(0, addressSlice + 2) +
                  "..." +
                  creator.slice(creator.length - addressSlice, creator.length)}
              </p>
            )}
          </div>
          <div>
            <p>Collected by this NFT</p>
            <h1>${playerFunds.toFixed(2)}</h1>
          </div>
        </div>
        <p>{metadata.description}</p>
      </div>
      {isCurrentRound ? (
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
      ) : (
        <div>Round Ended</div>
      )}
    </div>
  );
};
