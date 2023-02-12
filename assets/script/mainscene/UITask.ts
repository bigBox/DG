import UIBase from "../common/UIBase";


const { ccclass, property } = cc._decorator;

@ccclass
export default class UITask extends UIBase {
    @property({type: cc.Prefab, displayName: "templateTask", tooltip: "templateTask" })
    templateTask: cc.Prefab = null;
    @property({type: cc.ScrollView, displayName: "nodeScrollView", tooltip: "nodeScrollView" })
    nodeScrollView: cc.ScrollView = null;
    @property({type: cc.Node, displayName: "nodeScrollViewContent", tooltip: "nodeScrollViewContent" })
    nodeScrollViewContent: cc.Node = null;
    @property({type: cc.Node, displayName: "nodeLight", tooltip: "nodeLight" })
    nodeLight: cc.Node = null;
    @property({type: cc.Node, displayName: "MakeNode", tooltip: "MakeNode" })
    MakeNode: cc.Node = null;
    data: any[];
    curData: any;
    buyCallback: any;
    curChooseItem: any;
    dropItems: any;

    constructor() {
        super();
        this.data = [];
        this.curData = null;
        this.buyCallback = null;
        this.curChooseItem = null;
    };

    onLoad() {
        let clickAnim = global.Manager.UIManager.getResident('clickAnim');
        if (clickAnim)
            clickAnim.reflashEntry(false);
        this.nodeLight.active = true;
    };

    start() {
        this.show();
    };

    show() {
       
        let tasks = global.Module.TaskData.getAllTasks();
        global.Instance.Log.debug('任务数据',tasks);
        var width = cc.winSize.width;//推荐  原因  短
        this.nodeScrollViewContent.getComponent(cc.Layout).spacingX = (width - 227 * 5) / 5;

        this.nodeScrollViewContent.removeAllChildren();
        {
            // 节日任务
            let nodeItem = cc.instantiate(this.templateTask);
            nodeItem.active = true;
            nodeItem.x = nodeItem.y = 0;
            nodeItem.getComponent('TemplateTask').setData(global.Enum.ETaskType.eSpecial, null);
            nodeItem.getComponent('TemplateTask').touchItemCB = this.onClickItem.bind(this);
            this.nodeScrollViewContent.addChild(nodeItem);
        }
        {
            // 月任务
            let tasks = global.Module.TaskData.getTasksByType(global.Enum.ETaskType.eMonth);
            let nodeItem:any = cc.instantiate(this.templateTask);
            nodeItem.active = true;
            nodeItem.x = nodeItem.y = 0;
            nodeItem.getComponent('TemplateTask').setData(global.Enum.ETaskType.eMonth, tasks && tasks.length > 0 ? tasks[0] : null);
            nodeItem.getComponent('TemplateTask').touchItemCB = this.onClickItem.bind(this);
            this.nodeScrollViewContent.addChild(nodeItem);
        }
        // {
        //     // 日常任务
        //     let tasks = global.Module.TaskData.getTasksByType(global.Enum.ETaskType.eDaily);
        //     let nodeItem:any = cc.instantiate(this.templateTask);
        //     nodeItem.active = true;
        //     nodeItem.x = nodeItem.y = 0;
        //     nodeItem.getComponent('TemplateTask').setData(global.Enum.ETaskType.eDaily, tasks && tasks.length > 0 ? tasks[0] : null);
        //     nodeItem.getComponent('TemplateTask').touchItemCB = this.onClickItem.bind(this);

        //     this.nodeScrollViewContent.addChild(nodeItem);
        // }
        {
            // 成长任务
            let tasks= global.Module.TaskData.getTasksByType(global.Enum.ETaskType.eGrowUp);
            global.Instance.Log.debug("成长任务", tasks)
            if (tasks){
                // for (let i = 0; i < tasks.length; i++) {
                    let task = tasks[0];
                    if (task && task.state != 3) {
                        let nodeItem: any = cc.instantiate(this.templateTask);
                        nodeItem.name = nodeItem.name + "1"
                        nodeItem.active = true;
                        nodeItem.x = nodeItem.y = 0;
                        nodeItem.getComponent('TemplateTask').setData(global.Enum.ETaskType.eGrowUp, task);
                        nodeItem.getComponent('TemplateTask').touchItemCB = this.onClickItem.bind(this);
                        this.nodeScrollViewContent.addChild(nodeItem);
                    }
                }
                // }
        }
        cc.systemEvent.emit('10001', '10003');
    };

    onClickItem(data) {
        if (data == null) {
            return;
        }
        global.Manager.UIManager.close('UIFirstTalk');
        this.curData = data;
        this.showTaskContent(data);
    };
    showTaskContent(data) {
        if (data.type != global.Enum.ETaskType.eDaily) {
            global.Manager.UIManager.open('UITaskDetail', null, function (panel) {
                if (panel) {
                    panel.show(data);
                    panel.showType();
                }
            }.bind(this));
            return;
        }
        if (data.type == global.Enum.ETaskType.eDaily) {
            this.refresnodeUI(false)
            global.Manager.UIManager.open('UITaskDaily', null, function (panel) {
                if (panel) {
                    panel.show(data);
                }
            }.bind(this));
        }
    };
    refresnodeUI(isShow) {
        this.nodeScrollView.node.active = isShow;
    };

    refreshUI() {
        this.curChooseItem = null;
        this.curData = null;
        this.show();
        this.nodeScrollView.setContentPosition(this.nodeScrollView.getContentPosition());

    };
    addGrowUprefresh(taskId) {
        // 成长任务
        this.scheduleOnce(() => {
            let tasks = global.Module.TaskData.getTasksByType(global.Enum.ETaskType.eGrowUp);
            if (tasks) {
                let task = tasks[0];
                if (task && task.state == 0) {
                    let nodeItem: any = cc.instantiate(this.templateTask);
                    nodeItem.name = nodeItem.name + "1"
                    nodeItem.active = true;
                    nodeItem.x = nodeItem.y = 0;
                    nodeItem.getComponent('TemplateTask').enlarge();
                    nodeItem.getComponent('TemplateTask').setData(global.Enum.ETaskType.eGrowUp, task);
                    nodeItem.getComponent('TemplateTask').touchItemCB = this.onClickItem.bind(this);
                    this.nodeScrollViewContent.addChild(nodeItem);
                }
            }
        }, 0.5)
    };
    addrefresh(taskId) {
        // 成长任务
        let tasks = global.Module.TaskData.getAddata();
        global.Instance.Log.debug("新增成长任务", tasks)
        if (tasks){
            // for (let i = 0; i < tasks.length; i++) {
                let task = tasks[0];
                if (task&&task.state == 0) {
                    let nodeItem:any = cc.instantiate(this.templateTask);
                    nodeItem.name = nodeItem.name + "1"
                    nodeItem.active = true;
                    nodeItem.x = nodeItem.y = 0;
                    nodeItem.getComponent('TemplateTask').enlarge();
                    nodeItem.getComponent('TemplateTask').setData(global.Enum.ETaskType.eGrowUp, task);
                    nodeItem.getComponent('TemplateTask').touchItemCB = this.onClickItem.bind(this);
                    this.nodeScrollViewContent.addChild(nodeItem);
                }else{
                   
                }
            // }
    }
        this.scheduleOnce(() => {
            global.Module.TaskData.setAddata();
            this.nodeScrollView.scrollToBottom(0);
        }, 0.1)
    };
    deleterefresh(taskId) {
        for (let i = 0; i < this.nodeScrollViewContent.childrenCount; i++) {
            var nodeItem = this.nodeScrollViewContent.children[i]
            var TemplateTask = nodeItem.getComponent('TemplateTask');
            var data = TemplateTask.data
            if (data && data.taskId == taskId)
                TemplateTask.narrow();
        }
    };

    onDropFinish() {
        let showItems = [];
        for (let i = 0; i < this.dropItems.length; i++) {
            let tmpArr = this.dropItems[i].split("-");
            showItems.push({ itemID: tmpArr[0], itemNum: tmpArr[1] });
        }

        if (showItems.length > 0) {
            global.Manager.UIManager.open('DlgCollectDrop', null, function (panel) {
                panel.show(showItems);

                panel.setCloseCB(function () {
                    global.Module.MainPlayerData.popSaveChange();
                });
            });
        }
    };

    btnClose() {
        global.Manager.UIManager.close('UITask');
        let guideID = global.Module.MainPlayerData.getguideID() + 1;
        global.Instance.Log.debug('----------guideID----------:', guideID);
        if (guideID <= 8009) {
            guideID = 8008
            let NoveGuide = global.Manager.DBManager.findData('NoveGuide', 'ID', guideID);
            global.Manager.UIManager.open('UIFirstTalk', null, function (panel) {
                panel.show(guideID, global.Manager.UIManager.getChild(cc.find("Canvas"), NoveGuide.guideName));
            });
        }
        let taskdata = global.Module.TaskData.getHasAcceptTaskData();
        if (taskdata != null) {
            let clickAnim = global.Manager.UIManager.getResident('clickAnim');
            if (clickAnim)
                clickAnim.reflashEntry();
        }
    };

    // update (dt) {}
}
