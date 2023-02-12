import UIBase from "../common/UIBase";


const {ccclass, property} = cc._decorator;

@ccclass
export default class UICypher extends UIBase {
    @property({ type: cc.EditBox, displayName: "密码", tooltip: "密码" })
    edtPassWord: cc.EditBox = null;
    @property({ type: cc.EditBox, displayName: "确认密码", tooltip: "重复输入密码" })
    edtPassWord1: cc.EditBox = null;
    account:any; //账号

    // use this for initialization
    onLoad() {

    };
    result(account) {
      this.account = account
    };
    btnRegister() {
        let data = {account:this.account ,password: '' };
        let txtPassWord = this.edtPassWord.string;
        data.password = txtPassWord;
        let txtPassWord1 = this.edtPassWord1.string;
        if(txtPassWord==''){
            global.CommonClass.UITip.showTipTxt('密码不能为空', global.Enum.TipType.TIP_BAD);  
            this.edtPassWord.string = '';
            this.edtPassWord1.string = '';
            return;
        }
        if(txtPassWord!=txtPassWord1){
            global.CommonClass.UITip.showTipTxt('两次密码不一致', global.Enum.TipType.TIP_BAD);  
            this.edtPassWord.string = '';
            this.edtPassWord1.string = '';
            return;
        }
        global.Instance.MsgPools.send('resetPassword', data, function (msg) {
            global.Instance.Log.debug('修改密码',msg)
            if (msg.errorID == 0) {
                global.CommonClass.UITip.showTipTxt('修改成功', global.Enum.TipType.TIP_BAD);     
            }
        });
        
    };

    btnClose() {
        global.Manager.UIManager.close('UICypher');
    };
    // update (dt) {}
}
