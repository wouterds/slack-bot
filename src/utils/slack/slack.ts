import fetch from 'node-fetch';

export const slackPostMessage = async (options: {
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
