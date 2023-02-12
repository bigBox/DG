
const { ccclass, property } = cc._decorator;
@ccclass
export default class FactoryItemNew extends cc.Component {
    @property({ type: cc.Node, displayName: "引导节点", tooltip: "提示的引导节点" })
    helpNode: cc.Node = null;
    factoryID: number;
    locked: boolean;
    ndItem: cc.Node;
    constructor() {
        super();
        this.factoryID = 0;
        this.locked = false;
    };
    // use this for initialization
    onLoad() {

        this.ndItem = this.node.getChildByName('ndItem');
        // this.ndDec  = this.node.getChildByName('ndDec');
    };

    setFactory(factoryID) {
        let factory = global.Manager.DBManager.findData("Factory", 'ID', factoryID);
        this.factoryID = factoryID;
        if (factory) {
            let level = global.Module.MainPlayerData.getLevel();
            let lblUnLockDec = this.node.getChildByName('lblUnLockDec');
            lblUnLockDec.getComponent(cc.Label).string = factory.levelRequire.toString() + '级解锁';
            this.locked = level < factory.levelRequire;
            lblUnLockDec.active = this.locked;
            let lblName = this.node.getChildByName('lblName');
            lblName.getComponent(cc.Label).string = factory.name;
          
            let spItem = this.node.getChildByName('spItem');
            let self = this;
            global.CommonClass.Functions.setTexture(spItem, factory.filePath, function (item) {
                if (spItem)
                spItem.scale = global.CommonClass.Functions.getToscale(spItem, 160, 180);
                self.scheduleOnce(function () {
                    self.setGray(self.locked);
                }, 0.1);//下一帧立即执行，此处需要在下一帧执行
            });
            this.helpNode.active = false;
            var data = global.Module.TaskData.getHasAcceptTaskData();
            if (!data)
                return;
            var cfgData = global.Manager.DBManager.findData('Tasks', 'ID', data.taskId);
            if (cfgData && cfgData.FactoryID == factoryID)
                this.helpNode.active = true;
        }
    };

    setGray(bGray) {
        let spItem = this.node.getChildByName('spItem').getComponent(cc.Sprite);
        let spDirect = this.node.getChildByName('direct').getComponent(cc.Sprite);

        global.CommonClass.Functions.grayTexture(spItem, bGray);
        global.CommonClass.Functions.grayTexture(spDirect, bGray);
    };

    getLocked() {
        this.helpNode.active = false;
        return this.locked;
    };

    getFactoryID() {
        return this.factoryID;
    };
    // update (dt) {}
}
