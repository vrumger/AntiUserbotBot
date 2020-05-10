const Composer = require(`telegraf/composer`);
const textToHtml = require(`@youtwitface/text-to-html`);

module.exports = (bot, db) => {
    bot.command(`setwelcome`, Composer.admin(ctx => {
        const { text, entities } = ctx.message;

        const parsedText = textToHtml(text, entities).slice(entities[0].length + 1);

        db.update(
            { chat_id: ctx.chat.id },
            { $set: { welcome_message: parsedText } },
            { upsert: true },
        );

        ctx.reply(`I've updated the welcome message for this chat.`);
    }));
};
