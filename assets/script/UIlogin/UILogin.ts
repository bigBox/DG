import UIBase from "../common/UIBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class UILogin extends UIBase {

    static filePath: "prefab/login/";
    @property({ type: cc.EditBox, displayName: "edtName", tooltip: "账号" })
    edtName: cc.EditBox = null;
    @property({ type: cc.EditBox, displayName: "edtPassWord", tooltip: "密码" })
    edtPassWord: cc.EditBox = null;
    @property({ type: cc.Node, displayName: "AccounLoginNode", tooltip: "手机号登陆" })
    AccounLoginNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "SelectLoginNode", tooltip: "登陆方式选择界面" })
    SelectLoginNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "seleLayoutNode", tooltip: "QQ.VX.手机号.沿用上一次方式" })
    seleLayoutNode: any = [];
    @property({ type: cc.Node, displayName: "cutBtnNode", tooltip: "切换其他登录方式" })
    cutBtnNode: cc.Node = null;

    // use this for initialization
    onLoad() {
        global.Module.GameData.startLogicUpdate();
        global.Module.GameData.openLockSocketOp(false);           //在主场景建筑加载完后解锁

        if (!global.Proxys.ProxyReLogin.getIsReloginFailed())
            this.connectServer(null);;
        global.Instance.MsgPools.register('login', this.onLogin.bind(this));//登陆返回消息推送
        global.Instance.MsgPools.register('loginNtf', this.onLoginNtf.bind(this));

        cc.systemEvent.on('wxLoginResult', this.wxLoginResult.bind(this));
    };
    wxLogin() {
        if (cc.sys.platform === cc.sys.ANDROID) {
            if (jsb != null && jsb != undefined) {
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "weixin_login", "(Ljava/lang/String;)V", "wechat_sdk_demo_test");
            }
        } else if (cc.sys.os === cc.sys.OS_IOS) {
            // jsb.reflection.callStaticMethod("CocosHelper", "test2WithParm1:andParm2:", parm1, parm2);
        }
        if (!cc.sys.isNative) {
            var msg = {
                "openid": "asdadknfmdsfdfdmsklasmk1",
                "nickname": "aaaa",
                "sex": 1,
                "language": "zh_CN",
                "city": "",
                "province": "",
                "country": "CN",
                "headimgurl": "https:\/\/thirdwx.qlogo.cn\/mmopen\/vi_32\/mpv31l5FdYo3BMjp6mzhSbp0psxRukEJyZV0oOVicSdRSQiaPFjdMP8QjLuQRyDOaqEHqxvaKmbhmY4JWAGciajuQ\/132",
                "privilege": [],
                "unionid": "asdadknfmlsdfssfkdmsklasmk1"
            }
            let data = { account: msg.openid, password: msg.unionid, platformType: 2, userInfo: msg, version: global.Module.GameData.getversion() };
            this.wxLoginsend(data);
        }
    };
    qqLogin() {
        if (cc.sys.platform === cc.sys.ANDROID) {
            if (jsb != null && jsb != undefined) {
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "qq_login", "(Ljava/lang/String;)V", "qq_login");
            }

        } else if (cc.sys.os === cc.sys.OS_IOS) {
            // jsb.reflection.callStaticMethod("CocosHelper", "test2WithParm1:andParm2:", parm1, parm2);
        }
        if (!cc.sys.isNative) {
            var msg = {
                "openid": "asdad58sdfssklasmk1",
                "nickname": "aaaa",
                "sex": 1,
                "language": "zh_CN",
                "city": "",
                "province": "",
                "country": "CN",
                "headimgurl": "https:\/\/thirdwx.qlogo.cn\/mmopen\/vi_32\/mpv31l5FdYo3BMjp6mzhSbp0psxRukEJyZV0oOVicSdRSQiaPFjdMP8QjLuQRyDOaqEHqxvaKmbhmY4JWAGciajuQ\/132",
                "privilege": [],
                "unionid": "asdadkn9sfddlasmk1"
            }
            let data = { account: msg.openid, password: msg.unionid, platformType: 1, userInfo: msg, version: global.Module.GameData.getversion() };
            this.wxLoginsend(data);
        } else {
            // this.getQQunionid()
        }
    };
    wxLoginResult(errCode: any) {
        this.getAccessToken(errCode);
    };
    qqLoginResult(date: string, openId: any, access_token: any) {
        const msg = JSON.parse(date);

        let unionid = this.getQQunionid(access_token);

        let msgData = {
            "openid": openId,
            "unionid": unionid,
            "nickname": msg.nickname,
            "sex": 0,
            "language": "zh_CN",
            "city": "",
            "province": "",
            "country": "CN",
            "headimgurl": '',
            "privilege": [],
        }
        if (msg.gender == "男") {
            msgData.sex = 1;
        } else {
            msgData.sex = 2;
        }
        var self = this;
        let data = {
            account: msgData.openid,
            password: msgData.unionid,
            platformType: 1,
            userInfo: msgData,
            version: global.Module.GameData.getversion()
        };
        if (msgData.openid) {
            if (global.Instance.Socket.isConnected()) {
                self.wxLoginsend(data);
            }
            else {
                self.connectServer(function (isOpen: any) {
                    if (isOpen)
                        self.wxLoginsend(data);
                });
            }
        }
    };
    getQQunionid(access_token: string) {
        var url = " https://graph.qq.com/oauth2.0/me?access_token=" + access_token + "&unionid=1";
        // var url = 'https://graph.qq.com/oauth2.0/me?access_token=3D8AD26E66E736423D05B6EC2B2A02D9&unionid=1'
        var self = this;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                global.Instance.Log.debug("response===>>>", response);
                response = response.substring(response.indexOf("{"), response.indexOf("}") + 1);
                var msg = JSON.parse(response);
                var unionid = msg.unionid;
                return unionid;

            }
        };
        xhr.open("GET", url, true);
        xhr.send();
    };
    getAccessToken(code: string) {        //获取accessToken
        global.Instance.Log.debug('获取accessToken',code)
        var url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=wx828d9d56f67f7dad&secret=564322c36e4e4da6e4bdff281e9d0639&code=" + code + "&grant_type=authorization_code";
        var self = this;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                global.Instance.Log.debug("response===>>>", response);
                var msg = JSON.parse(response);
                var access_token = msg.access_token;
                var openid = msg.openid;
                self.getUserInfo(access_token, openid, 2)

            }
        };
        xhr.open("GET", url, true);
        xhr.send();
    };
    getUserInfo(access_token: string, openid: string, platformType: number) {       //获取用户信息
        global.Instance.Log.debug("accessToken is " , access_token);
        global.Instance.Log.debug("openid is " , openid);
        var url = "https://api.weixin.qq.com/sns/userinfo?access_token=" + access_token + "&openid=" + openid;
        var self = this;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                var msg = JSON.parse(response);
                global.Instance.Log.debug("msg is ", msg);
                let data = { account: msg.openid, password: msg.unionid, platformType: platformType, userInfo: msg, version: global.Module.GameData.getversion() };
                if (msg.openid) {
                    if (global.Instance.Socket.isConnected()) {
                        self.wxLoginsend(data);
                    }
                    else {
                        self.connectServer(function (isOpen: any) {
                            if (isOpen)
                                self.wxLoginsend(data);
                        });
                    }
                }
            }
        };
        xhr.open("GET", url, true);
        xhr.send();

    };
    onEnable() {
        let data = JSON.parse(cc.sys.localStorage.getItem('loginInfo'));

        if (data != null && data.req) {
            global.Instance.Log.debug('本地缓存账户信息',data);
            //platformType 0 手机号 1 QQ 2 微信
            for (let i = 0; i < this.seleLayoutNode.length; i++)
                this.seleLayoutNode[i].active = false;
            this.cutBtnNode.active = true;
            if (data.req.platformType == 0) {
                this.edtName.string = data.req.account;
                this.edtPassWord.string = data.req.password;
                this.seleLayoutNode[3].active = true;
            } else if (data.req.platformType == 2) {
                this.seleLayoutNode[1].active = true;
            } else {
                this.seleLayoutNode[0].active = true;
            }
        } else {
            let loginInfo = null;
            cc.sys.localStorage.setItem('loginInfo', JSON.stringify(loginInfo));
            this.cutBtnNode.active = false;
        }

    };
    connectServer(call: { (isOpen: any): void; (isOpen: any): void; (isOpen: any): void; (arg0: boolean): void; }) {
        let callBack = function (event: { type: string; }) {
            if (event.type == 'open') {
                global.Proxys.ProxyReLogin.getIsReloginFailed();

                if (call)
                    call(true);
            }
            else if (event.type == 'close') {
                global.CommonClass.UITip.showTipTxt('与服务器失去连接', global.Enum.TipType.TIP_BAD);
                if (!global.Proxys.ProxyReLogin.getIsReloginFailed())
                    global.Proxys.ProxyReLogin.reConnectToServer();
                if (call)
                    call(false);
            }
        }
        if (!global.Instance.Socket.isConnected()) {
            global.Proxys.ProxyReLogin.connect("ws://118.25.3.4:9310", callBack);   //官网服 ip
            // global.Proxys.ProxyReLogin.connect("ws://122.152.215.21:9310", callBack);   //版号版
            // global.Proxys.ProxyReLogin.connect("ws://192.168.1.88:9310", callBack);     //内网
        }
    };
    /**
        * 返回三选一模式
        */
    leaveBtn() {
        this.AccounLoginNode.active = false;
        this.SelectLoginNode.active = true;
        this.cutBtnNode.active = false;
        let loginInfo = null;
        cc.sys.localStorage.setItem('loginInfo', JSON.stringify(loginInfo));
        for (let i = 0; i < this.seleLayoutNode.length; i++) {
            if (i == 3) {
                this.seleLayoutNode[i].active = false;
            } else {
                this.seleLayoutNode[i].active = true;
            }
        }

    };
    onCreateAccount(msg: { errorID: any; errorCode: number; }) {
        if (!msg.errorID) {
            global.CommonClass.UITip.showTipTxt('注册成功', global.Enum.TipType.TIP_GOOD);
        }
        else {
            global.CommonClass.Functions.logServerError(msg);

            if (msg.errorCode == 112)
                global.CommonClass.UITip.showTipTxt("账号名不合适，请重新选择账号", global.Enum.TipType.TIP_BAD);
            else if (msg.errorCode == 9999)
                global.CommonClass.UITip.showTipTxt("身份证不合法", global.Enum.TipType.TIP_BAD);
            else
                global.CommonClass.UITip.showTipTxt("注册失败", global.Enum.TipType.TIP_BAD);
        }

    };

    onLogin(msg: any) {
        global.Instance.Log.debug("onLogin",msg)
        global.Module.GameData.setIsAdult(msg.age < 18);
        global.Module.GameData.setage(msg.age);
        if (!msg.errorID) {
            global.Module.TaskData.growUpTaskID = msg.growUpTaskID;
            let loginInfo = { req: msg.req };
            cc.sys.localStorage.setItem('loginInfo', JSON.stringify(loginInfo));

            if (msg.roleID != null) { //数据格式变化暂不使用
                global.Module.MainPlayerData.setRoleID(msg.roleID.toNumber());
                global.Instance.Log.debug("player login success %d", msg.roleID.toNumber());
            }
            global.Module.MainPlayerData.setRoleName(msg.roleName);
            global.Module.MainPlayerData.setSignature(msg.signature);
            global.Module.MainPlayerData.setFiveElem(msg.fiveEle);

            global.Instance.MsgPools.register('login', null);
        }
        else {
            global.CommonClass.Functions.logServerError(msg);
            if (msg.errorID == 14) {
                global.CommonClass.UITip.showTipTxt('重复登入,请尝试用新帐号', global.Enum.TipType.TIP_BAD);
            }
            else if (msg.errorID == 10008) {
                global.Manager.UIManager.open('DlgAdultConfirm', null, function (panel: { setTxt: (arg0: string) => void; }) {
                    if (panel)
                        panel.setTxt('每日22时至次日8时，未成年人用户无法登陆游戏。');
                })
            }
            else if (msg.errorID == 10009) {
                global.Manager.UIManager.open('DlgAdultConfirm', null, function (panel: { setTxt: (arg0: string) => void; }) {
                    if (panel)
                        panel.setTxt('非节假日未成年人每日累计游戏时间不得超过1.5小时，法定节假日每日累计游戏时间不得超过3小时。');
                })
            }
        }

    };

    onLoginNtf(msg:any) {
        global.Instance.Log.debug('onLoginNtf', msg)
        let roleBaseData = msg.infos.map[1].value.ntf;
        global.Module.MainPlayerData.onPlayerAttrNtf(roleBaseData);
        global.Module.GameData.setClientData(msg.clientData);
    };
    btnClick(event: any, arg: string) {
      
        if (arg == 'gameBtn') {
            let data = JSON.parse(cc.sys.localStorage.getItem('loginInfo'));
            if (data != null) {
                this.edtName.string = data.req.account;
                this.edtPassWord.string = data.req.password;
            } else {
                this.edtName.string = '';
                this.edtPassWord.string = '';
            }
            this.AccounLoginNode.active = true;
            this.SelectLoginNode.active = false;
        } else if (arg == 'remePassBtn') {
            global.Manager.UIManager.open('UIHandCode',null,null);
        }
        else if (arg == 'RegisterBtn') {
            global.Manager.UIManager.open('UIRealAgree',null,null);
        }
        else if (arg == 'LoginBtn' || arg == 'start') {
            let data = { account: '', password: '', platformType: 0, version: global.Module.GameData.getversion() };
            let txtAccount = this.edtName.string;
            data.account = txtAccount;
            let txtPassWord = this.edtPassWord.string;
            data.password = txtPassWord;
            if (global.Instance.Socket.isConnected()) {
                this.wxLoginsend(data);
            } else {
                var self = this;
                this.connectServer(function (isOpen: any) {
                    if (isOpen)
                        self.wxLoginsend(data);
                });
            }
        }
    };
    wxLoginsend(data: { account: any; password: any; platformType: any; userInfo?: any; version?: any; }) {
      
        global.Instance.Log.debug("登录---------------------",JSON.stringify(data))
        global.Instance.MsgPools.send('login', data, function (msg) {
            global.Instance.Log.debug("登录返回", msg)
            if (msg.errorID == 13) {
                global.CommonClass.UITip.showTipTxt('账号密码错误', global.Enum.TipType.TIP_BAD);
            } else {
                if (msg.errorID == 0) {
                    global.Module.GameData.setuserInfo(msg.req.userInfo)
                    global.Module.GameData.setAccountInfo(data.account, data.password, data.platformType);
                    global.Module.GameData.setFirstLogin(msg.firstLogin);
                    global.Module.GameData.setIsNeedCert(msg.isNeedCert);
                    global.Module.GameData.setisNeedUpdate(msg.isNeedUpdate);
                    global.Module.TaskData.setHasAcceptTask(msg.acceptTask);
                    global.Module.MainPlayerData.setguideID(msg.guideID);
                    global.Module.MainPlayerData.setguildID(msg.guildID);

                    global.Module.MainPlayerData.setguideState(msg.guideState);
                }
            }
        });
    };
    onDisable() {
        cc.systemEvent.off('wxLoginResult');
    };

    // update (dt) {}
}
