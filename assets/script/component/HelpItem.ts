
const { ccclass, property } = cc._decorator;
@ccclass
export default class HelpItem extends cc.Component {
    @property({ type: cc.SpriteFrame, displayName: "bgSp", tooltip: "" })
    bgSp: any = [];
    @property({ type: cc.Sprite, displayName: "bg", tooltip: "" })
    bg: cc.Sprite = null;
    data: any;

    constructor() {
        super();
        this.data = null;
    };

    static create(helpId, index, parent) {
        let filePath = "prefab/component/HelpItem";
        cc.loader.loadRes(filePath, function (err, prefab) {
            if (err == null) {
                let newNode = cc.instantiate(prefab);
                parent.addChild(newNode, cc.macro.MAX_ZINDEX);

                let itemClass = newNode.getComponent(HelpItem);
                itemClass.setData(index, helpId);
            }
        });
    };

    // use this for initialization
    onLoad() {


    };

    setData(index, helpId) {

        let helpData = global.Manager.DBManager.findData('illustrate', 'ID', helpId);
        let lblTilte = this.node.getChildByName('lblTitle');
        this.data = helpData;
        if (index != -1) {
            this.bg.spriteFrame = this.bgSp[index % 2];
            lblTilte.getComponent(cc.Label).string = helpData.title;
            this.node.tagEx = helpId;
        } else {
            this.bg.spriteFrame = this.bgSp[0];
            lblTilte.getComponent(cc.Label).string = "关于我们";
        }

    };

    getData() {
        return this.data;
    };

    btnItemClick(event, arg) {
       
        let evt = new cc.Event.EventCustom('onItemClick', true);
        evt.setUserData(this);
        this.node.dispatchEvent(evt);
    };
}
