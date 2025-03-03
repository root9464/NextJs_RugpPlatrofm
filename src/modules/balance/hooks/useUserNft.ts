import { tonApiInstance } from '@/shared/lib/axios';
import { validateResult } from '@/shared/utils/utils';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

const OwnerSchema = z.object({
  address: z.string(),
  is_scam: z.boolean(),
  is_wallet: z.boolean(),
});

const CollectionSchema = z.object({
  address: z.string(),
  name: z.string(),
  description: z.string(),
});

const MetadataSchema = z.object({
  name: z.string(),
  image: z.string().url(),
  description: z.string(),
});

const PreviewSchema = z.object({
  resolution: z.string(),
  url: z.string().url(),
});

const NFTItemSchema = z.object({
  address: z.string(),
  index: z.number(),
  owner: OwnerSchema,
  collection: CollectionSchema,
  verified: z.boolean(),
  metadata: MetadataSchema,
  previews: z.array(PreviewSchema),
  approved_by: z.array(z.unknown()).optional(),
  trust: z.string(),
});

const NFTSchema = z.object({
  nft_items: z.array(NFTItemSchema),
});

export type NftItemsType = z.infer<typeof NFTItemSchema>;

export const useUserNft = (address: string) =>
  useQuery({
    queryKey: ['user-nft', address],
    queryFn: async () => {
      const { data, status, statusText } = await tonApiInstance.get(`/accounts/${address}/nfts`);
      if (status != 200) throw new Error(`${status}: ${statusText}`);
      return validateResult(data, NFTSchema);
    },
    select: (data) => data.nft_items,
    enabled: !!address,
  });
