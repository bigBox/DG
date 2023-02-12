

const { ccclass, property } = cc._decorator;

@ccclass
export default class UITradePop extends cc.Component {
    lblType: any;
    lblNum: any;
    lblPrice: any;
    spIcon: any;
    opNum: number;
    itemID: number;
    type: number;
    tradeData: any;
    constructor() {
        super();
        this.lblType = null;
        this.lblNum = null;
        this.lblPrice = null;
        this.spIcon = null;
        this.opNum = 0;

        this.itemID = 0;
        this.type = 0;

        this.tradeData = null;
    };

    onLoad() {
        this.spIcon = this.node.getChildByName('spIcon');
        this.lblType = this.node.getChildByName('lblType').getComponent(cc.Label);
        this.lblNum = this.node.getChildByName('lblNum').getComponent(cc.Label);
        this.lblPrice = this.node.getChildByName('ndInfo').getChildByName('lblPrice').getComponent(cc.Label);
    };

    start() {

    };
    onEnable() {

    };

    onDisable() {

    };

    show(type) {
        this.type = type;

        this.itemID = global.Module.TradeData.getTradeItemID();

        this.reflash();
    };

    reflash() {
        global.CommonClass.Functions.setItemTexture(this.spIcon, this.itemID, null);

        let typeDec = { 1: '买入', 2: '卖出' };
        this.lblType.string = typeDec[this.type];
        this.node.getChildByName('btnYes'+this.type).active = true;

        let lblTitle = this.node.getChildByName('lblTitle').getComponent(cc.Label);
        lblTitle.string = typeDec[this.type];

        let tradeType = this.type;
        this.tradeData = global.Module.TradeData.getCurTradeData(tradeType);
        if (this.tradeData != null) {
            let wantData = global.Module.TradeData.getWantData();
            if (wantData != null) {
                this.lblNum.string = wantData.wantNum.toString();
                this.lblPrice.string = wantData.wantPrice.toString();
            }
        }
    };

    btnYes() {
        //交易所安全保护
        if (global.Module.TaskData.taskguard(10022))
            return;
        let orderNum = parseInt(this.lblNum.string);
        let gold = parseInt(this.lblPrice.string);

        //挂
        {
            //orderNum挂单数量    itemNum物品数量
            let data = { type: this.type, itemID: this.itemID, price: gold, orderNum: orderNum,itemNum:1 };
            global.Instance.MsgPools.send('tradeEnqueue', data, function (msg) {
                if (!msg.errorID) {
                    global.CommonClass.UITip.showTipTxt('交易成功', global.Enum.TipType.TIP_GOOD);
                    let ID = global.Module.TradeData.getTradeItemID();
                    let dataSale = { type: 0, itemID: ID };
                    global.Instance.MsgPools.send('tradeTop', dataSale, function (msg) {
                        let panel = global.Manager.UIManager.get('UITradeDlg');
                        if (panel)
                            panel.refresh();
                    });
                    let panel = global.Manager.UIManager.get('UITrade');
                    if (panel)
                        panel.btnReflash();
                }
            });
        }
    
        global.Manager.UIManager.close('UITradePop');
    };

    btnClose() {
        global.Manager.UIManager.close('UITradePop');
    };
    // update (dt) {}
}
