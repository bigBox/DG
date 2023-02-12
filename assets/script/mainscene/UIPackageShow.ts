

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIPackageShow extends cc.Component {
    itemID: any;
    callback: any;
    timeDelay: number;
    curModleNode: any;
    showMode: number;
    touchCount: number;
    leaveTime: any;
    @property({ type: cc.Label, displayName: "title", tooltip: "标题" })
    title: cc.Label = null;
    @property({ type: cc.Node, displayName: "PutNode", tooltip: "卸下按钮" })
    PutNode: cc.Node = null;
    constructor(){
        super();
        this.itemID = null;
        this.callback = null;
        this.timeDelay = -1;

        this.curModleNode = null;
        this.showMode = 0;

        this.touchCount = 0;
    };

    onLoad () {}

    start () {

    }
    onEnable() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
    };

    onDisable() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
    };

    touchEvent(event) {
        if (event.type == cc.Node.EventType.TOUCH_END) {
            let touchPoint = event.getLocation();
            if (this.curModleNode != null) {
                this.btnClose();
            }
        }
        else if (event.type == cc.Node.EventType.TOUCH_MOVE) {
        }
        else if (event.type == cc.Node.EventType.TOUCH_START) {
        }
    };

    show(itemID, leaveTime) {
        this.itemID = itemID;
        this.leaveTime = leaveTime;

        let item = global.Manager.DBManager.getItemNew(itemID);
    
        if (item != null) {
            this.showMode = 1;
            this.curModleNode = this.node.getChildByName('ndMode1');
            this.curModleNode.active = true;
            if (item != null) {
                this.setImage(false);

                let lblName = this.curModleNode.getChildByName('lblName');
                lblName.getComponent(cc.Label).string = '工艺品';
                this.title.string = item.name;
                let lblValue = this.curModleNode.getChildByName('lblValue');
                lblValue.string = '';
                lblValue.active = item.recyclePrice > 0;
                let dec =item.resume2;
                if (item.perfect != 0) {
                    let perItem = global.Manager.DBManager.findData('Items', 'ID', item.perfect);
                    dec = perItem.resume2;
                }
                
                this.setDec(dec);

            }
        }
    };
    showtype(params) {
      this.PutNode.active = false;  
    };
    showPutDown(callback) {
        this.callback = callback;
    };
    setImage(isReal) {
        let spItem = this.curModleNode.getChildByName('spItem');
        let iconFile = "images/pictrue/items/default";
        let item = global.Manager.DBManager.getItemNew(this.itemID);
        iconFile = item.path + item.picName;
        global.CommonClass.Functions.setTexture(spItem, iconFile, function (spImage) {
            if (spImage != null) {
                spItem.scale = global.CommonClass.Functions.getToscale(spItem, 180, 150);

            }
        });
    };
    update(dt) {
        // if (this.leaveTime > 0) {
        //     this.timeDelay -= dt;
        //     if (this.timeDelay < 0) {
        //         this.timeDelay = 1;

        //         let leaveTime = global.CommonClass.Functions.getLeftTime(this.leaveTime);
        //         let lblLeaveTime = this.node.getChildByName('lblLeaveTime');
        //         lblLeaveTime.getComponent(cc.Label).string = '离开时间 ' + global.CommonClass.Functions.formatSeconds2(leaveTime);

        //         if (leaveTime <= 0)
        //             this.btnClose();
        //     }
        // }
    };

    setDec(dec) {
        let content = this.curModleNode.getChildByName('decScroll').getChildByName('view').getChildByName('content');
        let lblItemDec = content.getChildByName('lblItemDec').getComponent(cc.Label);
        lblItemDec.string = dec;
        lblItemDec._forceUpdateRenderData(true);

        let size = lblItemDec.node.getContentSize();
        content.setContentSize(size);
    };

    btnPutDown() {
        if (this.callback)
            this.callback(true);

        global.Manager.UIManager.close('UIPackageShow');
    };
    /**
     * 
     * @returns 打开全屏图 暂时弃用之后讨论
     */
    btnFullImage() {
        let item = global.Manager.DBManager.getItemNew(this.itemID);
        if (item.subType == 23)
            return;

        global.Manager.UIManager.close('UIPackageShow');

        let self = this;
        // global.Manager.UIManager.open('DlgPackageItem', null, function (panel) {
        //     if (panel != null) {
        //         panel.show(self.itemID, self.callback);
        //     }
        // });
    };

    btnClose() {
        if (this.callback)
            this.callback(false);
        global.Manager.UIManager.close('UIPackageShow');
    };
    // update (dt) {}
}
