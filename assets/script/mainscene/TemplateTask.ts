

const {ccclass, property} = cc._decorator;

@ccclass
export default class TemplateTask extends cc.Component {
    @property({type: cc.Node, displayName: "btnAccept", tooltip: "btnAccept" })
    btnAccept: cc.Node = null;
    @property({type: cc.Node, displayName: "btnCommit", tooltip: "btnCommit" })
    btnCommit: cc.Node = null;
    @property({type: cc.Node, displayName: "spItemBG", tooltip: "spItemBG" })
    spItemBG: cc.Node = null;
    @property({type: cc.SpriteFrame, displayName: "spBGspriteFrame", tooltip: "spBGspriteFrame" })
    spBGspriteFrame:any = [];
    @property({type: cc.Node, displayName: "spItem", tooltip: "spItem" })
    spItem: cc.Node = null;
    @property({type: cc.Node, displayName: "spTaskStatus1", tooltip: "spTaskStatus1" })
    spTaskStatus1: cc.Node = null;
    @property({type: cc.Node, displayName: "spTaskStatus2", tooltip: "spTaskStatus2" })
    spTaskStatus2: cc.Node = null;
    @property({type: cc.Node, displayName: "spTaskStatus3", tooltip: "spTaskStatus3" })
    spTaskStatus3: cc.Node = null;
    @property({type: cc.Label, displayName: "lblTaskStatus", tooltip: "lblTaskStatus" })
    lblTaskStatus: cc.Label = null;
    @property({type: cc.Node, displayName: "nodeTouch", tooltip: "nodeTouch" })
    nodeTouch: cc.Node = null;
    @property({type: cc.Node, displayName: "btnNode", tooltip: "btnNode" })
    btnNode: cc.Node = null;
    @property({type: cc.Node, displayName: "BackgroundNode", tooltip: "BackgroundNode" })
    BackgroundNode: cc.Node = null;
    @property({type: cc.Node, displayName: "nodeItem", tooltip: "nodeItem" })
    nodeItem: cc.Node = null;
    @property({type: cc.Node, displayName: "helpNode", tooltip: "提示" })
    helpNode: cc.Node = null;
    data: any;
    touchItemCB: any;
    touchDetailCB: any;
    btnCommitCB: any;
    taskType: number;
    constructor(){
        super();
        this.data = null;
        this.touchItemCB = null;
        this.touchDetailCB = null;
        this.btnCommitCB = null;
        this.taskType = 0;
    };
    onLoad () {}

    start () {

    }
    setData(taskType, data, isChoose) {
        this.taskType = taskType;
     
        this.lblTaskStatus.getComponent(cc.Label).string = "";
        this.data = data;

        this.spTaskStatus1.active = false;
        this.spTaskStatus3.active = false
        this.spTaskStatus2.active = false;
        if(this.data&&this.data.state == 2){
            this.spTaskStatus3.active = true;
            this.lblTaskStatus.getComponent(cc.LabelOutline).color = cc.color(203, 135, 29, 255);
        }else if(this.data&&this.data.state != 0){
            this.spTaskStatus1.active = true;
            this.lblTaskStatus.getComponent(cc.LabelOutline).color = cc.color(32, 43, 66, 255);
        }else{
            this.spTaskStatus2.active = true;
            this.lblTaskStatus.getComponent(cc.LabelOutline).color = cc.color(50, 67, 102, 255);
        }
        let cfgData = null;
        if (data != null) {
            this.data.islook = false;
            cfgData = global.Manager.DBManager.findData('Tasks', 'ID', data.taskId);
        } else {
            this.spItem.active = false;
        }
        if (taskType == global.Enum.ETaskType.eSpecial) {
            // 节日任务
            this.spItemBG.getComponent(cc.Sprite).spriteFrame = this.spBGspriteFrame[0];
            if (cfgData != null) {
                this.lblTaskStatus.getComponent(cc.Label).string = cfgData.title1.length > 5 ? cfgData.title1.substr(0, 5) : cfgData.title1;
            } else {
                this.lblTaskStatus.getComponent(cc.Label).string = "节日任务";
            }
        } else if (taskType == global.Enum.ETaskType.eMonth) {
            // 月度任务
            this.spItemBG.getComponent(cc.Sprite).spriteFrame = this.spBGspriteFrame[0];
            if (cfgData != null) {
                this.lblTaskStatus.getComponent(cc.Label).string = cfgData.title1.length > 5 ? cfgData.title1.substr(0, 5) : cfgData.title1;
            } else {
                this.lblTaskStatus.getComponent(cc.Label).string = "月度任务";
            }
        }else {
            // 成长任务
            this.spItemBG.getComponent(cc.Sprite).spriteFrame = this.spBGspriteFrame[2];
            this.lblTaskStatus.getComponent(cc.Label).string = cfgData.title1.length > 5 ? cfgData.title1.substr(0, 5) : cfgData.title1;
        } 
        // else if (taskType == global.Enum.ETaskType.eDaily) {
        //     // 日常任务
        //     this.spItemBG.getComponent(cc.Sprite).spriteFrame = this.spBGspriteFrame[1];
        //     if (cfgData != null) {
        //         this.lblTaskStatus.getComponent(cc.Label).string = cfgData.title1.length > 5 ? cfgData.title1.substr(0, 5) : cfgData.title1;
        //     } else {
        //         this.lblTaskStatus.getComponent(cc.Label).string = "日常任务";
        //     }
        // } 
        if (cfgData != null) {
            let tmpArr = cfgData.rewardItem.split("-");
            if (taskType == global.Enum.ETaskType.eDaily) {
                global.CommonClass.Functions.setItemTexture(this.spItem, tmpArr[0],null);
                this.BackgroundNode.getComponent(cc.Label).string = tmpArr[1];
                let spItem = this.nodeItem.getChildByName("spItem");
                let lblNum = spItem.getChildByName("lblNum");
                let tmpDaa = cfgData.needItem2.split("-");
                global.CommonClass.Functions.setItemTexture(spItem, tmpDaa[0],null);
                lblNum.getComponent(cc.Label).string = tmpDaa[1];
            } else {
                var url = "images/pictrue/taskicon/"+cfgData.ID
                global.CommonClass.Functions.setTextureNew(this.spItem, url,null);
                this.BackgroundNode.getComponent(cc.Label).string = "";
            } 
           
        }
        this.btnAccept.active = false;
        this.btnCommit.active = false;
        if (this.data != null&&taskType != global.Enum.ETaskType.eDaily) {
            if (this.data.state == 1) {
                this.lblTaskStatus.getComponent(cc.Label).string = "进行中";
            } else if (this.data.state == 2) {
                this.btnCommit.active = true;
                this.lblTaskStatus.getComponent(cc.Label).string = "已完成";
            } else {
                if (cfgData != null)
                    this.lblTaskStatus.getComponent(cc.Label).string = cfgData.title1;
            }
        }
        let guideID = global.Module.MainPlayerData.getguideID() + 1;
        this.helpNode.active = ((guideID <= 8008&&this.data&&this.data.state==0)||((this.data&&this.data.taskId == '10000'&&this.data.state==0)))
    };
    enlarge() {
        let scaleTo = cc.scaleTo(0, 0);
        let scaleTo1 = cc.scaleTo(1, 1);
        let seq = cc.sequence(scaleTo, scaleTo1);
        this.spItem.stopAllActions();
        this.spItem.runAction(seq);
    };
    narrow(){
        let scaleTo1 = cc.scaleTo(1, 0);
        let self = this
        let endFun = function () {
            self.node.removeFromParent();
        };
        let endFunction = cc.callFunc(endFun);
        let seq = cc.sequence(scaleTo1, endFunction);
        this.node.stopAllActions();
        this.node.runAction(seq);
    };

    refreshUI() {
        if (this.data.type == global.Enum.ETaskType.eDaily) {

        }
    };
    onbtnCommitClick() {
        if (this.btnCommitCB != null) {
            this.btnCommitCB(this.data);
        }
    };

    onClickDetail() {
        if (this.touchDetailCB != null) {
            this.touchDetailCB(this.data);
        }

    };


    onClickItem() {
        if (this.touchItemCB != null) {
            this.touchItemCB(this.data);
        }
    };

    // update (dt) {}
}
