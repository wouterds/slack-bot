import { formatDistanceToNowStrict, fromUnixTime } from 'date-fns';
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

  const marketCapFormatter = Intl.NumberFormat('en-US', {
    notation: 'compact',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
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

  const fields = [
    {
      type: 'mrkdwn',
      text: `*Price*\n${priceFormatter.format(coin.price)}`,
    },
    {
      type: 'mrkdwn',
      text: `*Market cap*\n${
        coin.marketCap ? marketCapFormatter.format(coin.marketCap) : '--'
      }`,
    },
    {
      type: 'mrkdwn',
      text: `*Change (24h)*\n${percentageFormatter.format(
        coin.percentageChange24h / 100,
      )}`,
    },
    {
      type: 'mrkdwn',
      text: `*Change (7d)*\n${percentageFormatter.format(
        coin.percentageChange7d / 100,
      )}`,
    },
  ];

  if (coin.ath) {
    fields.push({
      type: 'mrkdwn',
      text: `*ATH*\n${priceFormatter.format(
        coin.isAtAth ? coin.price : coin.ath,
      )}${
        coin.isAtAth
          ? ''
          : ` (${formatDistanceToNowStrict(fromUnixTime(coin.athDate))} ago)`
      }`,
    });
  }

  const title = `*${coin.website ? `<${coin.website}|` : ''}${
    coin.name
  } (${coin.symbol.toUpperCase()})${coin.website ? '>' : ''}${
    coin.isAtAth ? ' 🔥' : ''
  }*\n${text}`;

  const blocks = [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: title,
      },
      fields,
      accessory: {
        type: 'image',
        image_url: `https://api.jinx.capital${coin.imageUrl}`,
        alt_text: `${coin.symbol} logo`,
      },
    },
  ];

  return { text, blocks, unfurl_links: false };
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
