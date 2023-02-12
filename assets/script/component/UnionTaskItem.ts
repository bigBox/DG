
const { ccclass, property } = cc._decorator;
@ccclass
export default class UnionTaskItem extends cc.Component {
    data: any;
    targetCDTime: number;
    timeDelay: number;
    spBack: cc.Node;
    spActive: cc.Node;
    ndItem: cc.Node;
    ndDelete: cc.Node;


    constructor() {
        super();
        this.data = null;
        this.targetCDTime = 0;
        this.timeDelay = 1;
    };
    onLoad() {
        this.spBack = this.node.getChildByName('spBack');
        this.spActive = this.node.getChildByName('spActive');
        this.ndItem = this.node.getChildByName('ndItem');
        this.ndDelete = this.node.getChildByName('ndDelete');
    };

    onEnable() {
        this.selectItem(false);
    };

    setData(data) {
        this.data = data;
        global.Instance.Log.debug('UnionTaskItem',data)
        this.ndItem.active = this.data.cd <= 0;
        this.ndDelete.active = this.data.cd > 0;

        if (this.data.cd > 0) {
            this.targetCDTime = global.CommonClass.Functions.getTargetTime(this.data.cd);
        }
        let taskData = global.Manager.DBManager.findData('Tasks', 'ID', this.data.taskId);
        if (taskData) {
            let tmpArr = null;
            let actionTime = null;
            if (taskData.actionType == 910||taskData.actionType == 920) {
                tmpArr = taskData.needItem2.split("-");
                actionTime = tmpArr[1];
            } else {
                actionTime = taskData.actionTime;
            }
            let iconFile = 'images/pictrue/items/' + taskData.taskIcon;

            let spIcon = this.ndItem.getChildByName('spIcon');
            let lblName = this.ndItem.getChildByName('lblName');
            let lblNum = this.ndItem.getChildByName('lblNum');

            global.CommonClass.Functions.setTextureNew(spIcon, iconFile, null);

            lblName.getComponent(cc.Label).string = taskData.title1.toString();
            lblNum.getComponent(cc.Label).string = 'X' + actionTime;
        }

        if (this.data.cd > 0) {
            let lbTime = this.ndDelete.getChildByName('lbTime');
            lbTime.getComponent(cc.Label).string = global.CommonClass.Functions.formatSeconds2(this.data.cd);
        }

    };
    btnSpeedUp() {
        let uiUnionTask = global.Manager.UIManager.get('UIUnionTask');
        if (uiUnionTask)
            uiUnionTask.btnSpeedUp();
    };
    update(dt) {
        if (this.targetCDTime > 0) {
            this.timeDelay -= dt;

            if (this.timeDelay <= 0) {
                let lbTime = this.ndDelete.getChildByName('lbTime');
                let leftTime = global.CommonClass.Functions.getLeftTime(this.targetCDTime);
                lbTime.getComponent(cc.Label).string = global.CommonClass.Functions.formatSeconds2(leftTime);

                if (leftTime <= 0) {
                    this.targetCDTime = 0;
                    this.data.cd = 0;

                    this.setData(this.data);
                    this.playRelashAction();

                    let event = new cc.Event.EventCustom('onItemReflash', true);
                    event.setUserData(this);
                    this.node.dispatchEvent(event);
                }

                this.timeDelay = 1;
            }
        }
    };
    getData() {
        return this.data;
    };
    getTaskID() {
        return this.data.id;
    };
    selectItem(isSelect) {
        this.spActive.active = isSelect;
        let lblName = this.ndItem.getChildByName('lblName');
        let lblNum = this.ndItem.getChildByName('lblNum');

        if(isSelect){
            lblName.getComponent(cc.LabelOutline).color = cc.color(61, 108, 134, 255);
            lblNum.getComponent(cc.LabelOutline).color = cc.color(61, 108, 134, 255);
        }else{
            lblName.getComponent(cc.LabelOutline).color = cc.color(174, 131, 86, 255);
            lblNum.getComponent(cc.LabelOutline).color = cc.color(174, 131, 86, 255);
        }
    };
    playRelashAction() {
        this.node.active = true;
        this.node.scale = 0.01;

        let action = cc.scaleTo(1, 1);
        this.node.stopAllActions();
        this.node.runAction(action);
    };
    btnClick() {
        let event = new cc.Event.EventCustom('onItemClick', true);
        event.setUserData(this);
        this.node.dispatchEvent(event);
    };
    // update (dt) {}
}
