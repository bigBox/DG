import FactoryBase from "./FactoryBase";



const {ccclass, property} = cc._decorator;

@ccclass
export default class ParkRareAnimal extends FactoryBase {
    constructor() {
        super();
    };
    onLoad () {
        cc.systemEvent.on('10001', this.setData, this);
        var data = global.Module.TaskData.getHasAcceptTaskData();
        let scene = cc.director.getScene();
        if (data && data.taskId == 10009 && data.state == 1 && scene.name == 'PlayerScene') {
            this.setmyData();
        } else {
            this.setData();
        }

    }

    start () {

    }
    onDisable() {
        cc.systemEvent.off('10001', this.setData, this);
    };
    // update (dt) {}
}
