const {ccclass, property} = cc._decorator;
@ccclass
export default class UIPlayerScene extends cc.Component {
    @property({ type: cc.ProgressBar, displayName: "barExp", tooltip: "等级进度" })
    barExp: cc.ProgressBar = null;
    @property({ type: cc.Label, displayName: "lblLevel", tooltip: "等级级别" })
    lblLevel: cc.Label = null;
    @property({ type: cc.Label, displayName: "lblExp", tooltip: "当前经验" })
    lblExp: cc.Label = null;
    @property({ type: cc.Label, displayName: "lblExpTitle", tooltip: "等级名称" })
    lblExpTitle: cc.Label = null;
    @property({ type: cc.ProgressBar, displayName: "barFortune", tooltip: "收藏进度" })
    barFortune: cc.ProgressBar = null;
    @property({ type: cc.Label, displayName: "lblFortune", tooltip: "收藏价值" })
    lblFortune: cc.Label = null;
    @property({ type: cc.Label, displayName: "lblFortuneTitle", tooltip: "收藏名称" })
    lblFortuneTitle: cc.Label = null;
    @property({ type: cc.Node, displayName: "messNode", tooltip: "签名" })
    messNode: cc.Node = null;
    @property({ type: cc.Label, displayName: "messLabel", tooltip: "签名内容" })
    messLabel: cc.Label = null;
    
    isShow:boolean;
    ndBack: cc.Node;
    constructor() {
        super();
        this.isShow = false;
    };
    onLoad () {}

    start () {

    }
    onEnable () {
        this.ndBack = this.node.getChildByName('ndBack');

        this.show();
        this.reflashHelp();
  
    }


    show () {
        let roleInfo = global.Module.PlayerMapData.getRoleInfo();
        if (roleInfo != null) {
            let lblName = this.ndBack.getChildByName('lblName');
            let spFiveElem = this.ndBack.getChildByName('spFiveElem');
            
            lblName.getComponent(cc.Label).string = roleInfo.roleName;
            if (this.lblLevel != null)
                this.lblLevel.string = roleInfo.level;
            this.reflashExp(roleInfo.experience, roleInfo.level)
            if (this.messLabel != null)
            this.messLabel.string = '   '+roleInfo.signature;


            {
                let fiveElem = roleInfo.fiveEle
                let ID = 400010005 + fiveElem
                let iconFile = 'images/pictrue/items/' + ID.toString();
                if (spFiveElem)
                    global.CommonClass.Functions.setTexture(spFiveElem, iconFile, null);
            }


        }
    };
    reflashFortune() {
        if (this.barFortune == null)
            return;

        let fortuneValue = global.Module.MainPlayerData.getDataByKey('ShowTable');
        if (fortuneValue != null) {

            let title = global.Module.MainPlayerData.getDataByKey('ShowTableLevel');
           
            let data = global.Manager.DBManager.findData('ShowTableLevel', 'Id', title);
            if (data != null) {
                let nextTitle = title + 1;
                let nextLevData = global.Manager.DBManager.findData('ShowTableLevel', 'Id', nextTitle);
                if (nextLevData != null) {
                    if (fortuneValue != 0 && nextLevData.UpLevelTotalExp != 0)
                        this.barFortune.progress = fortuneValue / nextLevData.UpLevelTotalExp;
                    else
                        this.barFortune.progress = 0.001;
                }
                else {
                    this.barFortune.progress = 1;
                }
            }
            else
                this.barFortune.progress = 1;
            if (data)
                this.lblFortuneTitle.string = data.name;
            else
                this.lblFortuneTitle.string = '';
            let fortuneString = global.Module.PreciousRoomData.formatFortune(fortuneValue);
            this.lblFortune.string = fortuneString;
        }
    };
    reflashExp(exp,curLev) {
        if (this.barExp == null)
            return;
        let nextNeed = 0;
        let preNeed = 0;

        if (exp != null && curLev != null) {
            let cfgData = global.Manager.DBManager.findData('ExpLevelCfg', 'Level', curLev);
            nextNeed = cfgData.UpLevelExp;//所需经验
            preNeed = cfgData.UpLevelTotalExp;//总经验
            if (this.lblExpTitle != null) {
                this.lblExpTitle.string = cfgData.name;
            }
            let showExp = Math.floor((preNeed - exp));
            let showNextNeed = Math.floor(nextNeed);
            let left = showNextNeed - showExp;
            if (left < 0)
                left = 0;
            // this.lblExp.string = showExp.toString()+'/'+showNextNeed.toString();
            this.lblExp.string = left.toString();

            let percent = 0.001;
            if (showNextNeed > 0 && showExp > 0) {
                percent = left / showNextNeed;
            }
            this.barExp.progress = percent;
        }else {
            this.lblExp.string = '0/1';
            this.barExp.progress = 0.001;
        }
    };

    btnReturn () {
        global.Module.PlayerMapData.clear();
        global.CommonClass.Functions.loadScene("MainScene",null);
    };
    reflashHelp() {
        var taskdata = global.Module.TaskData.getHasAcceptTaskData();
        let btnReturn = this.node.getChildByName('btnReturn');
        let helpNode = btnReturn.getChildByName('helpNode');
        if (helpNode)
        helpNode.active = (taskdata&&taskdata.taskId == 10009 && taskdata.state == 2 )
       
    };
    btnHead () {
        // return;
        let roleInfo = global.Module.PlayerMapData.getRoleInfo();

        let friend = global.Module.FriendData.getFriend(roleInfo.roleId);
        if (friend != null) {
            global.Manager.UIManager.open('UIRole', null, function (panel) {
                panel.show(roleInfo.roleId);
            });
        }else {
            global.CommonClass.UITip.showTipTxt('不能查看非好友信息', global.Enum.TipType.TIP_BAD);
        }

    };

    btnHideTitle () {
        let btnHideTitle = this.node.getChildByName('btnHideTitle');
        let btnShowTitle = this.node.getChildByName('btnShowTitle');

        btnHideTitle.active = false;
        btnShowTitle.active = true;

        global.Module.GameData.setIsShowFactoryName(false);
    };

    btnShowTitle () {
        let btnHideTitle = this.node.getChildByName('btnHideTitle');
        let btnShowTitle = this.node.getChildByName('btnShowTitle');

        btnHideTitle.active = true;
        btnShowTitle.active = false;

        global.Module.GameData.setIsShowFactoryName(true);
    };

    btnFriend () {
        global.Manager.UIManager.open('UIFriend',null,null);
       
    };
    btnNode(){
        let endPosition = cc.v3(this.messNode.x,this.messNode.y,0);
        let btnNode = this.messNode.getChildByName('btnNode');
        btnNode.active = false;
        if(this.isShow == false){
            this.isShow = true;
            endPosition.y -= 200; 
        }else{
            this.isShow = false;
            endPosition.y += 200;
        }
        cc.tween(this.messNode)
            .to(0.5, { position: endPosition })
            .call(() => {
                btnNode.active = true;
            })
            .start();
    }

    // update (dt) {}
}
