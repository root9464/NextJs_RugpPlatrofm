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
  approved_by: z.array(z.unknown()).optional().default([]),
  trust: z.string(),
});

const NFTSchema = z.object({
  nft_items: z.array(NFTItemSchema),
});

export type NftItemsType = z.infer<typeof NFTSchema>;

export const useUserNft = () => {};
