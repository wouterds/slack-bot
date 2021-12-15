import { App as Slack } from '@slack/bolt';
import { findCoin, getCoinData } from 'utils/coin';

const slack = new Slack({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
});

const start = async () => {
  console.log('Starting slack bot..');
  await slack.start();
  console.log('✅ Connected!');

  slack.message('wojak', async ({ say }) => {
    console.log('💬 wojak');

    say('wadup?');
  });

  slack.message('!price', async ({ say, message }) => {
    console.log('💬 !price');

    const q = `${(message as any)?.text}`.replace('!price ', '');

    try {
      const result = await findCoin(q);
      if (!result) {
        console.log(`Couldn't find coin "${q}"`);
        await say(`bruh, tf do i know what "${q}" is`);
        return;
      }

      if (Array.isArray(result)) {
        if (result.length > 1) {
          console.log(
            `Found multiple coins for "${q}": ${result
              .map((coin) => coin.name)
              .join(', ')}`,
          );
        }

        return;
      }

      const coin = await getCoinData(result.id);

      console.log(coin);
    } catch {
      say(
        "I'm having trouble connecting to https://api.jinx.capital - please try again in a minute",
      );
    }
  });
};

export default {
  start,
};
