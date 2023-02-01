// I - CARREGAR ARQUIVO .env
const dotenv = require(`dotenv`);
dotenv.config();
// F - CARREGAR ARQUIVO .env

const { Telegraf } = require(`telegraf`);
const { user } = require(`./user.js`);
const { price_monitor } = require(`./price_monitor.js`);
const PriceMonitor = new price_monitor();
const bot = new Telegraf(process.env.BOT_TOKEN || ``);

const toBRL = (data) => {
    return data.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
}

bot.start(async ctx => {
    ctx.reply(`Bem-vindo!\nDe agora em diante você vai receber informações importantes sobre o valor do BNB.`);
    const eUser = await user.findOne({where: {tID: ctx.from.id}});
    if (eUser == null){
        const nUser = await user.build({tID: ctx.from.id});
        nUser.save();
    }
    ctx.telegram.deleteMessage(ctx.chat.id, ctx.message.message_id);
})

bot.command('test', ctx => {
    ctx.reply(`💰 BNB - BRL\n\nValor atual\n|-💱: ${toBRL(PriceMonitor.current)}\n|\nUltimas 24 horas\n|-📉: ${toBRL(PriceMonitor.min)}\n|-📈: ${toBRL(PriceMonitor.max)}\n|\nVolume: ${toBRL(PriceMonitor.volumeBRL)}\nVolume BNB: ${PriceMonitor.volumeBNB}\n|\nÚltimos preços\n|-${PriceMonitor.historyEmoji.slice(-10).join(``)}\n|-${PriceMonitor.historyPrices.slice(-10, -5).join(` | `)}\n|-${PriceMonitor.historyPrices.slice(-5).join(` | `)}`);
})

bot.launch();
PriceMonitor.launch();