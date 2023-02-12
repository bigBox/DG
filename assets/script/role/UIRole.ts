

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIRole extends cc.Component {
    @property({ type: cc.Label, displayName: "lblID", tooltip: "玩家ID" })
    lblID: cc.Label = null;
    @property({ type: cc.Label, displayName: "lblName", tooltip: "昵称" })
    lblName: cc.Label = null;
    @property({ type: cc.Label, displayName: "lblLevel", tooltip: "等级" })
    lblLevel: cc.Label = null;
    
    @property({ type: cc.Label, displayName: "lblMoney", tooltip: "馆藏" })
    lblMoney: cc.Label = null;
    @property({ type: cc.Label, displayName: "lblUnion", tooltip: "商会" })
    lblUnion: cc.Label = null;
    @property({ type: cc.Label, displayName: "lblNote", tooltip: "签名" })
    lblNote: cc.Label = null;
    @property({ type: cc.Node, displayName: "nameclick", tooltip: "点击修改昵称" })
    nameclick: cc.Node = null;
    @property({ type: cc.Node, displayName: "lblNoteclick", tooltip: "点击修改昵称" })
    lblNoteclick: cc.Node = null;
    @property({ type: cc.Node, displayName: "lblLevelNode", tooltip: "等级称号" })
    lblLevelNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "lblMoneyNode", tooltip: "馆藏称号" })
    lblMoneyNode: cc.Node = null;
    roleID: number;
    curMdifyMode: number;
    nodeName: string;
    constructor(){
        super();
        this.roleID = 0;
        this.nodeName = '';
        this.curMdifyMode = 1;
    };

    onLoad () {};

    start () {

    };
    onEnable() {
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);
        this.node.on(cc.Node.EventType.MOUSE_WHEEL, this.touchEvent, this);
    };

    onDisable() {
        this.node.off(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);
        this.node.off(cc.Node.EventType.MOUSE_WHEEL, this.touchEvent, this);
    };

    touchEvent() {

    };

    show(roleID) {
        this.roleID = roleID;
        let mainRoleID = global.Module.MainPlayerData.getRoleID();

        if (mainRoleID == this.roleID) {
            this.reflashSelf();
        }
        else if (global.Module.FriendData.getFriend(roleID) != null) {
            this.reflashFriend();
        }
        
    };
    beginEditBox(event) {
        event.node.opacity = 0;
        this.nodeName = event.node.name;
        if (this.nodeName == 'nameclick')
            event.string = this.lblName.string;
        if (this.nodeName == 'lblNoteclick')
            event.string = this.lblNote.string;
    };
    refreshEditBox(name) {
        if (this.nodeName == 'nameclick')
            this.lblName.string = name;
        if (this.nodeName == 'lblNoteclick')
            this.lblNote.string = name;
    }
    endEditBox(event) {
        let self = this;
        event.node.opacity = 255;
        this.nodeName = event.node.name;
        if (this.nodeName == 'nameclick') {
            this.lblName.string = event.string;
            let str = this.lblName.string;
            global.Instance.MsgPools.send('changeName', { Isint32roduction: true, name: str }, function (msg) {
                if (!msg.errorID) {
                    self.lblName.string = msg.req.name;
                    global.CommonClass.UITip.showTipTxt('名字修改成功', global.Enum.TipType.TIP_GOOD);
                }else{
                    self.lblName.string = global.Module.MainPlayerData.getRoleName();  
                }
            });
        }
        if (this.nodeName == 'lblNoteclick') {
            this.lblNote.string = event.string;
            let str = this.lblNote.string;
            global.Instance.MsgPools.send('changeSignature', { signature: str }, function (msg) {
                if (!msg.errorID) {
                    self.lblNote.string = msg.req.signature;
                    global.CommonClass.UITip.showTipTxt('留言修改成功修改成功', global.Enum.TipType.TIP_GOOD);
                }
                else {
                    self.lblNote.string = global.Module.MainPlayerData.getSignature();
                }
            });
        }
      
    }
    reflashSelf() {
        this.nameclick.active = true;
        this.lblNoteclick.active = true;
        this.lblID.string = this.roleID.toString();
        this.lblName.string = global.Module.MainPlayerData.getRoleName();
        let level = global.Module.MainPlayerData.getLevel();
        this.lblLevel.string =  level.toString();
        let fortuneData = global.Module.PreciousRoomData.getFortuneData();
        let title = fortuneData.title;
        if (fortuneData.title <= 0)
            title = 1;
        let fortune = global.Manager.DBManager.findData('ShowTableLevel', 'Id', title);
        if (fortune != null && fortuneData != null)
            this.lblMoney.string =  fortuneData.totalMoney.toString();
        else if (fortune != null)
            this.lblMoney.string =  '0';

        let unionData = global.Module.UnionData.getSelfUnion();
        if (unionData != null && unionData.id > 0)
            this.lblUnion.string =  unionData.name;
        else
            this.lblUnion.string = '未加入';
        this.lblNote.string = global.Module.MainPlayerData.getSignature();
        {
                let cfgData = global.Manager.DBManager.findData('ExpLevelCfg', 'Level', level);
                let titlblLevel = this.lblLevelNode.getChildByName("Label");
                titlblLevel.getComponent(cc.Label).string = cfgData.name;


                let titlblMoney = this.lblMoneyNode.getChildByName("Label");
                titlblMoney.getComponent(cc.Label).string = fortune.name;
            
        }
    };

    reflashFriend() {
        this.nameclick.active = false;
        this.lblNoteclick.active = false;
        let roleID = this.roleID;
        let friendData = global.Module.FriendData.getFriend(roleID);
        this.lblID.string = this.roleID.toString();;
        this.lblName.string = friendData.roleInfo.roleName;
        let level = global.Module.MainPlayerData.getLevel();
        this.lblLevel.string = level.toString();
        let fortuneData = global.Module.PreciousRoomData.getFortuneData();
        let title = fortuneData.title;
        if (fortuneData.title <= 0)
            title = 1;
        let fortune = global.Manager.DBManager.findData('ShowTableLevel', 'Id', title);
        if (fortune != null && fortuneData != null)
            this.lblMoney.string = fortune.name + '(' + fortuneData.totalMoney.toString() + ')';
        else if (fortune != null)
            this.lblMoney.string = fortune.name + '(0)';
        let guildId = friendData.roleInfo.guildId.toNumber();
        if (guildId > 0) {
            global.Instance.MsgPools.send('guildSearch', { type: 1, id: guildId, name: '' }, function (msg) {
                if (msg.errorID == 0) {
                    let value = global.Module.UnionData.getShearch(0);
                    if (value != null)
                        this.lblUnion.string = value.name;
                }
                else {
                    this.lblUnion.string = '未加入';
                }
            });
        }
        else
            this.lblUnion.string = '未加入';

        {
                let cfgData = global.Manager.DBManager.findData('ExpLevelCfg', 'Level', level);
                let titlblLevel = this.lblLevelNode.getChildByName("Label");
                titlblLevel.getComponent(cc.Label).string = cfgData.name;


                let titlblMoney = this.lblMoneyNode.getChildByName("Label");
                titlblMoney.getComponent(cc.Label).string = fortune.name;

        }

    };

    btnClose(evnet, arg) {
        global.Manager.UIManager.close('UIRole');
    };
    UnionClick() {
        let mainRoleID = global.Module.MainPlayerData.getRoleID();
        let guildId = global.Module.MainPlayerData.getguildID();
        if (mainRoleID != this.roleID) {
            let friendData = global.Module.FriendData.getFriend(this.roleID);
            guildId = friendData.roleInfo.guildId.toNumber();
        }
        if (guildId <= 0){
            global.CommonClass.UITip.showTipTxt('商会不存在', global.Enum.TipType.TIP_GOOD);
            return;
        }
           
        global.Instance.MsgPools.send('guildSearch', { type: 1, id: guildId, name: '' }, function (msg) {
            if (msg.errorID == 0) {
                if (msg.guilds[0]) {
                    global.Manager.UIManager.open('UIUnionOther', null, function (panel) {
                        panel.show(msg.guilds[0]);
                    });
                }

            }
        });
    }
    // update (dt) {}
}
