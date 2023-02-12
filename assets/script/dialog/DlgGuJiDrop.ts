import UIBase from "../common/UIBase";
const { ccclass, property } = cc._decorator;

@ccclass
export default class DlgGuJiDrop extends UIBase {
    itemID: any;
    callBack: any;
    inAnimation: boolean;
    isInFly: boolean;
    constructor() {
        super();
        this.itemID = null;
        this.callBack = null;

        this.inAnimation = false;
        this.isInFly = false;
    };

    onLoad() { };

    start() {

    };
    onEnable() {
        let touchLayer = this.node.getChildByName('touchLayer');
        touchLayer.on(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
        touchLayer.on(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
    };

    onDisable() {
        let touchLayer = this.node.getChildByName('touchLayer');
        touchLayer.off(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
        touchLayer.off(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
    };

    touchEvent(event) {
        if (event.type == cc.Node.EventType.TOUCH_END) {
            global.Instance.Log.debug('inAnimation',this.inAnimation)
            if(this.inAnimation == true){
                if (this.isInFly == false) {
                    this.playShowItemFly();
                    return;
                }
                this.btnClose();
            }else{
                let animation = this.node.getComponent(cc.Animation);
                animation.stop();
                let lblName = this.node.getChildByName('lblName');
                let itemDec = this.node.getChildByName('ItemDec');
                let spItem = this.node.getChildByName('spItem');
                lblName.active = true;
                itemDec.active = true;
                spItem.scale = 2;
                let self = this;
                setTimeout(() => {
                    self.onScaleEnd();
                }, 300);
            }
        }
    };

    setCloseCB(callBack) {
        this.callBack = callBack;
    };

    setItem(itemId, treasure) {
        this.itemID = itemId;
        let iconFile = "images/pictrue/items/default";
        let data = global.Manager.DBManager.getItemNew(itemId);
        if (data != null) {
            if(data.perfect != 0)
            iconFile = data.path + data.perfect;
            else
            iconFile = data.path + data.picName;

           
            let itemDecSprite = this.node.getChildByName('spItem');
            global.CommonClass.Functions.setTexture(itemDecSprite, iconFile, null);

            let nameDec = data.name;

            let lblName = this.node.getChildByName('lblName');
            lblName.getComponent(cc.Label).string = nameDec;
        }
        global.Instance.AudioEngine.replaySound('drop1', false, null);
    };

    setNumber(number) {
        let itemDec = this.node.getChildByName('ItemDec');
        let itemDecNum = itemDec.getChildByName('lblNumber');
        itemDecNum.getComponent(cc.Label).string = 'X' + number.toString();

        itemDecNum.active = number > 0;
    };

    isClickItem(touchPoint) {
        let itemDecSprite = this.node.getChildByName('spItem');
        let boundingBox = itemDecSprite.getBoundingBoxToWorld();
        return boundingBox.contains(touchPoint);
    };

    playShowItemFly() {
        this.isInFly = true;
        let spPackage = this.node.getChildByName('spPackage');
        spPackage.active = true;
        let ItemDec = this.node.getChildByName('ItemDec');
        ItemDec.active = false;


        let itemDecSprite = this.node.getChildByName('spItem');

        let end = spPackage.getPosition();

        itemDecSprite.stopAllActions();

        let start = itemDecSprite.getPosition();
        itemDecSprite.setPosition(start);

        let position = start;
        let endPosition = end;

        if (endPosition == null || position == null)
            return false;

        let self = this;
        let callBack = function () {
            self.btnClose();
            self.isInFly = false;
        };

        let midPosition = cc.v2((endPosition.x + position.x) / 2, position.y + 500);
        let scaleInBack = cc.scaleTo(2, 0.1);

        let bezier = [position, midPosition, endPosition];
        let bezierTo = cc.bezierTo(2, bezier);

        let endFunction = cc.callFunc(callBack);
        let seq2 = cc.sequence(bezierTo, endFunction);
        let spawn = cc.spawn(scaleInBack, seq2);
        itemDecSprite.runAction(spawn);
    };

    onScaleEnd() {
        this.inAnimation = true;
        let isTaskId = global.Module.TaskData.getIsTaskId();
        if (isTaskId == true) {
            global.Module.TaskData.setIsTaskId(false);
            let guideID = global.Module.MainPlayerData.getguideID() + 1;
            let NoveGuide = global.Manager.DBManager.findData('NoveGuide', 'ID', guideID);
            global.Manager.UIManager.open('UIFirstTalk', null, function (panel) {
                panel.show(guideID, global.Manager.UIManager.getChild(cc.find("Canvas"), NoveGuide.guideName));
            });
        }
        
    };

    btnShowItem() {
        if (this.inAnimation == false)
            return;
        let itemId = this.itemID;
        global.Manager.UIManager.open('UIPackageShow', null, function (panel) {
            if (panel != null) {
                panel.show(itemId);
            }
        });
    };

    btnClose() {
        global.Manager.UIManager.close('DlgGuJiDrop');

        if (this.callBack)
            this.callBack()
    };

    // update (dt) {}
}
