

const { ccclass, property } = cc._decorator;

@ccclass
export default class UIUnionNews extends cc.Component {
    @property({ type: cc.Label, displayName: "lblMaster", tooltip: "会长名字" })
    lblMaster: cc.Label = null;
    @property({ type: cc.Label, displayName: "lblLevel", tooltip: "等级" })
    lblLevel: cc.Label = null;
    @property({ type: cc.Label, displayName: "lblTaskDec", tooltip: "竞赛时间" })
    lblTaskDec: cc.Label = null;
    @property({ type: cc.Label, displayName: "lblTime", tooltip: "比赛开始倒计时" })
    lblTime: cc.Label = null;
    @property({ type: cc.ProgressBar, displayName: "barExp", tooltip: "经验进度条" })
    barExp: cc.ProgressBar = null;
    @property({ type: cc.Label, displayName: "lblExp", tooltip: "经验进度条数值" })
    lblExp: cc.Label = null;
    @property({ type: cc.Label, displayName: "lblNeedLevel", tooltip: "联赛要求等级" })
    lblNeedLevel: cc.Label = null;
    @property({ type: cc.Label, displayName: "lblMemberNum", tooltip: "联赛要求人数" })
    lblMemberNum: cc.Label = null;
    @property({ type: cc.Label, displayName: "lblSorce", tooltip: "赛季积分" })
    lblSorce: cc.Label = null;
    @property({ type: cc.Label, displayName: "lblActiveLevel", tooltip: "赛季排名" })
    lblActiveLevel: cc.Label = null;
    curModify: number;
    data: any;

    constructor() {
        super();
        this.curModify = 0;/** 1 对外公告 2 对内公告*/
    };


    onLoad() { };

    start() {

    };
    onEnable() {
        global.Module.GameData.setMaskSound(true,null);
    };

    onDisable() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);

        global.Module.GameData.setMaskSound(false,null);
    };

    selfUpdate() {
        let activeTime = this.data.activeTime;
        if (activeTime <= 0) {
            this.lblTime.node.active = false;
            let btnSignUp = this.node.getChildByName('btnSignUp');
            btnSignUp.active = true;

            cc.director.getScheduler().unschedule(this.selfUpdate, this);
        }
        else {
            let timeDec = global.CommonClass.Functions.formatSeconds(activeTime);
            this.lblTime.string = '比赛开始倒计时:' + timeDec;
        }
    };

    show(data) {
        this.data = data;
        
        if (data && data.id > 0) {
            this.lblMaster.string = data.name;
            this.lblLevel.string = data.level.toString() + '级';

            let expData = global.Manager.DBManager.findData('GuildLevel', 'Level', (data.level + 1));
            if (expData != null) {
                this.lblExp.string = data.experience.toString() + '/' + expData.UpLevelTotalExp.toString();
                this.barExp.progress = data.experience / expData.UpLevelTotalExp;
            }
            else {
                this.lblExp.string = '0/0';
                this.barExp.progress = 0.001;
            }
            this.lblMemberNum.string = data.curMemberNums.toString();

            let chairman = data.chairman;
            this.lblMaster.string = chairman.baseInfo.roleName;
        }
        this.reflashFight();
    };

    reflashFight() {
        let state = global.Module.GuildBattleData.getFightState();
        let guildID = global.Module.MainPlayerData.getguildID();
        let btnSignUp = this.node.getChildByName('btnSignUp');
        let lblReady = this.node.getChildByName('lblReady');
        let btnFight = this.node.getChildByName('btnFight');
        let btnLeave = this.node.getChildByName("btnLeave");
        if (guildID == parseInt(this.data.id)) {
            btnSignUp.active = state == 0;
            lblReady.active = state == 1;
            btnFight.active = state == 2;
        } else {
            btnSignUp.active = false;
            lblReady.active = false;
            btnFight.active = false;
            btnLeave.active = false;
        }
    };


    edtMdifySummaryDidEnd(target) {
        let str = target.getComponent(cc.EditBox).string;

        let curModify = this.curModify;
        let data = global.Module.UnionData.getSelfUnion();


    };

    btnAttempActive(event) {
        global.CommonClass.UITip.showTipTxt('功能还没开放', global.Enum.TipType.TIP_BAD);
    };

    btnFight() {
        global.Instance.MsgPools.send('battleBuildList', {}, function (msg) {
            if (msg.errorID == 0) {
                global.Manager.UIManager.open('UIUnionFight', null, function (panel) {
                    panel.show(msg.builds, msg.roomTime);
                });

                // global.Manager.UIManager.close('UIUnionNews');
            }
        });

    };

    btnSignUp() {
        let self = this;
        global.Instance.MsgPools.send('signUpGuildBattle', {}, function (msg) {
            if (msg.errorID == 0) {
                global.Module.GuildBattleData.setFightState(1);
                self.reflashFight();
            }
        });
    };

    btnExit() {
        let self = this;
        global.CommonClass.UIDialog.create("退出商会", "是否退出当前商会?", function (isYes) {
            if (isYes) {
                global.Proxys.ProxyUnion.leaveUnion(function (isSuccess) {
                    if (isSuccess) {
                        global.Manager.UIManager.close('UIUnionNews');
                        global.Manager.UIManager.close('UIUnion');
                    }
                });
            }
        })
    };

    btnClose() {
        global.Manager.UIManager.close('UIUnionNews');
        let UIUnion = global.Manager.UIManager.get('UIUnion');
        if (UIUnion != null)
            UIUnion.SwithMain(true);
        let UIUnionOther = global.Manager.UIManager.get('UIUnionOther');
        if (UIUnionOther != null)
            UIUnionOther.SwithMain(true);
        global.Proxys.ProxyUnion.reflashRank();
    };

    touchEvent() {

    };
    // update (dt) {}
}
