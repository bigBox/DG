
const { ccclass, property } = cc._decorator;

@ccclass
export default class GuideHelp extends cc.Component {

    onLoad() { }

    start() {

    }

    static create(parent, position, dec, callback) {
        let filePath = "prefab/component/GuideHelp";
        cc.loader.loadRes(filePath, function (err, prefab) {
            if (err == null) {
                let newNode = cc.instantiate(prefab);
                parent.addChild(newNode, cc.macro.MAX_ZINDEX);
                newNode.setPosition(position);
                newNode.setName('guideHelp');
                newNode.active = true;

                let itemClass = newNode.getComponent(global.CommonClass.GuideHelp);
                itemClass.setDec(dec);

                if (callback)
                    callback(itemClass);
            }
        });
    };

    setDec(dec) {
        global.Instance.Log.debug('',"guideHelpsetDec")
        let ndDec = this.node.getChildByName('ndHelp').getChildByName('lblDec');
        let back = this.node.getChildByName('ndHelp').getChildByName('back');

        if (dec == null) {
            ndDec.active = false;
            back.active = false;
        }
        else {
            ndDec.active = true;
            back.active = true;

            ndDec.getComponent(cc.Label).string = dec;
            let size = ndDec.getContentSize();
            size.width += 80; size.height += 40;
            back.setContentSize(size);
        }
    };

    setIconScale(scale) {
        this.node.getChildByName('ndHelp').getChildByName('shou1').setScale(scale);
    };

    setIconOffset(offset) {
        let ndIcon = this.node.getChildByName('ndHelp').getChildByName('shou1');
        let position = ndIcon.getPosition();
        let newPosition = cc.v2(position.x + offset.x, position.y + offset.y);
        ndIcon.setPosition(newPosition);
    };
}
