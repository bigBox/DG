import FactoryBase from "./FactoryBase";


const { ccclass, property } = cc._decorator;

@ccclass
export default class TaskBuild extends FactoryBase {
    @property({ type: cc.Node, displayName: "引导节点", tooltip: "提示的引导节点" })
    helpNode: cc.Node = null;
    onEnable() {
        cc.systemEvent.on('dirhelp', this.setData.bind(this));
        cc.systemEvent.on('8010', this.NoveGuide.bind(this));
        this.setData();
    };

    runAction(nodeItem, data) {
        if (!nodeItem.active && data) {
            cc.Tween.stopAllByTarget(nodeItem);
            nodeItem.scale = 0;
            cc.tween(nodeItem)
                .to(1, { scale: 1.5 })
                .start()
        }
        nodeItem.active = data;
    };
    setData() {
        let name = global.CommonClass.Functions.getSceneName();
        if (name != 'MainScene')
            return;
        if (this.helpNode)
            this.helpNode.active = false;
        // let Farmdata = global.Module.TaskData.gettaskphase(10000);
        // if (Farmdata && Farmdata.state == 2)
        //     this.helpNode.active = true;
        this.scheduleOnce(function () {
            if (this.node) {
                var data = global.Module.TaskData.getHasAcceptTaskData();
                let TaskspItem = this.node.getChildByName('TaskspItem');
                this.runAction(TaskspItem, data);

                if (data) {
                    var cfgData = global.Manager.DBManager.findData('Tasks', 'ID', data.taskId);
                    if (cfgData) {
                        var url = "images/pictrue/taskicon/" + cfgData.taskIcon
                        if (TaskspItem && TaskspItem.getChildByName("spItem"))
                            global.CommonClass.Functions.setTextureNew(TaskspItem.getChildByName("spItem"), url, null);
                    }
                    // if (this.helpNode){
                    //     this.node.zIndex = 999;
                    //     this.helpNode.active = true;
                    // }
                      
                } else {
                    let Farmdata = global.Module.TaskData.gettaskphase(10026)
                    let level = global.Module.MainPlayerData.getLevel();
                    if (level > 1 && (!Farmdata || Farmdata.state == 0)) {
                        this.node.zIndex = 999;
                        if (this.helpNode)
                            this.helpNode.active = true;
                    }
                        
                            
                }

            }
        }, 0.2);

    };
    NoveGuide() {
    };
    openhelp() {
        global.Manager.UIManager.close('UIFirstTalk');
        let data = {};
        global.Instance.MsgPools.send('taskList', data, function (msg) {
            global.Manager.UIManager.open('UITask', null, function (panel) {
                global.Manager.UIManager.open('UITaskDetail', null, function (panel) {
                    if (panel) {
                        panel.show(global.Module.TaskData.getHasAcceptTaskData());
                        panel.showType();
                        // global.CommonClass.UITip.showTipTxt('请进入任务屋提交任务', global.Enum.TipType.TIP_BAD);
                    }
                }.bind(this));
            });
        });
     
    };
}
