

const { ccclass, property } = cc._decorator;

@ccclass
export default class DlgShowFish extends cc.Component {
    itemID: any;
    callback: any;
    timeDelay: number;
    fish: any;
    constructor() {
        super();
        this.callback = null;
        this.itemID = null;
        this.timeDelay = -1;
    };

    onLoad() { }

    start() {

    }
    show(fish, callback) {
        this.fish = fish;

        let itemID = fish.templateID;

        this.callback = callback;
        this.itemID = itemID;

        let lblMoney = this.node.getChildByName('lblMoney');
        let lblName = this.node.getChildByName('lblName');
        let lblQuality = this.node.getChildByName('lblQuality');

        let itemData = global.Manager.DBManager.getItemNew(itemID);
        if (itemData != null) {
            let qualityDec = global.Module.PreciousRoomData.qualityDec[itemData.color];
            lblQuality.getComponent(cc.Label).string = '品质: ' + qualityDec;

            let spItem = this.node.getChildByName('spItem');
            let iconFile = itemData.path + itemData.picName;
            global.CommonClass.Functions.setTexture(spItem, iconFile, null);

            lblName.getComponent(cc.Label).string = itemData.name;

            lblMoney.getComponent(cc.Label).string = itemData.gold.toString();
            //lblDec.getComponent(cc.Label).string = itemData.dec;
            this.setDec(itemData.dec);
        }

    };

    setDec(dec) {
        let content = this.node.getChildByName('decScroll').getChildByName('view').getChildByName('content');
        let lblItemDec = content.getChildByName('lblItemDec');
        lblItemDec.getComponent(cc.Label).string = dec;
        // lblItemDec.getComponent(cc.Label)._forceUpdateRenderData(true);

        let size = lblItemDec.getContentSize();
        content.setContentSize(size);
    };

    update(dt) {
        this.timeDelay -= dt;

        if (this.timeDelay < 0) {
            this.timeDelay = 1;

            let lblLeaveTime = this.node.getChildByName('lblLeaveTime');
            if (this.fish.leaveTime != null) {
                lblLeaveTime.active = true;
                let leaveTime = global.CommonClass.Functions.getLeftTime(this.fish.leaveTime);

                lblLeaveTime.getComponent(cc.Label).string = '离开时间 ' + global.CommonClass.Functions.formatSeconds2(leaveTime);

                if (leaveTime <= 0)
                    this.btnNo();
            }
            else {
                lblLeaveTime.active = false;
            }
        }
    };

    btnNo() {
        if (this.callback != null)
            this.callback(this.fish.index);

        global.Manager.UIManager.close('DlgShowFish');
    };
    // update (dt) {}
}
