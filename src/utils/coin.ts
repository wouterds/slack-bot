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

    const ids = coins.filter(
      (coin) => coin.id?.toLowerCase() === q?.toLowerCase(),
    );

    if (ids.length === 1) {
      return ids[0];
    }

    if (ids.length > 1) {
      return ids;
    }

    const symbols = coins.filter(
      (coin) => coin.symbol?.toLowerCase() === q?.toLowerCase(),
    );

    if (symbols.length === 1) {
      return symbols[0];
    }

    if (symbols.length > 1) {
      return symbols;
    }

    const names = coins.filter(
      (coin) => coin.name?.toLowerCase() === q?.toLowerCase(),
    );

    if (names.length === 1) {
      return names[0];
    }

    if (names.length > 1) {
      return names;
    }

    return null;
  } catch {
    throw new Error('API Error');
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
    throw new Error('API Error');
  }
};
