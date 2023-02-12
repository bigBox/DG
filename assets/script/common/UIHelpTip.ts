

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIHelpTip extends cc.Component {
    data: any;
    closeCB: any;
    constructor() {
        super();
        this.data = null;
        this.closeCB = null;
    };
 

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }
    show(data) {
        this.data = data;
        if (data) {
            let nameNode = this.node.getChildByName(data.key);
            nameNode.active = true;
            if (data.key == 'Exploratory') {
                let ownerMap = global.Proxys.ProxyGuJi.getOwnerMap();
                ownerMap.reflashHelpTips(true);
                nameNode.getChildByName('bottom4').active = false;
                this.scheduleOnce(function () {
                    nameNode.getChildByName('bottom4').active = true;
                }, 10);
            }
        }  
    };
    reflash(){

    }
    setCloseCB(cb) {
        this.closeCB = cb;
    };
    UIHelpTipClick() {
        global.Manager.UIManager.close('UIHelpTip');
        var data = this.data;
        if (data.key == 'Exploratory') {
            let ownerMap = global.Proxys.ProxyGuJi.getOwnerMap();
            ownerMap.reflashHelpTips(false);

        }
       
        if (this.closeCB)
            this.closeCB();
            
    }
;
    // update (dt) {}
}
