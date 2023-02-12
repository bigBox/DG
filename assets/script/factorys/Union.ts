import FactoryBase from "./FactoryBase";


const {ccclass, property} = cc._decorator;

@ccclass
export default class Union extends FactoryBase {
    @property({ type: cc.Node, displayName: "引导节点", tooltip: "提示的引导节点" })
    helpNode: any = [];

    // use this for initialization
    onLoad() {
        this.setData();
        cc.systemEvent.on('10001', this.setmyData, this);
        this.setmyData();
        cc.systemEvent.on('Union', this.setData, this);
        return FactoryBase.prototype.onLoad.apply(this, arguments);
   };

    onEnable() {


   };
    setmyData() {
        let scene = cc.director.getScene();
        if (scene.name == 'PlayerScene' || !this.node)
            return;
        let taskdata = global.Module.TaskData.getHasAcceptTaskData();
        let task = null;
        if (taskdata)
            task = global.Manager.DBManager.findData('Tasks', 'ID', taskdata.taskId);
        if (task && this.node.tagEx == task.FactoryID) {
            if (taskdata && taskdata.taskId == '10024' && taskdata.state == 1){
                this.helpNode[0].active = true;
                this.node.zIndex = 999;
            }else{
                this.helpNode[0].active = false;
            }
                
            if (taskdata && taskdata.taskId == '10025' && taskdata.state == 1){
                this.helpNode[1].active = true;
                this.node.zIndex = 999;
            } else
                this.helpNode[1].active = false;
        }else{
            this.node.zIndex = 1;
        }

   };
    onDisable() {
        cc.systemEvent.off('10001', this.setmyData, this);
   };
    getClickFlag(touchPoint) {
        let ndTouch = this.node.getChildByName('ndTouch');
        let ndItems = ndTouch.children;
        for (let i = 0; i < ndItems.length; ++i) {
            let ndItem:any = ndItems[i];
            let boundingBox = ndItem.getBoundingBoxToWorld();
            if (boundingBox.contains(touchPoint)) {
                let userData = ndItem.getComponent(global.CommonClass.UserData);
                let flag = userData.iData;
                //this.openUI(flag);
                //break;
                return flag;
            }
        }

        return -1;
   };
    setData() {
        let name = global.CommonClass.Functions.getSceneName();
        if (name != 'MainScene')
            return;
        this.scheduleOnce(function () {
            if (this.node) {
                let data = global.Module.UnionTaskData.getCurUnionTask();
                let UnionpItem = this.node.getChildByName('UnionpItem');
                UnionpItem.active = data;
                if (data) {
                    var cfgData = global.Manager.DBManager.findData('Tasks', 'ID', data.taskId);
                    if (cfgData) {
                        var url = "images/pictrue/items/" + cfgData.taskIcon
                        global.CommonClass.Functions.setTextureNew(UnionpItem.getChildByName("spItem"), url,null);
                    }
                }

            }
       }, 0.5);
   };
    openhelp() {
        let data = global.Module.UnionTaskData.gethandLst();
        global.Manager.UIManager.open('UIUnionTaskSpeek', null, function (panel) {
            if (panel != null)
                panel.show(data);
        })
   };
    isPicked(touchPoint) {
        if (this.getClickFlag(touchPoint) > 0)
            return true;

        return FactoryBase.prototype.isPicked.apply(this, arguments);
   };

    onClick(touchPoint) {
        let flag = this.getClickFlag(touchPoint);
        if (flag > 0)
            this.openUI(flag);
   };
    openUI(flag) {
        let selfUnion = global.Module.UnionData.getSelfUnion();
        let hasUnion = (selfUnion != null && selfUnion.id > 0);

        if (flag == 1)         //排行
        {
            global.Instance.MsgPools.send('rankGuildLst', { type: 13}, function (msg) {
                global.Manager.UIManager.open('UIUnionRank', null, function (panel) { });
            })
        }
        else if (flag == 2) {   //商会成员  
       
            global.Instance.MsgPools.send('guildList', {}, function (msg) {
                if (msg.errorID == 0 && msg.guilBaseInfo != null) {
                    global.Manager.UIManager.open('UIUnion', null, function (panel) { });
                }
                else {
                    global.CommonClass.UIDialog.create("商会不存在", '请先加入商会', function (isYes) {

                    });
                }
            });
        }
        else if (flag == 3)     //探险任务
        {
            if (hasUnion) {
                let data = {};
                global.Instance.MsgPools.send('guildTaskList', data, function (msg) {
                    global.Manager.UIManager.open('UIUnionTask',null,null);
                });
            }
            else {
                global.CommonClass.UIDialog.create("商会不存在", '请先加入商会', function (isYes) {

                });
            }
        }
        else if (flag == 4)     //商会
        {
            global.Instance.MsgPools.send('guildList', {}, function (msg) {
                if (msg.errorID == 0 && msg.guilBaseInfo != null) {
                    global.Manager.UIManager.open('UIUnion', null, function (panel) { });
                }
                else {
                    global.CommonClass.UIDialog.create("商会不存在", '请先加入商会', function (isYes) {

                    });
                }
            });
        }
    }
}
