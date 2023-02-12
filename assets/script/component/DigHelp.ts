
const {ccclass, property} = cc._decorator;

@ccclass
export default class DigHelp extends cc.Component {

    onLoad () {}

    start () {

    }
    static create(parent, position, dec) {
            let filePath =  "prefab/component/DigHelp";
            cc.loader.loadRes(filePath, function (err, prefab) 
            {
                if (err==null)
                {
                    let newNode = cc.instantiate(prefab);
                    parent.addChild(newNode, cc.macro.MAX_ZINDEX);
                    newNode.setPosition(position);
                    newNode.setName('DigHelp');
                    newNode.active = true;
                  
                    let itemClass = newNode.getComponent(global.CommonClass.DigHelp);
                    itemClass.setDec(dec);
                }
            });
        };

    setDec(dec) {
        let ndDec = this.node.getChildByName('ndHelp').getChildByName('lblDec');
        if (dec==null)
        {
            ndDec.active = false;
        }
        else
        {
            ndDec.active = true;
            ndDec.getComponent(cc.Label).string = dec;
        }
    };
    // update (dt) {}
}
