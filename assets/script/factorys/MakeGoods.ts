import FactoryBase from "./FactoryBase";


const { ccclass, property } = cc._decorator;

@ccclass
export default class MakeGoods extends FactoryBase {
    constructor() {
        super();
    };
    onLoad() { 
        return FactoryBase.prototype.onLoad.apply(this,arguments);
    };

    start() {
        cc.systemEvent.on('10001', this.setData, this);
        this.setData();
    };
    setData() {
        let scene = cc.director.getScene();
        if (scene.name == 'PlayerScene' || !this.node)
            return;
        let ndHelp = this.node.getChildByName('helpNode');
        let taskdata = global.Module.TaskData.getHasAcceptTaskData();
        let task = null;
        if (taskdata)
            task = global.Manager.DBManager.findData('Tasks', 'ID', taskdata.taskId);
        if (task && task.FactoryID != taskdata.taskId) {
            if (this.node.tagEx == 3023) {
                let item = global.Module.PackageData.getItem(240060003);//原奶数量
                if (item == null)
                    return;
            }
            if (this.node.tagEx == task.FactoryID)
                if (taskdata && taskdata.taskId == taskdata.taskId && taskdata.state == 1) {
                    if (ndHelp != null) {
                        ndHelp.active = true;
                        this.node.zIndex = 999;
                    }
                       
                } else {
                    if (ndHelp != null)
                        ndHelp.active = false;
                        this.node.zIndex = 1;
                }
        }

         
    };
    onDisable() {
        cc.systemEvent.off('10001', this.setData, this);
    };
    addPickItem(itemID) {
        if (itemID != null) {
            let ndPickItems = this.node.getChildByName('ndPickItems');
            let position = cc.v2(0, 0);
            let size = ndPickItems.getContentSize();
            position.x = Math.ceil(Math.random() * size.width) - size.width / 2;
            position.y = Math.ceil(Math.random() * size.height) - size.height / 2;

            global.CommonClass.PickItem.create(itemID, ndPickItems, position, function (ItemIcon) {
                ItemIcon.node.tagEx = itemID;
            });
        }
    };

    pickItem(itemID) {
        let ndPickItems = this.node.getChildByName('ndPickItems');

        if (ndPickItems != null) {
            let items:any = ndPickItems.children;
            //let boundingBox = ndPickItems.getBoundingBoxToWorld();
            // if (boundingBox.contains(touchPoint))
            // {
            for (let key in items) {
                let ndItem = items[key];
                let id = ndItem.tagEx;
                if (id == itemID) {
                    ndItem.removeFromParent();
                    return true;
                }
            }
            // }
        }

        return false;
    };

    pickAllItem() {
        let ndPickItems = this.node.getChildByName('ndPickItems');

        if (ndPickItems != null)
            ndPickItems.removeAllChildren();
    };

    reflashPickItem(pickItems) {
        let ndPickItems = this.node.getChildByName('ndPickItems');
        if (ndPickItems == null)
            return;
        ndPickItems.removeAllChildren();

        if (pickItems != null) {
            //let pickItems = msg.data.pickItem;
            for (let key in pickItems) {
                let itemID = pickItems[key];
                this.addPickItem(itemID);
            }
        }
    };
}
