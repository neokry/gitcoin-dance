import { NFTDataContext } from "@zoralabs/nft-components";
import { Fragment, useContext } from "react";

export default function Thumbnail({ isWinner }: { isWinner: boolean }) {
  const {
    nft: { data },
    metadata: { metadata },
  } = useContext(NFTDataContext);

  if (!metadata || !data) return <Fragment />;

  return (
    <div
      className={`w-40 h-40 m-4 border-4 ${
        isWinner ? "border-green-600" : "border-red-600"
      }`}
    >
      <img
        className="w-full h-full object-cover"
        src={
          data && "zoraNFT" in data ? data.zoraNFT.contentURI : metadata.image
        }
        alt="image"
      />

      <p className="">{metadata.name}</p>
    </div>
  );
}
