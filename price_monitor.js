const axios = require('axios');

class price_monitor{
    
    constructor (){
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
    
    getValues = async () => {
        axios.get("https://www.binance.com/bapi/asset/v2/public/asset-service/product/get-product-by-symbol?symbol=BNBBRL")
        .then(obj => {
            this.updateValues(obj.data.data);
        });
    }

    updateValues = (ValuesObj) => {
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
            console.log(this);
        }
        setTimeout(() => {
            this.getValues();
        }, 5000);


    }

}

module.exports = { price_monitor };