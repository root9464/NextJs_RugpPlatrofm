import { NftsBalance } from '../hooks/useUserNft';

type Image = {
  original: string;
  sizes: {
    big: string;
    medium: string;
    small: string;
  };
};

type NftInfo = {
  address: string;
  user_friendly: string;
  index: string;
  collection_address: string;
  owner_address: string;
  last_transaction_lt: string;
};

type Collection = {
  address: string;
  name: string;
  description: string;
  image: Image;
};

type Metadata = {
  name: string;
  description: string;
  image: Image;
  collection: Collection;
};

type UserNfts = {
  nft_info: NftInfo;
  metadata: Metadata;
};

const extractImageSizes = (extra: Record<string, string>): Image['sizes'] => ({
  big: extra['_image_big'] || '',
  medium: extra['_image_medium'] || '',
  small: extra['_image_small'] || '',
});

const serializeNft = (nft: NftsBalance): UserNfts[] => {
  return nft.nft_items.map((item) => {
    const nftAddress = item.address;
    const collectionAddress = item.collection_address;
    const ownerAddress = item.owner_address;

    const nftUserFriendly = nft.address_book[nftAddress].user_friendly;
    const ownerUserFriendly = nft.address_book[ownerAddress].user_friendly;

    const nftMetadataEntry = nft.metadata[nftAddress];
    const nftTokenInfo = nftMetadataEntry.token_info[0];

    const collectionMetadataEntry = nft.metadata[collectionAddress];
    const collectionTokenInfo = collectionMetadataEntry.token_info[0];

    if (!nftTokenInfo || !collectionTokenInfo) {
      throw new Error(`Missing metadata for NFT (${nftAddress}) or collection (${collectionAddress})`);
    }

    const nftImage: Image = {
      original: item.content.image,
      sizes: extractImageSizes(nftTokenInfo.extra),
    };

    const collectionImage: Image = {
      original: item.collection.collection_content.image,
      sizes: extractImageSizes(collectionTokenInfo.extra),
    };

    const collectionData: Collection = {
      address: collectionAddress,
      name: item.collection.collection_content.name,
      description: item.collection.collection_content.description,
      image: collectionImage,
    };

    return {
      nft_info: {
        address: nftAddress,
        user_friendly: nftUserFriendly,
        index: item.index,
        collection_address: collectionAddress,
        owner_address: ownerUserFriendly,
        last_transaction_lt: item.last_transaction_lt,
      },
      metadata: {
        name: item.content.name,
        description: item.content.description,
        image: nftImage,
        collection: collectionData,
      },
    };
  });
};

export { serializeNft };
export type { UserNfts };
