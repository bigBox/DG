

const { ccclass, property } = cc._decorator;

@ccclass
export default class UIGuJiList extends cc.Component {
    @property({ type: cc.Node, displayName: "sideleft", tooltip: "sideleft" })
    sideleft: cc.Node = null;
    @property({ type: cc.Node, displayName: "sideright", tooltip: "sideright" })
    sideright: cc.Node = null;
    @property({ type: cc.Label, displayName: "numLabel", tooltip: "numLabel" })
    numLabel: cc.Label = null;
    @property({ type: cc.Node, displayName: "mapNoe", tooltip: "完整地图" })
    mapNoe: cc.Node = null;
    @property({ type: cc.Node, displayName: "nodeMapAnim", tooltip: "碎片地图节点" })
    nodeMapAnim: cc.Node = null;
    @property({ type: cc.Node, displayName: "lblNumNode", tooltip: "lblNumNode" })
    lblNumNode: cc.Node = null;


    @property({ type: cc.Node, displayName: "homeNode", tooltip: "homeNode" })
    homeNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "btnGo", tooltip: "btnGo" })
    btnGo: cc.Node = null;
    @property({ type: cc.Node, displayName: "spChips", tooltip: "spChips" })
    spChips: any = [];
    

    @property({ type: cc.Node, displayName: "nodeMapSel", tooltip: "nodeMapSel" })
    nodeMapSel: cc.Node = null;
    @property({ type: cc.Node, displayName: "spMap", tooltip: "spMap" })
    spMap: cc.Node = null;
    @property({ type: cc.Node, displayName: "lblCount", tooltip: "好友的数量" })
    lblCount: cc.Node = null;
    @property({ type: cc.Node, displayName: "lblCount1", tooltip: "我的数量" })
    lblCount1: cc.Node = null;
    @property({ type: cc.Node, displayName: "lblID", tooltip: "lblID" })
    lblID: cc.Node = null;
    @property({ type: cc.SpriteFrame, displayName: "spriteArr", tooltip: "名字的图片资源" })
    spriteArr:cc.SpriteFrame[] = [];
    @property({ type: cc.Node, displayName: "btnplayLabel", tooltip: "显示隐藏按钮" })
    btnplayNode:cc.Node = null;
    @property({ type: cc.Label, displayName: "btnplayLabel", tooltip: "显示隐藏文字" })
    btnplayLabel:cc.Label = null;

    
    mapID: any;
    mapIDleft: number;
    mapIDrigth: number;
    roleId: any;
    spMaps: any[];
    clickItem: any;
    datas: any;
    playerMapData: any;
    isPlay:boolean;


    constructor(){
        super();
        this.mapID = 0;
        this.spMaps = [];
        this.datas = null;
        this.clickItem = 0;
        this.isPlay = true;
    };
    onLoad() { 
        let panel = global.Manager.UIManager.getPersistUI('UIProgress');
        if (panel != null) {
            panel.show(true);
            panel.setMode(true, 1, null);
            panel.setProgress(0.88, 2);
        }
     };

    start() {
        this.btnplayLabel.string = '显示数量';
    };
    getRoleId() {
        let roleId = global.Module.MainPlayerData.getRoleID();
        let roleInfo = global.Module.PlayerMapData.getRoleInfo();
        let isFriend = false;
        if (roleInfo != null) {
            isFriend = (global.Module.FriendData.getFriend(roleInfo.roleId) != null);
            if (isFriend == true) {
                roleId = roleInfo.roleId;
            }
        }
        return roleId;
    };
    isFriend() {
        let roleId = global.Module.MainPlayerData.getRoleID();
        let isFriend = false;
        if (this.roleId == roleId) {
            isFriend = true;
        }
        return isFriend;
    };
    show(mapID, roleId) {
        this.mapID = mapID;
        global.Proxys.ProxyGuJi.loadPicture(this.mapID);
        this.roleId = roleId;
        let data = { roleId: roleId };
        let isPlay = (roleId == global.Module.MainPlayerData.getRoleID())
        this.homeNode.active = !isPlay;  
        if (isPlay) {
            this.btnplayNode.active = true;
        } else {
            this.btnplayNode.active = false;
        }
        global.Instance.MsgPools.send('playerMapItem', data, function (msg) {
            global.Instance.Log.debug('playerMapItem', msg);
            if (!msg.errorID) {
                this.reflash(msg);
            }
        }.bind(this));
        this.reflashHelp();
    };
    btnPlay(){
        this.isPlay = !this.isPlay;
        this.mapNoe.active = this.isPlay;
        this.nodeMapAnim.active = !this.isPlay;
        this.lblNumNode.active = !this.isPlay;
        if (this.isPlay)
            this.btnplayLabel.string = '显示数量';
        else
            this.btnplayLabel.string = '隐藏数量';
    };
    reflashHelp(){
        //箭头 help 出发
        var data = global.Module.TaskData.getHasAcceptTaskData();
        let helpNode = this.node.getChildByName('HelpNode');
        if (!data || !helpNode)
            return;
        if (data.state == 1 && (data.taskId == 10000 || data.taskId == 10003 || data.taskId == 10010))
            if (helpNode.getChildByName('help'))
                helpNode.getChildByName('help').active = true;
    };
    reflash(data) {
        this.playerMapData = data;
        let datas = global.Manager.DBManager.getData('RobCfg');
        this.mapIDleft = 0;
        this.mapIDrigth = 0;
        if (this.mapID == 1) {
            this.mapIDleft = 4;
            this.mapIDrigth = 2;
            this.sideleft.getChildByName("sprite").getComponent(cc.Sprite).spriteFrame = this.spriteArr[3];
            this.sideright.getChildByName("sprite").getComponent(cc.Sprite).spriteFrame = this.spriteArr[1];
            this.sideleft.getChildByName("numLabel").getComponent(cc.Label).string = data.itemCount.map[4].value;
            this.sideright.getChildByName("numLabel").getComponent(cc.Label).string = data.itemCount.map[2].value;
        } else if (this.mapID == 4) {
            this.mapIDleft = 3;
            this.mapIDrigth = 1;
            this.sideleft.getChildByName("sprite").getComponent(cc.Sprite).spriteFrame = this.spriteArr[2];
            this.sideright.getChildByName("sprite").getComponent(cc.Sprite).spriteFrame = this.spriteArr[0];

            this.sideleft.getChildByName("numLabel").getComponent(cc.Label).string = data.itemCount.map[3].value;
            this.sideright.getChildByName("numLabel").getComponent(cc.Label).string = data.itemCount.map[1].value;
        } else {
            this.mapIDleft = this.mapID - 1;
            this.mapIDrigth = this.mapID + 1;
            this.sideleft.getChildByName("sprite").getComponent(cc.Sprite).spriteFrame = this.spriteArr[this.mapID - 2];
            this.sideright.getChildByName("sprite").getComponent(cc.Sprite).spriteFrame = this.spriteArr[this.mapID];

            this.sideleft.getChildByName("numLabel").getComponent(cc.Label).string = data.itemCount.map[this.mapID - 1].value;
            this.sideright.getChildByName("numLabel").getComponent(cc.Label).string = data.itemCount.map[this.mapID + 1].value;
        }
        this.numLabel.string = data.itemCount.map[this.mapID].value;
        let mapData = datas[this.mapID - 1];
        let RobData = global.Manager.DBManager.findData('RobCfg', 'ID', this.mapID);
        let iconFile = "images/pictrue/items/default";
        if (RobData != null) {
            iconFile = RobData.path + RobData.nameItemID;
            global.CommonClass.Functions.setTextureNew(this.mapNoe, iconFile, function () {
                let panel = global.Manager.UIManager.getPersistUI('UIProgress');
                if (panel != null)
                    panel.setProgress(1, 0.5);
            });
        }
        this.showtype(mapData.ID, this.roleId);
    };
    reflashItems(datas) {
        this.datas = datas;
        for (let i = 0; i < this.spMaps.length; i++) {
            let tmpNode = this.spMaps[i];
            let inputItemId = tmpNode.tagEx;
            let lblNumNode = this.lblNumNode.getChildByName('lblNum'+(i+1));
            if (datas[inputItemId] == null || datas[inputItemId] == undefined) {
                lblNumNode.getComponent(cc.Label).string = "00"
            } else {
                lblNumNode.getComponent(cc.Label).string = datas[inputItemId].value;
            }
        }
    };
    showtype(mapID,roleId) {
        this.mapID = mapID;
        let mapData = global.Manager.DBManager.findData('RobCfg', 'ID', mapID);
        global.Instance.Log.debug('RobCfg', mapData);
        let inputItemId = mapData.inputItemId;
        this.roleId = roleId;
        let itemIds = [];
        this.spMaps = [];
        var sheetsnum = -1
        for (let i = 0; i < this.spChips.length; i++) {
            itemIds.push(inputItemId);
            let tmpNode = this.spChips[i];
            tmpNode.tagEx = inputItemId;
            this.spMaps.push(tmpNode);
            let lblNumNode = this.lblNumNode.getChildByName('lblNum' + (i + 1));
            let lblNum = lblNumNode.getComponent(cc.Label);
            let item = global.Module.PackageData.getItem(inputItemId);
            let path = global.CommonClass.Functions.getItemPicPathNew(inputItemId);
            global.CommonClass.Functions.setTextureNew(tmpNode, path, null);
            if (item == null) {
                lblNum.string = "00";
                sheetsnum = 0
            } else {
                lblNum.string = item.Count;
                if (sheetsnum == -1 || (sheetsnum != -1 && item.Count < sheetsnum))
                    sheetsnum = item.Count
            }
            tmpNode.on(cc.Node.EventType.TOUCH_START, function () {
                this.onClickMap(tmpNode, i);
            }.bind(this));
            inputItemId++;
        }
        let isFriend = this.isFriend();
        this.btnGo.active = isFriend;

        if (isFriend == false) {
            let data = { roleId: roleId, ItemId: itemIds };
            global.Instance.MsgPools.send('itemFriend', data, function (msg) {
                if (!msg.errorID) {
                    for (let key in msg.itemCount.map) {
                        let tmpData = msg.itemCount.map[key];
                        global.Instance.Log.debug('', tmpData);
                    }
                    this.reflashItems(msg.itemCount.map);
                }
            }.bind(this));
            this.mapNoe.active = false;
            this.nodeMapAnim.active = true;
            this.lblNumNode.active = true;
        } else {
            let isPlay = this.isPlay
            this.mapNoe.active = isPlay;
            this.nodeMapAnim.active = !isPlay;
            this.lblNumNode.active = !isPlay;

        }
      
    };

    onClickHideMapSel() {
        this.nodeMapSel.active = false;
    };
    friendBlick(params) {
        let UIFriend = global.Manager.UIManager.get('UIFriend');
        if (UIFriend) {
            UIFriend.move(true);
        } else {
            global.Manager.UIManager.open('UIFriend', null, null);
        }

    };
    onClickMap(sender, mapIdx) {
        if (this.isFriend())
            return;
        let mapData = global.Manager.DBManager.findData('RobCfg', 'ID', this.mapID);
        let inputItemId = mapData.inputItemId + mapIdx;
        this.clickItem = inputItemId;

        this.nodeMapSel.active = true;
        let hasNum = global.Module.PackageData.getItemCount(inputItemId);
        this.lblID.getComponent(cc.Label).string = mapData.name + ((mapIdx + 1) < 10 ? ("0" + (mapIdx + 1)) : (mapIdx + 1));
        this.lblCount1.getComponent(cc.Label).string = hasNum;
        let value = this.playerMapData.itemCount.map[this.mapID].value;
        if (this.datas == null) {
            this.lblCount.getComponent(cc.Label).string = "0";
            this.lblCount.color = cc.color(217,112,101,255)
        } else {
            if (this.datas[inputItemId] == null || this.datas[inputItemId] == undefined) {
                this.lblCount.getComponent(cc.Label).string = "0";
                this.lblCount.color = cc.color(217,112,101,255)
            } else {
                this.lblCount.getComponent(cc.Label).string = this.datas[inputItemId].value;
                if(value>=this.datas[inputItemId].value&&this.datas[inputItemId].value!=0)
                this.lblCount.color = cc.color(217,112,101,255)
                else
                this.lblCount.color = cc.color(64,173,110,255)
            }
        }
        let path =  global.CommonClass.Functions.getItemPicPathNew(inputItemId);
        global.CommonClass.Functions.setTextureNew(this.spMap, path, function () {
            this.spMap.scale = global.CommonClass.Functions.getToscale(this.spMap, 130, 80);
        }.bind(this));
    };

    onClickGo() {
        let state = 1;//global.Proxys.ProxyGuJi.getGuideState();
        let level = global.Module.MainPlayerData.getLevel();
        if (level == 1) {
            if (global.Module.TaskData.growUpTaskID == 10000) {
                state = 2;
            }
        }
        if(this.numLabel.string == "0"){
            global.CommonClass.UITip.showTipTxt('地图碎片不足', global.Enum.TipType.TIP_BAD);
            return;
        }
       
        let mapData = global.Manager.DBManager.findData('RobCfg', 'ID', this.mapID);
        global.Proxys.ProxyGuJi.setMapData(mapData);
        let data = { mapId: this.mapID, enterCondition: state, floor: 1 };
        global.Instance.Log.debug('',data);
        global.Instance.MsgPools.send('robMap', data, function (msg) {
            global.Instance.Log.debug("Response GuJiMapNew", msg);
            if (msg.errorID==0){
                global.Proxys.ProxyWorldMap.setMapID(data.mapId)
                let panel = global.Manager.UIManager.getPersistUI('UIProgress');
                if (panel != null) {
                    panel.showMode(true, 6,mapData);
                }
            }
        });
       
    };
    // 取
    onClickGet() {

        let data = { roleId: this.roleId, ItemId: this.clickItem, Count: -1, ps: "#01" };
        global.Instance.MsgPools.send('itemInteract', data, function (msg) {
            global.Instance.Log.debug('',msg);
            if (!msg.errorID) {
                if (this.datas[this.clickItem] != null && this.datas[this.clickItem] != undefined) {
                    this.datas[this.clickItem].value -= 1;
                }

                this.lblCount.getComponent(cc.Label).string = this.datas[this.clickItem].value;

                let scaleTo1 = cc.scaleTo(0.2, 1.5);
                let scaleTo2 = cc.scaleTo(0.1, 1.0);
                let callback = cc.callFunc(function () {

                }.bind(this));
                let seq = cc.sequence(scaleTo1, scaleTo2, callback);
                this.lblCount.runAction(seq);

                this.reflashItems(this.datas);
            }
        }.bind(this));
    };

    // 送
    onClickSend() {
        let data = { roleId: this.roleId, ItemId: this.clickItem, Count: 1 };
        global.Instance.MsgPools.send('itemInteract', data, function (msg) {
            global.Instance.Log.debug('',msg);
            if (!msg.errorID) {
                if (this.datas[this.clickItem] != null && this.datas[this.clickItem] != undefined) {
                    this.datas[this.clickItem].value += 1;
                }
                this.lblCount.getComponent(cc.Label).string = this.datas[this.clickItem].value;

                let scaleTo1 = cc.scaleTo(0.2, 1.5);
                let scaleTo2 = cc.scaleTo(0.1, 1.0);
                let callback = cc.callFunc(function () {

                }.bind(this));
                let seq = cc.sequence(scaleTo1, scaleTo2, callback);
                this.lblCount.runAction(seq);

                this.reflashItems(this.datas);
            }
        }.bind(this));
    };

    onFriendItemClick(roleId) {
        this.show(this.mapID, roleId);
    };
    onSideClick(event,type){
        if(type == 1)
        this.show(this.mapIDleft, this.roleId);
        else
        this.show( this.mapIDrigth, this.roleId);
    };
    homeclick() {
        this.show(this.mapID, global.Module.MainPlayerData.getRoleID());
    };
    btnClose() {
        global.Manager.UIManager.close('UIFriend');
        global.Manager.UIManager.close('UIGuJiList');
    };

    // update (dt) {}
}
