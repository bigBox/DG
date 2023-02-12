import UIBase from "../common/UIBase";


const {ccclass, property} = cc._decorator;

@ccclass
export default class UIForum extends UIBase {
    webView: any;

    onLoad () {

        this.webView = this.node.getChildByName('webview').getComponent(cc.WebView);

        let account     = global.Module.GameData.getAccount();
        let password    = global.Module.GameData.getPassword();

        let url = 'http://118.25.3.4:8088/api/game/login?account='+account+'&password='+password;
        this.webView.url=url;

       //this.webView.url='https://www.baidu.com';
    };

    start ()
    {
        // 这里是与内部页面约定的关键字，请不要使用大写字符，会导致 location 无法正确识别。
        var scheme = "testkey";

        function jsCallback (target, url) {
            // 这里的返回值是内部页面的 URL 数值，需要自行解析自己需要的数据。
            var str = url.replace(scheme + '://', ''); // str === 'a=1&b=2'

            global.Instance.Log.debug('global',str);
            // webview target
            global.Instance.Log.debug('',target);
        }

        this.webView.setJavascriptInterfaceScheme(scheme);
        this.webView.setOnJSCallback(jsCallback);
    };

    onEnable()
    {
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEvent, this);	
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchEvent, this);	
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);
        this.node.on(cc.Node.EventType.MOUSE_WHEEL, this.touchEvent, this);
    };

    onDisable()
    {
        this.node.off(cc.Node.EventType.TOUCH_END, this.touchEvent, this);	
        this.node.off(cc.Node.EventType.TOUCH_START, this.touchEvent, this);	
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);
        this.node.off(cc.Node.EventType.MOUSE_WHEEL, this.touchEvent, this);
    };

    touchEvent(event)
    {
        if(event.type==cc.Node.EventType.TOUCH_END)
        {
            global.CommonClass.UITip.showTipTxt('运营时开放', global.Enum.TipType.TIP_BAD);
        }
    };

   
    btnClose(evnet, arg)
    {
        global.Manager.UIManager.close('UIForum');
    };

}
