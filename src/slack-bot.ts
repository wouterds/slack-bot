import { App as Slack } from '@slack/bolt';
import { findCoin } from 'utils/coin';
import { generateSlackPayloadForCoinId } from 'utils/slack';

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

          say({
            text: `Found multiple coins for "${q}", which one did you mean?`,
            blocks: [
              {
                type: 'section',
                text: {
                  type: 'plain_text',
                  text: `Found multiple coins for "${q}", which one did you mean?`,
                },
              },
              {
                type: 'actions',
                block_id: 'select-coin',
                elements: [
                  ...result.map((coin) => ({
                    type: 'button',
                    text: {
                      type: 'plain_text',
                      text: coin.name,
                    },
                    style: 'primary',
                    value: coin.id,
                  })),
                  {
                    type: 'button',
                    text: {
                      type: 'plain_text',
                      text: 'Cancel',
                    },
                    style: 'danger',
                    value: 'cancel',
                  },
                ],
              },
            ],
          });

          return;
        }

        say('Wtf devs do something, unhandled logic');
        return;
      }

      const payload = await generateSlackPayloadForCoinId(result.id);
      if (!payload) {
        say(
          `Had trouble loading data https://api.jinx.capital/coins/${result.id} - please try again in a minute`,
        );
        return;
      }

      console.log(payload);
    } catch {
      say(
        "I'm having trouble connecting to https://api.jinx.capital - please try again in a minute",
      );
    }
  });

  slack.action(
    { block_id: 'select-coin' },
    async ({ ack, respond, say, action }) => {
      await Promise.all([ack(), respond({ delete_original: true })]);

      const id = (action as any).value;
      if (id === 'cancel') {
        return;
      }

      try {
        const payload = await generateSlackPayloadForCoinId(id);
        if (!payload) {
          say(
            `Had trouble loading data https://api.jinx.capital/coins/${id} - please try again in a minute`,
          );
          return;
        }

        console.log(payload);
      } catch {
        say(
          "I'm having trouble connecting to https://api.jinx.capital - please try again in a minute",
        );
      }
    },
  );
};

export default {
  start,
};
