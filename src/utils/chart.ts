import fetch from 'node-fetch';
import { Coin } from 'types/coin';

const QUOTE_CURRENCIES = [
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

export const findUsdPeggedChartForCoin = async (coin: Coin) => {
  for (const quote of QUOTE_CURRENCIES) {
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
