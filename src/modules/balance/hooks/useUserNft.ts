import { tonCenterInstance } from '@/shared/lib/axios';
import { useQuery } from '@tanstack/react-query';
import { serializeNft } from '../helpers/serialize-nfts';

type Content = {
  description: string;
  image: string;
  name: string;
};

type Collection = {
  address: string;
  owner_address: string;
  last_transaction_lt: string;
  next_item_index: string;
  collection_content: Content;
  data_hash: string;
  code_hash: string;
};

type NftItem = {
  address: string;
  init: boolean;
  index: string;
  collection_address: string;
  owner_address: string;
  content: Content;
  last_transaction_lt: string;
  code_hash: string;
  data_hash: string;
  collection: Collection;
};

type AddressBookEntry = {
  user_friendly: string;
  domain: string | null;
};

type TokenInfo = {
  type: string;
  name: string;
  description: string;
  image: string;
  extra: Record<string, string>;
};

type MetadataEntry = {
  is_indexed: boolean;
  token_info: TokenInfo[];
};

type NftsBalance = {
  nft_items: NftItem[];
  address_book: Record<string, AddressBookEntry>;
  metadata: Record<string, MetadataEntry>;
};

const fetchUserNfts = async (address: string) => {
  const { data, status, statusText } = await tonCenterInstance.get<NftsBalance>(`v3/nft/items?`, {
    params: {
      owner_address: address,
      offset: 0,
    },
  });

  if (status !== 200) throw new Error(statusText);

  return serializeNft(data);
};

const useUserNft = (address: string) =>
  useQuery({
    queryKey: ['user-nft', address],
    queryFn: () => fetchUserNfts(address),
    enabled: !!address,
  });

export { fetchUserNfts, useUserNft };
export type { NftItem, NftsBalance };
