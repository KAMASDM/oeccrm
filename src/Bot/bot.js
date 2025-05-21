const { Telegraf } = require("telegraf");
const token = "";
const bot = new Telegraf("5868277941:AAFEzdZhlae1gMLso5LPj-NHmuH0-TxM_10");
bot.start((ctx) => ctx.reply("Welcome"));

bot.launch();
