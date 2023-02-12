
const { ccclass, property } = cc._decorator;

@ccclass
export default class GuideSpeek extends cc.Component {

    static filePath: "prefab/component/";


    autoClose: boolean = true;
    guideKey: string = '';
    callback: any;
    decs: any[];
    images: {};
    curIdx: number;

    constructor() {
        super();
        this.callback = null;

        this.decs = [];
        this.images = {};
        this.curIdx = 0;

    };

    // use this for initialization
    onLoad() {

    };

    onEnable() {
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);
        this.node.on(cc.Node.EventType.MOUSE_WHEEL, this.touchEvent, this);

        let ndShow = this.node.getChildByName('ndShow');
        if (ndShow != null)
            ndShow.removeAllChildren();

        this.curIdx = 0;
    };

    onDisable() {
        this.node.off(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);
        this.node.off(cc.Node.EventType.MOUSE_WHEEL, this.touchEvent, this);
    };

    touchEvent(event) {
        if (event.type == cc.Node.EventType.TOUCH_END) {
            ++this.curIdx;
            if (this.curIdx >= this.decs.length) {
                if (this.callback)
                    this.callback();
            }
            else {
                this.showPage(this.curIdx);
            }
        }
    };

    showPage(idx) {
        this.curIdx = idx;
        if (this.decs.length > 0) {
            let lblDec = this.node.getChildByName('ndSpeek').getChildByName('back').getChildByName('lblDec').getComponent(cc.RichText);
            lblDec.string = this.decs[idx];

            let ndShow = this.node.getChildByName('ndShow');
            if (ndShow != null) {
                ndShow.removeAllChildren();
                // ndShow.active = false;
                if (this.images[idx] != null) {
                    let image = this.images[idx];
                    let filePath = "prefab/guide/" + image;
                    cc.loader.loadRes(filePath, function (err, prefab) {
                        if (err == null) {
                            let newNode = cc.instantiate(prefab);
                            ndShow.addChild(newNode);
                           
                            //ndShow.active = true;
                        }
                    }.bind(this));
                }
            }

            let btnNext = this.node.getChildByName('btnNext');
            btnNext.active = (this.curIdx < this.decs.length - 1);

            let btnPre = this.node.getChildByName('btnPre');
            btnPre.active = (this.curIdx > 0);

            let btnLookBack = this.node.getChildByName('btnLookBack');
            let btnOver = this.node.getChildByName('btnOver');
            if (this.curIdx >= this.decs.length - 1) {
                // lblNext.string = '结束';
                if (this.decs.length > 1) {
                    btnLookBack.active = true;
                    btnOver.active = true;
                }
                else {
                    btnLookBack.active = false;
                    btnOver.active = true;
                }
            }
            else {
                //lblNext.string = '后翻';
                btnLookBack.active = false;
                btnOver.active = false;
            }
        }
    };

    show(guideKey) {
        this.decs = [];
        this.images = {};
        this.curIdx = 0;

        let guideData = global.Manager.DBManager.findData('NewGuide', 'guideKey', guideKey);
        if (guideData != null) {
            let talkKey = guideData.talkKey;
            let idxs = guideData.talkIdx.split('_');
            if (idxs.length == 2) {
                let startIdx = parseInt(idxs[0]);
                let endIdx = parseInt(idxs[1]);

                let data = global.Manager.DBManager.findData('illustrate', 'key', talkKey);
                if (data != null) {
                    for (let i = startIdx; i <= endIdx; ++i) {
                        let image = data['opreator' + i.toString()];
                        let tagFlag = image.substr(0, 6);
                        if (tagFlag == 'Image:') {
                            this.images[i - startIdx] = image.substr(6, image.length);
                        }

                        let value = data['helpDec' + i.toString()];
                        if (value.length > 0) {
                            this.decs.push(value);
                        }
                        else {
                            break;
                        }
                    }
                }

                let lblTitle = this.node.getChildByName('ndLeft').getChildByName('lblTitle');
                lblTitle.getComponent(cc.Label).string = data.title;

                lblTitle = this.node.getChildByName('ndRight').getChildByName('lblTitle');
                lblTitle.getComponent(cc.Label).string = data.title;
            }
        }
        this.showPage(this.curIdx);
    };

    showNpcMode(isRight) {
        let ndLeft = this.node.getChildByName('ndLeft');
        let ndRight = this.node.getChildByName('ndRight');

        ndLeft.active = !isRight;
        ndRight.active = isRight;
    };

    showSpeek(isShow) {
        let ndSpeek = this.node.getChildByName('ndSpeek')
        let ndLeft = this.node.getChildByName('ndLeft');
        let ndRight = this.node.getChildByName('ndRight');
        let btnOver = this.node.getChildByName('btnOver');
        let btnLookBack = this.node.getChildByName('btnLookBack');
        ndLeft.active = isShow;
        ndRight.active = isShow;
        ndSpeek.active = isShow;
        btnOver.active = isShow;
        btnLookBack.active = isShow;
    };

    setClickCallBack(callback) {
        this.callback = callback;
    };

    btnPage(event, arg) {
        let flag = parseInt(arg);

        this.curIdx += flag;
        if (this.curIdx >= this.decs.length)
            this.curIdx = this.decs.length - 1;
        else if (this.curIdx < 0)
            this.curIdx = 0;

        if (this.curIdx < this.decs.length)
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

    btnClose(event) {
        if (this.callback)
            this.callback();

    };


    // update (dt) {}
}
