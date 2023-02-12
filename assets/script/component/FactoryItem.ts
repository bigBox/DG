
const { ccclass, property } = cc._decorator;

@ccclass
export default class FactoryItem extends cc.Component {
    @property({ type: cc.Node, displayName: "引导节点", tooltip: "提示的引导节点" })
    helpNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "ndItem",tooltip: "" })
    ndItem: cc.Node = null;
    factoryID: number;
    locked: boolean;
    constructor() {
        super();
        this.factoryID = 0;
        this.locked = false;
    };

    onLoad() {
        this.ndItem = this.node.getChildByName('ndItem');
    };

    onEnable() {

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
            this.setGray(this.locked);

            let spItem = this.ndItem.getChildByName('spItem');
            let orginSize = spItem.getContentSize();

            global.CommonClass.Functions.setTexture(spItem, factory.filePath, function (item) {
                let scale = item.scale;

                let scaleX = scale;
                let scaleY = scale;

                let curSize = item.getContentSize();
                if (orginSize.width < curSize.width)
                    scaleX *= orginSize.width / curSize.width;
                if (orginSize.height < curSize.height)
                    scaleY = orginSize.height / curSize.height * scale;
                scaleY > scaleX ? scale = scaleY : scale = scaleX;

                item.setScale(scale);
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
        let spItem = this.ndItem.getChildByName('spItem').getComponent(cc.Sprite);
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
}
