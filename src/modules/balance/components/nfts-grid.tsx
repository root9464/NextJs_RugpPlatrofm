/* eslint-disable @next/next/no-img-element */
import { NftItemsType } from '../hooks/useUserNft';

export const NFTsGrid = ({ nfts }: { nfts: NftItemsType['nft_items'] }) => {
  console.log(nfts);

  return (
    <div className='grid w-full grid-cols-[1fr_1fr] gap-3'>
      {nfts.map((nft) => (
        <img src={nft.metadata.image} alt={nft.metadata.name} key={nft.address} className='w-full' />
      ))}
    </div>
  );
};
