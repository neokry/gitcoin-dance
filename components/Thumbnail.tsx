import { NFTDataContext } from "@zoralabs/nft-components";
import { Fragment, useContext } from "react";
import Image from 'next/image';
import losingLogo from '../public/assets/img/losing_logo.svg';
import {
  MediaObject,
} from "@zoralabs/nft-components";

export default function Thumbnail({ isWinner }: { isWinner: boolean | null }) {
  const {
    nft: { data },
    metadata: { metadata },
  } = useContext(NFTDataContext);
  if (!metadata || !data) return <Fragment />;

  return (
    // className={`border-4 ${
    //   (isWinner === true && "border-green-600") ||
    //   (isWinner == false && "border-red-600")
    // }`}
    <div className={`relative ${isWinner !== null && !isWinner ? 'gamelosing' : 'game-win'}`}>
      {/* Displays NFT media (assumed to be an image)*/}
      <div className="object-none object-center w-32 h-24 xl:w-52 xl:h-36">
        <MediaObject contentURI={
          data && "zoraNFT" in data ? data.zoraNFT.contentURI : undefined
        }
          metadata={metadata} />
      </div>

      {/* NFT title */}
      <p className="game-player-name text-sm px-2 italic text-pink font-extrabold xl:px-5 xl:text-base">{metadata.name}</p>
      <div className={`game-losing ${isWinner !== null && !isWinner ? 'block' : 'hidden'}`} >
        <Image src={losingLogo} alt="game_losing" />
      </div>
    </div>
  );
}
