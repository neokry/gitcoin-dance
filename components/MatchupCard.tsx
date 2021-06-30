import { NFTDataContext } from "@zoralabs/nft-components";
import { useContext } from "react";
import { TournamentDataContext } from "../context/TournamentDataContext";
import { Fragment } from "react";
import { NFTDataProvider } from "@zoralabs/nft-components";

export type MatchupCardProps = {
  playerIndex: number;
};

export default function MatchupCard({ playerIndex }: MatchupCardProps) {
  const { tournament } = useContext(TournamentDataContext);
  if (!tournament.data) return <Fragment />;
  const { data } = tournament;

  const Content = () => {
    const {
      nft: { data },
      metadata: { metadata },
    } = useContext(NFTDataContext);

    if (!data || !metadata) return <Fragment />;

    return (
      <div className="m-4">
        <div>
          <img
            className="w-full h-96 object-cover"
            src={
              data && "zoraNFT" in data
                ? data.zoraNFT.contentURI
                : metadata.image
            }
            alt="image"
          />

          <h1 className="">{metadata.name}</h1>
          <p>created by: {data.nft.creator}</p>
          <p>{metadata.description}</p>
        </div>
        <div className="mt-4 flex">
          <select>
            <option>Dai</option>
          </select>
          <input className="mx-2" placeholder="Amount"></input>
          <button>Vote</button>
        </div>
      </div>
    );
  };

  return (
    <NFTDataProvider
      id={data.tokenIds ? data.tokenIds[playerIndex].toString() : ""}
      contract={data.tokenAddresses ? data.tokenAddresses[playerIndex] : ""}
    >
      <Content />
    </NFTDataProvider>
  );
}
