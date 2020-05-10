const Composer = require(`telegraf/composer`);

module.exports = bot => {
    bot.command([`start`, `help`], Composer.privateChat(async ctx => {
        ctx.reply(await ctx.i18n(`start`), {
            parse_mode: `markdown`,
        });
    }));
};
