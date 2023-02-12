

const { ccclass, property } = cc._decorator;

@ccclass
export default class UIMainScene extends cc.Component {
    @property({ type: cc.Node, displayName: "引导", tooltip: "引导提示" })
    helpNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "云动画", tooltip: "第一次进入云动画" })
    ndCloudNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "热气球", tooltip: "第一次进入云动画" })
    btnGoNode: cc.Node = null;
    
    @property({ type: cc.Node, displayName: "设置显示", tooltip: "设置显示按钮" })
    btnShowNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "设置隐藏", tooltip: "设置隐藏按钮" })
    btnHideNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "每日礼包", tooltip: "每日礼包按钮" })
    btnDailyRewardNode: cc.Node = null;

    onLoad() {
        this.ndCloudNode.active = false;
    };
    setData() {
        this.helpNode.active = false;
        let scene = cc.director.getScene();
        if (scene.name == 'PlayerScene' || !this.node)
            return;
        let taskdata = global.Module.TaskData.getHasAcceptTaskData();
        if (taskdata && taskdata.taskId == '10009' && taskdata.state == 1)
            this.helpNode.active = true;
    };
    onEnable() {
        global.Manager.UIManager.add('UIMainScene', this);
        this.reflash();
        cc.systemEvent.on('10001', this.setData, this);
        this.setData();
    };

    onDisable() {
        cc.systemEvent.off('10001', this.setData, this);
        global.Manager.UIManager.remove('UIMainScene');
    };
    //打开主页下方好友
    btnFriend() {
        this.helpNode.active = false;
        global.Manager.UIManager.open('UIFriend', null, null);
    };
    //打开主页商会消息
    btnUIChat() {
        global.CommonClass.UITip.showTipTxt('暂未开放', global.Enum.TipType.TIP_BAD);
        return;
        global.Manager.UIManager.open('UIChat', null, function (panel) {
            panel.show(true);
        });
    };

    reflash() {
        let isShow = global.Module.GameData.getIsShowFactoryName();
        this.btnShowNode.active = !isShow;
        this.btnHideNode.active = isShow;

        this.reflashDailyReward();


    };
    playTitleFade(delayTime) {
        let showBar = function (isShow) {
            let uiRoleInfo = global.Manager.UIManager.getMutiPanel('UIRoleInfo');
            if (uiRoleInfo != null) {
                uiRoleInfo.node.opacity = isShow;
            }
        };

        showBar(0);
        let fadeIn = cc.fadeOut(2);
        let delayAction = cc.delayTime(delayTime);
        let seq1 = cc.sequence(delayAction, fadeIn);
        // this.spTitle.stopAllActions();
        // this.spTitle.runAction(seq1);

        let endFun = function () {
            showBar(255);
        };
        let timeAction = cc.delayTime(delayTime + 1);
        let endCall = cc.callFunc(endFun);
        let seq2 = cc.sequence(timeAction, endCall);
        this.node.stopAllActions();
        this.node.runAction(seq2);
    };

    reflashDailyReward() {
        let canReward = global.Module.GameData.getCanRewardCard() ||
            (global.Module.GameData.getCanRewardMoonCard() )

        this.btnDailyRewardNode.active = canReward;
    };
   
    btnShop() {
        global.Manager.UIManager.open('UIShop', null, null);

        /*  let data = {};
          cc.Instance.MsgPools.send('listDigRoom', data, function(msg)
          {
              cc.Manager.UIManager.open('UIDigRoomEnter', null, function(panel)
              {
                  let rooms = new Array();
                  panel.show(msg.personalScenes);
              });
          });*/

        // cc.Proxys.ProxyFactoryGuide.onLevelUp();
        //cc.Proxys.ProxyGuide.onLevelUp();
    };


    btnDailyReward(evnet, param) {
        global.Manager.UIManager.open('UIDailyReward', null, null);
    };
    //打开论坛
    btmForum() {
        global.Manager.UIManager.open('UIForum', null, null);
    };

    btmGmCode() {
        global.Manager.UIManager.open('UIGMCode', null, null);
    };


    playCloudAction(callback) {
        this.ndCloudNode.active = true;
        this.btnGoNode.active = true;
        let animation = this.ndCloudNode.getComponent(cc.Animation);
        let animation1 = this.btnGoNode.getComponent(cc.Animation);
        animation1.play('luxian2')
        this.scheduleOnce(function () {
            animation.play('cloud');
            if (callback)
                animation.on('finished', callback);
        }, 1.5);//下一帧立即执行，此处需要在下一帧执行
       
    };

    btnShowName(event, arg) {

        let isShow = false;
        if (arg == 'true')
            isShow = true;

        this.btnShowNode.active = !isShow;
        this.btnHideNode.active = isShow;
        global.Module.GameData.setIsShowFactoryName(isShow);
        let task = global.Module.TaskData.getAcceptTask();
        if (task && task.taskId == 10016) {
            let data = { point: 2 };
            global.Instance.MsgPools.send('taskPoint', data, function (msg) {
                if (msg.errorID == 0) {
                }
            });
        }

        global.Proxys.ProxyGuide.stepNextGuide('ClickSet');
    };
    btnShow() {
        let panel = global.Manager.UIManager.get('UINewFactory');
        if (panel != null)
            panel.show(true);
    };

    // update (dt) {}
}
