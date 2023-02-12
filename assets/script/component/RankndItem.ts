
const {ccclass, property} = cc._decorator;
@ccclass
export default class RankndItem extends cc.Component {
    titleDec: { 1: string; 2: string; 3: string; 4: string; };
    mode: number;
    @property({ type: cc.Label, displayName: "lblIndexLabel", tooltip: "排序" })
    lblIndexLabel: cc.Label = null;
    @property({ type: cc.Label, displayName: "lblNameLabel", tooltip: "名字" })
    lblNameLabel: cc.Label = null;
    @property({ type: cc.Label, displayName: "lblTitleLabel", tooltip: "称号" })
    lblTitleLabel: cc.Label = null;
    @property({ type: cc.Label, displayName: "lblDecLabel", tooltip: "签名" })
    lblDecLabel: cc.Label = null;
    @property({ type: cc.Label, displayName: "idLabel", tooltip: "id" })
    idLabel: cc.Label = null;
    @property({ type: cc.Label, displayName: "lblLevelDecLabel", tooltip: "等级" })
    lblLevelDecLabel: cc.Label = null;
    @property({ type: cc.Node, displayName: "btnGoNode", tooltip: "拜访" })
    btnGoNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "btnAddNode", tooltip: "添加" })
    btnAddNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "ndBackNode", tooltip: "申请加好友列表" })
    ndBackNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "helpNode", tooltip: "加好友任务引导" })
    helpNode: cc.Node = null;
    
    data: any;
    roleID: any;
    
    constructor() {
        super();
        this.titleDec = { 1: '新手', 2: '收藏达人', 3: '收藏专家', 4: '收藏大师' };
        this.mode = 0;//7.馆藏模式 8.声望模式 9.等级模式 3.好友申请
        this.data = null;
    };

    // use this for initialization
    onLoad() {


    };

    setData(key, rankData) {
        if (rankData != null) {
            this.data = rankData;
            let name = rankData.roleInfo.roleName;
            let nameLen = rankData.roleInfo.roleName.length;
            if (nameLen > 6)
                name = rankData.roleInfo.roleName.substr(0, 4);
            this.lblNameLabel.getComponent(cc.Label).string = name;
            if (this.idLabel)
            this.idLabel.getComponent(cc.Label).string = 'ID:' + rankData.roleInfo.roleId;
            this.lblDecLabel.getComponent(cc.Label).string = rankData.roleInfo.signature;
            this.lblLevelDecLabel.string ='等级: ' + rankData.roleInfo.level.toString() + '级';

            let index = parseInt(key)+1;
            this.lblIndexLabel.string = index.toString();
            let title = rankData.roleInfo.showTable;
            let honorData = global.Manager.DBManager.findData('ShowTableLevel', 'Id', title);
            if (honorData != null)
                this.lblTitleLabel.string = '资产: ' + honorData.name;
            else
                this.lblTitleLabel.string = '资产: 小白';

            let roleID = rankData.roleInfo.roleId;
            
            this.node.tagEx = roleID;
            this.reflashHelp(roleID);
           
        }
    };
    reflashHelp(roleID) {
        if (this.helpNode) {
            this.helpNode.active = false;
            var data = global.Module.TaskData.getHasAcceptTaskData();
            if (!data)
                return;
            if (data && data.taskId == '10008' && data.state == 1&&roleID==10)
            if (roleID==10)
                this.helpNode.active = true;
        }
    };
    reflash(key, rankData) {
        if (rankData != null) {
            this.data = rankData;
            this.data.roleInfo = rankData;
            let name = rankData.roleName;
            let nameLen = rankData.roleName.length;
            if (nameLen > 6)
                name = rankData.roleName.substr(0, 4);
            this.lblNameLabel.getComponent(cc.Label).string = name;
            if (this.idLabel)
            this.idLabel.getComponent(cc.Label).string ='ID:' + rankData.roleId;
            this.lblDecLabel.getComponent(cc.Label).string = rankData.signature;
            this.lblLevelDecLabel.string ='等级: ' +  rankData.level.toString() + '级';
            let index = parseInt(key)+1;
            this.lblIndexLabel.string = index.toString();

            let honorData = global.Manager.DBManager.findData('ShowTableLevel', 'Id', rankData.showTable);
            if (honorData != null)
                this.lblTitleLabel.string = '资产: ' + honorData.name;
            else
                this.lblTitleLabel.string = '资产: 小白';
            
            let roleID = rankData.roleId;

            this.node.tagEx = roleID;
            this.reflashHelp(roleID);
        }
    };
    getData() {
        return this.data;
    };

    showBtns(isShow) {
        let mainRoleID = global.Module.MainPlayerData.getRoleID();
        let roleID = this.node.tagEx;
        let isSelf = (roleID == mainRoleID);//是否是本人
        let isFriend = (global.Module.FriendData.getFriend(roleID) != null);//是否是好友
        // if (this.btnGoNode)
        //     this.btnGoNode.active = isShow;
        if (this.btnAddNode)
            this.btnAddNode.active = !isFriend && !isSelf && isShow;
      
       
    };

    setMode(mode)  { //7.馆藏模式 8.声望模式 9.等级模式 3.好友申请 1 推荐好友
        this.mode = mode;
        this.ndBackNode.active = mode ==3;
        if(mode !=3){
            this.showBtns(true)
        }
    };

    btnDealApplyClick(event, arg) {
        arg = parseInt(arg);
        let roleId = this.node.tagEx;
        let data = {targetRoleId: [roleId], agree: true }; //同意
        if (arg == 2) {   
            data = { targetRoleId: [roleId], agree: false };//拒绝
        }
        let self = this
        let lbTips = this.node.getChildByName('lbTips');
        lbTips.active = true;
        this.ndBackNode.active = false;
        global.Instance.MsgPools.send('friendApprove', data, function (event) {
            global.Instance.Log.debug('friendApprove',event);
            if (event.errorID == 0) {

                if (data.agree) {
                    lbTips.getComponent(cc.Label).string = '已同意';
                } else {
                    lbTips.getComponent(cc.Label).string = '已拒绝';
                }
            } else {
                lbTips.getComponent(cc.Label).string = '操作失败';
            }
        });
       
    };
    onApprove(agree) {
        this.ndBackNode.active = false;
        let lbTips = this.node.getChildByName('lbTips');
        if (!lbTips)
            return;
        lbTips.active = true;
        if (agree == true) {
            lbTips.getComponent(cc.Label).string = '已同意';
        } else if (agree == false) {
            lbTips.getComponent(cc.Label).string = '已拒绝';
        } else {
            lbTips.getComponent(cc.Label).string = '操作失败';
        }
       
    };
    onAddFriend(){
        let btnAddFriend = this.node.getChildByName('btnAddFriend');
        btnAddFriend.active = false;
    }

    btnAddFriendClick(event, arg) {
        if (this.helpNode)
            this.helpNode.active = false;
        let isAdd = parseInt(arg) != 0;
        if (isAdd) {
            let evt = new cc.Event.EventCustom('onAddFriendClick', true);//添加好友
            evt.setUserData(this);
            this.node.dispatchEvent(evt);
        }
        else {
            let evt = new cc.Event.EventCustom('onDelFriendClick', true);//删除好友
            evt.setUserData(this);
            this.node.dispatchEvent(evt);
        }

    };

    btnGo(event, arg) {
        if (this.mode == 3)
            return;
        let roleId = this.node.tagEx;

        global.Module.PlayerMapData.setRoleInfo(this.data.roleInfo);
        global.Instance.MsgPools.send('scenePosition', { roleId: roleId }, function (msg) {
            global.CommonClass.Functions.loadScene("PlayerScene", null);
        });
    };
    update(){
        let lblName = this.node.getChildByName('lblName');
        let lblLevel = this.node.getChildByName('lblLevel');
        let lblLevelNode = this.node.getChildByName('lblLevelNode');
        let lblMoneyNode = this.node.getChildByName('lblMoneyNode');
        let lblTitle = this.node.getChildByName('lblTitle');
        if (!lblLevelNode || !lblLevel || !lblName || !lblLevelNode || !lblMoneyNode || !lblTitle)
            return;
        lblLevelNode.width = lblLevel.width + 20;
        lblLevelNode.x = lblName.x + lblName.width + 20;
        lblLevel.x = lblName.x + lblName.width + 20 + lblLevelNode.width / 2;

        lblMoneyNode.x = lblLevelNode.x + lblLevelNode.width + 20;
        lblTitle.x = lblLevelNode.x + lblLevelNode.width + 20 + lblMoneyNode.width / 2;

    }
    // update (dt) {}
}
