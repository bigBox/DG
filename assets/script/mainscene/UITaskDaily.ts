const { ccclass, property } = cc._decorator;

@ccclass
export default class UITaskDaily extends cc.Component {
    @property({ type: cc.Node, displayName: "makeNode", tooltip: "makeNode" })
    makeNode: cc.Node = null;
    @property({ type: cc.Label, displayName: "lblContent", tooltip: "lblContent" })
    lblContent: cc.Label = null;
    @property({ type: cc.Sprite, displayName: "demandSP", tooltip: "demandSP" })
    demandSP: cc.Sprite = null;
    @property({ type: cc.Sprite, displayName: "goodSP", tooltip: "goodSP" })
    goodSP: cc.Sprite = null;
    @property({ type: cc.Label, displayName: "demandLabel", tooltip: "demandLabel" })
    demandLabel: cc.Label = null;
    @property({ type: cc.Label, displayName: "goodLabel", tooltip: "goodLabel" })
    goodLabel: cc.Label = null;
    @property({ type: cc.Node, displayName: "onClickCommNode", tooltip: "onClickCommNode" })
    onClickCommNode: cc.Node = null;
    curData: any;

    constructor() {
        super();
    };

    // onLoad () {}

    start() {

    }
    show(data) {
        this.curData = data;
        global.Instance.Log.debug('UITaskDaily', data)
        let cfgData = global.Manager.DBManager.findData('Tasks', 'ID', data.taskId);
        this.lblContent.string = cfgData.talk;
        global.Instance.Log.debug('Tasks', cfgData);
        // this.onClickCommNode.active = data.state == 2;
        let tmpArr = cfgData.rewardItem.split("-");
        global.CommonClass.Functions.setItemTexture(this.goodSP, tmpArr[0], null);
        this.goodLabel.string = tmpArr[1];
        let needArr = cfgData.needItem2.split("-");
        global.CommonClass.Functions.setItemTexture(this.demandSP, needArr[0], null);
        this.demandLabel.string = needArr[1];
        tmpArr = null;
        needArr = null;

    };
    onClickCommit(event) {
        if (this.curData.state != 2) {
            global.CommonClass.UITip.showTipTxt('任务物品不足', global.Enum.TipType.TIP_BAD);
            return;
        }
        let data = {
            taskId: this.curData.taskId,
            type: this.curData.type
        };
        global.Instance.MsgPools.send('taskReward', data, function (msg) {
            if (msg.errorID == 0) {
                global.Instance.MsgPools.send('taskList', {}, function () {
                    this.scheduleOnce(function () {
                        this.Refresh();
                        let uiTask = global.Manager.UIManager.get('UITask');
                        if (uiTask != null) {
                            uiTask.refreshUI();
                        }
                    }, 0.5);
                }.bind(this));

            }
        }.bind(this));
    };
    Refresh() {
        let tasks = global.Module.TaskData.getTasksByType(global.Enum.ETaskType.eDaily);
        if (tasks.length > 0) {
            this.show(tasks[0]);
        } else {
            this.onClose();
        }
    };
    onClose() {
        global.Manager.UIManager.close('UITaskDaily');
        let uiTask = global.Manager.UIManager.get('UITask');
        if (uiTask != null) {
            uiTask.refresnodeUI(true);
        }
    };
}
