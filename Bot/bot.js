const { Telegraf } = require("telegraf");
const TOKEN = "6211159955:AAGKzllYFEWWkwLAnaIg9VBa_tlJnb54mkg";
const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) => ctx.reply("Welcome"));

bot.launch();
