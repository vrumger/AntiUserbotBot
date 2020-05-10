const Markup = require(`telegraf/markup`);

module.exports = bot => {
    bot.context.keyboard = function () {
        const { id } = this.message.new_chat_member;

        return Markup.inlineKeyboard([
            Markup.callbackButton(this.i18n(`not_a_bot`), `unmute.${id}`),
        ]).extra();
    };
};
