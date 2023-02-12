
const { ccclass, property } = cc._decorator;

@ccclass
export default class MakeGoodsItem extends cc.Component {
    @property({ type: cc.Node, displayName: "箭头", tooltip: "提示引导节点" })
    helpNode: cc.Node = null;
    itemData: any;
    itemIdx: number;
    size: any;

    static create(itemData, itemIdx, parent, position, callback) {
        let filePath = "prefab/component/MakeGoodsItem";
        cc.loader.loadRes(filePath, function (err, prefab) {
            if (err == null) {
                let newNode = cc.instantiate(prefab);
                if (parent != null)
                    parent.addChild(newNode, cc.macro.MAX_ZINDEX);
                newNode.setPosition(position.x, position.y);
                newNode.setName(itemIdx.toString());
                newNode.tagEx = itemIdx;

                let itemIcon = newNode.getComponent(MakeGoodsItem);
                itemIcon.setItem(itemData, itemIdx);

                if (itemData != null) {
                    let level = global.Module.MainPlayerData.getLevel();
                    itemIcon.setGray(itemData.levelRequire > level)
                }

                if (callback)
                    callback(itemIcon);
            }
        });
    };

    constructor() {
        super();
        this.itemData = null;
        this.itemIdx = 0;
    };
    onLoad() {

    };

    setItem(itemData, itemIdx) {
        this.itemData = itemData;
        this.itemIdx = itemIdx;

        if (itemData != null) {
            let itemID = this.itemData.ID;
            let iconFile = "images/pictrue/items/default";
            let data = global.Manager.DBManager.getItemNew(itemID);
            if (data != null)
                iconFile = data.path + data.picName;
            let spItem = this.node.getChildByName('spItem');
            global.CommonClass.Functions.setTexture(spItem, iconFile, function(){
                
            });

            let lblItemNum = this.node.getChildByName('lblNumber');
            let item = global.Module.PackageData.getItem(itemID);
            if (item != null && item.Count != null)
                lblItemNum.getComponent(cc.Label).string = item.Count.toString();
            else
                lblItemNum.getComponent(cc.Label).string = '0';
            

            this.node.active = true;
        } else {
            this.node.active = false;
        }
        this.scheduleOnce(function () {
            this.reflashHelp();
        }, 0.5);

        

    };
    countNum(){
        let lblItemNum = this.node.getChildByName('lblNumber');
        let itemID = this.itemData.ID;
        let item = global.Module.PackageData.getItem(itemID);
        if (item != null && item.Count != null)
            lblItemNum.getComponent(cc.Label).string = item.Count.toString();
        else
            lblItemNum.getComponent(cc.Label).string = '0';   
    }
    onOpen(isShow){
        let lblItemNum = this.node.getChildByName('lblNumber');
        lblItemNum.active = isShow;
    }
    isRepeat(ID) {
        let factoryID = global.Module.MakeGoodsData.getFactoryID();
        let data: any = global.Module.MakeGoodsData.getData(factoryID);
        for (var i = 0; i < data.makeItem.length; i++)
            if (data.makeItem[i] == ID)
                return false;
        return true;
      };
    reflashHelp() {
        if (this.helpNode){
            this.helpNode.stopAllActions();
            this.helpNode.active = false;
        }
           
        var data = global.Module.TaskData.getHasAcceptTaskData();
        
        if (!data)
            return;
        if (
            (data.taskId == '10005' && this.itemData.ID == '410240001'&&this.isRepeat(410240001))
            || (data.taskId == '10014' && (this.itemData.ID == '300200001'&&this.isRepeat(300200001))||(this.itemData.ID == '300200002'&&this.isRepeat(300200002)))
        )
         {
            if (data.state == 1)
            {
            let panel = global.Manager.UIManager.get('UIMakeGoods');
                if (this.helpNode && panel != null) {
                  
                    this.helpNode.active = true;
                    let nodeNode = panel.getDragRange();
                    this.tween(nodeNode)
                }
                
            }
                
                    
        }
    };
    
    tween(nodeNode){
        var animation = this.helpNode.getChildByName('shou1').getComponent(cc.Animation);
        var position = global.Manager.UIManager.coortrans(nodeNode, this.node);
        cc.tween(this.helpNode)
            .call(() => {
                this.helpNode.active = true;
                animation.play('anxia2');
                this.helpNode.setPosition(16, -11, 0);
                position = global.Manager.UIManager.coortrans(nodeNode, this.node);
            })
            .delay(0.5)
            .to(1, { position: position })
            .call(() => {
                this.tween(nodeNode)
            })
            .start()   
    }
    getItemID() {
        if (this.helpNode){
            this.helpNode.stopAllActions();
            this.helpNode.active = false;
        }
           
        return this.itemData.ID;
    };

    setItemSize(itemSize) {
        this.size = itemSize;
        let curSize = this.node.getContentSize();
        this.node.setScale(itemSize / curSize.width, itemSize / curSize.height);
    };

    setBackSprite(filePath) {
        let ndSpBack = this.node.getChildByName('spBack');
        global.CommonClass.Functions.setTexture(ndSpBack, filePath, null);
    };

    setGray(bGray) {
        let spItem = this.node.getChildByName('spItem').getComponent(cc.Sprite);
        global.CommonClass.Functions.grayTexture(spItem, bGray);

    };
}
