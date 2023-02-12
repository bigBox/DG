

const { ccclass, property } = cc._decorator;

@ccclass
export default class UITradeDlg extends cc.Component {
    @property({ type: cc.Node, displayName: "lblTitle", tooltip: "lblTitle" })
    lblTitle: cc.Node = null;
    @property({ type: cc.Node, displayName: "ndInfoBuy", tooltip: "ndInfoBuy" })
    ndInfoBuy: cc.Node = null;
    @property({ type: cc.Node, displayName: "ndInfoSale", tooltip: "ndInfoSale" })
    ndInfoSale: cc.Node = null;
    @property({ type: cc.Node, displayName: "ndPrice", tooltip: "ndPrice" })
    ndPrice: cc.Node = null;
    @property({ type: cc.Node, displayName: "helpNode", tooltip: "helpNode" })
    helpNode: cc.Node = null;
    @property({ type: cc.EditBox, displayName: "buyNum", tooltip: "购买数量" })
    buyNum: cc.EditBox = null;
    @property({ type: cc.EditBox, displayName: "buygold", tooltip: "购买单价" })
    buygold: cc.EditBox = null;
    @property({ type: cc.EditBox, displayName: "sellNum", tooltip: "卖出数量" })
    sellNum: cc.EditBox = null;
    @property({ type: cc.EditBox, displayName: "sellgold", tooltip: "卖出单价" })
    sellgold: cc.EditBox = null;
    @property({ type: cc.Label, displayName: "ndGoldBuy", tooltip: "购买总价" })
    ndGoldBuy: cc.Label = null;
    @property({ type: cc.Label, displayName: "ndGoldSell", tooltip: "卖出总价" })
    ndGoldSell: cc.Label = null;
    lblType: any;
    spIcon: any;
    data: {};
    itemID: number;
    type: number;
    constructor() {
        super();
        this.lblType = null;
        this.spIcon = null;
        this.data = {};

        this.itemID = 0;
        this.type = 0;
    };
    onLoad() {
        this.spIcon = this.node.getChildByName('spIcon');
     
        this.node.on('onNumberChange', this.onNumberChange,this);
    };

    start() {

    }
    onEnable() {
    };

    onDisable() {
        this.node.off('onNumberChange', this.onNumberChange,this);
    };
    onNumberChange() {
        let gold = 0;
        gold = parseInt(this.buyNum.string) * parseInt(this.buygold.string)
        this.ndGoldBuy.string = gold.toString();
        gold = parseInt(this.sellNum.string) * parseInt(this.sellgold.string)
        this.ndGoldSell.string = gold.toString();
    };
    show() {
        this.type = global.Enum.TradeType.TRADE_WANT_BUY;
        this.showReflash();
        this.reflashData();
        this.setData();
    };
    refresh(){
        this.reflashData();
        this.setData();
    }
    setData() {
        var data = global.Module.TaskData.getHasAcceptTaskData();
        if (data && data.taskId == 10022 && data.state == 1){
            this.helpNode.active = true;
            let guideHelp = this.node.getChildByName('guideHelp')
            guideHelp.zIndex = 999;
        }
          

    };
    reflashData() {

        this.itemID = global.Module.TradeData.getTradeItemID();
        global.CommonClass.Functions.setItemTexture(this.spIcon, this.itemID, function (msg) {
            this.spIcon.scale = global.CommonClass.Functions.getToscale(this.spIcon, 140, 160);
        }.bind(this));
        let itemData = global.Manager.DBManager.getItemNew(this.itemID);
        this.lblTitle.getComponent(cc.Label).string = itemData.name;
        
        let dataSale = global.Module.TradeData.getCurTradeData(global.Enum.TradeType.TRADE_WANT_SELL);
        let dataBuy = global.Module.TradeData.getCurTradeData(global.Enum.TradeType.TRADE_WANT_BUY);
        let startPrice = global.Module.TradeData.getStartPrice();
        {
            let hasData = false;
            if (dataBuy != null) {
                for (let i = 0; i < 3; ++i) {
                    let lblPrice = this.ndInfoBuy.getChildByName('lblPrice' + (i + 1).toString());
                    let lblNum = this.ndInfoBuy.getChildByName('lblNum' + (i + 1).toString());
                    lblPrice.color = cc.color(177, 46, 46, 255);
                    if (dataBuy.info[i] != null) {
                        let leftNum = dataBuy.info[i].orderNum - dataBuy.info[i].tradeNum;
                        lblPrice.getComponent(cc.Label).string = dataBuy.info[i].price.toString();
                        if (Number(startPrice) > Number(dataBuy.info[i].price))
                            lblPrice.color = cc.color(31, 255, 72, 255);
                        lblNum.getComponent(cc.Label).string = leftNum.toString();
                        hasData = true;


                    } else {
                        lblPrice.getComponent(cc.Label).string = '--';
                        lblNum.getComponent(cc.Label).string = '--';
                    }
                }
            }
        }
        {
            let hasData = false;
            if (dataSale != null) {
                for (let i = 0; i < 3; ++i) {
                    let lblPrice = this.ndInfoSale.getChildByName('lblPrice' + (i + 1).toString());
                    let lblNum = this.ndInfoSale.getChildByName('lblNum' + (i + 1).toString());
                    lblPrice.color = cc.color(177, 46, 46, 255);
                    if (dataSale.info[i] != null) {
                        let leftNum = dataSale.info[i].orderNum - dataSale.info[i].tradeNum;
                        lblPrice.getComponent(cc.Label).string = dataSale.info[i].price.toString();
                        if (Number(startPrice) > Number(dataSale.info[i].price))
                            lblPrice.color = cc.color(31, 255, 72, 255);
                        lblNum.getComponent(cc.Label).string = leftNum.toString();
                        hasData = true;
                    } else {
                        lblPrice.getComponent(cc.Label).string = '--';
                        lblNum.getComponent(cc.Label).string = '--';
                    }
                }
            }
        }
    };
    getBuy() {
        this.type = global.Enum.TradeType.TRADE_WANT_BUY;
        this.showReflash();
    };
    getSell() {
        this.type = global.Enum.TradeType.TRADE_WANT_SELL;
        this.showReflash();
    };

    setChanageBox(tradeData) {
        global.Instance.Log.debug('', tradeData)
        let ndPrice: any = this.ndPrice
        if (tradeData.info.length > 0) {
            let numChange = ndPrice.getChildByName('numChange').getComponent(global.CommonClass.UICountChange);
            let trade = tradeData.info[0];

            let num = trade.orderNum - trade.orderUsed;
            numChange.setNumber(num);
            numChange.setMax(num);
            numChange.setMin(1);
            let lblPrice1 = this.ndPrice.getChildByName('lblPrice1').getComponent(cc.Label);
            let lblNum1 = this.ndPrice.getChildByName('lblNum1').getComponent(cc.Label);

            lblPrice1.string = trade.price;
            lblNum1.string = num.toString();
        } else {
            let numChange = ndPrice.getChildByName('numChange').getComponent(global.CommonClass.UICountChange);
            numChange.setNumber(0);
            numChange.setMax(0);
            numChange.setMin(0);
            let lblPrice1 = this.ndPrice.getChildByName('lblPrice1').getComponent(cc.Label);
            let lblNum1 = this.ndPrice.getChildByName('lblNum1').getComponent(cc.Label);

            lblPrice1.string = "--";
            lblNum1.string = "--";
        }

    };
    onReflash(){
        let self = this;
        let dataSale = { type: 0, itemID: this.itemID };
        global.Instance.MsgPools.send('tradeTop', dataSale, function (msg) {
            global.Module.TradeData.setTradeItemID(dataSale.itemID);
            self.show();
        }); 
    }
    onClickKLine(event, arg) {
        let itemID = this.itemID;
        let data = { itemID: itemID };
        global.Instance.MsgPools.send('tradeHistory', data, function (msg) {
            global.Manager.UIManager.open('UITradeKLine', null, function (panel) {
                panel.show(itemID);
            });
        });
    };
    showReflash(){
        let ndPrice1 = this.node.getChildByName("ndPrice1");
        let ndPrice2 = this.node.getChildByName("ndPrice2");
        ndPrice1.zIndex = 5;
        ndPrice2.zIndex = 5;
        if (this.type == global.Enum.TradeType.TRADE_WANT_BUY) {
            ndPrice1.zIndex = 6;
            this.setpriceBox(ndPrice1)
        } else {
            ndPrice2.zIndex = 6;
            this.setpriceBox(ndPrice2)
        }
    }
    setpriceBox(ndPrice) {
        let tradeData =  global.Module.TradeData.getCurTradeData(this.type);
        let price = 1;
        if(this.type == 1){
           let  tradeData1 = global.Module.TradeData.getCurTradeData(2);
           if(tradeData1.info.length > 0)
           price = tradeData1.info[0].price
        }
        global.Instance.Log.debug('tradeData', tradeData)
        ndPrice = this.ndPrice;
        if (tradeData.info.length > 0) {
            let trade = tradeData.info[0];
            let numChangeWant = ndPrice.getChildByName('numChangeWant').getComponent(global.CommonClass.UICountChange);
            numChangeWant.setNumber(1);
            numChangeWant.setMax(999);
            numChangeWant.setMin(1);

            let numChange = ndPrice.getChildByName('numChange').getComponent(global.CommonClass.UICountChange);

            numChange.setNumber(price);
            numChange.setMax(999999);
            numChange.setMin(1);
            // let gold = 0;
            // gold = parseInt(this.buyNum.string) * parseInt(this.buygold.string)
            // this.ndGoldBuy.string = gold.toString();
            // gold = parseInt(this.sellNum.string) * parseInt(this.sellgold.string)
            // this.ndGoldSell.string = gold.toString();
        }
    };

    setWantInfo(isWantOp) {
        let data = {};
        if (isWantOp) {
            let ndPrice = this.node.getChildByName("ndPrice2");
           
            let buyNumChange: any = ndPrice.getChildByName('numChangeWant');
            let countClass = buyNumChange.getComponent(global.CommonClass.UICountChange);
            let wantNum = countClass.getCurNumber();

            let numChange: any = ndPrice.getChildByName('numChange');
            let priceClass = numChange.getComponent(global.CommonClass.UICountChange);
            let gold = priceClass.getCurNumber();

            data = { itemID: this.itemID, wantNum: wantNum, wantPrice: gold };
            global.Module.TradeData.setWantData(data);
        }
        else {
            let ndPrice = this.node.getChildByName("ndPrice1");
           
            let buyNumChange: any = ndPrice.getChildByName('numChangeWant');
            let countClass = buyNumChange.getComponent(global.CommonClass.UICountChange);
            let wantNum = countClass.getCurNumber();

            let numChange: any = ndPrice.getChildByName('numChange');
            let priceClass = numChange.getComponent(global.CommonClass.UICountChange);
            let gold = priceClass.getCurNumber();

            data = { itemID: this.itemID, wantNum: wantNum, wantPrice: gold };
            global.Module.TradeData.setWantData(data);
        }
    };
    //购买
    btnWantBuy() {
        this.setWantInfo(false);
        this.helpNode.active = false;
        global.Manager.UIManager.open('UITradePop', null, function (panel) {
            panel.show(global.Enum.TradeType.TRADE_WANT_BUY);
        });
    };
    //卖出
    btnWantSell() {
        this.setWantInfo(true);
        this.helpNode.active = false;
        global.Manager.UIManager.open('UITradePop', null, function (panel) {
            panel.show(global.Enum.TradeType.TRADE_WANT_SELL);
        });
    };

    btnClose() {
        global.Manager.UIManager.close('UITradeDlg');
    };

    // update (dt) {}
}
