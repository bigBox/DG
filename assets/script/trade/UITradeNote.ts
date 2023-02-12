import UIBase from "../common/UIBase";


const { ccclass, property } = cc._decorator;

@ccclass
export default class UITradeNote extends UIBase {

    onLoad() { };

    start() {

    };

    onEnable() {
        this.show();
    };

    onDisable() {
    };

    show() {
        //{key:itemType, vaule:Array(itemID, idx, tradeType, price, number, tradeNum, leftNum)}
        this.reflash();
    };

    reflash() {
        let space = 10;
        let tradeData = global.Module.TradeData.getTradeNotes();
        let ndView = this.node.getChildByName('spBack1').getChildByName('itemScorll').getChildByName('view');
        let ndItems = ndView.getChildByName('content');
        let itemSize = this.node.getChildByName('tradeNodeItem').getContentSize();
        let itemNum = tradeData.length;
        ndItems.setContentSize((itemSize.width + space) * itemNum + 20, itemSize.height);
        ndItems.removeAllChildren();

        let itemPosX = itemSize.width / 2;
        global.Instance.Log.debug('', tradeData);

        for (let i = 0; i < tradeData.length; i++) {
            let item = tradeData[i];
            global.CommonClass.TradeNoteItem.create(i, tradeData.length, item, ndItems, cc.v2(itemPosX, 0), this.unTradeCall.bind(this));
            itemPosX += itemSize.width + space;
        }
    };

    unTradeCall(id) {
        let self = this;
        global.CommonClass.UIDialog.create("撤单", '是否撤单?', function (isYes) {
            if (isYes) {
                let tradeData = global.Module.TradeData.getTradeNote(id);
                let data = { id: id, orderId: tradeData.orderId, type: tradeData.tradeType };
                global.Instance.MsgPools.send('tradeDequeue', data, function (msg) {
                    if (!msg.errorID) {
                        global.Module.TradeData.removeTradeNote(id);

                        let panelBuy = global.Manager.UIManager.get('UITradeBuy');
                        if (panelBuy != null)
                            panelBuy.reflash();

                        let panelSell = global.Manager.UIManager.get('UITradeSell');
                        if (panelSell != null)
                            panelSell.reflash();

                        self.reflash();
                        global.CommonClass.UITip.showTipTxt('撤单成功', global.Enum.TipType.TIP_GOOD);
                    }
                    else {
                        global.CommonClass.UITip.showTipTxt('撤单失败', global.Enum.TipType.TIP_BAD);
                    }
                });
            }
        });
    };

    btnClose() {
        global.Manager.UIManager.close('UITradeNote');
    };
    // update (dt) {}
}
