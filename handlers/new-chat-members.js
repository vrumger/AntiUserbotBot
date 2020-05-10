module.exports = (bot, db) => {
    bot.on(`new_chat_members`, async ctx => {
        const { message_id } = ctx.message;
        const { first_name, id } = ctx.message.new_chat_member;
        const { title } = ctx.chat;

        if (id === ctx.botInfo.id) {
            const { user, status } = await ctx.getChatMember(ctx.from.id);
            const statuses = [`creator`, `administrator`];

            if (!statuses.includes(status)) {
                await ctx.reply(
                    ctx.i18n(`not_admin`, {
                        first_name: user.first_name,
                        user_id: user.id,
                    }),
                    { parse_mode: `markdown` },
                );

                await ctx.leaveChat();
            }

            return;
        }

        try {
            await ctx.restrictChatMember(id, {
                can_send_messages: false,
            });

            db.findOne({ chat_id: ctx.chat.id }, async (err, chat) => {
                if (err) {
                    return console.log(err);
                }

                const welcomeMessage = chat && chat.welcome_message || ctx.i18n(`welcome`, { first_name, title });

                await ctx.reply(welcomeMessage, {
                    ...ctx.keyboard(),
                    reply_to_message_id: message_id,
                    parse_mode: `html`,
                });
            });
        } catch (err) {
            switch (err.description) {
                case `Bad Request: can't demote chat creator`:
                    ctx.reply(ctx.i18n(`creator`));
                    break;

                case `Bad Request: user is an administrator of the chat`:
                    break;

                default:
                    await ctx.reply(err.description);
                    await ctx.leaveChat();
            }
        }
    });
};
