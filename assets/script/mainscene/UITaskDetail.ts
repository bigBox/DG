import UIBase from "../common/UIBase";
//成长任务详情

const { ccclass, property } = cc._decorator;
@ccclass
export default class UITaskDetail extends UIBase {

    @property({ type: cc.Node, displayName: "btnAccept", tooltip: "btnAccept" })
    btnAccept: cc.Node = null;
    @property({ type: cc.Node, displayName: "btnCommit", tooltip: "btnCommit" })
    btnCommit: cc.Node = null;
    @property({ type: cc.Node, displayName: "btnRunning", tooltip: "btnRunning" })
    btnRunning: cc.Node = null;
    @property({ type: cc.Node, displayName: "spItem", tooltip: "图片" })
    spItem: cc.Node = null;

    @property({ type: cc.Node, displayName: "lblTitle1", tooltip: "lblTitle1" })
    lblTitle1: cc.Node = null;
    @property({ type: cc.Node, displayName: "lblTitle2", tooltip: "lblTitle2" })
    lblTitle2: cc.Node = null;
    @property({ type: cc.Label, displayName: "lblDescLabel", tooltip: "lblDescLabel" })
    lblDescLabel: cc.Label = null;
    @property({ type: cc.Node, displayName: "nodeRewardItems", tooltip: "任务奖励" })
    nodeRewardItems: cc.Node = null;

    @property({ type: cc.Node, displayName: "nodeItem", tooltip: "与人所需物品预制体" })
    nodeItem: cc.Node = null;
    @property({ type: cc.Node, displayName: "taskhelpNode", tooltip: "箭头引导" })
    taskhelpNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "nodeItemsAdd", tooltip: "任务所需物品" })
    nodeItemsAdd: cc.Node = null;


    data: any;
    constructor() {
        super();
        this.data = null;
    };
    onLoad() {
        this.nodeRewardItems.active = false;
        this.btnRunning.getComponent(cc.Button).interactable = false;
        this.lblTitle1.getComponent(cc.Label).string = "";
        this.lblTitle2.getComponent(cc.Label).string = "";
    };

    start() {

    };
    show(data) {
        if (this.data != null)
            return;
        let self = this;
        this.data = data;
        global.Manager.UIManager.close('UIFirstTalk');
        let cfgData = global.Manager.DBManager.findData('Tasks', 'ID', data.taskId);
        this.lblTitle1.getComponent(cc.Label).string = cfgData.title1;
        this.lblTitle2.getComponent(cc.Label).string = cfgData.title2;
        this.lblDescLabel.string = cfgData.talk
        let arrItems = cfgData.needItem2.split(";");
        let dataMap = this.data.curItem.map;
        if (cfgData.needItem2 == '') {
            let nodeItems = cc.instantiate(this.nodeItem);
            this.nodeItemsAdd.addChild(nodeItems, cc.macro.MAX_ZINDEX);
            nodeItems.active = true;
            let spItem = nodeItems.getChildByName("spItem");
            let lblNum = nodeItems.getChildByName("lblNum");
            var url = "images/pictrue/taskicon/" + cfgData.taskIcon
            spItem.setPosition(36, -36)
            global.CommonClass.Functions.setTextureNew(spItem, url, function (item) {
                if (item) {
                    spItem.scale = global.CommonClass.Functions.getToscale(spItem, 70, 70);
                }
            });
            lblNum.getComponent(cc.Label).string = '';
        } else {
            for (let k = 0; k < arrItems.length; k++) {
                let cfgItem = arrItems[k];
                if (cfgItem != '') {
                    let nodeItems = cc.instantiate(this.nodeItem);
                    this.nodeItemsAdd.addChild(nodeItems, cc.macro.MAX_ZINDEX);
                    nodeItems.active = true;
                    let spItem = nodeItems.getChildByName("spItem");
                    let lblNum = nodeItems.getChildByName("lblNum");
                    let tmpArr = cfgItem.split("-");
                    global.CommonClass.Functions.setItemTexture(spItem, tmpArr[0], function (item) {
                        if (item) {
                            spItem.scale = global.CommonClass.Functions.getToscale(spItem, 70, 70);
                        }
                    });
                    let num = 0;
                    if (dataMap[tmpArr[0]])
                        num = dataMap[tmpArr[0]].value;
                    lblNum.getComponent(cc.Label).string = num + '/' + tmpArr[1];
                }
            }
        }

        {
            let nodeItem = this.nodeRewardItems;
            nodeItem.active = true;
            let spItem = nodeItem.getChildByName("spItem");
            let lblNum = nodeItem.getChildByName("lblNum");
            let tmpArr = cfgData.rewardItem.split("-");
            global.CommonClass.Functions.setItemTexture(spItem, tmpArr[0], function (item) {
                if (item) {
                    spItem.scale = global.CommonClass.Functions.getToscale(spItem, 80, 70);
                }
            });
            lblNum.getComponent(cc.Label).string = tmpArr[1];
        }
        {
            var url = "images/pictrue/taskicon/" + cfgData.taskIcon;

            global.CommonClass.Functions.setTextureNew(this.spItem, url, function () {
                self.spItem.scale = global.CommonClass.Functions.getToscale(self.spItem, 150, 150);
            });
        }





        global.Instance.Log.debug('', this.data)
    };
    showType() {
        if (this.data.type == global.Enum.ETaskType.eGrowUp) {
            //状态， 0未接受，1已接受
            if (this.data.state == 0) {
                this.btnAccept.active = true;
            } else if (this.data.state == 1) {
                this.btnRunning.active = true;
            } else if (this.data.state == 2) {
                this.btnCommit.active = true;
            }

        }
        let guideID = global.Module.MainPlayerData.getguideID() + 1;
        if (guideID == 8008 || guideID == 8009) {
            guideID = 8009;
            global.Manager.UIManager.open('UIFirstTalk', null, function (panel) {
                panel.show(guideID, global.Manager.UIManager.getChild(this.node, "nodeCenter"));
            }.bind(this));
        }
    }
    onClickHelp() {
        global.Manager.UIManager.open('UITaskHelp', null, function (panel) {
            panel.show(this.data);
        }.bind(this));
    };
    // 接受任务
    onClickAccept() {
        global.Instance.Log.debug('接受任务', this.data)
        if (global.Module.TaskData.taskRont(this.data.taskId))//任务前置任务判断
            return;
        let data = {
            taskId: this.data.taskId,
            type: this.data.type
        };



        global.Manager.UIManager.close('UIFirstTalk');
        global.Instance.MsgPools.send('taskAccept', data, function (msg) {
            if (msg.errorID == 0) {
                cc.systemEvent.emit('10001', data.taskId + '');
                global.Module.TaskData.onTaskAcceptRsp(msg);
                global.CommonClass.UITip.showTipTxt('接受任务成功', global.Enum.TipType.TIP_GOOD);
                let clickAnim = global.Manager.UIManager.getResident('clickAnim');
                // if(msg.taskId==10008||msg.taskId==10016||msg.taskId==10022||msg.taskId==10024||msg.taskId==10025||msg.taskId==10026||msg.taskId==10027){                    
                //     global.Manager.UIManager.open('UITaskTip', null, function (panel) {//提示自动移动屏幕

                //     }.bind(this));
                // }
                let mainMap = global.Instance.Dynamics["MainMap"];
                if (mainMap != null) {//领取任务后自动移动屏幕
                    var cfgData = global.Manager.DBManager.findData('Tasks', 'ID', data.taskId);

                    mainMap.centerToFactoryByTableID(cfgData.FactoryID);
                }
                this.btnAccept.active = false;
                this.btnRunning.active = true;
                this.onClose();
                if (clickAnim)
                    clickAnim.reflashEntry();
                global.Manager.UIManager.close('UITask');
                if (data.taskId == '10000') {
                    let guideID = global.Module.MainPlayerData.getguideID() + 1;
                    if (guideID == 8010) {
                        this.scheduleOnce(function () {
                            let NoveGuide = global.Manager.DBManager.findData('NoveGuide', 'ID', guideID);
                            global.Instance.Log.debug('', NoveGuide)
                            global.Manager.UIManager.open('UIFirstTalk', null, function (panel) {
                                panel.show(guideID, global.Manager.UIManager.getChild(cc.find("Canvas"), NoveGuide.guideName));
                            }.bind(this));
                        }, 0.2)
                    }
                }


            }
        }.bind(this));
    };

    // 提交任务
    onClickCommit() {
        global.Module.MainPlayerData.setNeedSaveChange(true);

        let data = {
            taskId: this.data.taskId,
            type: this.data.type
        };

        global.Instance.MsgPools.send('taskReward', data, function (msg) {
            if (msg.errorID == 0) {
                global.Module.TaskData.setHasAcceptTaskData(null)
                global.Instance.MsgPools.send('taskList', {}, function () {
                    let cfgData = global.Manager.DBManager.findData('Tasks', 'ID', this.data.taskId);
                    let uiTask = global.Manager.UIManager.get('UITask');
                    if (uiTask != null) {
                        uiTask.deleterefresh(cfgData.ID)
                    }
                    cc.systemEvent.emit('dirhelp');
                    this.onClose();
                    let guideID = 8012;
                    if (this.data.taskId == 10000) {
                        let NoveGuide = global.Manager.DBManager.findData('NoveGuide', 'ID', guideID);
                        global.Manager.UIManager.open('UIFirstTalk', null, function (panel) {
                            panel.show(guideID, global.Manager.UIManager.getChild(cc.find("Canvas"), NoveGuide.guideName));
                        }.bind(this));
                    }else if (this.data.taskId == 10026){
                        let helpData = global.Manager.DBManager.findData('illustrate', 'ID', 15);
                        global.Manager.UIManager.open('UIHelpSpeek', null, function (panel) {
                            panel.show(helpData);
                            panel.setisShow();
                        });
                    }
                }.bind(this));
                global.Module.MainPlayerData.popSaveChange();
            }
        }.bind(this));
    };

    onClose() {
        global.Manager.UIManager.close('UITaskDetail');

    };
    // update (dt) {}
}
