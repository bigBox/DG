const { ccclass, property } = cc._decorator;
//正常点击提示
@ccclass
export default class UITip extends cc.Component {


    static TipType: any = { TYPE_PAOPAO_TXT: 1, };

    static showError(errorKey: any) {
        let data = global.Manager.DBManager.findData('Error', 'key', errorKey);
        if (data == null) return;

        let params = {
            txt: data.text,
            color: 'ffffff',//'ff701c';
        };
        global.CommonClass.UITip.create(data.type, params,null);
    };

    static showText(txt: any, color: any, speed: any) {
        let params = { txt: txt, color: color, speed: speed };
        global.CommonClass.UITip.create(UITip.TipType.TYPE_PAOPAO_TXT, params,null);
    };

    static showTipTxt(txt: string, type: any) {
        if (txt == "") {
            return;
        }
        let color = 'ffffff';
        if (type == global.Enum.TipType.TIP_GOOD)
            color = 'ffffff';//'42f5ff';
        else if (type == global.Enum.TipType.TIP_BAD)
            color = 'ffffff';//'ff701c';
        this.showText(txt, color, null);
    };

    static create(type: any, params: any, parent: any) {
        let tip = new UITip();
        tip.show(type, params, parent);
    };
    start() { };

    /*
        type:TipType
        1--->params:{txt:'xxx',color:'ff00ff'}
        2--->params:new Array({itemID:1, itemNum:1});
        3--->params:new Array({itemID:1, itemNum:1});
        parent:node
    */
    show(type: string | number, params: { speed: any; color?: any; txt?: any; items?: any; text?: any; }, parent: { addChild: any; }) {
        var self = this;
        let filePath = "prefab/common/UITip";
        cc.loader.loadRes(filePath, function (err, prefab) {
            if (err == null) {
                let newNode = cc.instantiate(prefab);
                let index = global.Manager.UITipManager.getIndex();
                if (parent == null) {
                    let clickAnim = global.Manager.UIManager.getResident('clickAnim');
                    if (clickAnim)
                        parent = clickAnim.getTipNode();
                }
                parent.addChild(newNode);
                newNode.zIndex = (cc.macro.MAX_ZINDEX);
                newNode.y = index * -50 ;
                let nd = newNode.getChildByName('ndTxtTip');
                let userData = nd.getComponent(global.CommonClass.UserData);
                let flag = userData.iData;
                nd.active = (flag == type);
                if (nd.active)
                    self.reflash(type, params, nd,newNode);
                    global.Manager.UITipManager.addTip(UITip.TipType.TYPE_PAOPAO_TXT, params);
                
            }
        });
    };

    reflash(type: any, params: any, ndTip:cc.Node,newNode) {
        if (type == UITip.TipType.TYPE_PAOPAO_TXT) {
            let rhTxt = ndTip.getChildByName("rhTxt").getComponent(cc.Label);
            rhTxt.string = params.txt;
            let self= this;
            cc.tween(newNode)
                .delay(2)
                .to(0.16, { opacity: 0 })
                .call(() => {
                    self.paopaoEnd(newNode);
                })
                .start()
        }
    };
    tipClose() {
        let newNode = this.node
        let self = this;
        let y = newNode.y + 50;
        if (y == 50)
            global.Manager.UITipManager.clear();
        cc.tween(newNode)
            .to(0.06, { position: new cc.Vec3(0, y, 0) })
            .call(() => {
                if (y == 50)
                    if (newNode)
                        newNode.removeFromParent();
            })
            .start()
        
    };

    paopaoEnd(newNode) {
        if (newNode) {
            newNode.removeFromParent();
            global.Manager.UITipManager.clearTip();
        }
    };
}
