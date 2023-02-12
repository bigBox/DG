

const {ccclass, property} = cc._decorator;

@ccclass
export default class DlgFarmAnimal extends cc.Component {
    data: any;
    timeDelay: number;
    sourceDec: any;
    lblLevelTime: cc.Node;
    constructor(){
        super();
        this.data = null;
        this.timeDelay = -1;
    };

    onLoad () {}

    start () {

    }
    onEnable() {
        this.sourceDec = {};
        this.sourceDec[0] = '无';
        this.sourceDec[1] = '宝藏';
        this.sourceDec[2] = '采集';
        this.sourceDec[3] = '精灵';

        this.lblLevelTime = this.node.getChildByName('lblLevelTime');
    };

    onDisable() {
    };

    show(data) {
        this.data = data;

        let lblName = this.node.getChildByName('lblName').getComponent(cc.Label);
        let lblSources = this.node.getChildByName('lblSources').getComponent(cc.Label);

        let item = global.Manager.DBManager.getItemNew(data.templateID);
        if (item != null) {
            let spItem = this.node.getChildByName('spItem');
            let iconFile = "images/pictrue/items/default";
            iconFile = item.path + item.picName;
            global.CommonClass.Functions.setTexture(spItem, iconFile,null);
            lblName.string = item.name;

            let sourceDec = '';
            let factoryData = global.Manager.DBManager.findData('Factory', 'ID', data.source);
            if (factoryData != null)
                sourceDec = factoryData.name;
            lblSources.string = sourceDec;

            this.setDec(item.dec);
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

        if (this.data.leaveTime > 0) {
            if (this.timeDelay < 0) {
                this.timeDelay = 1;

                let leftTime = global.CommonClass.Functions.getLeftTime(this.data.leaveTime);
                this.lblLevelTime.getComponent(cc.Label).string = '离开时间 ' + global.CommonClass.Functions.formatSeconds2(leftTime);

                if (leftTime <= 0) {
                    this.lblLevelTime.active = false;
                    this.btnClose();
                }
            }
        }
    };

    btnClose() {
        global.Manager.UIManager.close('DlgFarmAnimal');
    };

    // update (dt) {}
}
