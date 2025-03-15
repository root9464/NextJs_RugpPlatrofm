type Serialize = {
  jetton_assets: JettonAsset[];
};

type JettonAsset = {
  wallet_info: WalletInfo;
  jetton_details: JettonDetails;
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

type JettonDetails = {
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

export type { JettonAsset, JettonDetails, Serialize, WalletInfo };
