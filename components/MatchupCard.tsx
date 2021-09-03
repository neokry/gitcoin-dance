import { NFTDataContext } from "@zoralabs/nft-components";
import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import winningLogo from "../public/assets/img/winning_logo.svg";
import losingLogo from "../public/assets/img/losing_logo.svg";
import winningLogoSM from "../public/assets/img/winning_logo_sm.svg";
import losingLogoSM from "../public/assets/img/losing_logo_sm.svg";
import { TournamentDataContext } from "../context/TournamentDataContext";
import { Fragment } from "react";
import { NFTDataProvider, MediaObject } from "@zoralabs/nft-components";
import { CheckoutManager } from "zksync-checkout";
import { ethers } from "ethers";
import useSWR from "swr";
import { ZKSyncDataContext } from "../context/ZKSyncDataContext";
import usePlayer from "../hooks/usePlayer";

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
  isWinning: boolean;
};

export default function MatchupCard({
  playerIndex,
  isCurrentRound,
  roundNumber,
  isWinning,
}: MatchupCardProps) {
  const { tournament } = useContext(TournamentDataContext);
  const swr = useSWR("https://api.zksync.io/api/v0.1/tokens");
  const { funds } = usePlayer(playerIndex, roundNumber);
  console.log("funds", funds);

  if (!tournament.data || !swr.data) return <Fragment />;
  const { data } = tournament;
  const tokenList: ZKSyncToken[] = swr.data;

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
        playerFunds={funds}
        isWinning={isWinning}
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
  isWinning,
}: {
  checkout: (amount: string, tokenId: number) => void;
  tokenList: ZKSyncToken[];
  isCurrentRound: boolean;
  playerFunds: number;
  isWinning: boolean;
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
        <div
          className={`relative in-detail ${
            isWinning !== null && !isCurrentRound && !isWinning
              ? "gamelosing"
              : "game-win"
          }`}
        >
          <div className="w-full h-48 lg:h-80 object-cover">
            <MediaObject
              contentURI={
                data && "zoraNFT" in data ? data.zoraNFT.contentURI : undefined
              }
              metadata={metadata}
            />
          </div>
          <div
            className={`game-losing ${
              isWinning !== null && !isCurrentRound && !isWinning
                ? "block"
                : "hidden"
            }`}
          >
            <Image src={losingLogo} alt="game_losing" />
          </div>
        </div>

        <div className="block mt-5 lg:flex lg:justify-between extramarginadded">
          <div>
            {/* NFT creator information */}
            <h1 className="text-pink-600 text-pink font-extrabold italic text-lg lg:text-2xl font-montserrat">
              {metadata.name}
            </h1>
            {creator && (
              <p className="text-indigo-900 text-indigo text-xs lg:text-sm my-3 font-poppin font-bold">
                <span className="font-normal font-normal opacity-70">
                  created by{" "}
                </span>{" "}
                <span className="underline">
                  {creator.slice(0, addressSlice + 2) +
                    "..." +
                    creator.slice(
                      creator.length - addressSlice,
                      creator.length
                    )}
                </span>
              </p>
            )}
          </div>

          {/* Amount raised by the NFT */}
          <div className="flex justify-between">
            <div className="w-100">
              <p className="text-indigo-900 text-indigo text-xs lg:text-sm font-poppin font-normal">
                Collected by this NFT
              </p>
              <h1 className="text-pink-600 text-pink text-xl lg:text-3xl rightalign">
                ${playerFunds.toFixed(2)}
              </h1>
            </div>
            <div className="flex items-stretch w-100 lg:hidden">
              <div className="mr-2 self-end">
                <h4 className="text-indigo-900 text-indigo text-right text-base font-light italic">
                  {isWinning ? "WINNING!" : "LOSING!"}
                </h4>
                <p className="text-indigo-900 text-indigo text-right text-xs lg:text-sm font-poppin font-normal">
                  {isWinning
                    ? "Way to go, voters!"
                    : "Support your favorite by voting!"}
                </p>
              </div>
              <Image
                src={isWinning ? winningLogoSM : losingLogoSM}
                alt="winningLogo"
              />
            </div>
          </div>
        </div>

        {/* NFT description */}
        <p className="text-indigo-900 text-xs lg:text-sm text-indigo font-poppin font-normal">
          {metadata.description}
        </p>
      </div>

      {/* Allows users to vote for this NFT by sending funds through ZKSync */}
      <div className="lg:divide-y-4 lg:divide-gitcoin">
        <div className="xl:flex xl:justify-between xl:items-center">
          {isCurrentRound && (
            <Fragment>
              <div className="my-8 flex">
                {/* Select a token to vote with */}
                <select
                  value={tokenId}
                  className="w-1/3 bg-transparent font-poppin font-bold focus:outline-none text-white h-14 mr-5 border-b-2 border-indigo"
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

                {/* Input token amount to vote with */}
                <input
                  className={`appearance-none block w-full text-white font-poppin font-normal
          focus:outline-none focus:bg-transparent focus:border-purple-500 rounded py-3 px-4 mb-3 bg-transparent ${
            amount ? "opacity-100" : ""
          } gitcoin-border`}
                  type="text"
                  placeholder="Enter amount"
                  onChange={(e) => {
                    setAmount(e.target.value);
                  }}
                  value={amount}
                  name="amount"
                />
              </div>
              {/* Submit the vote */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  checkout(amount, parseInt(tokenId));
                }}
                className="block w-full xl:w-44 lg:h-10 lg:mb-5 italic bg-blue text-white font-poppin font-bold py-2 px-4 rounded-full"
              >
                Vote!
              </button>
            </Fragment>
          )}
        </div>
        {/* ) : (
        <div className="text-indigo-900 text-indigo">Round Ended</div>
      )} */}
        <div className="hidden lg:block my-20">
          <div className="flex items-center mx-20 py-9">
            <div>
              <Image
                src={isWinning ? winningLogo : losingLogo}
                alt="winningLogo"
                className="w-100"
              />
            </div>
            <div className="ml-4">
              <h4 className="text-indigo-900 text-4xl text-indigo text-base font-light italic">
                {isWinning ? "WINNING!" : "LOSING!"}
              </h4>
              <p className="text-indigo-900 text-indigo text-xs lg:text-sm font-poppin font-normal">
                {isWinning
                  ? "Way to go, voters!"
                  : "Support your favorite by voting!"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
