import fetch from 'node-fetch';

import { getCoinData } from './coin';

export const generateSlackPayloadForCoinId = async (id: string) => {
  const coin = await getCoinData(id);
  if (!coin) {
    return null;
  }

  const percentageFormatter = new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    signDisplay: 'always',
  });

  const fractionDigits =
    coin.price >= 10000
      ? 1
      : coin.price > 1000
      ? 0
      : coin.price > 100
      ? 1
      : coin.price > 0.1
      ? 2
      : coin.price > 0.01
      ? 4
      : coin.price > 0.0001
      ? 6
      : coin.price > 0.000001
      ? 8
      : 10;

  const priceFormatter = Intl.NumberFormat('en-US', {
    notation: coin.price >= 10000 ? 'compact' : undefined,
    minimumFractionDigits: 0,
    maximumFractionDigits: fractionDigits,
    currency: coin.quoteCurrency,
    style: 'currency',
  });

  const text = `${coin.name} went ${
    coin.percentageChange24h > 0 ? 'up' : 'down'
  } with ${percentageFormatter.format(
    coin.percentageChange24h / 100,
  )} in the last 24h, 1 ${coin.symbol.toUpperCase()} = ${priceFormatter.format(
    coin.price,
  )}.`;

  return { text };
};

export const postSlackMessage = async (options: {
  text: string;
  channel?: string;
  blocks?: unknown[];
  unfurl_links?: boolean;
}) => {
  const channel = options.channel || 'dev';
  const text = options.text;
  const blocks = options?.blocks ? options.blocks : [];
  const unfurl_links = !!options?.unfurl_links;

  await fetch('https://slack.com/api/chat.postMessage', {
    method: 'post',
    body: JSON.stringify({
      channel,
      text,
      blocks,
      unfurl_links,
    }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
    },
  });
};
