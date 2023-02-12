import FactoryBase from "./FactoryBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class FishPool extends FactoryBase {
    bornPosition: any;
    curMovePos: any;
    isOnPutFish: boolean;
    curFishID: number;
    touchStart: any;
    isInDrag: boolean;
    fishScale: number;
    ndMovePoints: any;
    node: any;
    ndFishs: any;
    createPos: any;
    ndTempLate: any;

    constructor() {
        super();
        this.bornPosition = null;
        this.curMovePos = null;

        this.isOnPutFish = false;
        this.curFishID = 0;

        this.touchStart = null;
        this.isInDrag = false;
        this.fishScale = 0.5;
    };

    // use this for initialization
    onLoad() {

        this.ndMovePoints = this.node.getChildByName('ndMovePoints');
        this.ndFishs = this.node.getChildByName('ndFishs');
        this.bornPosition = this.node.getChildByName('ndBornPos').getPosition();
        this.createPos = this.bornPosition;

        global.Module.FishPoolData.setFishPool(this);

        this.ndTempLate = this.node.getChildByName('ndTempLate');
        this.ndTempLate.active = false;

        //cc.Module.FishPoolData.loadLocal();
        return FactoryBase.prototype.onLoad.apply(this, arguments);
    };

    onEnable() {
        let panel = global.Manager.UIManager.get('UIFishBag');
        if (panel != null) {
            panel.setDragEndCall(this.onPutFishEnd.bind(this));
            panel.setShowEndCall(this.onShowEnd.bind(this));
            // panel.setDragEventCall(this.onDragEvent.bind(this));
            panel.setAutoHide(true);
            panel.setShowPopBtn(false);
            panel.setShowHideBtn(false);
        }

        this.createFishs();
    };

    onDisable() {
        global.Module.FishPoolData.setFishPool(null);
    };

    adjustEdge(worldPos, callback) {
        let farmParkMap = global.Instance.Dynamics["FarmParkMap"];

        if (farmParkMap != null) {
            let cell = farmParkMap.getPickCell(worldPos);
            if (cell != null) {
                return farmParkMap.adjustEdge(cell, callback);
            }
        }

        return false;
    };

    randFishMove(fishID) {
        let self = this;
        let ndItems = this.ndFishs;
        let fish = global.CommonClass.Functions.getChildTagEx(ndItems,fishID);
        if (fish != null) {
            let randMovePos = function () {
                let moveNum = self.ndMovePoints.getChildren().length;
                let idx = Math.ceil(Math.random() * moveNum) + 1;
                let name = 'ndPos' + idx.toString();
                let movePos = self.ndMovePoints.getChildByName(name).getPosition();

                return movePos;
            }

            let movePos = randMovePos();
            while (movePos.sub(fish.getPosition()).mag() < 10)
                movePos = randMovePos();

            let onEnd = function () {
                self.randFishMove(fishID);
            }

            let position = fish.getPosition();
            let distance = position.sub(movePos).mag();
            let speed = 600;
            let timeCost = distance / speed;

            let curTime = 3;
            let curSpeed = distance / curTime;
            if (curSpeed < speed)
                timeCost = curTime;

            let moveAction = cc.moveTo(timeCost, movePos);
            let endFunction = cc.callFunc(onEnd);
            let seq = cc.sequence(moveAction, endFunction);

            this.setFishAngle(fish, movePos);
            fish.runAction(seq);
        }
    };

    createFish(fish, worldPos, needWait) {
        let self = this;

        let fishPos = this.createPos;
        if (worldPos != null)
            fishPos = this.ndFishs.convertToNodeSpaceAR(worldPos);

        if (fish != null) {
            let poolData = global.Manager.DBManager.findData('PoolFishs', 'ID', fish.templateID);
            if (poolData != null) {
                let newFish = cc.instantiate(this.ndTempLate);
                newFish.setPosition(fishPos);
                newFish.tagEx = fish.index;

                let spFish = newFish.getChildByName('spFish');
                global.CommonClass.Functions.setTexture(spFish, poolData.showImage,null);

                this.ndFishs.addChild(newFish);

                newFish.active = true;
                newFish.opacity = 160;

                if (needWait) {
                    let animState = null;
                    let animation = newFish.getComponent(cc.Animation);
                    if (animation != null) {
                        animState = animation.play('fishWait');
                        animState.wrapMode = cc.WrapMode.Loop;
                    }

                    newFish.setScale(this.fishScale * 2);
                    let spBack = newFish.getChildByName('spBack');
                    spBack.active = true;

                    let waitEnd = function () {
                        if (animState != null)
                            animState.stop();

                        spBack.active = false;
                        self.randFishMove(fish.index);

                        newFish.setScale(self.fishScale);
                    }

                    let endFunction = cc.callFunc(waitEnd);
                    let timeDelay = cc.delayTime(1);
                    let seq = cc.sequence(timeDelay, endFunction);
                    this.node.runAction(seq);
                }
                else {
                    this.randFishMove(fish.index);
                }
            }
        }
        else {
            global.CommonClass.UITip.showTipTxt('达到上限', global.Enum.TipType.TIP_BAD);
        }
    };

    createFishs() {
        let fishs = global.Module.FishPoolData.getFishs();
        for (let key in fishs.data) {
            let fish = fishs.data[key];
            this.createFish(fish,null,null);
        }
    };

    getFishByIndex(fishID) {
        let ndItems = this.ndFishs;
        let ndFish = global.CommonClass.Functions.getChildTagEx(ndItems,fishID);
        return ndFish;
    };

    setFishAngle(fish, targetPos) {
        let fishPos = fish.getPosition();
        let moveVec = cc.v2(targetPos.x - fishPos.x, targetPos.y - fishPos.y);
        if (moveVec.x > 0) {
            fish.scaleX = -this.fishScale;
        }
        else {
            fish.scaleX = this.fishScale;
        }

        fish.scaleY = this.fishScale;
    };

    getPickFish(touchPoint) {
        if (touchPoint == null)
            return null;

        let ndFishs = this.ndFishs.getChildren();
        for (let key in ndFishs) {
            let ndFish = ndFishs[key];
            let boundingBox = ndFish.getBoundingBoxToWorld();
            if (boundingBox.contains(touchPoint))
                return ndFish;
        }

        return null;
    };

    onPutFish() {
        let self = this;
        let msgData = { fishID: this.curFishID };
        global.Instance.MsgPools.send('parkPlaceFish', msgData, function (msg) {
            if (!msg.errorID) {
                global.Instance.AudioEngine.replaySound('water', false,null);

                let uiDragBag = global.Manager.UIManager.get('UIFishBag');
                if (uiDragBag != null) {
                    uiDragBag.createDrop(cc.v2(0, 100), function (worldPos) {
                        let fish = global.Module.FishPoolData.getFish(msg.fish.fishTimeID);
                        self.createFish(fish, worldPos, true);
                    });
                    uiDragBag.reflashCount(msgData.fishID);
                }
            }
            else {
                self.isOnPutFish = false;
                cc.director.getScheduler().unschedule(self.onPutFish, self);
            }
        });
    };

    onPutFishEnd() {
        if (this.isOnPutFish) {
            this.isOnPutFish = false;
            cc.director.getScheduler().unschedule(this.onPutFish, this);
        }
    };

    onDragEvent(event, itemID) {
        if (event.type == cc.Node.EventType.TOUCH_MOVE) {
            if (itemID > 0) {
                let touchPoint = event.getLocation();;

                this.curFishID = itemID;
                this.createPos = this.node.convertToNodeSpaceAR(touchPoint);

                let isPicked = this.isPicked(touchPoint);
                if (isPicked) {
                    if (!this.isOnPutFish) {
                        this.isOnPutFish = true;
                        cc.director.getScheduler().schedule(this.onPutFish, this, 1, cc.macro.REPEAT_FOREVER, 0, false);
                    }
                }
                else {
                    if (this.isOnPutFish) {
                        this.isOnPutFish = false;
                        cc.director.getScheduler().unschedule(this.onPutFish, this);
                    }
                }
            }
        }

        if (itemID <= 0) {
            let dragLayer = global.CommonClass.DragLayer.getDragLayer('FarmParkMap');
            if (dragLayer != null)
                dragLayer.touchEvent(event);
        }
    }isPicked(touchPoint: any):any {
        throw new Error("Method not implemented.");
    };

    onShowEnd(isShow) {
        if (!isShow) {
            // let panel = cc.Manager.UIManager.get('UIDragBag');
            //if (panel != null)
            // panel.show(false);
        }
        else {
            let panel = global.Manager.UIManager.get('UIFishBag');
            if (panel != null) {
                panel.showItems(2, function (item) {
                    return (item.parkItemType == 5);
                });
            }
        }

        let uiParkScene = global.Manager.UIManager.get('UIFarmParkScene');
        if (uiParkScene)
            uiParkScene.showHelp(!isShow);
    };

    btnPutFish(event) {

    };
}
