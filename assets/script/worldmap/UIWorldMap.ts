const {ccclass, property} = cc._decorator;
@ccclass
export default class UIWorldMap extends cc.Component {
    curSelOp: number;
    constructor(){
        super();
        this.curSelOp = 0;
    };

    onLoad() { }

    start() {
        // this.reflashHelp();
    };
    reflashHelp(): void {
        let helpNode = this.node.getChildByName('helpNode');
        var taskdata = global.Module.TaskData.getHasAcceptTaskData();
        if (taskdata && (taskdata.taskId == 10000 || taskdata.taskId == 10003) && taskdata.state == 2) {
            helpNode.active = true;
        }
           
    };
    onEnable() {
        global.Manager.UIManager.add('UIWorldMap', this);
        this.node.zIndex = global.Enum.PanelZOrder.PanelZ_DONW_UI;
    };
    onDisable() {
        global.Manager.UIManager.remove('UIWorldMap');
    };
    btnReturn() {
        global.CommonClass.Functions.loadScene("MainScene",null);
    };
    // update (dt) {}
}
