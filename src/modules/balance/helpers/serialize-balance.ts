import { formatNumber } from '@/shared/utils/utils';
import { JettonBalance } from '../hooks/useUserBalance';

type Details = {
  contract_address: string;
  name: string;
  symbol: string;
  description: string;
  decimals: number;
  icon?: {
    original: string;
    sizes: {
      big: string;
      medium: string;
      small: string;
    };
  };
};

type WalletInfo = {
  address: string;
  user_friendly: string;
  balance: number;
  owner: {
    raw: string;
    friendly: string;
  };
  last_transaction_lt: number;
};

type UserBalance = {
  wallet_info: WalletInfo;
  metadata: Details;
};

const serializeUserBalance = (data: JettonBalance): UserBalance[] => {
  return data.jetton_wallets.map((wallet) => {
    const walletAddressEntry = data.address_book[wallet.address];
    const ownerEntry = data.address_book[wallet.owner];

    const metadataEntry = data.metadata[wallet.jetton];
    const tokenInfo = metadataEntry.token_info[0];

    const wallet_info: WalletInfo = {
      address: wallet.address,
      user_friendly: walletAddressEntry.user_friendly,
      balance: formatNumber(Number(wallet.balance) / 10 ** Number(tokenInfo.extra.decimals)),
      owner: {
        raw: wallet.owner,
        friendly: ownerEntry.user_friendly,
      },
      last_transaction_lt: Number(wallet.last_transaction_lt),
    };

    const metadata: Details = {
      contract_address: wallet.jetton,
      name: tokenInfo.name,
      symbol: tokenInfo.symbol,
      description: tokenInfo.description,
      decimals: Number(tokenInfo.extra.decimals),
      icon: tokenInfo.image
        ? {
            original: tokenInfo.image,
            sizes: {
              big: tokenInfo.extra._image_big,
              medium: tokenInfo.extra._image_medium,
              small: tokenInfo.extra._image_small,
            },
          }
        : undefined,
    };

    return {
      wallet_info,
      metadata,
    };
  });
};

export { serializeUserBalance };
export type { UserBalance };
