module.exports = bot => {
    bot.action(/^unmute\.(\d+)$/, async ctx => {
        const clickedId = ctx.from.id;
        const unmuteId = Number(ctx.match[1]);

        if (clickedId !== unmuteId) {
            return ctx.answerCbQuery(ctx.i18n(`user_must_click`));
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
};
