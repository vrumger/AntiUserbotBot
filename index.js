`use strict`;

const telegraf = require(`telegraf`);
const { Markup } = telegraf;
const bot = new telegraf(process.env.TOKEN);

const botId = bot.token.split(`:`)[0];

const admins = process.env.ADMINS
    .split(`,`)
    .map(Number);

bot.context.keyboard = function () {
    const { id } = this.message.new_chat_member;

    return Markup.inlineKeyboard([
        Markup.callbackButton(`I'm not a bot`, `unmute.${id}`)
    ]).extra();
}

bot.command(`leave`, async (ctx) => {
    const id = Number(ctx.from.id);

    if (admins.includes(id)) {
        await ctx.leaveChat();
    }
});

bot.on(`new_chat_members`, async (ctx) => {
    const { id } = ctx.message.new_chat_member;

    if (id == botId) {
        const adder = Number(ctx.from.id);

        if (!admins.includes(adder)) {
            const msg = `I'm not allowed to be here... ask one of my admins to add me here. My admins are:\n${admins.map((a) => `[${a}](tg://user?id=${a})`).join(`\n`)}`
            await ctx.reply(msg, { parse_mode: `markdown` });
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
                ctx.reply(`Why would you leave if you're the creator`);
                break;

           default:
               await ctx.reply(err.description);
               await ctx.leaveChat();
        }
    }
});

bot.action(/unmute.(\d+)/, async (ctx) => {
    const clickedId = ctx.callbackQuery.from.id;
    const unmuteId = ctx.match[1];

    if (clickedId == unmuteId) {
        try {
            await ctx.restrictChatMember(clickedId, {
                can_send_messages: true
            });
        } catch (err) {
            console.log(err);
        }

        ctx.deleteMessage();
    } else {
        ctx.answerCbQuery(`The user must click the button themself`);
    }
});

bot.startPolling();
