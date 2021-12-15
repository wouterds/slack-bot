import fetch from 'node-fetch';

type CoinListItem = {
  id: string;
  name: string;
  symbol: string;
};

export const getCoinList = async (): Promise<CoinListItem[]> => {
  try {
    const response = await fetch(`https://api.jinx.capital/coins`);

    return (await response.json()).data as CoinListItem[];
  } catch {
    return [];
  }
};

export const findCoin = async (
  q: string,
): Promise<CoinListItem | CoinListItem[] | null> => {
  try {
    const response = await fetch(`https://api.jinx.capital/coins`);
    const coins = (await response.json()).data as CoinListItem[];

    const result = coins.filter(
      (coin) =>
        coin.name?.toLowerCase() === q?.toLowerCase() ||
        coin.symbol?.toLowerCase() === q?.toLowerCase(),
    );

    if (result.length === 1) {
      return result[0];
    }

    if (result.length === 0) {
      return null;
    }

    return result;
  } catch {
    return null;
  }
};

export const getCoinData = async (
  coin: string,
): Promise<CoinListItem | null> => {
  try {
    const response = await fetch(
      `https://api.jinx.capital/coins/${encodeURIComponent(coin)}`,
    );

    return (await response.json()).data as CoinListItem;
  } catch {
    return null;
  }
};
