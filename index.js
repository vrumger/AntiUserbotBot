`use strict`;

const telegraf = require(`telegraf`);
const { Markup } = telegraf;
const bot = new telegraf(process.env.TOKEN);

const botId = bot.token.split(`:`)[0];

bot.context.keyboard = function () {
    const { id } = this.message.new_chat_member;

    return Markup.inlineKeyboard([
        Markup.callbackButton(`I'm not a bot`, `unmute.${id}`)
    ]).extra();
}

bot.command([`start`, `help`], async (ctx) => {
    if (ctx.chat.type === `private`) {
        await ctx.reply(
            `Hi, I can help you prevent spam attacks in your group. Just add me to your group and I will mute all new users until they prove their humanity.\n\nI'm made by [Twit 💩](tg://user?id=234480941) and you can also find my source code on [github](https://github.com/YouTwitFaceTG/AntiUserbotBot).`,
            { parse_mode: `markdown` }
        );
    }
});

bot.on(`new_chat_members`, async (ctx) => {
    const { id } = ctx.message.new_chat_member;

    if (id == botId) {
        const { user, status } = await ctx.getChatMember(ctx.from.id);
        const statuses = [`creator`, `administrator`];

        if (!statuses.includes(status)) {
            await ctx.reply(
                `Hi [${user.first_name}](tg://user?id=${user.id}). Thanks for adding me but you don't seem to be admin here so I will have to leave. Ask an admin to add me here :)`,
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
            `Muted <i>*evil laugh*</i>`,
            {
                parse_mode: `html`,
                ...ctx.keyboard()
            }
        );
    } catch (err) {
        switch (err.description) {
            case `Bad Request: can't demote chat creator`:
                ctx.reply(`Why would you leave if you're the creator?`);
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
    } else {
        ctx.answerCbQuery(`The user must click the button themself.`);
    }
});

bot.startPolling();
