const axios = require('axios');
const { user } = require(`./user.js`);

class price_monitor{
    
    constructor (bot){
        this.bot = bot;
        this.min = 0;
        this.max = 0;
        this.current = 0;
        this.volumeBRL = 0;
        this.volumeBNB = 0;
        this.lastPrice = 0;
        this.historyEmoji = [];
        this.historyPrices = [];
    }
    
    launch = () => {
        this.getValues();
    }

    toBRL = (data) => {
        return data.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
    }
    
    getValues = async () => {
        axios.get("https://www.binance.com/bapi/asset/v2/public/asset-service/product/get-product-by-symbol?symbol=BNBBRL")
        .then(obj => {
            this.updateValues(obj.data.data);
        });
    }

    updateValues = async (ValuesObj) => {
        this.min = parseInt(ValuesObj.l);
        this.max = parseInt(ValuesObj.h);
        this.current = parseInt(ValuesObj.c);
        this.volumeBRL = parseInt(ValuesObj.qv);
        this.volumeBNB = parseInt(ValuesObj.v);
        if (this.lastPrice != this.current){
            if (this.lastPrice > this.current){
                this.historyEmoji.push('📉');
            } else if (this.lastPrice != 0){
                this.historyEmoji.push('📈');
            }
            this.historyPrices.push(this.current);
            this.historyEmoji = this.historyEmoji.slice(-100);
            this.historyPrices = this.historyPrices.slice(-100);
            this.lastPrice = this.current;

            var users = await user.findAll();
            for (let index = 0; index < users.length; index++) {
                const user = users[index];
                // console.log(user.dataValues.tID);
                var message = `💰 BNB - BRL\n\nValor atual\n|-💱: ${this.toBRL(this.current)}\n|\nUltimas 24 horas\n|-📉: ${this.toBRL(this.min)}\n|-📈: ${this.toBRL(this.max)}\n|\nVolume: ${this.toBRL(this.volumeBRL)}\nVolume BNB: ${this.volumeBNB}\n|\nÚltimos preços\n|-${this.historyEmoji.slice(-10).join(``)}\n|-${this.historyPrices.slice(-10, -5).join(` | `)}\n|-${this.historyPrices.slice(-5).join(` | `)}`
                console.log(user.dataValues.mID);
                if (user.dataValues.mID == null){
                    this.bot.telegram.sendMessage(user.dataValues.tID, message).then(res => {
                        user.update({mID: res.message_id}, {where: {tID: user.dataValues.tID}});
                    });
                } else {
                    this.bot.telegram.editMessageText(user.dataValues.tID, user.dataValues.mID, null, message)
                    .then(res => {
                    })
                    .catch(e => {
                        user.update({mID: null}, {where: {tID: user.dataValues.tID}});
                    });
                }
            }
        }

        setTimeout(() => {
            this.getValues();
        }, 1000);


    }

}

module.exports = { price_monitor };