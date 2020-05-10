const handlers = [
    `keyboard`,
    `i18n`,
];

module.exports = (bot, db) =>
    handlers.forEach(handler => require(`./${handler}`)(bot, db));
