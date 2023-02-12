import UIBase from "../common/UIBase";


const {ccclass, property} = cc._decorator;

@ccclass
export default class UIRealauthen extends UIBase {
    @property({ type: cc.EditBox, displayName: "edtID", tooltip: "身份证号" })
    edtIDCard: cc.EditBox = null;
    @property({ type: cc.EditBox, displayName: "edtName", tooltip: "姓名" })
    edtRealName: cc.EditBox = null;
  

    // use this for initialization
    onLoad () {

    };

    onEnable() {
        // let data = JSON.parse(cc.sys.localStorage.getItem('loginInfo'));
        //  if (data != null)
        //  this.node.getChildByName('edtName').getComponent(cc.EditBox).string = data.account;
    };

    onDisable () {
        //cc.Instance.Socket.close();
    };

    btnRegister (event, arg) {
        let data = {
            account: global.Module.GameData.getAccount(),//账号
            password:global.Module.GameData.getPassword(),//密码
            platformType: global.Module.GameData.getPlatform(),//平台
            name: '',
            idCard: ''
        };
        data.name = this.edtRealName.string;
        data.idCard = this.edtIDCard.string;
        let self = this;
        if (data.name.length < 2) {
            global.CommonClass.UITip.showTipTxt('名字长度必须大于2', global.Enum.TipType.TIP_BAD);
            return;
        }
        global.Instance.MsgPools.send('realNameAuth', data, function (msg) {
            global.Instance.Log.debug("realNameAuth",msg)
                if (msg.errorID == 0) {
                    global.Module.GameData.setIsAdult(self.IdCard(msg.req.idCard)< 18);
                    global.Module.GameData.setage(self.IdCard(msg.req.idCard));
                    global.Module.GameData.requestBaseData();
                    global.Module.GameData.checkPlayTime();
                }
            });
    };
    IdCard(UUserCard) {
        //获取年龄
        var myDate = new Date();
        var month = myDate.getMonth() + 1;
        var day = myDate.getDate();
        var age = myDate.getFullYear() - UUserCard.substring(6, 10) - 1;
        if (UUserCard.substring(10, 12) < month || UUserCard.substring(10, 12) == month && UUserCard.substring(12, 14) <= day) {
            age++;
        }
        return age;
    };

    btnClose() {
        global.Manager.UIManager.close('UIRealauthen');
    };
}
