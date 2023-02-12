

const {ccclass, property} = cc._decorator;

@ccclass
export default class DlgCollectDrop extends cc.Component {
    @property({ type: cc.Node, displayName: "spineNode", tooltip: "spineNode" })
    spineNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "spine", tooltip: "spine" })
    spine: cc.Node = null;
    items: any;
    ndItems: any;
    closeCB: any;
    ndTemplate: any;
    isInFly: boolean;
    closeTime: number;
    autoClose: boolean;
    dropMode: {};
    callback: any;
    params: any;
    constructor(){
        super();
        this.items = {};
        this.ndItems = null;
        this.closeCB = null;
        this.callback = null;
        this.ndTemplate = null;

        this.isInFly = false;

        this.closeTime = 1;
        this.autoClose = false;
    };

    onLoad () {}

    start () {

    }
    onEnable() {
      
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEvent, this);

        this.ndItems = this.node.getChildByName('content');

        this.ndTemplate = this.node.getChildByName('ndTemplate');
        this.ndTemplate.active = false;

        let ndClick = this.node.getChildByName('ndClick');
        ndClick.active = false;

        this.dropMode = {};
        this.dropMode[1] = [1];
        this.dropMode[2] = [0, 2];
        this.dropMode[3] = [0, 1, 2];
        this.dropMode[4] = [0,1,2,3];
        this.dropMode[5] = [0,1,2,3,4];
        this.dropMode[6] = [0,1,2,3,4,5];
        // this.dropMode[7] = [0,1,2,3,4,5,6];
        // this.dropMode[8] = [0,1,2,3,4,5,6,7];
        //  this.dropMode[9] = [0,1,2,3,4,5,6,7,8];


    };

    onDisable() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
    };

    touchEvent(event) {
        let touchPoint = event.getLocation();

        if (event.type == cc.Node.EventType.TOUCH_START) {
            let ndItem = this.getPickItem(touchPoint);
            if (ndItem != null) {

                let itemID = ndItem.tagEx;

                let item = global.Manager.DBManager.getItemNew(itemID);
                if (item != null)   //物品
                {
                    global.Manager.UIManager.open('UIPackageShow', null, function (panel) {
                        if (panel != null) {
                            panel.show(itemID);
                        }
                    });
                    
                    // global.Manager.UIManager.open('DlgItemDec', null, function (panel) {
                    //     panel.show(itemID);
                    // });
                }
            }
            else {
                if (!this.isInFly)
                    this.playShowItemFly();
                else
                    this.btnClose();
            }

            this.autoClose = false;

        }
        else if (event.type == cc.Node.EventType.TOUCH_END) {
        }
    };

    randJokeIdx() {
        let data = global.Manager.DBManager.getData('Joke');
        let randIdx = Math.ceil(Math.random()*data.length);
        return randIdx;
    };

    show(items,data) {
        this.items = items;
        if (data) {
            this.spineNode.active = true
            let skeleton = this.spine.getComponent(sp.Skeleton);
                skeleton.loop = true;
                skeleton.paused = false;
                skeleton.animation = 'zuoyouwa';
                this.scheduleOnce(function(){ 
                   this.show(items)
                 },2);
            return ;  
        }

        this.spineNode.active = false;
        
        global.Instance.Log.debug("DlgCollectDrop",items)
        let itemSize = this.node.getChildByName('ndTemplate').getContentSize();
        let backSize = this.ndItems.getContentSize();

        let itemColNum = 3;
        let itemSpaceX = (backSize.width - itemColNum * itemSize.width) / (itemColNum - 1);
        let beginX = 0;

        let startX = beginX - backSize.width / 2 + itemSize.width / 2;
        let position = cc.v2(startX, 0);
        let type = 0;

        let positionArray = [];
        for (let i = 0; i < 3; ++i) {
            positionArray.push(cc.v2(position));

            ++type;
            position.x += (itemSpaceX + itemSize.width);
            if (type >= itemColNum) {
                position.y = 0;
                position.x = startX;
                type = 0;
            }
        }

        let dropMode = this.dropMode[this.items.length];

        /* for (let j=0; j<dropMode.length; ++j)
         {
             let posIdx = dropMode[j];
             let pos = positionArray[posIdx];
 
             let newItem =  cc.instantiate(this.ndTemplate);
             let itemClass = newItem.getComponent(global.CommonClass.ItemIcon);
             itemClass.setItem(110020005, 1);
             this.ndItems.addChild(newItem);
             newItem.setPosition(pos);
             newItem.active = true;
         }*/
        global.Instance.Log.debug('mode..',this.items.length.toString());
        global.Instance.Log.debug('mode..1',this.items);
        let itemIdx = 0;
        for (let key in this.items) {
            if(itemIdx > 2) {
                break;
            }
            let item = this.items[key];
            let itemNum = item.itemNum;
            let posIdx = dropMode[itemIdx];
            let position = positionArray[posIdx];

            if (item.type == 30 || item.type == 40)     //奇遇
            {
                let newNode = cc.instantiate(this.ndTemplate);
                newNode.active = true;

                let spItem = newNode.getChildByName('spItem');
                global.CommonClass.Functions.setTexture(spItem, 'images/pictrue/worldmap/qiyu',null);

                let lblName = newNode.getChildByName('lblName').getComponent(cc.Label);
                if (item.type == 30)
                    lblName.string = '故事';
                else if (item.type == 40)
                    lblName.string = '奇遇';

                this.ndItems.addChild(newNode);
                newNode.setPosition(position);
                newNode.tagEx = item.itemID;

                let btnHelp = newNode.getChildByName('btnHelp');
                btnHelp.tagEx = item.itemID;

                if (item.type == 30) {
                    //  let jokeIdx = this.randJokeIdx();
                    // newNode.setUserData(jokeIdx);
                }
            }
            else {
                let newItem = cc.instantiate(this.ndTemplate);
                let itemClass = newItem.getComponent(global.CommonClass.ItemIcon);
                itemClass.setItem(item.itemID, itemNum);
                this.ndItems.addChild(newItem);
                newItem.setPosition(position);
                newItem.active = true;

                // let btnHelp = newItem.getChildByName('btnHelp');
                // btnHelp.tagEx = item.itemID;

                // let isFirst = global.Module.GameData.getIsFirstDrop(item.itemID);
                // global.CommonClass.ItemIcon.create(item.itemID, itemNum, null, this.ndItems, cc.v2(0,0), function(item)
                //   {
                //item.showNew(isFirst);
                // });
            }

            ++itemIdx;

            //if (item.type!=30 && item.type!=40)
            //global.Module.GameData.addDropCount(item.itemID, itemNum);
        }

        global.Instance.AudioEngine.replaySound('drop1', false,null);
    };

    setCloseCB(cb) {
        this.closeCB = cb;
    };

    getPickItem(touchPoint) {
        let ndItems = this.ndItems.getChildren();

        for (let key in ndItems) {
            let ndItem = ndItems[key];
            let spItem = ndItem.getChildByName('spItem');
            let boundingBox = spItem.getBoundingBoxToWorld();
            if (boundingBox.contains(touchPoint)) {
                return ndItem;
            }
        }

        return null;
    };

    playShowItemFly() {
        this.isInFly = true;

        let items = [];
        let coin = 0;
        let exp = 0;
        let reputation = 0;

        for (let i in this.items) {
            let curItem = this.items[i];
            if (curItem.itemID >= 100000000)
                items.push(curItem);
            else if (curItem.itemID == 1)      //金币
                coin = curItem.itemNum;
            else if (curItem.itemID == 4)       //经验
                exp = curItem.itemNum;
            else if (curItem.itemID == 39)     //声望
                reputation = curItem.itemNum;
        }

        let spPackage = this.node.getChildByName('spPackage');
        spPackage.active = items.length == 1;
        // if (spPackage.active) {
        //     let item = items[0];
        //     let itemData = global.Manager.DBManager.findData('Items', 'ID', item.itemID);
        //     let picPath = 'images/pictrue/mainscene/factory/package' + itemData.warehouseType.toString();
        //     global.CommonClass.Functions.setTexture(spPackage, picPath,null);
        // }

        let ndPackages = this.node.getChildByName('ndPackages');
        ndPackages.active = items.length > 1;
        let ItemDec = this.node.getChildByName('ItemDec');
        ItemDec.active = false;

        let ndClick = this.node.getChildByName('ndClick');
        ndClick.active = true;

        let ndItems = this.ndItems.getChildren();
        for (let key in ndItems) {
            let end = null;

            let ndItem = ndItems[key];
            ndItem.stopAllActions();

            let start = ndItem.getPosition();
            ndItem.setPosition(start);

            end = global.CommonClass.Functions.nodePositionToTarget(ndPackages, this.ndItems);

            let position = start;
            let endPosition = end;

            if (endPosition == null || position == null)
                return false;

            let self = this;
            let callBack = function () {
                self.btnClose();
                self.isInFly = false;
            };

            let midPosition = cc.v2((endPosition.x + position.x) / 2, position.y + 300);
            let scaleInBack = cc.scaleTo(1, 0.1);

            let bezier = [position, midPosition, endPosition];
            let bezierTo = cc.bezierTo(1, bezier);

            let endFunction = cc.callFunc(callBack);
            let seq2 = cc.sequence(bezierTo, endFunction);
            let spawn = cc.spawn(scaleInBack, seq2);

            ndItem.runAction(spawn);
        }

    };

    update(dt) {
        if (this.autoClose) {
            this.closeTime -= dt;
            if (this.closeTime <= 0) {
                this.autoClose = false;
                this.btnClose();
            }
        }
    };

    btnShowItem(event, arg) {
        let itemId = event.target.tagEx;
        global.Manager.UIManager.open('UIPackageShow', null, function (panel) {
            if (panel != null) {
                panel.show(itemId);
            }
        });

        this.autoClose = false;
    };
    reflash(params,callback){
        this.callback = callback;
        this.params = params;
    }

    btnClose() {
        if(this.spineNode.active == true){
            this.show(this.items,null)
            return;
        }
        global.Manager.UIManager.close('DlgCollectDrop');
        if (this.callback)
            this.callback(this.params);
        if (this.closeCB)
            this.closeCB();
    };
    // update (dt) {}
}
