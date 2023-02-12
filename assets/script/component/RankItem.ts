
const { ccclass, property } = cc._decorator;
@ccclass
export default class RankItem extends cc.Component {
    titleDec: { 1: string; 2: string; 3: string; 4: string; };
    data: any;

    constructor() {
        super();
        this.titleDec = { 1: '新手', 2: '收藏达人', 3: '收藏专家', 4: '收藏大师' };

    };

    static create(randkData, parent, position) {
        let filePath = "prefab/component/RankItem";
        cc.loader.loadRes(filePath, function (err, prefab) {
            if (err == null) {
                let newNode = cc.instantiate(prefab);
                // let parent =  cc.CommonClass.Functions.getRoot();
                parent.addChild(newNode, cc.macro.MAX_ZINDEX);
                newNode.setPosition(position);
                newNode.tagEx = randkData.ID;

                let itemClass = newNode.getComponent(RankItem);
                itemClass.setData(randkData);
            }
        });
    }

    // use this for initialization
    onLoad() {


    };

    setData(rankData) {
        //{ID,  index, name, level, head, fortune, isOnline, findNum, perfectNum, ownerNum}
        if (rankData != null) {
            this.data = rankData;

            let lblIndex = this.node.getChildByName('lblIndex');
            let lblName = this.node.getChildByName('lblName');
            let lblFortune = this.node.getChildByName('lblFortune');
            let lblTitle = this.node.getChildByName('lblTitle');
            let spSelfBack = this.node.getChildByName('selfBack');
            let lblLevel = this.node.getChildByName('lblLevel');

            let name = rankData.roleInfo.roleName;
            let nameLen = rankData.roleInfo.roleName.length;
            if (nameLen > 6)
                name = rankData.roleInfo.roleName.substr(0, 4);
            lblName.getComponent(cc.Label).string = name;

            lblFortune.getComponent(cc.Label).string = global.CommonClass.Functions.formatMoney(rankData.roleInfo.showTable * 10000);
            lblLevel.getComponent(cc.Label).string = rankData.roleInfo.level.toString() + '级';

            let index = (rankData.order);
            lblIndex.getComponent(cc.Label).string = index.toString();


            let honorData = global.Manager.DBManager.findData('ReputationLevel', 'Id', rankData.roleInfo.reputationLevel);
            if (honorData != null)
                lblTitle.getComponent(cc.Label).string = honorData.name;

            let roleID = rankData.roleInfo.roleId;
            let mainRoleID = global.Module.MainPlayerData.getRoleID();
            let isSelf = (roleID == mainRoleID);
            if (spSelfBack != null)
                spSelfBack.active = isSelf;

            this.node.tagEx = roleID;
        }
    };

    getData() {
        return this.data;
    };

    setMode(mode)  //7.馆藏模式 8.声望模式 9.等级模式 3.好友申请
    {
        let lblFortune = this.node.getChildByName('lblFortune');
        let lblTitle = this.node.getChildByName('lblTitle');
        let lblLevel = this.node.getChildByName('lblLevel');
        let lbltitle2 = this.node.getChildByName('lbltitle2');
        
        lblFortune.active = mode == 7;
        lblTitle.active = mode == 8;
        lblLevel.active = mode == 9;
        if (mode == 7)
            lbltitle2.getComponent(cc.Label).string = '资产';
        else
            lbltitle2.getComponent(cc.Label).string = '等级';
    };

    btnRankItemClick(event, arg) {
        let evt = new cc.Event.EventCustom('onRankItemClick', true);
        evt.setUserData(this);
        this.node.dispatchEvent(evt);
    };

    btnAddFriendClick(event, arg) {
        let isAdd = parseInt(arg) != 0;
        if (isAdd) {
            let evt = new cc.Event.EventCustom('onAddFriendClick', true);
            evt.setUserData(this);
            this.node.dispatchEvent(evt);
        }
        else {
            let evt = new cc.Event.EventCustom('onDelFriendClick', true);
            evt.setUserData(this);
            this.node.dispatchEvent(evt);
        }

    };

    btnGo(event, arg) {
        let roleId = this.data.roleInfo.roleId;

        global.Module.PlayerMapData.setRoleInfo(this.data.roleInfo);
        global.Instance.MsgPools.send('scenePosition', { roleId: roleId }, function (msg) {
            global.CommonClass.Functions.loadScene("PlayerScene", null);
        });
    };



    // update (dt) {}
}
