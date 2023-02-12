
const { ccclass, property } = cc._decorator;
@ccclass
export default class TradeNoteItem extends cc.Component {
    tradeData: any;
    unTradeCall: any;
    constructor() {
        super();
        this.tradeData = null;
        this.unTradeCall = null;
    };
    static create(i: any, length: any, tradeData: { id: { toString: () => any; }; }, parent: { addChild: (arg0: any, arg1: number) => void; }, position: { x: any; y: any; }, unTradeCall: any) {
        let filePath = "prefab/component/TradeNoteItem";
        cc.loader.loadRes(filePath, function (err, prefab) {
            if (err == null) {
                let newNode = cc.instantiate(prefab);
                if (parent != null)
                    parent.addChild(newNode, cc.macro.MAX_ZINDEX);
                newNode.setPosition(position.x, position.y);
                newNode.tagEx = tradeData.id;
                newNode.setName(tradeData.id.toString());

                let itemClass = newNode.getComponent(global.CommonClass.TradeNoteItem);
                itemClass.setItem(tradeData);
                itemClass.unTradeCall = unTradeCall;
            }
        });
    };
    // use this for initialization
    onLoad() {

    };
    setItem(tradeData: any) {
        this.tradeData = tradeData;

        let spItem = this.node.getChildByName('spItem');
        let lblPrice = this.node.getChildByName('lblPrice');
        let lblWantNum = this.node.getChildByName('lblWantNum');
        let lblTradeNum = this.node.getChildByName('lblTradeNum');
        let lblLeftNum = this.node.getChildByName('lblLeftNum');
        let lblDec = this.node.getChildByName('lblDec');

        //{key:itemType, vaule:Array(itemID, idx, tradeType, price, number, tradeNum, leftNum)}
        let picPath = global.CommonClass.Functions.getItemPicPathNew(tradeData.orderId);
        global.CommonClass.Functions.setTexture(spItem, picPath, null);

        if (tradeData.tradeType == 0) {
            lblPrice.getComponent(cc.Label).string = tradeData.price.toString();
            lblDec.getComponent(cc.Label).string = '卖';
        }
        else if (tradeData.tradeType == 1) {
            lblPrice.getComponent(cc.Label).string = tradeData.price.toString();
            lblDec.getComponent(cc.Label).string = '买';
        }

        lblWantNum.getComponent(cc.Label).string = (tradeData.orderNum + tradeData.orderUsed).toString();
        lblTradeNum.getComponent(cc.Label).string = tradeData.orderUsed.toString();
        lblLeftNum.getComponent(cc.Label).string = tradeData.orderNum.toString();

    };

    btnUnTrade() {
        if (this.unTradeCall)
            this.unTradeCall(this.tradeData.id);
    };
}
