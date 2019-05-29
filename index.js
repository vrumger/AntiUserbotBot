`use strict`;

require(`dotenv`).config();

const telegraf = require(`telegraf`);
const { Markup } = telegraf;
const bot = new telegraf(process.env.TOKEN);

const botId = bot.token.split(`:`)[0];

bot.catch(console.log);

bot.context.keyboard = function () {
    const { id } = this.message.new_chat_member;

    return Markup.inlineKeyboard([
        Markup.callbackButton(this.i18n(`not_a_bot`), `unmute.${id}`)
    ]).extra();
}

bot.context.i18n = require(`./i18n.js`);

bot.command([`start`, `help`], async (ctx) => {
    if (ctx.chat.type === `private`) {
        await ctx.reply(ctx.i18n(`start`), {
            parse_mode: `markdown`,
        });
    }
});

bot.on(`new_chat_members`, async (ctx) => {
    const { message_id } = ctx.message;
    const { first_name, id } = ctx.message.new_chat_member;
    const { title } = ctx.chat;

    if (id == botId) {
        const { user, status } = await ctx.getChatMember(ctx.from.id);
        const statuses = [`creator`, `administrator`];

        if (!statuses.includes(status)) {
            await ctx.reply(
                ctx.i18n(`not_admin`, {
                    first_name: user.first_name,
                    user_id: user.id,
                }),
                { parse_mode: `markdown` }
            );

            await ctx.leaveChat();
        }

        return;
    }

    try {
        await ctx.restrictChatMember(id, {
            can_send_messages: false
        });

        await ctx.reply(
            ctx.i18n(`welcome`, { first_name, title, }),
            {
                ...ctx.keyboard(),
                reply_to_message_id: message_id,
            }
        );
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

bot.action(/unmute\.(\d+)/, async (ctx) => {
    const clickedId = ctx.callbackQuery.from.id;
    const unmuteId = ctx.match[1];

    if (clickedId == unmuteId) {
        try {
            await ctx.restrictChatMember(clickedId, {
                until_date: (Date.now() + 86400000) / 1000, // 24 hours
                can_send_messages: true
            });
        } catch (err) {
            console.log(err);
        }

        ctx.deleteMessage();

        if (ctx.callbackQuery.message) {
            const { reply_to_message: reply } = ctx.callbackQuery.message;

            ctx.deleteMessage(reply.message_id)
                .catch(() => { /* Do nothing */ });
        }
    } else {
        ctx.answerCbQuery(ctx.i18n(`user_must_click`));
    }
});

bot.startPolling();
