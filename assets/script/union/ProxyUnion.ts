

const { ccclass, property } = cc._decorator;

@ccclass
export default class ProxyUnion extends cc.Component {

    onLoad() { }

    start() {

    }
    show(){};
    addUnion(unionID, callback) {
        //  var mainRoleID = cc.Module.MainPlayerData.getRoleID();
        let data = { guildId: unionID, tokenID: 609990004, tokenCount: 1 };
        global.Instance.MsgPools.send('guildApply', data, function (msg) {
            if (msg.errorID == 0) {
                global.CommonClass.UITip.showTipTxt('申请加入商会成功', global.Enum.TipType.TIP_GOOD);
            }
            else {
                //if (msg.errorID==264)
                //  {
                // cc.CommonClass.UITip.showText('离开商会4小时后才能重新加入', '832B2B');
                //  }
                //else
                //  {
                // cc.CommonClass.UITip.showText('申请加入商会失败', '832B2B');
                //  }*/
            }

            if (callback)
                callback(msg.errorID == 0);
        });
    };

    leaveUnion(callback) {
        global.Instance.MsgPools.send('quitGuild', {}, function (msg) {
            if (msg.errorID == 0) {
                global.Module.UnionData.setSelfUnion(null);
                global.CommonClass.UITip.showTipTxt('成功退出商会', global.Enum.TipType.TIP_GOOD);

            }
            /// else if(msg.errorID==240)
            // {
            // cc.CommonClass.UITip.showText('商会管理者(会长副会长)不能退会', '832B2B');
            //}

            if (callback)
                callback(msg.errorID == 0);
        });
    };

    reflashRank() {
        let panel = global.Manager.UIManager.get('UIUnionRank');
        if (panel != null) {
            let rankType = panel.getRankType();
            global.Instance.MsgPools.send('rankGuildLst', { type: rankType }, function (msg) {
                panel.show();
            });
        }
    };

    reflashUnion() {
        let panel = global.Manager.UIManager.get('UIUnion');
        if (panel != null) {
            global.Instance.MsgPools.send('guildList', {}, function (msg) {
                if (msg.errorID == 0)
                    panel.show();
            });
        }
    };

    reflashUnionMembers() {
        let panel = global.Manager.UIManager.get('UIUnionMember');
        global.Instance.MsgPools.send('guildList', {}, function (msg) {
            if (msg.errorID == 0)
                panel.show(msg.members);
        });
    };

    reflashAllOpen() {
        this.reflashRank();
        this.reflashUnion();
        this.reflashUnionMembers();
    };
    // update (dt) {}
}
