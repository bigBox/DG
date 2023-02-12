

const {ccclass, property} = cc._decorator;

@ccclass
export default class DlgIdentifySpeed extends cc.Component {
    ID: number;
    callback: any;
    indentifyIdx: any;
    itemNum: number;
    constructor(){
        super();
        this.ID = 0;
        this.callback = null;
    };

    onLoad () {}

    start () {

    };
    show(leftTime, indentifyIdx, callback) {
        this.callback = callback;
        this.indentifyIdx = indentifyIdx;

        let itemID = 2;
        let data = global.Manager.DBManager.findData('Sundry', 'name', 'accelerateConsumption');
        this.itemNum = Math.ceil(leftTime / (data.value * 60));
        let itemCount = global.Module.PackageData.getItemCount(itemID);
        let lblNeed = this.node.getChildByName('lblNeed').getComponent(cc.Label);
        lblNeed.string = this.itemNum.toString() + '/' + itemCount.toString();
        if (itemCount >= this.itemNum)
            lblNeed.node.color = cc.color(0, 255, 0);
        else
            lblNeed.node.color = cc.color(255, 0, 0);
    };

    btnYes() {
        let self = this;
        let data = { index: this.indentifyIdx, speedupCard: 2, cardCount: this.itemNum };
        global.Instance.MsgPools.send('verifySpeedup', data, function (msg) {
            if (self.callback)
                self.callback(msg.errorID);
        });
        global.Manager.UIManager.close('DlgIdentifySpeed');
    };

    btnNo() {

        global.Manager.UIManager.close('DlgIdentifySpeed');
    };

    // update (dt) {}
}
