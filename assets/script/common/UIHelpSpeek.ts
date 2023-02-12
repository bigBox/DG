

const { ccclass, property } = cc._decorator;

@ccclass
export default class UIHelpSpeek extends cc.Component {
    @property({ type: cc.RichText, displayName: "lblDec", tooltip: "输入内容" })
    lblDec: cc.RichText = null;
    @property({ type: cc.Node, displayName: "UIHelp", tooltip: "帮助" })
    UIHelp: cc.Node = null;
    
    decs: any[];
    curIdx: number;
    images: {};
    data: any;
    callback: any;
    isShow: boolean;
    constructor() {
        super();
        this.decs = [];
        this.curIdx = 0;
        this.images = {};
        this.isShow = false;
    };

    onLoad() { }

    start() {

    }
    onEnable() {
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);
        this.node.on(cc.Node.EventType.MOUSE_WHEEL, this.touchEvent, this);

        //this.show(this.guideKey);
    };

    onDisable() {
        this.node.off(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);
        this.node.off(cc.Node.EventType.MOUSE_WHEEL, this.touchEvent, this);
    };
    setisShow(){
        this.isShow = true;
    };

    touchEvent(event) {
        if (event.type == cc.Node.EventType.TOUCH_END) {
            ++this.curIdx;
            if (this.curIdx >= this.decs.length) {
                this.btnClose();
            }
            else {
                this.showPage(this.curIdx);
            }
        }
    };

    showPage(idx) {
        this.curIdx = idx;
        if (this.decs.length > 0) {
            this.lblDec.string = this.decs[idx];
            let ndShow = this.node.getChildByName('ndShow');
            if (ndShow != null) {
                ndShow.removeAllChildren();
                if (this.images[idx] != null) {
                    let image = this.images[idx];
                    let filePath = "prefab/help/" + image;
                    cc.loader.loadRes(filePath, function (err, prefab) {
                        if (err == null) {
                            let newNode = cc.instantiate(prefab);
                            ndShow.addChild(newNode);
                        }
                    });
                }
            }


        }
    };

    show(helpData) {
        this.isShow = false;
        this.data = helpData;

        this.decs = [];
        this.images = {};
        this.curIdx = 0;

        if (helpData != null) {
            for (let i = 1; i <= 17; ++i) {
                let value = helpData['helpDec' + i.toString()];
                if (value.length > 0) {
                    this.decs.push(value);
                }
                else {
                    break;
                }
            }
        }
        this.showPage(this.curIdx);
    };

    setClickCallBack(callback) {
        this.callback = callback;
    };

    btnPage(event, arg) {
        let flag = parseInt(arg);

        this.curIdx += flag;
        if (this.curIdx >= this.decs.length)
            this.curIdx = this.decs.length - 1;
        else if (this.curIdx < 1)
            this.curIdx = 0;

        if (this.curIdx < this.decs.length)
            this.showPage(this.curIdx);
    };

    btnFirstPage() {
        this.curIdx = 0;
        this.showPage(this.curIdx);
    };

    btnLookBack() {
        this.curIdx--;
        if (this.curIdx <= 0)
            this.curIdx = 0;

        this.showPage(this.curIdx);
    };

    btnAccept() {

    };

    btnClose() {
        if (this.callback)
            this.callback();
        if (this.isShow == true) {
            let ndSpeek = this.node.getChildByName('ndSpeek');
            var position = global.Manager.UIManager.coortrans(this.UIHelp,ndSpeek );
            cc.tween(ndSpeek)
                .call(() => {
                })
                .delay(0.5)
                .to(0.5, { scale: 0.1 })
                .call(() => {
                    this.UIHelp.active = true;
                })
                .delay(0.2)
                
                .to(1, { position: position })
                .call(() => {
                    ndSpeek.opacity = 0;
                })
                .delay(0.2)
                .call(() => {
                    global.Manager.UIManager.close('UIHelpSpeek');
                })
                .start()
        } else {
            global.Manager.UIManager.close('UIHelpSpeek');
        }
            
    };
    // update (dt) {}
}
