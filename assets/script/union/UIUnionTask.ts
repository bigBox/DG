import UIBase from "../common/UIBase";


const {ccclass, property} = cc._decorator;

@ccclass
export default class UIUnionTask extends UIBase {
    @property({ type: cc.Node, displayName: "ndItems", tooltip: "ndItems" })
    ndItems: cc.Node = null;
    @property({ type: cc.Node, displayName: "ndTemplateItem", tooltip: "ndTemplateItem" })
    ndTemplateItem: cc.Node = null;
    @property({ type: cc.Node, displayName: "rhxDec", tooltip: "rhxDec" })
    rhxDec: cc.Node = null;
    tasks: any;
    curSelItem: any;
    constructor(){
        super();
        this.curSelItem = null;
    };

    onLoad () {
        this.ndTemplateItem.active = false;
        this.rhxDec.active = false;
    };

    start () {

    };
    onEnable() {

        let self = this;
        this.node.on('onItemClick', function (event) {
            self.onItemClick(event);
        });

        this.node.on('onItemReflash', function (event) {
            self.onItemReflash(event);
        });
        this.show();

    };

    onDisable() {

        this.node.off('onItemClick');
        this.node.off('onItemReflash');
    };

    touchEvent(event) {
    };

    show() {
        this.tasks = global.Module.UnionTaskData.getQuestLst();
        if (this.tasks != null)
            this.reflashItems(this.tasks);

        let curTask = global.Module.UnionTaskData.getCurUnionTask();
        if (curTask != null)
            this.showTaskInfo(curTask);
        this.reflashHelp(curTask);

    };
    reflashHelp(curTask) {
        //箭头 ndHelp1 选中
        var data = global.Module.TaskData.getHasAcceptTaskData();
        let helpNode = this.node.getChildByName('HelpNode');

        if (!data || !helpNode)
            return;
        if (data.state == 1 && data.taskId == 10025)
            if (curTask == null || (curTask != null && curTask.state == 0))
                if (helpNode.getChildByName('ndHelp1'))
                    helpNode.getChildByName('ndHelp1').active = true;
        if (data.state == 1 && data.taskId == 10025 && curTask && curTask.state == 0) {
            if (helpNode.getChildByName('ndHelp2'))
                helpNode.getChildByName('ndHelp2').active = true;
            if (helpNode.getChildByName('ndHelp1'))
                helpNode.getChildByName('ndHelp1').active = false;
        } else {
            if (helpNode.getChildByName('ndHelp2'))
                helpNode.getChildByName('ndHelp2').active = false;
        }
    };
    reflashItems(tasks) {
        let itemNum = tasks.length;

        for (let i = 0; i < itemNum; ++i) {
            let data = tasks[i];

            let newNode:any = cc.instantiate(this.ndTemplateItem);
            this.ndItems.addChild(newNode);
            newNode.active = true;

            let itemClass = newNode.getComponent(global.CommonClass.UnionTaskItem);
            itemClass.setData(data);

            newNode.tagEx = data.index;
        }
    };

    showTaskInfo(data) {
        this.reflashHelp(data);
        let curTask = global.Module.TaskData.getCurUnionTask();
        let hasTask = curTask != null;

        let ndSelInfo = this.node.getChildByName('ndSelInfo');
        ndSelInfo.active = data != null && data.cd <= 0;

        this.rhxDec.active = hasTask;

        let taskData = global.Manager.DBManager.findData('Tasks', 'ID', data.taskId);
        if (taskData != null) {
            let tmpArr = null;
            let actionTime = null;
            if (taskData.actionType == 910||taskData.actionType == 920) {
                tmpArr = taskData.needItem2.split("-");
                actionTime = tmpArr[1];
            } else {
                actionTime = taskData.actionTime;
            }
            this.rhxDec.active = true;

            let hasFinish = (data.actionTime >= actionTime);

            let btnAccept = ndSelInfo.getChildByName('btnAccept');
            let btnCommit = ndSelInfo.getChildByName('btnCommit');
            let btnDelete = ndSelInfo.getChildByName('btnDelete');
            let lblIn = ndSelInfo.getChildByName('lblIn');
            btnAccept.active = data.state == 0;
            btnCommit.active = (data.state == 1 && hasFinish);
            btnDelete.active = (data.state == 0);
            lblIn.active = (data.state == 1 && !hasFinish);
            if (data.state == 1) {
                let color = '#ff0000';
                if (data.actionTime >= taskData.actionTime)
                    color = '#00ff00';

                let dec = taskData.title2 + '(';
                dec +=  data.actionTime.toString() +  '/' + actionTime.toString();
                dec += ')' ;
                this.rhxDec.getComponent(cc.Label).string = dec;
            } else {
                this.rhxDec.getComponent(cc.Label).string =  taskData.title2 ;
            }

        }
    };

    getItemByIdx(idx) {
        let items:any = this.ndItems.children;
        for (let key in items) {
            let ndItem = items[key].getComponent(global.CommonClass.UnionTaskItem);
            if (ndItem.getData().index == idx)
                return ndItem;
        }

        return null;
    };

    deleteSelTask() {
        if (this.curSelItem != null) {
            let taskData = this.curSelItem.getData();
            global.Instance.Log.debug('',taskData)
            let data = { taskId: taskData.taskId,index:taskData.index};
            let self = this;
            global.Instance.MsgPools.send('guildTaskRemove', data, function (msg) {
                global.Instance.Log.debug('guildTaskRemove',msg)
                if (msg.errorID == 0) {
                    self.reflashSelTask(msg.task);
                    self.playRelashAction(msg.task.index);
                }
            });
        }
    };

    reflashSelTask(task) {
        this.curSelItem.setData(task);
        this.showTaskInfo(task);
    };

    reflashTaskByIdx(idx, task) {
        if (idx == this.curSelItem.node.tagEx)
            this.reflashSelTask(task);
        else {
            let item = this.getItemByIdx(idx);
            if (item)
                item.setData(task);
        }
    };

    playFlyAction(idx, callback) {
        let item = this.getItemByIdx(idx);
        if (item) {
            // global.Manager.UIManager.open('UIUnionTaskSpeek', null, function (panel) {
            //     let taskData = item.getData();
            //     panel.show(taskData);
            //     panel.playFlyActionDelay(item, callback);
            // })
            // item.node.active = false;
        };
    };

    playRelashAction(idx) {
        let item = this.getItemByIdx(idx);
        item.playRelashAction();
    };

    onItemClick(event) {
        let item = event.getUserData();
        if (this.curSelItem == item)
            return;
        else {
            if (this.curSelItem != null)
                this.curSelItem.selectItem(false);

            item.selectItem(true);
            this.curSelItem = item;
        }

        let data = this.curSelItem.getData();
        this.showTaskInfo(data);
    };

    onItemReflash(event) {
        let item = event.getUserData();
        if (this.curSelItem == item) {
            let data = this.curSelItem.getData();
            this.showTaskInfo(data);
        }
    };
    //接受任务
    btnAccpetTask() {
        let helpNode = this.node.getChildByName('HelpNode');
        if (helpNode.getChildByName('ndHelp2'))
             helpNode.getChildByName('ndHelp2').active = false;
        if (this.curSelItem != null) {
            let task = this.curSelItem.getData();
            let data = { taskId: task.taskId,index:task.index};

            let ndSelInfo = this.node.getChildByName('ndSelInfo');
            let btnAccept = ndSelInfo.getChildByName('btnAccept');
            let btnDelete = ndSelInfo.getChildByName('btnDelete');
            let lblIn =  ndSelInfo.getChildByName('lblIn');
            let self = this;
            global.Instance.MsgPools.send('guildTaskAccept', data, function (msg) {
                if (msg.errorID == 0) {
                    let call = function () {
                        self.reflashTaskByIdx(msg.task.index, msg.task);
                        self.playRelashAction(msg.task.index);
                    };
                    self.playFlyAction(task.index, call);
                    global.Instance.MsgPools.send('guildTaskList', {},null); 
                    btnAccept.active = false;
                    btnDelete.active = false;
                    lblIn.active = true;
                }
            });
        }
    };
    //提交任务
    btnCommitTask() {
        let helpNode = this.node.getChildByName('HelpNode');
        if (helpNode.getChildByName('ndHelp2'))
             helpNode.getChildByName('ndHelp2').active = false;
        if (this.curSelItem != null) {
         
            let task = this.curSelItem.getData();
            global.Instance.Log.debug('提交任务',task)
            let data = { taskId: task.taskId, type: 5 };
            let ndSelInfo = this.node.getChildByName('ndSelInfo');
            ndSelInfo.active = false;

            global.Instance.MsgPools.send('taskReward', data, function (msg) {
                if (msg.errorID == 0) {

                }
            });
    }
    };
    //删除任务
    btnDeleteTask() {
        let helpNode = this.node.getChildByName('HelpNode');
        if (helpNode.getChildByName('ndHelp2'))
             helpNode.getChildByName('ndHelp2').active = false;
        this.deleteSelTask();
    };


    btnSpeedUp() {
        let taskData = this.curSelItem.getData();
        let self = this;

        let callBack = function () {
            let data = { taskId: taskData.taskId,index:taskData.index };
            global.Instance.MsgPools.send('guildTaskSpeedUp', data, function (msg) {
                if (!msg.errorID) {
                    self.reflashSelTask(msg.task);
                }
            });

        };
        global.Manager.UIManager.open('DlgCostItem', null, function (panel) {
            panel.show(taskData.cd, callBack);

        });
    };

    btnClose() {
        global.Manager.UIManager.close('UIUnionTask');
    }



    // update (dt) {}
}
