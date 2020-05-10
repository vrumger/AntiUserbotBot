const handlers = [
    `help`,
    `group-config`,
    `new-chat-members`,
    `callback-query`,
];

module.exports = (bot, db) =>
    handlers.forEach(handler => require(`./${handler}`)(bot, db));
