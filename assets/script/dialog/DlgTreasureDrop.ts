const { ccclass, property } = cc._decorator;

@ccclass
export default class DlgTreasureDrop extends cc.Component {
    items: any;
    ndItems: any;
    closeCB: any;
    isMoved: any;
    touchStart: any;
    inAnimation: boolean;
    isInFly: boolean;
    constructor() {
        super();
        this.items = {};
        this.ndItems = null;
        this.closeCB = null;
        this.isMoved = null;

        this.inAnimation = false;
        this.isInFly = false;
    };

    start() {

    }
    onEnable() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
        this.enableScrollTouch(true);
        this.ndItems = this.node.getChildByName('itemBack').getChildByName('itemScorll').getChildByName('view').getChildByName('content');
    };

    onDisable() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
        this.enableScrollTouch(false);
    };


    enableScrollTouch(isEnable) {
        let itemScroll = this.node.getChildByName('itemBack').getChildByName('itemScorll');
        if (isEnable) {
            itemScroll.on(cc.Node.EventType.TOUCH_MOVE, this.touchScrollEvent, this);
            itemScroll.on(cc.Node.EventType.TOUCH_END, this.touchScrollEvent, this);
            itemScroll.on(cc.Node.EventType.TOUCH_START, this.touchScrollEvent, this);
            itemScroll.on(cc.Node.EventType.TOUCH_CANCEL, this.touchScrollEvent, this);
        }
        else {
            itemScroll.off(cc.Node.EventType.TOUCH_MOVE, this.touchScrollEvent, this);
            itemScroll.off(cc.Node.EventType.TOUCH_END, this.touchScrollEvent, this);
            itemScroll.off(cc.Node.EventType.TOUCH_START, this.touchScrollEvent, this);
            itemScroll.off(cc.Node.EventType.TOUCH_CANCEL, this.touchScrollEvent, this);
        }
    };

    touchEvent(event) {
        global.Instance.Log.debug('touchEvent', event)
        if (event.type == cc.Node.EventType.TOUCH_END){
            if (this.inAnimation == true){
                this.btnClose();
            }else{
                for (let i = 0; i < this.ndItems.children.length; i++) {
                    let item = this.ndItems.children[i];
                    item.stopAllActions();
                    item.scale = 1;
                }
            }
                
        }
           
    };

    touchScrollEvent(event) {
        if (this.inAnimation != true)
            return;
        let touchPoint = event.getLocation();
        global.Instance.Log.debug('touchScrollEvent', event)
        if (event.type == cc.Node.EventType.TOUCH_START) {
            this.touchStart = touchPoint;
            this.isMoved = false;
        }
        else if (event.type == cc.Node.EventType.TOUCH_MOVE) {

            let distance = touchPoint.sub(this.touchStart).mag();
            if (distance > 5)
                this.isMoved = true;
        }
        else if (event.type == cc.Node.EventType.TOUCH_END) {
            if (!this.isMoved) {
                let ndItem = this.getPickItem(touchPoint);
                if (ndItem != null) {
                    let itemID = ndItem.tagEx;
                    
                    let item = global.Manager.DBManager.getItemNew(itemID);
                    if (item != null) {  //物品
                    
                        global.Manager.UIManager.open('UIPackageShow', null, function (panel) {
                            if (panel != null) {
                                panel.show(itemID);
                            }
                        });
                    }else{
                        this.btnClose();  
                    }
                } else {
                    this.btnClose();
                }
            }
        }
    };

    randJokeIdx() {
        let data = global.Manager.DBManager.getData('Joke');
        let randIdx = Math.ceil(Math.random() * data.length);
        return randIdx;
    };

    show(items) {
        if (!items || items.length == 0)
            return;
        this.items = items;
        global.Instance.Log.debug('show', items);
        global.Instance.Log.debug('this.ndItems', this.ndItems);
        let len = this.ndItems.children.length
        for (let i = 0; i < len.length; i++){
            let newNode = this.ndItems.children[i];
            newNode.active = false;
            newNode.tagEx = -1;
        }

        for (let i = 0; i < this.items.length; i++) {
            let item = this.items[i];
            let itemNum = item.itemNum;
            let newNode = this.ndItems.children[i];
            if (item.type == 30 || item.type == 40) {
                let spItem = newNode.getChildByName('spItem');
                global.CommonClass.Functions.setTexture(spItem, 'images/pictrue/worldmap/qiyu', null);
                newNode.active = true;
                newNode.scale = 0;
                let lblName = newNode.getChildByName('lblName').getComponent(cc.Label);
                if (item.type == 30)
                    lblName.string = '故事';
                else if (item.type == 40)
                    lblName.string = '奇遇';
                newNode.tagEx = (item.itemID);
            } else { 
                let itemClass = newNode.getComponent(global.CommonClass.ItemIcon);
                itemClass.setItem(item.itemID, itemNum);
                newNode.scale = 0;
                newNode.active = true;
            }

        }

        for (let i = 0; i < this.ndItems.children.length; i++) {
            let item = this.ndItems.children[i];
            let scaleTo = cc.scaleTo(0.3, 1);
            item.stopAllActions();
            item.runAction(scaleTo);
        }
        let self = this;
        setTimeout(() => {
            self.inAnimation = true;
        }, 300);
        global.Instance.AudioEngine.replaySound('getItem', false, null);
    };

    setCloseCB(cb) {
        this.closeCB = cb;
    };

    getPickItem(touchPoint) {
        let ndItems = this.ndItems.getChildren();

        for (let key in ndItems) {
            let ndItem = ndItems[key];
            let boundingBox = ndItem.getBoundingBoxToWorld();
            if (boundingBox.contains(touchPoint)) {
                return ndItem;
            }
        }

        return null;
    };

    btnClose() {
        global.Manager.UIManager.close('DlgTreasureDrop');

        if (this.closeCB)
            this.closeCB();
    };


    // update (dt) {}
}
