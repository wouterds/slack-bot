import fetch from 'node-fetch';
import { Coin, STABLECOINS } from 'types/coin';

export const findUsdPeggedChartForCoin = async (coin: Coin) => {
  for (const quote of STABLECOINS) {
    const chartUrl =
      `https://api.jinx.capital/chart/${coin.symbol}:${quote}.jpg`.toLowerCase();

    try {
      const { status } = await fetch(chartUrl);
      if (status === 200) {
        return chartUrl;
      }
    } catch {}
  }

  return null;
};
