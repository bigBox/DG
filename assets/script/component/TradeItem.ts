
const { ccclass, property } = cc._decorator;

@ccclass
export default class TradeItem extends cc.Component {
    @property({ type: cc.Node, displayName: "btnSale", tooltip: "" })
    btnSale: cc.Node = null;
    @property({ type: cc.Node, displayName: "spChoose", tooltip: "背景图" })
    spChoose: cc.Node = null;
    @property({ type: cc.Node, displayName: "底框", tooltip: "需要变色" })
    frameNode: cc.Node = null;
    
    @property({ type: cc.Node, displayName: "spItem", tooltip: "宝贝图片" })
    spItem: cc.Node = null;
    @property({ type: cc.Node, displayName: "lblLastPrice", tooltip: "最新价格" })
    lblLastPrice: cc.Node = null;
    @property({ type: cc.Label, displayName: "titleLabel", tooltip: "" })
    titleLabel: cc.Label = null;
    @property({ type: cc.Node, displayName: "lblPencent", tooltip: "涨跌比" })
    lblPencent: cc.Node = null;
    @property({ type: cc.Node, displayName: "lblTurnover", tooltip: "成交量" })
    lblTurnover: cc.Node = null;
    @property({ type: cc.Node, displayName: "lblHighestPrice", tooltip: "最高价" })
    lblHighestPrice: cc.Node = null;
    @property({ type: cc.Node, displayName: "lblLowestPrice", tooltip: "最低价" })
    lblLowestPrice: cc.Node = null;
    
    data: any;
    pageType: number;

    constructor() {
        super();
        this.data = null;
        this.pageType = 0;
    };

    onLoad() {
    };

    setData(pageType, tradeData) {
        let self = this;
        this.pageType = pageType;
        this.data = tradeData;
        if (tradeData == null) {
            return;
        }
        let cfgData = global.Manager.DBManager.getItemNew(this.data.ID);
        if (cfgData == null) {
            return;
        }
        let iconFile = "images/pictrue/items/default";
        if (cfgData != null) {
            iconFile = cfgData.path + cfgData.picName;
        }
        global.CommonClass.Functions.setTexture(this.spItem, iconFile, function (image) {
            self.spItem.scale = global.CommonClass.Functions.getToscale(self.spItem, 99, 100);
        });
        this.node.tagEx = tradeData.index;
        this.node.name = this.data.ID.toString();
        this.newLabel();
    };
    newLabel() {
        var tradeData = this.data;
        this.lblLastPrice.getComponent(cc.Label).string = tradeData.lastPrice;
        if (tradeData.percent > 0) {
            this.frameNode.color = cc.color(220, 9, 9, 255)
            this.lblPencent.getComponent(cc.Label).string = "+" + tradeData.percent.toString() + '%';
        } else {
            if (tradeData.percent == 0) {
                this.frameNode.color = cc.color(106, 101, 101, 255)
            } else {
                this.frameNode.color = cc.color(73, 220, 9, 255)
            }
            this.lblPencent.getComponent(cc.Label).string = tradeData.percent.toString() + '%';
        }

        this.lblTurnover.getComponent(cc.Label).string = tradeData.turnover;
        this.lblHighestPrice.getComponent(cc.Label).string = tradeData.highestPrice;
        this.lblLowestPrice.getComponent(cc.Label).string = tradeData.lowestPrice;
    };
    showChoose(bShow) {
        this.spChoose.active = bShow;
    };

    getData() {
        return this.data;
    };

    showKLine(isShow) {
    };

    btnTradeItemClick(event, arg) {
        let evt = new cc.Event.EventCustom('onTradeItemClick', true);
        evt.setUserData(this);
        this.node.dispatchEvent(evt);
    };

    onClickSale() {
        let evt = new cc.Event.EventCustom('onTradeClickSale', true);
        evt.setUserData(this);
        this.node.dispatchEvent(evt);
    };

    onClickKLine(event, arg) {
        let itemID = this.data.ID;
        let data = { itemID: itemID };
        global.Instance.MsgPools.send('tradeHistory', data, function (msg) {
            global.Manager.UIManager.open('UITradeKLine', null, function (panel) {
                panel.show(itemID);
            });
        });
    };

    // update (dt) {}
}
