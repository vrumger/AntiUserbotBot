`use strict`;

require(`dotenv`).config();

const Telegraf = require(`telegraf`);
const NeDB = require(`nedb`);

const bot = new Telegraf(process.env.TOKEN);
const db = new NeDB({ filename: `chats.db`, autoload: true });

bot.catch(console.log);

require(`./middleware`)(bot, db);
require(`./handlers`)(bot, db);

bot.launch().then(() => {
    console.log(`@${bot.options.username} is running...`);
});
