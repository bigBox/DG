
const {ccclass, property} = cc._decorator;

@ccclass
export default class GuJiListItem extends cc.Component {
    data: any;

    constructor() {
        super();
        this.data = null;
    };

    static create(helpId, index, parent)
        {
            let filePath =  "prefab/component/GuJiListItem";
            cc.loader.loadRes(filePath, function (err, prefab) 
            {
                if (err==null)
                {
                    let newNode = cc.instantiate(prefab);
                    parent.addChild(newNode, cc.macro.MAX_ZINDEX);
                  
                    let itemClass = newNode.getComponent(GuJiListItem);
                    itemClass.setData(index, helpId);
                }
            });
    };

    // use this for initialization
    onLoad() {
        

    };

    setData(index, ID)
    {
        let gujiData = global.Manager.DBManager.findData('RobCfg', 'ID', ID);
        let lblIndex = this.node.getChildByName('lblIndex');
        lblIndex.getComponent(cc.Label).string = index.toString();

        let lblTilte = this.node.getChildByName('lblTitle');
        lblTilte.getComponent(cc.Label).string = gujiData.name;

        this.data = gujiData;

        this.node.tagEx = ID;
    };

    getData()
    {
        return this.data;
    };

    btnItemClick(event, arg)
    {
        let evt = new cc.Event.EventCustom('onItemClick', true);
        evt.setUserData(this);
        this.node.dispatchEvent(evt); 
    };

}



