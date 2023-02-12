//商会对战匹配
const { ccclass, property } = cc._decorator;
@ccclass
export default class GuildBattleData {
    battleCD: number;
    builds: {};
    selfCD: number;
    otherCD: number;
    selfScore: number;
    otherScore: number;
    fightState: number;
    timeCost: number;
    panel: any;
    constructor() {
        this.battleCD = 0;
        this.builds = {};

        this.selfCD = 0;      //自己攻占建筑的CD
        this.otherCD = 0;      //他人攻占建筑的CD

        this.selfScore = 0;
        this.otherScore = 0;

        this.fightState = 0;        //0.没有开始 1.匹配中 2.匹配成功

        this.timeCost = 0;

        this.panel = null;
    };

    setPanel(panel: any) {
        this.panel = panel;
    };
    clear() {
        this.battleCD = 0;
        this.builds = {};

        this.selfCD = 0;      //自己攻占建筑的CD
        this.otherCD = 0;      //他人攻占建筑的CD

        this.selfScore = 0;
        this.otherScore = 0;

        this.fightState = 0;        //0.没有开始 1.匹配中 2.匹配成功

        this.timeCost = 0;
    };
    getBattleCD() {
        return this.battleCD;
    };
    getBuilds() {
        return this.builds;
    };
    setCD(isSelf: any, CD: number) {
        if (isSelf)
            this.selfCD = CD;
        else
            this.otherCD = CD;
    };
    getCD(isSelf: any) {
        if (isSelf)
            return this.selfCD;
        else
            return this.otherCD;
    };
    getScore(isSelf: any) {
        if (isSelf)
            return this.selfScore;
        else
            return this.otherScore;
    };
    getBuildByID(ID: any) {
        for (let key in this.builds) {
            let build = this.builds[key];
            if (build.buildID == ID)
                return build;
        }

        return null;
    };
    reflashBuild(build: { buildID: any; }) {
        let curBuild = this.getBuildByID(build.buildID);
        if (curBuild != null)
            curBuild = Object.assign({}, build);
    };
    setFightState(state: number) {
        this.fightState = state;
    };

    getFightState() {
        return this.fightState;
    };
    selfUpdate(dt: number) {
        this.timeCost += dt;
        if (this.timeCost > 1) {
            this.timeCost = 0;
            this.selfCD -= 1;
            this.otherCD -= 1;

            if (this.selfCD >= 0 || this.otherCD >= 0) {
                if (this.panel != null)
                    this.panel.reflashPlayerCD();
            }
            if (this.selfCD < 0)
                this.selfCD = 0;

            if (this.otherCD < 0)
                this.otherCD = 0;

        }
    };
    onSignUpGuildBattleRsp(msg: any) {

    };
    onGuildBattleMatchSucessNtf(msg: any) {
        this.setFightState(2);
        let UIUnionNews = global.Manager.UIManager.get('UIUnionNews');
        if (UIUnionNews != null)
        UIUnionNews.reflashFight();
    };
    onCaptureBattleBuildRsp(msg: any) {

    };
    onHoldBattleBuildRsp(msg: any) {

    };
    onBattleBuildListRsp(msg: { errorID: number; battleCD: number; builds: {}; }) {
        if (msg.errorID == 0) {
            this.battleCD = msg.battleCD;
            this.builds = msg.builds;
        }
    };
    onCaptureBattleBuildNtf(msg: { buildID: any; captureRoleInfo: { roleName: string; }; }) {
        global.Module.CatchGoodsNetData.setFightBuild(msg.buildID);
        if (this.panel != null) {
            let dec = msg.captureRoleInfo.roleName + '来攻占，是否进入挑战?';
            this.panel.showFightDlg(dec);
        }
    };
    onBattleHoldScoreNtf(msg: { roleID: any; totalScore: number; score: any; }) {
        let roleID = global.Module.MainPlayerData.getRoleID();
        let isSelf = msg.roleID == roleID;
        if (isSelf)
            this.selfScore = msg.totalScore;
        else
            this.otherScore = msg.totalScore;
        if (this.panel != null)
            this.panel.reflashScores();
        if (isSelf) {
            if (this.panel != null)
                this.panel.playScoreFly(msg.score);
        }
    };
    onExitBattleBuildListRsp(msg: any) {

    };
    onBattleOverNtf(msg: any) {
        // let data= {score:100, exp:100, level:55, matchScore:101, winGuildID:0};
        global.Manager.UIManager.open('UIUnionFightOver', null, function (panel: { show: (arg0: any) => void; }) {
            if (panel != null) {
                panel.show(msg);
            }
        });
        global.Manager.UIManager.close('UIUnionFight');
        global.CommonClass.UITip.showTipTxt('游戏结束', global.Enum.TipType.TIP_BAD);
    };
}
