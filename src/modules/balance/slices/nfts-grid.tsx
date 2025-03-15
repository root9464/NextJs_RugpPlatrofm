/* eslint-disable @next/next/no-img-element */
'use server';
import { UserNfts } from '../helpers/serialize-nfts';

export const NFTsGrid = ({ nfts }: { nfts: UserNfts[] }) => (
  <div className='grid w-full flex-1 grid-cols-[1fr_1fr] gap-3'>
    {nfts.map((nft) => (
      <img src={nft.metadata.image.sizes.medium} alt={nft.metadata.name} key={nft.metadata.name} className='w-full' />
    ))}
  </div>
);
