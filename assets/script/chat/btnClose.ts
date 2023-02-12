const {ccclass, property} = cc._decorator;

@ccclass
export default class btnClose extends cc.Component {
    constructor() {
        super();
    };
   

    start () {

    }
    onEnable() {
        // cc.systemEvent.on('ArrowHead', this.reflashHelp, this);
        this.reflashHelp();
       
    };
    reflashHelp() {
        let helpNode = this.node.getChildByName('helpNode');
        if (helpNode) {
            // let data = global.Module.TaskData.getHasAcceptTaskData();
            // helpNode.active = (data && data.state == 2);
            helpNode.opacity = 0;
            helpNode.active = false;
        }
    };
    onDisable() {
        // cc.systemEvent.off('ArrowHead', this.reflashHelp, this);
    };
    // update (dt) {}
}
