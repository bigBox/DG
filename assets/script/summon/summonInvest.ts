const {ccclass, property} = cc._decorator;

@ccclass
export default class summonInvest extends cc.Component {
    data: any;
    dt: number;
    timeDelay: number;

    // LIFE-CYCLE CALLBACKS:

    constructor() {
        super();
        this.dt = 0;
      
    };
    // onLoad () {}

    start () {

    };
    show(data){
        this.data = data;
        this.timeDelay = -1;
        let timeLbale = this.node.getChildByName('timeLabel');
        timeLbale.active = false;
        if (data != null) {
            this.node.active = true;
            if (data.rewardType == 11) {
                if (data.targetTime > -1) {
                    timeLbale.active = true;
                    if (data.targetTime == 0) {
                        timeLbale.getComponent(cc.Label).string = '投资成功';
                    } else {
                        let leftTime = global.CommonClass.Functions.getLeftTime(this.data.targetTime);
                        timeLbale.getComponent(cc.Label).string = global.CommonClass.Functions.formatSeconds2(leftTime);
                    }
                }


            }

        } else {
            this.node.active = false;
        }
      
    };

    getData() {
        return this.data;
    };
    btnInvest(){
        let mainRoleID = global.Module.MainPlayerData.getRoleID();
        global.Instance.MsgPools.send('summonPickupInvestReward', { roleId: mainRoleID, index: this.data.ID }, function (msg) {
            if (msg.errorID == 0) {
                let allItems = [];
                for (let key in msg.reward.map) {
                    let tmp = msg.reward.map[key];
                    let item = { itemID: tmp.key, itemNum: tmp.value, type: 0 };
                    allItems.push(item);
                }
                if (allItems.length > 0) {
                    global.Manager.UIManager.open('DlgCollectDrop', null, function (panel) {
                        panel.show(allItems, "投资");
                    });
                }

                global.Module.MainPlayerData.lockDrop(false);
            }
        });
    };
    update (dt) {
        if (this.data == null) {
            this.node.active = false;
            return;
        }
        {
            let isShow = global.Module.SummonData.iShowBackDemo(this.data.summonID);
            this.node.active = isShow;
            if (isShow == false)
                return;
        }
        //投资倒计时
        this.timeDelay -= dt;
        if (this.data.targetTime > 0) {
            if (this.timeDelay < 0) {
                this.timeDelay = 1;
                var timeLbale = this.node.getChildByName('timeLabel');
                let leftTime = global.CommonClass.Functions.getLeftTime(this.data.targetTime);
                timeLbale.getComponent(cc.Label).string = global.CommonClass.Functions.formatSeconds2(leftTime);
                if (leftTime <= 0) {
                    this.data.targetTime = 0;
                    this.show(this.data);
                }
            }
        }
        

    }
}
