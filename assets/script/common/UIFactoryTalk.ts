
const { ccclass, property } = cc._decorator;

@ccclass
export default class UIFactoryTalk extends cc.Component {
    static create(factoryID, parent) {

        let filePath = "prefab/common/UIFactoryTalk";
        cc.loader.loadRes(filePath, function (err, prefab) {
            if (err == null) {
                let newNode = cc.instantiate(prefab);
                if (parent == null)
                    parent = global.CommonClass.Functions.getRoot();

                let talkClass = newNode.getComponent(UIFactoryTalk);
                talkClass.setFactory(factoryID);

                newNode.zIndex = (cc.macro.MAX_ZINDEX);
                parent.addChild(newNode);

                talkClass.playTalk();
            }
        });
    };

    static createByName(name, parent) {
        let factoryData = global.Manager.DBManager.findData('Factory', 'name', name);
        UIFactoryTalk.create(factoryData.ID, parent);
    };

    static createByText(text, parent) {
        let filePath = "prefab/common/UIFactoryTalk";
        cc.loader.loadRes(filePath, function (err, prefab) {
            if (err == null) {
                let newNode = cc.instantiate(prefab);
                if (parent == null)
                    parent = global.CommonClass.Functions.getRoot();

                newNode.zIndex = (cc.macro.MAX_ZINDEX);
                parent.addChild(newNode);

                let talkClass = newNode.getComponent(UIFactoryTalk);
                talkClass.playByText(text);


            }
        });
    };
    factoryKey: string = '';
    // use this for initialization
    onLoad() {

    };

    onEnable() {
        //this.playTalk();
    };


    setFactory(ID) {
        let factoryData = global.Manager.DBManager.findData('Factory', 'ID', ID);
        this.factoryKey = factoryData.name;
    };

    setKey(key) {
        this.factoryKey = key;
    };

    playByText(text) {
        let ndTip = this.node.getChildByName('ndTxtTip');
        let rhTxt = ndTip.getChildByName("rhTxt").getComponent(cc.RichText);

        rhTxt.string = text;

        let animation = this.node.getComponent(cc.Animation);
        if (animation != null) {
            animation.play('tipFactoryTalk');
        }
    };

    playTalk() {
        let ndTip = this.node.getChildByName('ndTxtTip');
        let rhTxt = ndTip.getChildByName("rhTxt").getComponent(cc.RichText);

        let data = global.Manager.DBManager.findData('Factory', 'name', this.factoryKey);
        if (data != null) {
            let talk = data.talk;
            // let talk = '欢迎进入建筑';
            rhTxt.string = talk;
        }

        let animation = this.node.getComponent(cc.Animation);
        if (animation != null) {
            animation.play('tipFactoryTalk');
        }
    };

}
