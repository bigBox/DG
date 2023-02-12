const { ccclass, property } = cc._decorator;

@ccclass
export default class ProxyReLogin extends cc.Component{
    url: string;//websocket 连接路径
    connectCount: number;//websocket 连接几次大于7次不在连接
    isInReLogin: boolean; //true 继续断线重连
    isInFailed: boolean;//是否重新连接 true 继续 false 停止

    constructor() {
        super();
        this.url = '';
        this.connectCount = 0;
        this.isInReLogin = false;
        this.isInFailed = false;
    };

    reLogin() {
        let account = global.Module.GameData.getAccount();
        let passWord = global.Module.GameData.getPassword();

        let data = { account: account, password: passWord, platformType: global.Module.GameData.getPlatform() };
        global.Instance.MsgPools.send('relogin', data,null);
    };

    connect(url: string, callBack: any) {
        this.url = url;
        global.Instance.Socket.connect(url, callBack);
    };

    reConnectToServer() {
        let self = this;

        let callBack = function (event: { type: string; }) {
            if (event.type == 'open') {
                self.reLogin();

                self.connectCount = 0;
                self.setReloginFailed(false);
            }
            else if (event.type == 'close') {
                if (self.isInReLogin)
                global.CommonClass.UITip.showTipTxt('断线重连失败', global.Enum.TipType.TIP_BAD);
                else
                    self.reConnectToServer();
            }
            else {
                global.Instance.Log.debug('event type ' , event.type.toString());
            }
        }

        if (!global.Instance.Socket.isConnected()) {
            if (this.connectCount == 0) {
                cc.director.getScheduler().schedule(this.reConnectToServer, this, 3, cc.macro.REPEAT_FOREVER, 0, false);
                this.isInReLogin = true;
            }

            global.Instance.Socket.connect(this.url, callBack);
            this.connectCount++;
            global.CommonClass.UITip.showTipTxt('尝试与服务器重连' + this.connectCount.toString() + '次', global.Enum.TipType.TIP_BAD);

            if (this.connectCount >= 7) {
                cc.director.getScheduler().unschedule(this.reConnectToServer, this);
                this.setReloginFailed(true);
                this.connectCount = 0;

                let delayEnd = function () {
                    global.CommonClass.UIDialog.create("断线重连", '断线重连失败,请重新登入游戏', function (isYes: any) {
                        global.CommonClass.Functions.loadScene('LoginScene',null);
                    });
                };

                let delayAction = cc.delayTime(3);
                let endFunction = cc.callFunc(delayEnd)
                let seq = cc.sequence(delayAction, endFunction);

                let root = global.CommonClass.Functions.getRoot();
                root.runAction(seq);
            }
        }
    };

    onReLogin(msg: { errorID: number; }) {
        if (msg.errorID != 0) {
            global.CommonClass.UITip.showTipTxt('重新登入失败', global.Enum.TipType.TIP_BAD);
            let scene = cc.director.getScene();
            if (scene.name != "LoginScene" && scene.name.length > 0)
            global.CommonClass.Functions.loadScene("LoginScene",null);
        }
        else {
            cc.director.getScheduler().unschedule(this.reConnectToServer, this);

            global.CommonClass.UITip.showTipTxt('断线重连成功', global.Enum.TipType.TIP_GOOD);
            this.isInReLogin = false;

            let scene = cc.director.getScene();
            if ('DigGoldScene' == scene.name) {
                let data = {};
                global.Instance.MsgPools.send('checkScene', data, function (msg: any) {
                    global.Manager.UIManager.close('UIReConnect');
                });
            }
            else {
                global.Manager.UIManager.close('UIReConnect');
            }
        }
    };

    setReloginFailed(isFailed: boolean) {
        this.isInFailed = isFailed;
    };

    getIsReloginFailed() {
        return this.isInFailed;
    };
}
