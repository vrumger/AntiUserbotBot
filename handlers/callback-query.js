module.exports = (bot, db) => {
    bot.action(/^unmute\.(\d+)$/, async ctx => {
        const clickedId = ctx.from.id;
        const unmuteId = Number(ctx.match[1]);

        if (clickedId !== unmuteId) {
            return ctx.answerCbQuery(await ctx.i18n(`user_must_click`));
        }

        try {
            await ctx.restrictChatMember(clickedId, {
                until_date: (Date.now() + 86400000) / 1000, // 24 hours
                can_send_messages: true,
            });
        } catch (err) {
            console.log(err);
        }

        ctx.deleteMessage();

        if (ctx.callbackQuery.message) {
            const { reply_to_message: reply } = ctx.callbackQuery.message;

            ctx.deleteMessage(reply.message_id).catch(() => {
                /* Do nothing */
            });
        }
    });

    bot.action(/^lang\.(\w+)$/, async ctx => {
        const [, lang] = ctx.match;
        const { status } = await ctx.getChatMember(ctx.from.id);

        if (![`creator`, `administrator`].includes(status)) {
            return ctx.answerCbQuery();
        }

        db.update(
            { chat_id: ctx.chat.id },
            { $set: { lang } },
            { upsert: true },
        );

        ctx.answerCbQuery(await ctx.i18n(`language_updated`));
    });
};
