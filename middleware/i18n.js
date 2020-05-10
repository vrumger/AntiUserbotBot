const Markup = require(`telegraf/markup`);
const newI18n = require(`new-i18n`);

const languages = process.env.I18N.split(`,`);
const i18n = newI18n(`${__dirname}/../i18n`, languages, languages[0]);

const langMap = {
    en: `🇺🇸 English`,
    es: `🇪🇸 Spanish`,
    fr: `🇫🇷 French`,
    pt: `🇵🇹 Portuguese`,
};

module.exports = (bot, db) => {
    bot.context.i18n = function (keyword, variables) {
        return new Promise((resolve, reject) => {
            db.findOne({ chat_id: this.chat.id }, (error, chat) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(i18n(chat.lang, keyword, variables));
                }
            });
        });
    };

    const _languages = languages.map(lang => Markup.callbackButton(langMap[lang], `lang.${lang}`));
    const buttons = [];

    while (_languages.length) {
        buttons.push(_languages.splice(0, 2));
    }

    bot.context.i18nButtons = Markup.inlineKeyboard(buttons).extra();
};
