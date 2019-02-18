const newI18n = require(`new-i18n`);
const languages = process.env.I18N.split(`,`);
const i18n = newI18n(`${__dirname}/i18n`, languages);

module.exports = function (keyword, variables) {
    let [lang] = (this.from.language_code || ``).split('-');
    lang = i18n.languages.includes(lang) ? lang : `en`;

    return i18n(lang, keyword, variables);
};
