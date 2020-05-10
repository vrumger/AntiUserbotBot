const Composer = require(`telegraf/composer`);
const textToHtml = require(`@youtwitface/text-to-html`);

module.exports = (bot, db) => {
    bot.command(`setwelcome`, Composer.admin(async ctx => {
        const { text, entities } = ctx.message;

        const parsedText = textToHtml(text, entities).slice(entities[0].length + 1);

        db.update(
            { chat_id: ctx.chat.id },
            { $set: { welcome_message: parsedText } },
            { upsert: true },
        );

        ctx.reply(await ctx.i18n(`welcome_message_updated`));
    }));

    bot.command(`setlang`, Composer.admin(async ctx => {
        ctx.reply(await ctx.i18n(`select_lang`), {
            ...ctx.i18nButtons,
            reply_to_message_id: ctx.message.message_id,
        });
    }));
};
