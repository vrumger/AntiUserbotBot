const Composer = require(`telegraf/composer`);

module.exports = bot => {
    bot.command([`start`, `help`], Composer.privateChat(ctx => {
        ctx.reply(ctx.i18n(`start`), {
            parse_mode: `markdown`,
        });
    }));
};
