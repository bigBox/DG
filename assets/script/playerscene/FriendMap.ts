
const {ccclass, property} = cc._decorator;

@ccclass
export default class FriendMap extends cc.Component {
    makeGoods: any;

    constructor() {
        super();
        this.makeGoods = null;
    };
    @property(cc.Node)
    btnJianLou: cc.Node = null;

   
    onLoad () {

    };
    start () {
        // this.loadMapData();
    };
    onEnable () {
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);
        this.btnJianLou.active = false;

        let self = this;
        let roleInfo = global.Module.PlayerMapData.getRoleInfo();
        if (roleInfo != null) {
            // global.Instance.Log.debug('send roleInfo.roleID ' + roleInfo.roleId.toString());
            global.Instance.MsgPools.send('obstaclesList', { roleId: roleInfo.roleId }, function (msg) {
                self.refalashObstacle();
            });
        }
        global.Instance.Dynamics["FriendMap"] = this;
        let panel = global.Manager.UIManager.getPersistUI('UIProgress');
        if (panel != null){
            panel.setProgress(1, 1);
            // panel.setFinishCall(this.loadMapData.bind(this));
        }
        this.scheduleOnce(function () {
            this.loadMapData();
        }, 0.5);  
        
    };

    onDisable() {
        this.node.off(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);

        global.Module.GameData.setDropInstance(null);
        global.Instance.Dynamics["FriendMap"] = null;
    };
    getFactoryNode() {
        return this.node.getChildByName("ndFactorys");
    };
    //显示隐藏建筑名称
    showFactoryName(isShow) {
        let ndFactorys = this.getFactoryNode().children;
        for (let key in ndFactorys) {
            let curND:any = ndFactorys[key];
            let factoryID = curND.tagEx;
            let factoryClass = global.CommonClass.Functions.getFactoryClassType(factoryID);
            let itemClass = curND.getComponent(factoryClass);
            itemClass.showName(isShow);
        }
    };

    onClickFactory(factoryID) {
        let factory = global.Manager.DBManager.findData("Factory", 'ID', factoryID);
        let roleInfo = global.Module.PlayerMapData.getRoleInfo();

        if (roleInfo == null)
            return false;
        let isFriend = (global.Module.FriendData.getFriend(roleInfo.roleId) != null);
        if (factory.type == 'identify')//鉴定
        {
            if (isFriend) {
                let data = { roleId: roleInfo.roleId };
                global.Instance.MsgPools.send('verifyingQueue', data, function (msg) {
                    global.Module.IdentifyData.setCurRoleID(roleInfo.roleId);
                    global.Manager.UIManager.open('UIIdentifyFriend',null,null);
                });
            }
            else {
                global.CommonClass.UITip.showTipTxt('非好友不能打开鉴定', global.Enum.TipType.TIP_BAD);
            }
        }
        else if (factory.type == 'fishRoom1')   //鱼室
        {
            if (isFriend) {
                let data = { roleId: roleInfo.roleId, type: 1 };
                global.Instance.MsgPools.send('showTable', data, function (msg) {
                    global.Manager.UIManager.open('UIFishRoomFriend',null,null);
                });
            }
            else {
                global.CommonClass.UITip.showTipTxt('非好友不能打开鱼室', global.Enum.TipType.TIP_BAD);
            }
        }
        else if (factory.type == 'specimenRoom1')       //标本
        {
            let data = { roleId: roleInfo.roleId, type: 2 };
            global.Instance.MsgPools.send('showTable', data, function (msg) {
                global.Manager.UIManager.open('UISpecimenFriend',null,null);
            });
        }
        else if (factory.type == 'paintRoom')      //字画
        {
            let data = { roleId: roleInfo.roleId, type: 3 };
            global.Instance.MsgPools.send('showTable', data, function (msg) {
                global.Manager.UIManager.open('UIPanitRoomFriend',null,null);
            });
        }
        else if (factory.type == 'showRoom') //展厅
        {
            let data = { roleId: roleInfo.roleId, type: 0, page: 1 };
            global.Instance.MsgPools.send('showTable', data, function (msg) {
                global.Manager.UIManager.open('UIPreciousFriend',null,null);
            });

        } else if (factory.type == 'guji2') {//精灵
           
        }else if (factory.type == 'collection') {//套装
            global.Instance.MsgPools.send('collectionList', { type: 0, roleId:roleInfo.roleId}, function (msg) {
              
                if (msg.errorID != 0) {
                    return;
                }
                global.Manager.UIManager.open('UICollectionNew', null, function (panel) {
                    if (panel)
                        panel.show();
                });
            }.bind(this));
            

        }
    };

    judagePick(node, touchPoint) {
        let isPick = false;

        if (!node.active)
            return false;

        let itemClass = node.getComponent(global.CommonClass.FactoryBase);
        if (itemClass != null) {
            isPick = itemClass.isPicked(touchPoint);
        }
        else {
            let boundingBox = node.getBoundingBoxToWorld();
            isPick = boundingBox.contains(touchPoint);
        }

        return isPick;
    };

    intellectPick(touchPoint) {
        let ndFactorys = this.node.getChildByName('ndFactorys').children;
        let pickNode = null;

        for (let key in ndFactorys) {
            let curND:any = ndFactorys[key];

            if (this.judagePick(curND, touchPoint)) {
                pickNode = curND;

                let name = curND.getName();
                if (name != 'WorldMapEnter' && name != 'FarmPark')
                    break;
            }
        }

        return pickNode;
    };

    touchEvent(event) {
        if (event.type == cc.Node.EventType.TOUCH_START) {
            let touchPoint = event.touch.getLocation();
            let curND = this.intellectPick(touchPoint);
            if (curND) {
                let factoryID = curND.tagEx;
                this.onClickFactory(factoryID);
            }
        }
    };

    loadMapData() {
        var ndFactorys = this.node.getChildByName('ndFactorys');
        ndFactorys.removeAllChildren();

        let factorys = global.Module.PlayerMapData.getMapData();
        // let roleInfo = global.Module.PlayerMapData.getRoleInfo();
        let loadCount = 0;
        let factoryNum = 0;

        let self = this;

        if (factorys != null) {
            for (let key in factorys) {
                let item = factorys[key];

                let factoryData = global.Manager.DBManager.findData("Factory", 'ID', item.templateID);
                if (factoryData != null && factoryData.scene == 'MainScene') {
                    let filePath = factoryData.prefabFile;
                    ++factoryNum;

                    global.CommonClass.Functions.setCreate(filePath, function (prefab) {
                        if (prefab != null) {
                            let newNode = cc.instantiate(prefab);
                            if (ndFactorys != null)
                                ndFactorys.addChild(newNode, cc.macro.MAX_ZINDEX);

                            newNode.setPosition(item.position.x, item.position.y);
                            newNode.tagEx = parseInt(key);

                            let className = global.CommonClass.Functions.getFactoryClassType(item.templateID);
                            let factoryClass = newNode.getComponent(className);
                            if (factoryData.type == 'bee2')
                                factoryClass.setIsFriend(true);
                            else if (factoryData.type == 'summon1')
                                factoryClass.setIsFriend(true);

                            let isShow = global.Module.GameData.getIsShowFactoryName();
                            factoryClass.showName(isShow);

                            ++loadCount;
                            if (loadCount >= factoryNum)
                                self.onLoadFactoryFinish();
                          
                        }
                        else {
                            global.Instance.Log.debug('filePath',filePath);
                        }
                    });
                }
            }
        }
    };

    onLoadFactoryFinish() {
        let dragLayer = global.CommonClass.DragLayer.getDragLayer('FriendMap');
        dragLayer.scaleItemLayer(0.23);

        this.centerToFactory(7010);

        global.Module.GameData.showTaskHelp();
    };

    centerToFactory(ID) {
        let dragLayer = global.CommonClass.DragLayer.getDragLayer('FriendMap');
        let factory = global.Module.PlayerMapData.getFactory(ID);

        if (factory != null) {
            let scale = dragLayer.getItemScale();
            let position = cc.v2(factory.position.x * scale, factory.position.y * scale);
            dragLayer.setDragItemPosition(position);
        }
    };

    refalashObstacle() {
        let ndObstacles = this.node.getChildByName('ndObstacles').children;
        for (let key in ndObstacles) {
            let obstacle:any = ndObstacles[key];

            let itemClass = obstacle.getComponent(global.CommonClass.ObstacleBase);

            let ID = itemClass.getID();
            let item = global.Module.PlayerMapData.getObstacle(ID);
            obstacle.active = item == null || !item.isOpen;
        }
    };

    onClickJianLou() {
        let roleInfo = global.Module.PlayerMapData.getRoleInfo();
        if (roleInfo != null) {
            // global.Instance.Log.debug('send roleInfo.roleID ' + roleInfo.roleId.toString());
            global.Instance.MsgPools.send('summonPickupInvestReward', { roleId: roleInfo.roleId }, function (msg) {
                this.btnJianLou.active = false;

                if (msg.errorID == 0) {
                    let allItems = [];
                    for (let key in msg.reward.map) {
                        let tmp = msg.reward.map[key];

                        let item = { itemID: tmp.key, itemNum: tmp.value, type: 0 };
                        allItems.push(item);
                    }

                    if (allItems.length > 0) {
                        global.Manager.UIManager.open('DlgCollectDrop', null, function (panel) {
                            panel.show(allItems,"投资");
                        });
                    }
                } else {
                    global.CommonClass.UITip.showTipTxt('已经捡漏过了', global.Enum.TipType.TIP_BAD);
                }

            }.bind(this));
        }
    };
    // update (dt) {}
}
