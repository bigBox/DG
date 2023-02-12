
const { ccclass, property } = cc._decorator;
@ccclass
export default class UnionApplyItem extends cc.Component {
    data: any;

    constructor() {
        super();
        this.data = null;
    };

    static createfunction(data, parent, position) {
        let filePath = "prefab/component/UnionApplyItem";
        cc.loader.loadRes(filePath, function (err, prefab) {
            if (err == null) {
                let newNode = cc.instantiate(prefab);
                // let parent =  cc.CommonClass.Functions.getRoot();
                parent.addChild(newNode, cc.macro.MAX_ZINDEX);
                newNode.setPosition(position);
                newNode.tagEx = data.baseInfo.roleId;

                let itemClass = newNode.getComponent(UnionApplyItem);
                itemClass.setData(data);
            }
        });
    };

    // use this for initialization
    onLoad() {

    };

    setData(data) {
        this.data = data;

        let lblName = this.node.getChildByName('lblName');
        let lblLevel = this.node.getChildByName('lblLevel');

        lblName.getComponent(cc.Label).string = data.baseInfo.roleName;
        lblLevel.getComponent(cc.Label).string = data.baseInfo.level.toString() + '级';

        let roleId = data.baseInfo.roleId;
        this.node.tagEx = roleId;

    };

    btnAgree(event, arg) {
        let evt = new cc.Event.EventCustom('onClickAgree', true);
        evt.setUserData(this.data);
        this.node.dispatchEvent(evt);
    };

    btnRefuse(event, arg) {
        let evt = new cc.Event.EventCustom('onClickRefuse', true);
        evt.setUserData(this.data);
        this.node.dispatchEvent(evt);
    };
}
