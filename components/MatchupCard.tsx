import { NFTDataContext } from "@zoralabs/nft-components";
import { useContext, useState } from "react";
import Image from 'next/image';
import winningLogo from '../public/assets/img/winning_logo.svg';
import losingLogo from '../public/assets/img/losing_logo.svg';
import { TournamentDataContext } from "../context/TournamentDataContext";
import { Fragment } from "react";
import { NFTDataProvider, MediaObject } from "@zoralabs/nft-components";
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

  //Sends player to zksync checkout
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
      {/* Main content for matchup card*/}
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
    <div>
      <div>
        {/* NFT media (assumed to be an image) */}
        <div className="relative"> {/* if game is losed added this class name "gamelosing"*/}
          <div className="w-full h-48 lg:h-80 object-cover">
            <MediaObject contentURI={
              data && "zoraNFT" in data ? data.zoraNFT.contentURI : metadata.image
            }
              metadata={metadata} />
          </div>
        </div>

        <div className="block mt-5 lg:flex lg:justify-between">
          <div>
            {/* NFT creator information */}
            <h1 className="text-pink-600 text-pink font-extrabold italic text-xl">{metadata.name}</h1>
            {creator && (
              <p className="text-indigo-900 text-indigo my-3">
                <span className="opacity-40">created by:</span>{" "}
                {creator.slice(0, addressSlice + 2) +
                  "..." +
                  creator.slice(creator.length - addressSlice, creator.length)}
              </p>
            )}
          </div>

          {/* Amount raised by the NFT */}
          <div className="flex justify-between">
            <div className="w-100">
              <p className="text-indigo-900 text-indigo">Collected by this NFT</p>
              <h1 className="text-pink-600 text-pink text-2xl">${playerFunds.toFixed(2)}</h1>
            </div>
            <div className="flex items-stretch w-100 lg:hidden">
              <div className="mr-2 self-end">
                <h4 className="text-indigo-900 text-indigo text-right text-base font-light italic">WINNING!</h4>
                <p className="text-indigo-900 text-indigo text-right text-xs">Way to go, voters!</p>
              </div>
              <Image src={winningLogo} alt="winningLogo" />
            </div>
          </div>
        </div>

        {/* NFT description */}
        <p className="text-indigo-900 text-indigo">{metadata.description}</p>
      </div>

      {/* Allows users to vote for this NFT by sending funds through ZKSync */}
      {/* {isCurrentRound ? ( */}
      <div className="lg:divide-y-4 lg:divide-gitcoin">
        <div className="lg:flex lg:justify-between lg:items-center">
          <form className="my-8 flex" onSubmit={(e) => {
            e.preventDefault();
            checkout(amount, parseInt(tokenId));
          }}>
            {/* Select a token to vote with */}
            <select value={tokenId} className="w-1/3 bg-transparent focus:outline-none text-white h-14 mr-5 border-b-2 border-indigo"
              onChange={(e) => {
                setTokenId(e.target.value);
              }}>
              {tokenList.map((token) => (
                <option key={token.id} value={token.id}>
                  {token.symbol}
                </option>
              ))}
            </select>

            {/* Input token amount to vote with */}
            <input className={`appearance-none block w-full text-white
          focus:outline-none focus:bg-transparent focus:border-purple-500 rounded py-3 px-4 mb-3 bg-transparent ${amount ? 'opacity-100' : ''} gitcoin-border`}
              type="text" placeholder="Enter amount"
              onChange={(e) => {
                setAmount(e.target.value);
              }}
              value={amount} name="amount" />
          </form>
          {/* Submit the vote */}
          <button className="block w-full lg:w-44 lg:h-10 lg:mb-5 italic bg-blue text-white font-bold py-2 px-4 rounded-full">
            Vote!
          </button>
        </div>
        {/* ) : (
        <div className="text-indigo-900 text-indigo">Round Ended</div>
      )} */}
        <div className="hidden lg:block my-20">
          <div className="flex items-center mx-20 py-9">
            <div>
              <Image src={losingLogo} alt="winningLogo" className="w-100" />
            </div>
            <div className="ml-4">
              <h4 className="text-indigo-900 text-4xl text-indigo text-base font-light italic">LOSING!</h4>
              <p className="text-indigo-900 text-indigo text-xs">Support your favorite by voting!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
