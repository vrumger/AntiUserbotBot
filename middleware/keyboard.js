const Markup = require(`telegraf/markup`);

module.exports = bot => {
    bot.context.keyboard = async function () {
        const { id } = this.message.new_chat_member;

        return Markup.inlineKeyboard([
            Markup.callbackButton(await this.i18n(`not_a_bot`), `unmute.${id}`),
        ]).extra();
    };
};
