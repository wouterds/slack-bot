import fetch from 'node-fetch';

type Coin = {
  id: string;
  name: string;
  symbol: string;
};

export const getCoinData = async (coin: string): Promise<Coin | null> => {
  try {
    const response = await fetch(
      `https://api.jinx.capital/coins/${encodeURIComponent(coin)}`,
    );

    return (await response.json()).data as CoinListItem;
  } catch {
    return null;
  }
};
