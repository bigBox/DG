//交易数据类
const {ccclass, property} = cc._decorator;
@ccclass
export default class TradeData {
    allItems: any[];
    data: any[];
    tradeNote: any[];
    curTradeID: number;
    curBuyData: { itemID: number; info: any[]; /*message TradeInfo*/ };
    curSellData: { itemID: number; info: any[]; /*message TradeInfo*/ };
    curHistory: any;
    curWantData: { itemID: number; wantNum: number; wantPrice: number; };
    rankItems: any[];
    needPopTardeUI: boolean;
    startPrice: any;

    constructor () {
        this.allItems = new Array();
        this.data = new Array();    //{key:itemType, vaule:Array (arrayObj : ID, Money, diamond, moneyUp, diamondUp)}
        this.tradeNote = new Array();   //{key:itemType, vaule:Array(itemID, idx, tradeType, price, number, tradeNum, leftNum)}
        // this.curType     = 0;           //包裹物品类型 目前默认都是5宝物类型
        this.curTradeID = 0;
        this.curBuyData = { itemID: 0, info: new Array()/*message TradeInfo*/ };
        this.curSellData = { itemID: 0, info: new Array()/*message TradeInfo*/ };
        this.curHistory = null;

        this.curWantData = { itemID: 0, wantNum: 0, wantPrice: 0 };

        this.rankItems = new Array;
        this.needPopTardeUI = false;
    };
    setItemQulity (quality: number) {
        this.tradeNote = new Array();
        this.data = this.filterItem(this.allItems, quality);
        return this.data;
    };
    getStartPrice(){
        return this.startPrice;
    }
    getHistoryData () {
        return this.curHistory;
    };

    sort (sortType: number,callback) {
        let items = this.data;
        global.CommonClass.Functions.sort(items, function (lhs: { ID: any; lastPrice: number; percent: number;color: number; }, rhs: { ID: any; lastPrice: number; percent: number;color: number; }) {
            if (sortType == 0)  //ID
            {
                return lhs.color < rhs.color;
            }
            else if (sortType == 1)            //价格升
            {
                return lhs.lastPrice < rhs.lastPrice;
            }
            else if (sortType == 2)             //价格降
            {
                return lhs.lastPrice > rhs.lastPrice;
            }
            else if (sortType == 3)            //涨幅升
            {
                return lhs.percent > rhs.percent;
            }
            else if (sortType == 4)             //涨幅降
            {
                return lhs.percent < rhs.percent;
            }

            return false;
        });
        if (callback)
            callback(items);
           
    };

    filterItem (data: any[], quality: number) {
        let filter = new Array();
        for (let key in data) {
            let value = data[key];
            let itemData = global.Manager.DBManager.getItemNew(value.ID);
            value.color = itemData.color;
            filter.push(value);
        }
        return filter;
    };
    getItem (itemIdx: string | number) {
        return this.data[itemIdx];
    };

    getItemByID (itemID: number) {
        for (let key in this.allItems) {
            let item = this.allItems[key];
            if (item.ID == itemID) {
                return item;
            }
        }
        return null;
    };
    getCurTradeData (type: any) {
        if (type == global.Enum.TradeType.TRADE_WANT_BUY)
            return this.curBuyData;
        else if (type == global.Enum.TradeType.TRADE_WANT_SELL)
            return this.curSellData;
    };

    getTradeNotes () {
        return this.tradeNote;
    };

    getTradeNote (id: any) {
        let infos = this.tradeNote;

        for (let key in infos) {
            let value = infos[key];
            if (value.id == id)
                return value;
        }
    };

    addTradeNote (info: any) {
        this.tradeNote.push(info);
    };

    removeTradeNote (id: any) {
        let infos = this.tradeNote;

        for (let key in infos) {
            let idx = parseInt(key);

            let value = infos[key];
            //value.id = value.id.toNumber();

            if (value.id == id) {
                infos.splice(idx, 1);
                break;
            }
        }
    };

    setNeedOpenTradeUI (isNeed: boolean) {
        this.needPopTardeUI = isNeed;
    };

    getNeedOpenTradeUI () {
        return this.needPopTardeUI;
    };

    setTradeItemID (itemID: number) {
        this.curTradeID = itemID;
    };

    getTradeItemID () {
        return this.curTradeID;
    };

    setWantData (data: { itemID: number; wantNum: number; wantPrice: number; }) {
        this.curWantData = data;
    };

    getWantData () {
        return this.curWantData;
    };

    // 计算5日线 10日线 30日线
    calKLine () {
        for (let i = 0; i < this.curHistory.historyPrices.length; i++) {
            let curData = this.curHistory.historyPrices[i];
            if (i > 3) {
                let val = 0;
                for (let j = i - 5 + 1; j < i + 1; j++) {
                    let tmpData = this.curHistory.historyPrices[j];
                    val += parseInt(tmpData.startPrice);
                }
                curData.day5 = val / 5;
            }
            if (i > 8) {
                let val = 0;
                for (let j = i - 10 + 1; j < i + 1; j++) {
                    let tmpData = this.curHistory.historyPrices[j];
                    val += parseInt(tmpData.startPrice);
                }
                curData.day10 = val / 10;
            }
            if (i > 28) {
                let val = 0;
                for (let j = i - 30 + 1; j < i + 1; j++) {
                    let tmpData = this.curHistory.historyPrices[j];
                    val += parseInt(tmpData.startPrice);
                }
                curData.day30 = val / 30;
            }
        }
    };

    onTradeTop (msg: { errorID: number; req: { itemID: number; }; startPrice: any; info: { [x: string]: any; }; }) {
        if (msg.errorID == 0) {
            this.curSellData = { itemID: 0, info: new Array() };
            this.curSellData.itemID = msg.req.itemID;

            this.curBuyData = { itemID: 0, info: new Array() };
            this.curBuyData.itemID = msg.req.itemID;
            this.startPrice = msg.startPrice
            for (let key in msg.info) {
                let value = msg.info[key];
                if (value.type == 2) {
                    // 卖
                    value.orderID = value.orderID;
                    this.curSellData.info.push(value);
                } else if (value.type == 1) {
                    // 买
                    value.orderID = value.orderID;
                    this.curBuyData.info.push(value);
                }
            }
        }
    };

    onTradeEnqueue (msg: any) {

    };

    onTradeDequeue (msg: any) {

    };

    onTradeUse (msg: any) {

    };

    onStockList (msg: { stocks: any[]; }) {
        global.Instance.Log.debug('onStockList',msg)
        let stocks = msg.stocks.map;
        this.allItems = [];
        for (let key in stocks) {
            let data = stocks[key];
            let item = {
                ID:data.value.itemID,
                lastPrice:Number(data.value.lastPrice),
                startPrice:data.value.startPrice,
                turnover:data.value.turnover,
                lowestPrice:data.value.lowestPrice,
                highestPrice:data.value.highestPrice,
                percent:data.value.score
            };
            this.allItems.push(item);
        }
        this.data = this.allItems;
    };

    onTradeHistoryRsp (msg: { errorID: number; highestPrice: any; lastPrice: any; lowestPrice: any; req: any; historyPrices: string | any[]; }) {
        if (msg.errorID == 0) {
            this.curHistory = {}
            this.curHistory.highestPrice = msg.highestPrice;
            this.curHistory.lastPrice = msg.lastPrice;
            this.curHistory.lowestPrice = msg.lowestPrice;
            this.curHistory.req = msg.req;
            this.curHistory.historyPrices = [];
            for (let i = 0; i < msg.historyPrices.length; i++) {
                let tmp = {
                    date: msg.historyPrices[i].date,
                    endPrice: msg.historyPrices[i].endPrice,
                    highestPrice: msg.historyPrices[i].highestPrice,
                    lowestPrice: msg.historyPrices[i].lowestPrice,
                    month: msg.historyPrices[i].month,
                    startPrice: msg.historyPrices[i].startPrice,
                    turnover: msg.historyPrices[i].turnover,
                    day5: -1,
                    day10: -1,
                    day30: -1,
                }
                this.curHistory.historyPrices.push(tmp);
            }
            // for (let i = 0; i < msg.historyPrices.length; i++) {
            //     let tmp = {
            //         date: msg.historyPrices[i].date,
            //         endPrice: msg.historyPrices[i].endPrice,
            //         highestPrice: msg.historyPrices[i].highestPrice,
            //         lowestPrice: msg.historyPrices[i].lowestPrice,
            //         month: msg.historyPrices[i].month,
            //         startPrice: msg.historyPrices[i].startPrice,
            //         turnover: msg.historyPrices[i].turnover,
            //         day5: -1,
            //         day10: -1,
            //         day30: -1,
            //     }
            //     this.curHistory.historyPrices.push(tmp);
            // }
        }
    };

    onTradeCloseRsp (msg: any) {
        global.Instance.Log.debug('onTradeCloseRsp',msg)

    };

    onTradeUseNtf (msg: { itemID: any; info: { date: any; endPrice: any; highestPrice: any; lowestPrice: any; month: any; startPrice: any; turnover: any; }; }) {
        if (this.curHistory == null) {
            return;
        }
        if (this.curHistory.req.itemID == msg.itemID) {
            let isExist = false;
            for (let i = 0; i < this.curHistory.historyPrices.length; i++) {
                let tmpData = this.curHistory.historyPrices[i];
                if (tmpData.date == msg.info.date) {
                    let tmp = {
                        date: msg.info.date,
                        endPrice: msg.info.endPrice,
                        highestPrice: msg.info.highestPrice,
                        lowestPrice: msg.info.lowestPrice,
                        month: msg.info.month,
                        startPrice: msg.info.startPrice,
                        turnover: msg.info.turnover,
                        day5: -1,
                        day10: -1,
                        day30: -1,
                    }
                    this.curHistory.historyPrices[i] = tmp;
                    isExist = true;
                    break;
                }
            }
            if (isExist == false) {
                let tmp = {
                    date: msg.info.date,
                    endPrice: msg.info.endPrice,
                    highestPrice: msg.info.highestPrice,
                    lowestPrice: msg.info.lowestPrice,
                    month: msg.info.month,
                    startPrice: msg.info.startPrice,
                    turnover: msg.info.turnover,
                    day5: -1,
                    day10: -1,
                    day30: -1,
                }
                this.curHistory.historyPrices.push(tmp);
            }
        }
    };

    onTradeRole (msg: { info: any; req: { type: number; }; }) {
        let info = msg.info;

        if (msg.req.type == 0) {
            this.tradeNote = [];
        }

        for (let key in info) {
            let value = info[key];
            value.tradeType = msg.req.type;

            value.id = value.id.toNumber();

            this.tradeNote.push(value);
        }
    };

    onStockChangeLstNTF (msg: { topN: { [x: string]: { rankBase: any; }; }; }) {
        for (let key in msg.topN) {
            let value = msg.topN[key].rankBase;
            let itemID = parseInt(value.id);
            let item = this.getItemByID(itemID);
            item.percent = value.score;
        }
    };

    getrankItems () {
        return this.rankItems;
    };
    // update (dt) {}
}
