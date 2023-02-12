

const { ccclass, property } = cc._decorator;

@ccclass
export default class WorldMap extends cc.Component {
    mapSize: any;
    mainPlayer: any;
    isMoveMap: boolean;
    lockOp: boolean;
   
    

    ndLeg: cc.Node;
    startClick: boolean;
    startClickTime: number;
    endClickTime: number;
    longSubTime: number;
    doubleSubTime: number;
    clickTime: any;
    state: number;
    clickStartPos: any;
    constructor() {
        super();
        this.mapSize = null;
        this.mainPlayer = null;
        this.isMoveMap = false;
        this.lockOp = false;
       

        this.clickStartPos = null;
        this.doubleSubTime=400;//ms
        this.longSubTime=600;
        this.startClick=false;
        this.clickTime=0;
        this.startClickTime=0;
        this.endClickTime=0;
    };

    onLoad() {
        global.Instance.Dynamics["WorldMap"] = this;

        global.Proxys.ProxyWorldMap.setMap(this);
        let mapID = global.Proxys.ProxyWorldMap.getMapID();
        this.mainPlayer = this.node.getChildByName('mainPlayer');
        if (mapID != -1) {
            let targetNode = this.node.getChildByName("house" + mapID);
            this.mainPlayer.x = targetNode.x;
            this.mainPlayer.y = targetNode.y;
            global.Proxys.ProxyWorldMap.setMapID(-1);
        }
        
        let panel = global.Manager.UIManager.getPersistUI('UIProgress');
        if (panel != null)
            panel.setProgress(1, 0.4);

    };

    start() {

    }
    onEnable() {

        this.refalshEnters();
        let dragLayer = global.CommonClass.DragLayer.getDragLayer('WorldMap');
        this.scheduleOnce(function () {
            let miniScale = dragLayer.getMinScale();
            dragLayer.scaleItemLayer(miniScale);
        }, 0.02);

        global.Module.GameData.setDropInstance(this.mainPlayer);
        let self = this;
        this.node.on('onPlantClick', function (event) {
            self.onPlantClick();
        });

        this.node.on('onFishClick', function (event) {
            self.onFishClick();
        });

        this.node.on('onFrogClick', function (event) {
            self.onFrogClick();
        });

        global.Manager.UIDlgTipManager.clearTips();


        global.Module.GameData.showTaskHelp();


        global.Module.MainPlayerData.lockDrop(true);
        this.movePosition();

        this.reflashHelp();
    };
    reflashHelp() {
        //箭头 help1 塞外江南 help2 茶马古道 help3 苏州府 help4 上海滩
        var data = global.Module.TaskData.getHasAcceptTaskData();
        let helpNode = this.node.getChildByName('HelpNode');
        if (!data || !helpNode)
            return;
        if (data.state == 1 && (data.taskId == 10000))
            if (helpNode.getChildByName('help1'))
                helpNode.getChildByName('help1').active = true;
        if (data.state == 1 && (data.taskId == 10003))
            if (helpNode.getChildByName('help2'))
                helpNode.getChildByName('help2').active = true;
        if (data.state == 1 && (data.taskId == 10023))
            if (helpNode.getChildByName('help3'))
                helpNode.getChildByName('help3').active = true;
        if (data.state == 1 && (data.taskId == 10015))
            if (helpNode.getChildByName('help4'))
                helpNode.getChildByName('help4').active = true;
    };
    movePosition() {
        let dragLayer = global.CommonClass.DragLayer.getDragLayer('WorldMap');
        let startX = dragLayer.getDragItemPosition().x;
        let startY = dragLayer.getDragItemPosition().y;
        let endX = -90;
        let endY = -0;
        global.Instance.Log.debug('', dragLayer.getDragItemPosition())
        let dtX = endX - startX;
        let dtY = endY - startY;


        dragLayer.delayScale(1.15, 1, function () {
            dragLayer.delayMove(dtX, dtY, 0.5, function () {
            }.bind(this));
        }.bind(this));
    };

    onDisable() {
        this.node.off('onPlantClick');
        this.node.off('onFishClick');
        this.node.off('onFrogClick');

        global.Instance.Dynamics["WorldMap"] = null;
        global.Proxys.ProxyWorldMap.setMap(null);
        global.Module.MainPlayerData.lockDrop(false);
    };

    reflashFactoryGuide(factoryID, isGuideStart) {
        let ndEnters = this.node.getChildByName("ndEnters").children;
        for (let key in ndEnters) {
            let curND: any = ndEnters[key];

            let userData = curND.getComponent(global.CommonClass.UserData);
            let templateID = userData.iData;

            if (templateID == factoryID) {
                let factoryClass = global.CommonClass.Functions.getFactoryClassType(templateID);
                let itemClass = curND.getComponent(factoryClass);

                //  let needGuide = global.Proxys.ProxyFactoryGuide.getNeedShowGuide(templateID);
                if (isGuideStart) {
                    itemClass.createHelp(function (item) {
                        item.setIconOffset(cc.v2(-0, 50));
                        item.setIconScale(0.4);
                    });
                }
                else {
                    itemClass.removeHelp();
                }
            }
        }
    };

    updatePlant(dt) {

    };

    refalshEnters() {
        let ndEnters = this.node.getChildByName("ndEnters").children;
        for (let key in ndEnters) {
            let curND: any = ndEnters[key];

            let userData = curND.getComponent(global.CommonClass.UserData);
            let templateID = userData.iData;

            let needShow = global.Proxys.ProxyFactoryGuide.getNeedShow(templateID);
            curND.active = needShow;
        }
    };

    update(dt) {
        this.updatePlant(dt);
    };

    centerToNode(nodeName) {
        let nodeNames = nodeName.split('/');

        let curNode = this.node;
        for (let key in nodeNames) {
            let vaule = nodeNames[key];
            curNode = curNode.getChildByName(vaule);
        }

        let dragLayer = global.CommonClass.DragLayer.getDragLayer('WorldMap');
        let position = cc.v2(curNode.getPosition());
        dragLayer.setDragItemPosition(position);
    };

    playPlayerAction(name, isLoop, callBack, isInWater, playerIdx) {
        let mainPlayer = this.mainPlayer;

        let playClass = mainPlayer.getComponent(global.CommonClass.MoveObject);
        playClass.play(name, isLoop, callBack);

        if (name != 'daiji')
            global.Instance.AudioEngine.replaySound('diger', false, 5);
    };

    gotoTarget(targetPos, callback) {
        this.lockOp = true;

        this.mainPlayer.active = true;
        let distance = targetPos.sub(this.mainPlayer.getPosition()).mag();
        if(distance == 0||this.state == 2){
            this.mainPlayer.x = targetPos.x;
            this.mainPlayer.y = targetPos.y
            if (callback) {
                callback();
            }
            return;
        }

       
        let actions = [];
        actions.push(cc.fadeOut(0.25));
        actions.push(cc.callFunc(function () {
            this.mainPlayer.x = this.ndLeg.x;
            this.mainPlayer.y = this.ndLeg.y;
        }.bind(this)));
        actions.push(cc.fadeIn(0.25));
        actions.push(cc.callFunc(function () {
            let playClass = this.mainPlayer.getComponent(global.CommonClass.MoveObject);
            playClass.play("zoulu", true, null);
            playClass.setSpeed(600);
            playClass.moveTo(targetPos, function () {
                playClass.play('daiji', true);
                this.lockOp = false;
                if (callback) {
                    callback();
                }
            }.bind(this));
        }.bind(this)));
        this.mainPlayer.runAction(cc.sequence(actions));
    };


    getMainPlayer() {
        return this.mainPlayer;
    };

    randPickItem(btnPick) {
        if (btnPick == null)
            return false;

        let parent = btnPick.getParent().getParent();
        // let userData = parent.getComponent(global.CommonClass.UserData);
        //let flag = userData.iData;

        let ndRands = parent.getChildByName('ndRands').getChildren();

        let freeRands = new Array();
        for (let key in ndRands) {
            let ndRand = ndRands[key];
            let isFree = ndRand.tagEx;
            if (isFree)
                freeRands.push(ndRand);
        }

        if (freeRands.length > 0) {
            let randNum = freeRands.length;
            let idx = Math.floor(Math.random() * randNum);
            let ndRand = freeRands[idx];

            //当前的随机点设置成不被占用
            let randPos = ndRand.getPosition();
            btnPick.setPosition(randPos);
            ndRand.tagEx = false;

            //把之前的随机节点变自由的
            let useNumber = btnPick.tagEx;
            let ndUseRand = parent.getChildByName('ndRands').getChildByName(useNumber.toString());
            if (ndUseRand != null)
                ndUseRand.tagEx = true;

            //设置当前占用的随机点
            let ndName = ndRand.getName();
            let number = parseInt(ndName);
            btnPick.tagEx = number;

            return true;
        }
        else {
            return false;
        }
    };
    //通过ID获取建筑
    getFactoryClassByTempID(templateID) {
        let ndEnters = this.node.getChildByName("ndEnters").children;
        for (let key in ndEnters) {
            let curND: any = ndEnters[key];

            let factoryClass = global.CommonClass.Functions.getFactoryClassType(templateID);
            let itemClass = curND.getComponent(factoryClass);

            let userData = curND.getComponent(global.CommonClass.UserData);
            if (userData.iData == templateID)
                return itemClass;
        }

        return null;
    };
    //显示隐藏建筑名称
    showFactoryName(isShow) {
        let ndEnters = this.node.getChildByName("ndEnters").children;
        for (let key in ndEnters) {
            let curND: any = ndEnters[key];
            let factoryID = curND.tagEx;

            let factoryClass = global.CommonClass.Functions.getFactoryClassType(factoryID);
            let itemClass = curND.getComponent(factoryClass);

            itemClass.showName(isShow);
        }
    };


    enterRoom(touchPoint) {
        if(this.node){
            let ndEnters = this.node.getChildByName("ndEnters").children;
            for (let k in ndEnters) {
                let curND: any = ndEnters[k];
                let userData = curND.getComponent(global.CommonClass.UserData);
    
                let boundingBox = curND.getBoundingBoxToWorld();
                if (curND.active && boundingBox.contains(touchPoint)) {
                    global.Proxys.ProxyFactoryGuide.setCurFactoryID(userData.iData);
                    this.pickRoom(userData.iData);
                    this.lockOp = false;
                    return true;
                }
            } 
        }
        return false;
    };

    pickRoom(factoryID) {
        let roleId = global.Module.MainPlayerData.getRoleID();
        let factory = global.Manager.DBManager.findData("Factory", 'ID', factoryID)
        let level = global.Module.MainPlayerData.getLevel();
        global.Instance.Log.debug('', factory)
        if (factory.levelRequire > level) {
            global.CommonClass.UITip.showTipTxt('功能将在' + factory.levelRequire.toString() + '级开放', global.Enum.TipType.TIP_BAD);
            this.lockOp = false;

            return false;
        } else {
            if (factory.type == "citys") {
                this.ndLeg = this.node.getChildByName('ndLegs5'); 
                let targetNode = this.node.getChildByName("nodeCitysPos1");
                let targetPos = targetNode.getPosition();
               
                this.gotoTarget(targetPos, function () {
                    // global.Instance.MsgPools.send('npcList', { cityID: 1001 }, function (msg) {
                        global.Module.TownMapData.loadScene(1001);
                    // });
                }.bind(this));
            }
            else if (factory.type == 'outsizetree'
                || factory.type == 'outsidefarm'
                || factory.type == 'outsideship'
                || factory.type == 'outsizetrap'
                || factory.type == 'outsideshop'
            ) {

            } else if (factory.type == "house1") {
                let targetNode = this.node.getChildByName("house1");
                this.ndLeg = this.node.getChildByName('ndLegs1'); 
                let targetPos = targetNode.getPosition();
                this.gotoTarget(targetPos, function () {
                    global.Manager.UIManager.open('UIGuJiList', null, function (panel) {
                        if (panel)
                            panel.show(1, roleId);
                    });
                }.bind(this));
               

            } else if (factory.type == "house2") {
                let targetNode = this.node.getChildByName("house2");
                this.ndLeg = this.node.getChildByName('ndLegs2'); 
                let targetPos = targetNode.getPosition();
                this.gotoTarget(targetPos, function () {
                    global.Manager.UIManager.open('UIGuJiList', null, function (panel) {
                        if (panel)
                            panel.show(2, roleId);
                    });
                }.bind(this));
            } else if (factory.type == "house3") {
                if (this.ndLeg && this.ndLeg.name == 'ndLegs4')
                    this.ndLeg = this.node.getChildByName('ndLegs3X');
                else
                    this.ndLeg = this.node.getChildByName('ndLegs3');
                let targetNode = this.node.getChildByName("house3");
                let targetPos = targetNode.getPosition();
                this.gotoTarget(targetPos, function () {
                    global.Manager.UIManager.open('UIGuJiList', null, function (panel) {
                        if (panel)
                            panel.show(3, roleId);
                    });
                }.bind(this));
            } else if (factory.type == "house4") {
                this.ndLeg = this.node.getChildByName('ndLegs4'); 
                let targetNode = this.node.getChildByName("house4");
                let targetPos = targetNode.getPosition();
                this.gotoTarget(targetPos, function () {
                    global.Manager.UIManager.open('UIGuJiList', null, function (panel) {
                        if (panel)
                            panel.show(4, roleId);
                    });
                }.bind(this));
            }
            else if (factory.type == "citys1") {
                this.ndLeg = this.node.getChildByName('ndLegs5'); 
                let targetNode = this.node.getChildByName("nodeCitysPos2");
                let targetPos = targetNode.getPosition();
                this.gotoTarget(targetPos, function () {
                        global.Module.TownMapData.loadScene(1002);
                }.bind(this));
            } else {
            }
        }
    };
    onPlantClick() {
        global.CommonClass.UITip.showTipTxt('点中植物', null);
    };

    onFishClick() {
        global.CommonClass.UITip.showTipTxt('点中鱼', null);
    };

    onFrogClick() {
        global.CommonClass.UITip.showTipTxt('点中青蛙', null);
    };

    onDragEvent(event) {
        let touchPoint = event.getLocation();
        if (event.type == cc.Node.EventType.TOUCH_START) {
            this.clickStartPos = touchPoint;
            this.isMoveMap = false;
            this.startClick=true;
            this.startClickTime=new Date().getTime();
            return;


        } else if (event.type == cc.Node.EventType.TOUCH_MOVE) {
            let distance = touchPoint.sub(this.clickStartPos).mag();
            if (distance > 5)
                this.isMoveMap = true;
        } else if (event.type == cc.Node.EventType.TOUCH_END || event.type == cc.Node.EventType.TOUCH_CANCEL) {
            // if (this.lockOp) {
            //     global.CommonClass.UITip.showTipTxt('正在探险中', global.Enum.TipType.TIP_BAD);
            // } else if (!this.isMoveMap) {

            //     this.enterRoom(touchPoint);
            // }

            this.endClickTime=new Date().getTime();
            if(this.endClickTime-this.startClickTime>this.longSubTime){
                //长按事件
                this.state = 0;
                this.enterRoom(touchPoint);
                this.startClick=false;
            }else if(this.endClickTime-this.startClickTime<this.doubleSubTime){
                //点击事件
                this.clickTime++;
                setTimeout(()=>{
                    if(this.clickTime==1){
                        //单击
                        this.state = 1;
                    }else if(this.clickTime==2){
                        //双击
                        this.state = 2;
                    }
                    this.enterRoom(touchPoint);
                   this.clickTime=0;
                },this.doubleSubTime)
            }

        }
    };

    // update (dt) {}
}
