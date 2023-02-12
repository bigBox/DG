
const { ccclass, property } = cc._decorator;

@ccclass
export default class SpecimenItem extends cc.Component {
    static className: string = 'SpecimenItem';
    item: any;
    isShowButtom: boolean;
    constructor() {
        super();
        this.item = null;
        this.isShowButtom = true;
    };

    // use this for initialization
    onLoad() {

    };

    setItem(item, callback) {
        this.node.scale = 0.9;

        this.item = item;

        let spBox = this.node.getChildByName('spBox');
        let spBlue = this.node.getChildByName('spBlue');
        let spRed = this.node.getChildByName('spRed');

        let spItem = this.node.getChildByName('spItem');
        let iconFile = "images/pictrue/items/default";

        let preciousData = global.Manager.DBManager.findData('Precious', 'ID', item.templateID);
        if (preciousData != null)
            iconFile = 'images/pictrue/precious/' + preciousData.showImage;

        let itemData = global.Manager.DBManager.findData('Items', 'ID', item.templateID);
        if (itemData != null) {
            spItem.scale = 1;

            let positon = spItem.getPosition();
            // positon.y = 26-itemData.scale1*26;   //往上偏移10

            spItem.setPosition(positon);
            spBox.setPosition(positon);
            spRed.setPosition(positon);
            spBlue.setPosition(positon);

            if (itemData.subType == 23 && itemData.antiqueId >= 0) {
                spBox.y = 25;
                spItem.y = 25;
                spBlue.y = 25;
                spRed.y = 25;
            }


        }


        let self = this;
        let spButtomM = this.node.getChildByName('spButtomM');
        let spButtomL = this.node.getChildByName('spButtomL');
        let spButtomR = this.node.getChildByName('spButtomR');
        let ndDoor = this.node.getChildByName('ndDoor');
        let btnPutBack = this.node.getChildByName('btnPutBack');
        let spQulity = this.node.getChildByName('spQulity');
        let ndEdge = this.node.getChildByName('ndEdge');

        spButtomL.active = false;
        spButtomM.active = false;
        spButtomR.active = false;

        global.CommonClass.Functions.setTexture(spItem, iconFile, function (spImage) {
            if (spImage == null)
                return;

            let size = spImage.getContentSize();
            self.node.setContentSize(size);

            let boxSize = cc.size(itemData.doorW, itemData.doorH);
            spBox.setContentSize(boxSize);

            let buttomSize = spButtomM.getContentSize();
            buttomSize.width = size.width;
            spButtomM.setContentSize(buttomSize);

            spButtomL.x = -buttomSize.width / 2;
            spButtomR.x = buttomSize.width / 2;

            if (ndDoor != null && itemData != null) {
                let doorSize = ndDoor.getContentSize();

                let scaleX = itemData.doorW / doorSize.width;
                let scaleY = itemData.doorH / doorSize.height;
                ndDoor.scaleX = scaleX;
                ndDoor.scaleY = scaleY;

                if (ndEdge != null) {
                    let edgeSize = cc.size(0, 0);
                    edgeSize.width = itemData.doorW;
                    edgeSize.height = itemData.doorH;
                    ndEdge.setContentSize(edgeSize);

                    let spLeft = ndEdge.getChildByName('spL');
                    let spRight = ndEdge.getChildByName('spR');
                    let spUp = ndEdge.getChildByName('spU');
                    let spDown = ndEdge.getChildByName('spD');
                    let spMid = ndEdge.getChildByName('spM');
                    let spLU = ndEdge.getChildByName('spLU');
                    let spRU = ndEdge.getChildByName('spRU');
                    let spLD = ndEdge.getChildByName('spLD');
                    let spRD = ndEdge.getChildByName('spRD');

                    spMid.setContentSize(edgeSize);

                    let yOffset = spMid.getPosition().y + edgeSize.height / 2;
                    spLeft.setPosition(-edgeSize.width / 2, yOffset);
                    spLeft.setContentSize(10, edgeSize.height);
                    spRight.setPosition(edgeSize.width / 2, yOffset);
                    spRight.setContentSize(10, edgeSize.height);

                    spUp.setPosition(0, edgeSize.height / 2 + yOffset);
                    spUp.setContentSize(edgeSize.width, 10);
                    spDown.setPosition(0, -edgeSize.height / 2 + yOffset);
                    spDown.setContentSize(edgeSize.width, 10);

                    spLU.setPosition(-edgeSize.width / 2 + 5, edgeSize.height / 2 + yOffset - 5);
                    spRU.setPosition(edgeSize.width / 2 - 5, edgeSize.height / 2 + yOffset - 5);
                    spLD.setPosition(-edgeSize.width / 2 + 5, -edgeSize.height / 2 + yOffset + 5);
                    spRD.setPosition(edgeSize.width / 2 - 5, -edgeSize.height / 2 + yOffset + 5);
                }
            }

            if (btnPutBack)
                btnPutBack.setPosition(itemData.doorW / 2 + 20, itemData.doorH + 20);

            if (spQulity)
                spQulity.setPosition(itemData.doorW / 2, 0);

            spBlue.setContentSize(boxSize);
            spRed.setContentSize(boxSize);

            if (callback)
                callback(spImage);

        });

        if (itemData != null) {
            let lblValue = this.node.getChildByName('lblValue').getComponent(cc.Label);

            let fortuneString = global.Module.PreciousRoomData.formatFortune(itemData.gold);
            lblValue.string = fortuneString;
        }

        this.showSuitFlag(null, null);
        this.showCanPut(0);

        this.showValue(true);

        //  this.node.scale = 0.5;
    };

    getItem() {
        return this.item;
    };

    setWithPutOnAction(item, callback) {
        this.setItem(item, callback);
    };

    showSuitFlag(color, isPlayAnimation)        //null 表示隐藏
    {
        let suitFlag = this.node.getChildByName('suitFlag');
        suitFlag.active = false;

        let spButtomM = this.node.getChildByName('spButtomM');
        let spButtomL = this.node.getChildByName('spButtomL');
        let spButtomR = this.node.getChildByName('spButtomR');

        if (color == null) {
            //suitFlag.active = false;
            spButtomM.color = cc.color(255, 255, 255, 255);
            spButtomL.color = cc.color(255, 255, 255, 255);
            spButtomR.color = cc.color(255, 255, 255, 255);
        }
        else {
            if (isPlayAnimation) {
                let animation = this.node.getComponent(cc.Animation);

                let animState = animation.getAnimationState('fadeInOut');
                if (!animState.isPlaying) {
                    animation.play('fadeInOut');

                    animState.wrapMode = cc.WrapMode.Loop;
                    animState.repeatCount = 2;
                }
            }

            spButtomM.color = cc.color(0, 0, 255, 255);
            spButtomL.color = cc.color(0, 0, 255, 255);
            spButtomR.color = cc.color(0, 0, 255, 255);
        }
    };

    showCanPut(mode)       //0.都不显示 1.可以放置 2.不可以放置
    {
        let spBlue = this.node.getChildByName('spBlue');
        let spRed = this.node.getChildByName('spRed');

        spBlue.active = mode == 1;
        spRed.active = mode == 2;
    };

    showValue(isShow) {
        //let lblValue = this.node.getChildByName('lblValue');
        //  lblValue.active = isShow;
    };

    showButtom(isShow) {
        this.isShowButtom = isShow;

        let spButtomM = this.node.getChildByName('spButtomM');
        let spButtomL = this.node.getChildByName('spButtomL');
        let spButtomR = this.node.getChildByName('spButtomR');

        // spButtomL.active = this.isShowButtom;
        //  spButtomM.active = this.isShowButtom;
        //  spButtomR.active = this.isShowButtom;
        spButtomL.active = false;
        spButtomM.active = false;
        spButtomR.active = false;
    };

    setQulity(itemData) {
        let spQulity = this.node.getChildByName('spQulity');

        let qulityFile = '';
        if (itemData != null)
            qulityFile = 'images/pictrue/identify/quality' + itemData.color.toString();

        if (itemData.subType == 23) {
            if (itemData.color == 1 || itemData.color == 2 || itemData.color == 5) {
                global.CommonClass.Functions.setTexture(spQulity, qulityFile, null);
                spQulity.active = true;
            }
            else {
                spQulity.active = false;
            }
        }
        else {
            if (itemData.isRare == 2)//稀有
            {
                spQulity.active = false;
            }
            else {
                global.CommonClass.Functions.setTexture(spQulity, qulityFile, null);
                spQulity.active = true;
            }
        }
    };

    playPutAction(isPut, callback) {
        let spItem = this.node.getChildByName('spItem');
        let spQulity = this.node.getChildByName('spQulity');
        let spnDoor = this.node.getChildByName('ndDoor');
        let skeleton = spnDoor.getComponent(sp.Skeleton);
        let ndEdge = this.node.getChildByName('ndEdge');

        spnDoor.active = true;
        ndEdge.active = false;

        let isShowQulity = spQulity.active;

        if (isPut) {
            let curPos = spItem.getPosition();

            let endCall = function () {
                if (callback)
                    callback();
            }

            let moveItemCall = function () {
                let moveTo1 = cc.moveTo(1, cc.v2(0, curPos.y));
                let endCallFun = cc.callFunc(endCall);
                let seq = cc.sequence(moveTo1, endCallFun);

                spItem.stopAllActions();
                spItem.runAction(seq);

                // let moveTo2 = cc.moveTo(1, cc.v2(0, curPos.y));
                //  spQulity.stopAllActions();
                //spQulity.runAction(moveTo2);

                spnDoor.active = false;
                ndEdge.active = true;
                //  spQulity.active = isShowQulity;
            }

            let size = ndEdge.getContentSize();
            let position = cc.v2(curPos.x - size.width, curPos.y);
            spItem.setPosition(position);
            // spQulity.setPosition(position);

            skeleton.animation = 'open';
            skeleton.paused = false;
            skeleton.loop = false;

            skeleton.setCompleteListener(moveItemCall);
        }
        else {
            let colseEndCall = function () {
                if (callback)
                    callback();

                spnDoor.active = false;
                ndEdge.active = true;
            }

            spItem.active = false;
            //  spQulity.active = false;

            skeleton.animation = 'close';
            skeleton.paused = false;
            skeleton.loop = false;

            skeleton.setCompleteListener(colseEndCall);
        }
    };

    playComposeAction(targetPos, callback) {
        let spButtomM = this.node.getChildByName('spButtomM');
        let spButtomL = this.node.getChildByName('spButtomL');
        let spButtomR = this.node.getChildByName('spButtomR');
        spButtomM.active = false;
        spButtomL.active = false;
        spButtomR.active = false;

        let spQulity = this.node.getChildByName('spQulity');
        let self = this;
        let fadeEndFun = function () {
            let scaleTo = cc.scaleTo(2, 0);
            let moveTo = cc.moveTo(2, targetPos);
            let spawn = cc.spawn(scaleTo, moveTo);

            if (callback) {
                let moveEndCall = cc.callFunc(callback);
                let seq1 = cc.sequence(spawn, moveEndCall);
                self.node.runAction(seq1);
            }
            else {
                self.node.runAction(spawn);
            }
        };

        let fadeEndCall = cc.callFunc(fadeEndFun);

        let fadeIn = cc.fadeIn(0.3);
        let fadeOut = cc.fadeOut(0.3);
        let seq = cc.sequence(fadeIn, fadeOut, fadeIn, fadeOut, fadeIn, fadeOut, fadeEndCall);
        spQulity.runAction(seq);
    };

    playMoneyFly(callback) {
        let spMoneyFly = this.node.getChildByName('spMoneyFly');

        let curPos = spMoneyFly.getPosition();
        curPos.y += 100;

        global.CommonClass.ItemDrop.createAndDrop2(1, 0, curPos, this.node, null, null, callback);
    };

    // update (dt) {}
}
