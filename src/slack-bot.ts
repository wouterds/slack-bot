import { App as Slack } from '@slack/bolt';

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

  slack.message('!price', async ({ message }) => {
    console.log('💬 !price');

    const coin = `${(message as any)?.text}`.replace('!price ', '');

    console.log({ coin });
  });
};

export default {
  start,
};
