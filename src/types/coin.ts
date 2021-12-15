export type Coin = {
  id: string;
  symbol: string;
  name: string;
  rank: number;
  quoteCurrency: string;
  price: number;
  ath: number;
  athDate: number;
  marketCap: number;
  percentageChange24h: number;
  percentageChange7d: number;
  imageUrl: string;
  website: string;
  pullbackPercentage: number;
  pullback: number;
  isAtAth: boolean;
};

export const STABLECOINS = [
  'usd',
  'usdt',
  'usdc',
  'busd',
  'dai',
  'gusd',
  'ust',
  'tusd',
  'usdp',
  'fei',
  'frax',
];
