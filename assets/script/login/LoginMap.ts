const {ccclass, property} = cc._decorator;

@ccclass
export default class LoginMap extends cc.Component {
    
    curSelFactory: any;//拖动建筑
    ndFactorys: any;
    isInAutoStart: boolean;
    touchCount: number;
    beginScale: number;
    animation: boolean;
    ndBalloon: cc.Node;
    curMapScale: number;
    curMapPos: any;
    moveDis: number;

    constructor() {
        super();
        this.curSelFactory = null;
        this.ndFactorys = null;


        this.isInAutoStart = false;
        this.touchCount = 0;

        this.beginScale = 0;
        this.animation = true;

    };

    start() {

    };

    onLoad() {
        this.ndFactorys = this.node.getChildByName('ndFactorys');
        this.ndBalloon =  this.node.getChildByName('ndBalloon');
        this.ndBalloon.active = false;

        this.isInAutoStart = false;

        let ndAnimation = this.node.getChildByName('ndAnimation');
        let ndPerson = ndAnimation.getChildByName('ndPerson');
        ndPerson.active = false;
        global.Instance.Dynamics["LoginMap"] = this;

    };

    onEnable() {
        let panel = global.Manager.UIManager.getPersistUI('UIProgress');
        if (panel != null) {
            panel.setProgress(1, 1);
            panel.setFinishCall(this.onFinishLoading.bind(this));
        }
        global.Module.MainMapData.setMap(this);
        // this.loadMapData();
        this.centerMap();
        global.Manager.UIDlgTipManager.clearTips();
    };

    onDisable() {
        global.Instance.Dynamics["LoginMap"] = null;
    };

 
    //启动云动画
    onFinishLoading() {
        this.animation = false
        this.isInAutoStart = true;

        let panel = global.Manager.UIManager.get('LoginScene');
        if (panel != null)
            panel.playCloudAction();
            
        let delayTime = cc.delayTime(0.8);
        let callback = cc.callFunc(function () {
            this.playBalloonAction(true);
            setTimeout(() => {
                this.autoNearMap(true);
            }, 1000);


        }.bind(this));
        this.node.runAction(cc.sequence(delayTime, callback));

        global.Module.MainMapData.setFristLoad(false);

    };
    //自动移动地图位置
    updateNearMap(dt) {
        let dragLayer = global.CommonClass.DragLayer.getDragLayer('LoginMap');
        let maxScale = 0.8;

        let timeCost = 1;
        let needScale = maxScale - this.beginScale;
        this.curMapScale = this.curMapScale * 1.01;
        if (this.curMapScale >= maxScale)
            cc.director.getScheduler().unschedule(this.updateNearMap, this);
        dragLayer.scaleItemLayer(1.01);
    };
    
    //屏幕缩放比例推进
    autoNearMap(isPlay) {
        let dragLayer = global.CommonClass.DragLayer.getDragLayer('LoginMap');
        this.curMapScale = dragLayer.getMinScale();
        this.curMapPos = dragLayer.getDragItemPosition();
        this.beginScale = this.curMapScale;
        if (isPlay) {
            cc.director.getScheduler().schedule(this.updateNearMap, this, 0.01, cc.macro.REPEAT_FOREVER, 0, false);
        } else {
            cc.director.getScheduler().unschedule(this.updateNearMap, this);
        }
    };
    //自动更新地图距离
    updateFarMap(dt) {
        let dragLayer = global.CommonClass.DragLayer.getDragLayer('LoginMap');
        let minScale = 0.355;

        let timeCost = 2;
        let needScale = this.beginScale - minScale;
        let addScale = dt / timeCost * needScale;
        if (this.curMapScale <= minScale) {
            this.curMapPos = dragLayer.getDragItemPosition();
            cc.director.getScheduler().unschedule(this.updateFarMap, this);

        }
        else {
            this.curMapScale -= addScale;
            dragLayer.setLayerScale(this.curMapScale);
        }
    };

    autoFarMap(isPlay) {
        let dragLayer = global.CommonClass.DragLayer.getDragLayer('LoginMap');
        this.curMapScale = dragLayer.getItemScale();
        this.curMapPos = dragLayer.getDragItemPosition();

        this.beginScale = this.curMapScale;
        if (isPlay) {
            this.movePosition(-100, -288);
            cc.director.getScheduler().schedule(this.updateFarMap, this, 0.01, cc.macro.REPEAT_FOREVER, 0, false);
        } else
            cc.director.getScheduler().unschedule(this.updateFarMap, this);
    };
    //移动到指定坐标地图
    centerToFactoryByTableID(templateID) {
        let dragLayer = global.CommonClass.DragLayer.getDragLayer('LoginMap');
        let factory = global.Manager.DBManager.findData('Factory', 'ID', templateID);

        if (factory != null) {
            let scale = dragLayer.getItemScale();
            let position = cc.v2(factory.x * scale, factory.y * scale);
            dragLayer.setDragItemPosition(position);
        }
    };
    //是否可以移动地图
    lockMove(isLock) {
        let dragLayer = this.node.parent.parent.getComponent('DragLayer');
        dragLayer.lockMove(isLock);
    };
    //遍历大厅建筑
    loadMapData() {
        let factorys = global.Module.MainMapData.getFactorys();
        let factoryNum = 0;
        let self = this;
        if (factorys != null) {
            this.ndFactorys.removeAllChildren();
            let loadCount = 0;
            for (let key in factorys) {
                if (key != null) {
                    let item = factorys[key];
                    let loadCallBack = function (ID) {
                        ++loadCount;
                        if (loadCount >= factoryNum)
                            self.onLoadFactoryFinish();
                    }

                    if (this.createFactory(item, loadCallBack))
                        ++factoryNum;
                }
            }
        }
    };
    //地图移动到指定位置大小
    centerMap() {
        let dragLayer = global.CommonClass.DragLayer.getDragLayer('LoginMap');
        dragLayer.setDragItemPosition(cc.v2(0, 960));
        dragLayer.scaleItemLayer(0.3);
    };
   
    //便利大厅结束后关闭云动画关闭进度条
    onLoadFactoryFinish() {
        this.centerMap();
        global.Proxys.ProxyNewFactory.setFactoryData();


    };
    //加载气球动画
    playBalloonAction(isPlay): void {
        this.ndBalloon.active = isPlay;
        if (isPlay == false)
            return;

        let self = this;
        let delay = cc.delayTime(3);
        let onDelayEnd = function () {
            self.playHouseAction(true);
            self.autoNearMap(false);
            self.autoFarMap(true);
        }
        let endFun = cc.callFunc(onDelayEnd);
        let seq = cc.sequence(delay, endFun);
        this.node.stopAllActions();
        this.node.runAction(seq);
        let ndAnimation = this.node.getChildByName('ndAnimation');
        let ndPerson = ndAnimation.getChildByName('ndPerson');
        let position = ndPerson.getPosition();
        let dragLayer = global.CommonClass.DragLayer.getDragLayer('MainMap');
        if (dragLayer) {
            let worldPos = ndPerson.convertToWorldSpaceAR(cc.v2(0, 0));
            dragLayer.getPostion(worldPos);
        }


        let flyOutEnd = function () {
            self.ndBalloon.active = false;
        };
        {
            let ndBalloon = self.ndBalloon.getChildByName('ndBalloonIn1');
            ndBalloon.active = true;
            ndBalloon.setPosition(position);
            let skeletonIn = ndBalloon.getComponent(sp.Skeleton);
            skeletonIn.loop = false;
            skeletonIn.paused = false;
            skeletonIn.animation = "reqiqiu";
            skeletonIn.setCompleteListener(flyOutEnd);
        }
    };
    //气球落下后让人物地图是否显示
    playHouseAction(isPlay): void {
        let ndAnimation = this.node.getChildByName('ndAnimation');
        let ndPerson = ndAnimation.getChildByName('ndPerson');
        ndPerson.active = false;
        if (isPlay)
            cc.tween(ndPerson)
                .call(function () {
                    ndPerson.active = isPlay;
                }.bind(this))
                .delay(2)
                .call(function () {
                    this.isInAutoStart = false;
                }.bind(this))
                .to(2, { opacity: 0 })
                .call(function () {
                    ndPerson.active = false;
                    ndPerson.opacity = 255;
                }.bind(this))
                .start()
    };
    //移动结束打开引导
    stopAutoMoveMap() {
        global.Instance.Log.debug('------------------stopAutoMoveMap', this.isInAutoStart)
        if (this.isInAutoStart) {
            this.playBalloonAction(false);

            this.isInAutoStart = false;
        }
        let dragLayer = global.CommonClass.DragLayer.getDragLayer('LoginMap');
        dragLayer.lockMove(false);
    };
    //设置移动地图位置
    movePosition(endX,endY): void {
        let dragLayer = global.CommonClass.DragLayer.getDragLayer('LoginMap');
        let startX = dragLayer.getDragItemPosition().x;
        let startY = dragLayer.getDragItemPosition().y;
        let dtX = endX - startX;
        let dtY = endY - startY;
        this.scheduleOnce(function () {
            this.isInAutoStart = true
            this.stopAutoMoveMap();
        }, 0.5);
        dragLayer.lockMove(true);
        dragLayer.delayMove(dtX, dtY, 0.5, function () {
            dragLayer.lockMove(false);
        }.bind(this));

        this.animation = true
    };
    //显示隐藏建筑名称
    showFactoryName(isShow) {
        let ndFactorys = this.getFactoryNode().children;
        for (let key in ndFactorys) {
            let curND = ndFactorys[key];
            let factoryID = curND.tagEx;

            let factoryClass = global.CommonClass.Functions.getFactoryClassType(factoryID);
            let itemClass = curND.getComponent(factoryClass);

            itemClass.showName(isShow);

        }
    };
    //建筑置灰
    refalashState() {
        let factorys = this.ndFactorys.children;
        for (let key in factorys) {
            let factory = factorys[key];
            let factoryClass = factory.getComponent(global.CommonClass.FactoryBase);
            let ID = factoryClass.getID();
            let factoryData = global.Manager.DBManager.findData("Factory", 'ID', ID);
            let level = global.Module.MainPlayerData.getLevel();
            factoryClass.setGray(factoryData.levelRequire > level);//建筑等级限制置灰
            if (level != 0)
                factoryClass.setGray(factoryData.levelRequire > level);
        }
    };
 
    //加载建筑
    createFactory(item: any, callback: any) {
        let self = this;
        let ID = item.templateID;

        let factoryData = global.Manager.DBManager.findData("Factory", 'ID', ID);

        if (factoryData != null && factoryData.type == 'makeGoods')  //制作
        {
           
            this.reflashPickItem(ID, null);
        }

        if (factoryData == null) {
            return false;
        }

        if (factoryData.scene != 'MainScene') {
            return false;
        }

        let filePath = factoryData.prefabFile;
        cc.loader.loadRes(filePath, function (err, prefab) {
            if (err == null) {
                let newNode = cc.instantiate(prefab);
                newNode.tagEx = ID;
                if (self.ndFactorys != null)
                    self.ndFactorys.addChild(newNode);
                newNode.setPosition(item.position.x, item.position.y);


                let level = global.Module.MainPlayerData.getLevel();
                if (global.Instance.Socket.isConnected())
                    newNode.active = factoryData.showLevel <= level;

                let factoryClass = newNode.getComponent(global.CommonClass.FactoryBase);
                factoryClass.setID(ID);

                let isShow = global.Module.GameData.getIsShowFactoryName();
                factoryClass.showName(isShow);
               
                let zOrder =  parseInt((((item.y + 2500) / 10)+((item.x + 2500) / 10)).toString());
                newNode.zIndex = zOrder;

                if (factoryData.type == 'paintRoom')
                    newNode.active = false;
            }
            else {
                global.Instance.Log.debug('', err.toString());
            }

            if (callback)
                callback(ID);
        }.bind(this));

        return true;
    };
    //加载指定建筑
    getFactoryByName(name) {
        let ndFactorys = this.getFactoryNode().children;
        for (let key in ndFactorys) {
            let curND = ndFactorys[key];
            let factoryName = curND.getName();

            if (factoryName == name) {
                let factoryTempID = curND.tagEx;
                let factoryClass = global.CommonClass.Functions.getFactoryClassType(factoryTempID);
                return curND.getComponent(factoryClass);
            }
        }

        return null;
    };
    //通过ID获取建筑
    getFactoryClassByTempID(factoryTempID) {
        let factorys = global.Module.MainMapData.getFactorys();
        let ndFactorys = this.getFactoryNode().children;
        for (let key in ndFactorys) {
            let curND = ndFactorys[key];
            let ID = curND.tagEx;

            let facotryData = factorys[ID];
            if (facotryData != null && facotryData.templateID == factoryTempID) {
                let factoryClass = global.CommonClass.Functions.getFactoryClassType(factoryTempID);
                let itemClass = curND.getComponent(factoryClass);
                return itemClass;
            }
        }

        return null;
    };
    //通过id确定点击建筑
    getFactoryClassByID(factoryID) {
        let ndFactorys = this.getFactoryNode().children;
        for (let key in ndFactorys) {
            let curND = ndFactorys[key];
            let ID = curND.tagEx;

            if (ID == factoryID) {
                let factoryClass = global.CommonClass.Functions.getFactoryClassType(factoryID);
                let itemClass = curND.getComponent(factoryClass);

                return itemClass;
            }
        }

        return null;
    };
    //获取建筑列表
    getFactoryNode() {
        return this.ndFactorys;
    };
    //制作好的物品
    reflashPickItem(factoryID, pickItems) {
        let itemClass = this.getFactoryClassByID(factoryID);
        if (itemClass != null) {
            itemClass.reflashPickItem(pickItems);
        }
    };


   
   
    //拖拽事件
    onDragEvent(event) {
        if (!this.animation)
            return;
        if (event == null || event.touch == null)
            return;
        let length = event.getTouches().length;
       
        if (length >= 2) {
            this.lockMove(false);

        }

        if (event.type == cc.Node.EventType.TOUCH_START) {
            if (length >= 2)
                this.touchCount = length;
            else
                this.touchCount = 0;
        }

        if (this.touchCount <= 0) {
            //处理建筑内部鼠标逻辑
           
        }
        else {
            if (event.type == cc.Node.EventType.TOUCH_END || event.type == cc.Node.EventType.TOUCH_CANCEL)
                this.touchCount--;
        }

    }

    onRotateX(event) {
        if (this.curSelFactory != null) {
            let spFactory = this.curSelFactory.getChildByName('spFactory');
            let scaleX = spFactory.scaleX || 1;
            spFactory.scaleX = -scaleX;
        }
    };

}
