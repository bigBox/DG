
const { ccclass, property } = cc._decorator;

@ccclass
export default class UICatchGoodsNet extends cc.Component {
    @property({ type: cc.Node, displayName: "ndNext", tooltip: "ndNext" })
    ndNext: cc.Node = null;
    ndDrop: any;
    ndSpine: any;
    ndGame: any;
    moveDirect: any;//移动方向
    moveMent: number;//移动方向
    moveSpeed: number;//移动速度
    flySpeed: number;//飞行速度
    dropSpeed: number;//下降速度
    gameTime: number;//游戏结束时间
    timeUpdate: number;//时间更新
    targetPos: any;
    ndItemPos: any;
    spNext1Pos: any;
    itemType: {};
    decs: any[];
    isInGame: boolean;
    isOver: boolean;
    isFirstUpdate: boolean;
    catchMakes: {};
    ndFly: any;
    spMoveItem: any;
    ndDropItem: cc.Node;
    ndFlyItem: cc.Node;//掉落物品
    ndDirect: cc.Node;
    ndDirLeft: any;
    ndDirRight: any;
    lblDoubleTime: any;
    touchStart: any;
    curPosition: any;
    doubleLeftTime: number;


    startGameShow: boolean;//开始游戏
    speedtime: number;//初速度
    ndLeftNum: number;//主角左边终点
    ndRightNum: number;//主角右边终点
    highNum: number;
    highSpeed: number;
    bloodNum: number;
    constructor() {
        super();
        this.ndDrop = null;
        this.ndSpine = null;
        this.ndGame = null;

        this.moveDirect = global.Enum.Direct.NONE;
        this.moveSpeed = 600;
        this.flySpeed = 150;
        this.dropSpeed = 300;
        this.gameTime = 60;
        this.timeUpdate = 0;
        this.targetPos = null;
        this.ndItemPos = null;
        this.spNext1Pos = null;
        this.itemType = {};
        this.decs = [];
        this.isInGame = false;
        this.isOver = true;
        this.isFirstUpdate = true;
        this.catchMakes = {};


        this.startGameShow = false;
        this.speedtime = 30;
        this.ndLeftNum = 0;
        this.ndRightNum = 1000;
        this.highNum = 0;
        this.highSpeed = 0;
        this.bloodNum = 3;//血量
    }

    start() {

    }

    onLoad() {
        this.ndGame = this.node.getChildByName('ndGame');
        this.ndDrop = this.ndGame.getChildByName('ndDrop');
        this.ndFly = this.ndGame.getChildByName('ndFly');
        this.spMoveItem = this.ndGame.getChildByName('spMoveItem');
        this.ndDropItem = this.node.getChildByName('ndDropItem');
        this.ndFlyItem = this.node.getChildByName('ndFlyItem');
        this.ndDropItem.active = false;
        this.ndFlyItem.active = false;

        this.ndDirect = this.node.getChildByName('ndDirect');
        this.ndDirLeft = this.ndDirect.getChildByName('ndLeft');
        this.ndDirRight = this.ndDirect.getChildByName('ndRight');
        this.ndDirLeft.active = false;
        this.ndDirRight.active = false;

        let ndUp = this.ndDirect.getChildByName('ndUp');
        ndUp.active = true;

        this.lblDoubleTime = this.spMoveItem.getChildByName('lblTime').getComponent(cc.Label);

        this.touchStart = null;
        this.curPosition = null;
        this.doubleLeftTime = 0;

        global.Module.GameData.setDropInstance(null);
    }

    onEnable() {
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
        this.showDlg(false, null, null);
        global.Module.GameData.setMaskSound(true, true);
        global.Instance.AudioEngine.playMusic('minigameback', true, 2);

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);



        let leftNode = this.node.getChildByName('leftNode');
        let jumpbottom = leftNode.getChildByName('jumpbottom');
        let rigthbottom = leftNode.getChildByName('rigthbottom');
        let leftbottom = leftNode.getChildByName('leftbottom');

        jumpbottom.on(cc.Node.EventType.TOUCH_START, this.onDown, this);
        jumpbottom.on(cc.Node.EventType.TOUCH_CANCEL, this.onDown, this);
        jumpbottom.on(cc.Node.EventType.TOUCH_END, this.onDown, this);

        rigthbottom.on(cc.Node.EventType.TOUCH_START, this.onDown, this);
        rigthbottom.on(cc.Node.EventType.TOUCH_CANCEL, this.onDown, this);
        rigthbottom.on(cc.Node.EventType.TOUCH_END, this.onDown, this);

        leftbottom.on(cc.Node.EventType.TOUCH_START, this.onDown, this);
        leftbottom.on(cc.Node.EventType.TOUCH_CANCEL, this.onDown, this);
        leftbottom.on(cc.Node.EventType.TOUCH_END, this.onDown, this);
    };


    onDisable() {
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_START, this.touchEvent, this);

        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        let leftNode = this.node.getChildByName('leftNode');
        let jumpbottom = leftNode.getChildByName('jumpbottom');
        let rigthbottom = leftNode.getChildByName('rigthbottom');
        let leftbottom = leftNode.getChildByName('leftbottom');

        jumpbottom.off(cc.Node.EventType.TOUCH_START, this.onDown, this);
        jumpbottom.off(cc.Node.EventType.TOUCH_CANCEL, this.onDown, this);
        jumpbottom.off(cc.Node.EventType.TOUCH_END, this.onDown, this);

        rigthbottom.off(cc.Node.EventType.TOUCH_START, this.onDown, this);
        rigthbottom.off(cc.Node.EventType.TOUCH_CANCEL, this.onDown, this);
        rigthbottom.off(cc.Node.EventType.TOUCH_END, this.onDown, this);

        leftbottom.off(cc.Node.EventType.TOUCH_START, this.onDown, this);
        leftbottom.off(cc.Node.EventType.TOUCH_CANCEL, this.onDown, this);
        leftbottom.off(cc.Node.EventType.TOUCH_END, this.onDown, this);
        this.startGameShow = false;
        cc.director.getScheduler().unschedule(this.selfUpdate, this);

        let worldMap = global.Instance.Dynamics["WorldMap"];
        if (worldMap) {
            let mainPlayer = worldMap.getMainPlayer();
            global.Module.GameData.setDropInstance(mainPlayer);
        }
        global.Module.GameData.setMaskSound(false, false);
        global.Instance.AudioEngine.stopMusic('minigameback');
    };

    onKeyDown(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.left:
                this.moveMent = global.Enum.Direct.LEFT
                break;
            case cc.macro.KEY.right:
                this.moveMent = global.Enum.Direct.RIGHT
                break;
            case cc.macro.KEY.up:
                // this.moveMent = global.Enum.Direct.UP
                if (this.highSpeed == 0)
                    this.highSpeed = 1;
                break;
            case cc.macro.KEY.down:
                this.moveMent = global.Enum.Direct.DOWN
                break;
            default:
                this.moveMent = global.Enum.Direct.NONE
                break;
        }
    };
    onKeyUp(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.left:
                this.moveMent = global.Enum.Direct.NONE
                break;
            case cc.macro.KEY.right:
                this.moveMent = global.Enum.Direct.NONE
                break;
            case cc.macro.KEY.up:
                // this.moveMent = global.Enum.Direct.NONE
                break;
            case cc.macro.KEY.down:
                // this.moveMent = global.Enum.Direct.NONE
                break;
        }
    };
    onDown(event) {
        let name = event.target.name;
        if (event.type == cc.Node.EventType.TOUCH_START) {

            if (name == 'leftbottom') {
                this.moveMent = global.Enum.Direct.LEFT
            }
            if (name == 'rigthbottom') {
                this.moveMent = global.Enum.Direct.RIGHT
            }
            if (name == 'jumpbottom') {
                if (this.highSpeed == 0)
                    this.highSpeed = 1;
            }

        } else if (event.type == cc.Node.EventType.TOUCH_END || event.type == cc.Node.EventType.TOUCH_CANCEL) {
            if (name == 'leftbottom') {
                this.moveMent = global.Enum.Direct.NONE
            }
            if (name == 'rigthbottom') {
                this.moveMent = global.Enum.Direct.NONE
            }
        }
    };
    enableGameNode(isEnable) {
        if (isEnable) {
            this.ndGame.on(cc.Node.EventType.TOUCH_MOVE, this.touchGameEvent, this);
            this.ndGame.on(cc.Node.EventType.TOUCH_END, this.touchGameEvent, this);
            this.ndGame.on(cc.Node.EventType.TOUCH_CANCEL, this.touchGameEvent, this);
            this.ndGame.on(cc.Node.EventType.TOUCH_START, this.touchGameEvent, this);
        }
        else {
            this.ndGame.off(cc.Node.EventType.TOUCH_MOVE, this.touchGameEvent, this);
            this.ndGame.off(cc.Node.EventType.TOUCH_END, this.touchGameEvent, this);
            this.ndGame.off(cc.Node.EventType.TOUCH_CANCEL, this.touchGameEvent, this);
            this.ndGame.off(cc.Node.EventType.TOUCH_START, this.touchGameEvent, this);
        }
    };
    //开始游戏
    beginGame() {
        let ndMask = this.node.getChildByName('ndMask');
        ndMask.active = false;

        let btnStart = this.node.getChildByName('btnStart');
        btnStart.active = false;


        let ndSmoke = this.spMoveItem.getChildByName('ndSmoke');
        ndSmoke.active = false;

        this.bloodNum = 3;
        this.refBlood();
        this.touchStart = null;
        this.curPosition = null;
        this.doubleLeftTime = 0;

        this.isOver = false;
        this.gameTime = 45;

        this.setInGame(true);

        global.Module.CatchGoodsNetData.clearNeeds();
        this.createFlylist();
        this.resetPan();
    };
    refBlood() {
        for (let i = 1; i <= 3; i++)
            this.spMoveItem.getChildByName('star' + i).active = (this.bloodNum >= i);
    };
    //重置平移
    resetPan() {
        this.spMoveItem.active = true;
        this.spMoveItem.positionX = 0;

        let panL = this.spMoveItem.getChildByName('panL');
        panL.active = false;

        let lblTime = this.spMoveItem.getChildByName('lblTime');
        lblTime.active = false;

    };
    //游戏关闭按钮
    setInGame(isInGame) {
        this.isInGame = isInGame;
    };
    //刷信息
    reflashInfo() {
        this.reflashScore();
        this.reflashMakeItem();
    };
    //分数
    reflashScore() {
        let score = global.Module.CatchGoodsNetData.getScore(true);
        let lblScore = this.ndNext.getChildByName('lblScore').getComponent(cc.Label);

        lblScore.string = score.toString() + '分';
    };

    reflashOtherScore() {
        let leftNode = this.node.getChildByName('leftNode');
        let score = global.Module.CatchGoodsNetData.getScore(false);
        let lblScore = leftNode.getChildByName('ndOther').getChildByName('lblScore').getComponent(cc.Label);
        lblScore.string = score.toString() + '分';
    }

    //左侧
    reflashMakeItem() {
        let dropItems = global.Module.CatchGoodsNetData.getFlyItems();
        for (let i = 0; i < 3; i++) {
            let dropItem = dropItems[i];
            let spNext = this.ndNext.getChildByName('spNext' + (i + 1));
            let meetImageData = global.Manager.DBManager.findData('MeetEggDropItems', 'ID', dropItem.dropItems.dropID);
            let picPath = ''
            global.CommonClass.Functions.setTexture(spNext, '', null);
            picPath = meetImageData.path + meetImageData.picName;
            global.CommonClass.Functions.setTexture(spNext, picPath, null);
        }
    };

    checkIsCatch(ndDropItem) {
        if (ndDropItem != null) {
            let spDropItem = ndDropItem.getChildByName('spItem');
            let spMoveItem = this.ndGame.getChildByName('spMoveItem');

            if (spDropItem != null) {
                let spDropBox = spDropItem.getBoundingBoxToWorld();
                let spMoveItemBox = spMoveItem.getChildByName('ndBox').getBoundingBoxToWorld();

                if (spDropBox.intersects(spMoveItemBox)) {
                    let spDropItemPos = spDropItem.convertToWorldSpaceAR(cc.v2(0, 0));
                    let spMoveItemPos = spMoveItem.convertToWorldSpaceAR(cc.v2(0, 0));

                    return spDropItemPos.y > spMoveItemPos.y;
                }
            }
        }
        return false;
    };
    createFlylist() {
        let MeetData = global.Manager.DBManager.getData('MeetEggGhostData');
        this.ndFly.removeAllChildren();
        for (let i = 0; i < MeetData.length; i++) {
            let data = MeetData[i];
            if (data) {
                let direct = Math.ceil(Math.random() * 2);
                let newItem = cc.instantiate(this.ndFlyItem);
                newItem.name = data.ID.toString();
                this.ndFly.addChild(newItem);
                let targetPos = null;
                let currentPos = newItem.getPosition();
                if (direct == global.Enum.Direct.LEFT) {
                    targetPos = cc.v2(this.ndLeftNum, currentPos.y);
                    currentPos = cc.v2(i * 150 + 100, currentPos.y);
                } else if (direct == global.Enum.Direct.RIGHT) {
                    targetPos = cc.v2(this.ndRightNum, currentPos.y);
                    currentPos = cc.v2(i * 150 + 100, currentPos.y);
                    let scalex = newItem.scaleX;
                    newItem.scaleX = -scalex;
                }

                newItem.setPosition(currentPos);
                newItem.active = true;
                let iconFile = data.path + data.picName;
                let spItem = newItem.getChildByName('flyItem');
                global.CommonClass.Functions.setTexture(spItem, iconFile, function () {
                    spItem.active = true;
                });

                let self = this;
                let callBack = function () {

                    if (direct == global.Enum.Direct.LEFT)
                        direct = global.Enum.Direct.RIGHT;
                    else
                        direct = global.Enum.Direct.LEFT;
                    if (direct == global.Enum.Direct.LEFT) {
                        targetPos = cc.v2(self.ndLeftNum, currentPos.y);
                    } else if (direct == global.Enum.Direct.RIGHT) {
                        targetPos = cc.v2(self.ndRightNum, currentPos.y);
                        let scalex = newItem.scaleX;
                        newItem.scaleX = -scalex;
                    }
                    let position = newItem.getPosition();
                    let distance = targetPos.sub(position).mag();
                    let timeCost = distance / self.flySpeed;

                    let endFunction = cc.callFunc(callBack);
                    let action = cc.moveTo(timeCost, targetPos);
                    let seq = cc.sequence(action, endFunction);
                    newItem.runAction(seq);
                };
                callBack();
            }

        }
    };

    createDropItem(itemID, templateID, positionX) {
        let newItem = cc.instantiate(this.ndDropItem);
        this.ndDrop.addChild(newItem);

        newItem.name = itemID.toString();
        newItem.tagEx = templateID;
        let spItem = newItem.getChildByName('spItem');
        newItem.active = true;

        let newItemY = newItem.getPosition().y;
        let newPosition = cc.v2(positionX, newItemY);
        newItem.setPosition(newPosition);
        
        let meetImageData = global.Manager.DBManager.findData('MeetEggDropItems', 'ID', templateID);
        let picPath = ''
        global.CommonClass.Functions.setTexture(spItem, '', null);
        picPath = meetImageData.path + meetImageData.picName;
        global.CommonClass.Functions.setTexture(spItem, picPath, null);

        let callBack = function () {
            newItem.removeFromParent();
        };

        let ndRight = this.ndGame.getChildByName('ndRight');
        let targetY = ndRight.getPosition().y;
        let runPos = cc.v2(positionX, targetY);

        let distance = runPos.sub(newPosition).mag();
        let timeCost = distance / this.dropSpeed;

        let action = cc.moveTo(timeCost, runPos);
        let endFunction = cc.callFunc(callBack);
        let seq = cc.sequence(action, endFunction);
        newItem.runAction(seq);
    };

    playSmoke()     //1.wait 2.walk
    {
        let smoke = this.spMoveItem.getChildByName('ndSmoke');
        smoke.active = true;

        let delayEnd = function () {
            smoke.active = false;
        };

        let delayAction = cc.delayTime(1);
        let endFunction = cc.callFunc(delayEnd)
        let seq = cc.sequence(delayAction, endFunction);
        smoke.stopAllActions();
        smoke.runAction(seq);
    };
    updateTime(dt) {
        let leftDoubleTime = global.CommonClass.Functions.getLeftTime(this.doubleLeftTime);

        let panL = this.spMoveItem.getChildByName('panL');
        panL.active = leftDoubleTime > 0;

        if (leftDoubleTime > 0)
            this.lblDoubleTime.string = 'X2 ' + global.CommonClass.Functions.formatSeconds(leftDoubleTime);

        this.lblDoubleTime.node.active = leftDoubleTime > 0;

        let lblTime = this.ndNext.getChildByName('lblTime').getComponent(cc.Label);
        let leftTime = global.CommonClass.Functions.getLeftTime(this.gameTime);
        let strTime = global.CommonClass.Functions.formatSeconds(leftTime);
        lblTime.string = strTime;
    };
    //判断是否需要掉落物品
    createDropitem() {

        let dropItem = global.Module.CatchGoodsNetData.popDropItem();
        if (dropItem) {
            let nodeName = dropItem.templateID.toString();
            let ndFlyItem = this.ndFly.getChildByName(nodeName);
            if (ndFlyItem != null) {
                let position = ndFlyItem.getPosition();
                this.createDropItem(dropItem.dropItems.ID, dropItem.dropItems.dropID, position.x);
            }
            global.Module.CatchGoodsNetData.removeFlyItem(dropItem.ID);
            this.reflashMakeItem();
        }
    }
    selfUpdate(dt) {
        //判断是否发生碰撞
        let ndDrops = this.ndDrop.getChildren();
        for (let index in ndDrops) {
            let dropItem = ndDrops[index];
            if (dropItem) {
                if (this.checkIsCatch(dropItem)) {
                    let strID = dropItem.getName();
                    let data = { timeID: strID };
                    dropItem.removeFromParent();

                    let self = this;
                    let templateID = dropItem.tagEx;
                    if (templateID == '100010001' || templateID == '100010002') {
                        if (templateID == '100010001') {
                            this.bloodNum -= 1;
                        } else {
                            this.bloodNum -= 3;
                        }
                        this.refBlood();
                        if (this.bloodNum < 1) {
                            // global.Instance.MsgPools.send('exitMeetEgg', {}, function (msg) {
                            //     if (msg.errorID == 0) {
                            //         self.gameOver(msg.totalScore);
                            //     }
                            // });
                        }
                        global.Instance.AudioEngine.replaySound('bomb', false, null);
                        // return;
                    } else {
                        let goldEgg = 249970001
                        if (templateID == goldEgg) {
                            global.Instance.AudioEngine.replaySound('goldegg', false, null);
                        }
                        else {
                            global.Instance.AudioEngine.replaySound('catchegg', false, null);
                        }
                        global.Module.GameData.openLockSocketOp(false);
                    }



                    let oldMakeID = global.Module.CatchGoodsNetData.getMakeID();

                    global.Instance.MsgPools.send('battleMeetDrop', data, function (msg) {
                        if (msg.errorID == 0) {
                            if (msg.makeID > 0) {
                                self.playSmoke();
                                if (self.catchMakes[oldMakeID] == null)
                                    self.catchMakes[oldMakeID] = 0;
                                self.catchMakes[oldMakeID]++;
                            }
                            self.reflashScore();

                            if (self.decs.length >= 3)
                                self.decs.shift();

                            let decItem: any = {};
                            let item = global.Manager.DBManager.getItemNew(templateID);
                            if (item) {
                                decItem.dec = '接到' + item.name;
                                self.decs.push(decItem);
                            }


                            if (msg.doubleLeftSeconds > 0) {
                                self.doubleLeftTime = global.CommonClass.Functions.getTargetTime(msg.doubleLeftSeconds);
                                global.CommonClass.UITip.showText("积分翻倍", 'ffffff');

                                if (self.catchMakes[templateID] == null)
                                    self.catchMakes[templateID] = 0;
                                self.catchMakes[templateID]++;

                                self.updateTime(0);
                            }
                        }

                        else {
                            global.CommonClass.UITip.showText("接到物品检测不一致" + strID, 'ffff00');
                        }

                        global.Module.GameData.openLockSocketOp(true);
                    });
                }
            }
        }
        this.updatePanMove(dt);
        this.timeUpdate += dt;
        if (this.timeUpdate >= 1) {//每隔一秒加载一次
            this.updateTime(dt);
            this.timeUpdate = 0;
        }
    };



    showDlg(isShow, selfScore, otherScore) {
        let digOver = this.node.getChildByName('digOver');
        if (isShow) {
            selfScore = global.Module.CatchGoodsNetData.getScore(true);
            otherScore = global.Module.CatchGoodsNetData.getScore(false);
            let spSuccess = digOver.getChildByName('spSuccess');
            let spFailed = digOver.getChildByName('spFailed');
            spSuccess.active = selfScore > otherScore;
            spFailed.active = selfScore <= otherScore;
        }
        digOver.active = isShow;
    }



    gameOver(data) {
        cc.director.getScheduler().unschedule(this.selfUpdate, this);
        this.startGameShow = false;
        this.isOver = true;
        this.spMoveItem.active = false;

        this.setInGame(false);
        this.showDlg(true, null, null);

        this.resetPan();
    };

    touchEvent(event) {
        if (this.isInGame) {
            this.touchGameEvent(event);
        }

    };

    touchGameEvent(event) {
        // let touchPoint = event.getLocation();;
        // if (event.type == cc.Node.EventType.TOUCH_START) {
        //     this.touchStart = touchPoint;
        //     this.targetPos = this.ndGame.convertToNodeSpaceAR(touchPoint);
        // }
        // else if (event.type == cc.Node.EventType.TOUCH_END || event.type == cc.Node.EventType.TOUCH_CANCEL) {
        //     this.targetPos = null;
        // }
        // else if (event.type == cc.Node.EventType.TOUCH_MOVE) {
        //     this.targetPos = this.ndGame.convertToNodeSpaceAR(touchPoint);
        // }
    };


    startGame() {
        let posX = Math.floor(this.spMoveItem.getPosition().x);
        let buildID = global.Module.CatchGoodsNetData.getFightBuild();
        let data = { positionX: posX, buildID: buildID };

        let self = this;
        global.Instance.MsgPools.send('startBattleMeetEgg', data, function (msg) {
           global.Instance.Log.debug('startBattleMeetEgg  数据返回',msg)
            if (msg.errorID == 0) {
                global.Module.CatchGoodsNetData.start(self);
                self.gameTime = global.CommonClass.Functions.getTargetTime(self.gameTime);
                self.startGameShow = true;

                cc.director.getScheduler().schedule(self.selfUpdate, self, 0.01, cc.macro.REPEAT_FOREVER, 0, false);
                self.reflashInfo();
                self.setInGame(true);
            }
        });

    };

    runGame() {
        this.beginGame();
        this.startGame();
    };

    btnStartGame() {
        this.runGame();
    };

    btnCloseClick() {
        global.Manager.UIManager.close('UICatchGoods');
    };

    btnPuaseclick() {
        let self = this;
        if (this.isInGame) {
            global.Instance.MsgPools.send('exitBattleMeetEgg', {}, function (msg) {
                if (msg.errorID == 0) {
                    // self.showDlg(true, msg.totalScore);
                }
            });
            this.startGameShow = false;
            cc.director.getScheduler().unschedule(this.selfUpdate, this);
        }
    };


    btnReStart() {
        this.runGame();

        let ndRestart = this.node.getChildByName('ndRestart');
        ndRestart.active = false;
    };
    updatePanMove(dt) {
        // if (this.targetPos != null) {
        if (this.startGameShow) {
            let position = this.spMoveItem.getPosition();
            // let flag = 0;

            // let moveDirect = global.Enum.Direct.NONE;
            // if (this.targetPos.x > position.x) {
            //     flag = 1;
            //     moveDirect = global.Enum.Direct.RIGHT;
            // }
            // else {
            //     flag = -1;
            //     moveDirect = global.Enum.Direct.LEFT;
            // }
                        let moveMent = this.moveMent;
            let moveDirect = global.Enum.Direct.NONE;
            let flag = 0;
            if (moveMent == global.Enum.Direct.RIGHT) {
                flag = 1;
                moveDirect = global.Enum.Direct.RIGHT;
            } else if (moveMent == global.Enum.Direct.LEFT) {
                flag = -1;
                moveDirect = global.Enum.Direct.LEFT;
            }

            if (moveDirect != this.moveDirect) {
                this.moveDirect = moveDirect;

                let posX = parseInt(position.x);
                let data = { positionX: posX, directionX: moveDirect };
                global.Module.GameData.openLockSocketOp(false);
                global.Instance.MsgPools.send('changeMeetX', data, function (msg) {
                    global.Module.GameData.openLockSocketOp(true);
                });
            }

            let minX = this.ndLeftNum;
            let maxX = this.ndRightNum;

          

            // let distance = Math.abs(this.targetPos.x - position.x);
            // let targetX = position.x + flag * 20;
            // if (flag < 0) {
            //     if (targetX < this.targetPos.x)
            //         targetX = this.targetPos.x;
            // }
            // else if (flag > 0) {
            //     if (targetX > this.targetPos.x)
            //         targetX = this.targetPos.x;
            // }

            // if (distance > 5 && targetX > minX && targetX < maxX) {
            //     position.x = targetX;
            //     this.spMoveItem.setPosition(position);
            // }
                {
                    let targetX = position.x + flag * 20;
                    if (targetX < minX)
                        targetX = minX;
                    if (targetX > maxX)
                        targetX = maxX;


                    position.x = targetX;
                    this.spMoveItem.setPosition(position);
                }
        }
    };

    // update(dt) {
    //     if (this.startGameShow) {
    //         let position = this.spMoveItem.getPosition();
    //         let minX = this.ndLeftNum;
    //         let maxX = this.ndRightNum;
    //         let moveMent = this.moveMent;
    //         let moveDirect = global.Enum.Direct.NONE;
    //         let flag = 0;
    //         if (moveMent == global.Enum.Direct.RIGHT) {
    //             flag = 1;
    //             moveDirect = global.Enum.Direct.RIGHT;
    //         } else if (moveMent == global.Enum.Direct.LEFT) {
    //             flag = -1;
    //             moveDirect = global.Enum.Direct.LEFT;
    //         }
    //         if (moveDirect != this.moveDirect) {
    //             this.moveDirect = moveDirect;

    //             let posX = parseInt(position.x);
    //             let data = { positionX: posX, directionX: moveDirect };

    //             global.Module.GameData.openLockSocketOp(false);
    //             global.Instance.MsgPools.send('changeMeetX', data, function (msg) {
    //                 global.Module.GameData.openLockSocketOp(true);
    //             });
    //         }
    //         let targetY = position.y;
    //         if (this.highSpeed == 1) {
    //             this.highNum++;
    //             targetY = position.y + 10;
    //             if (targetY >= -143) {
    //                 this.highNum = 0;
    //                 targetY = -143;
    //                 this.highSpeed = 2;
    //             }
    //         } else if (this.highSpeed == 2) {
    //             this.highNum++;
    //             targetY = position.y - 10;
    //             if (targetY <= -330) {
    //                 this.highNum = 0;
    //                 targetY = -330;
    //                 this.highSpeed = 0;
    //             }
    //         }

    //         let targetX = position.x + flag * 10;
    //         if (targetX < minX)
    //             targetX = minX;
    //         if (targetX > maxX)
    //             targetX = maxX;

    //         // if (position.y < -209) {
    //         //     if (targetX > 592 && targetX < 790) {
    //         //         if (position.x <= 592) {
    //         //             targetX = 592
    //         //         }
    //         //         if (position.x >= 790) {
    //         //             targetX = 790
    //         //         }
    //         //     }
    //         // } else {
    //         //     if (targetX > 593 && targetX < 789) {
    //         //         if (targetY < -209)
    //         //             targetY = -209
    //         //     }
    //         // }
    //         {

    //             position.x = targetX;
    //             position.y = targetY;
    //             this.spMoveItem.setPosition(position);
    //         }
    //     }
    // };
    btnClose() {
        global.Manager.UIManager.close('UICatchGoodsNet');
    };

    btnPuase() {
        let self = this;
        if (this.isInGame) {
            global.Instance.MsgPools.send('exitBattleMeetEgg', {}, function (msg) {
                if (msg.errorID == 0) {
                    self.showDlg(true, msg.captureScore, msg.holdScore);
                }
                else {
                    global.Manager.UIManager.close('UICatchGoodsNet');
                }
            });
            cc.director.getScheduler().unschedule(this.selfUpdate, this);
        }
    };

    btnCloseOver() {
        global.Manager.UIManager.close('UICatchGoodsNet');
    };
}
