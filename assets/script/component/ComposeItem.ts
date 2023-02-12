
const {ccclass, property} = cc._decorator;
@ccclass
export default class ComposeItem extends cc.Component {
    itemData: any;
    size: any;

    static create(itemData, itemIdx, parent, position, callback) {
            let filePath =  "prefab/component/ComposeItem";
            cc.loader.loadRes(filePath, function (err, prefab) 
            {
                if (err==null)
                {
                    let newNode = cc.instantiate(prefab);
                    if (parent != null)
                        parent.addChild(newNode, cc.macro.MAX_ZINDEX);
                    newNode.setPosition(position.x, position.y);
                    newNode.setName(itemIdx.toString());

                    let itemIcon = newNode.getComponent(ComposeItem);
                    itemIcon.setItem(itemData);

                    if (callback)
                        callback(newNode);
                }
            });
        };

        constructor() {
            super();
        this.itemData = null;
    };

    // use this for initialization
    onLoad() {

    };

    getData()
    {
        return this.itemData;
    };

    getIndex() {
        let name = this.node.name;
        let itemIdx = parseInt(name);
        return itemIdx;
    };

    setItem(itemData) {
        this.itemData = itemData;

        if (itemData != null)
        {
            let itemID = this.itemData.itemID;
            let iconFile = "images/pictrue/items/default";
            let data=global.Manager.DBManager.getItem(itemData.compose);   
            if (data != null)
                iconFile = data.path+data.picName;
            let spItem = this.node.getChildByName('spItem');
            global.CommonClass.Functions.setTexture(spItem, iconFile,null);
    
            let ndInfo = this.node.getChildByName('ndInfo');
            let lblName = ndInfo.getChildByName('lblName');
            lblName.getComponent(cc.Label).string = data.name;

            let lblItemNum = this.node.getChildByName('lblNumber');
            let item = global.Module.PackageData.getItem(itemID);
            if (item != null)
                lblItemNum.getComponent(cc.Label).string = item.num.toString();
            else
                lblItemNum.getComponent(cc.Label).string = '0';
          
            this.node.active = true;
        }
        else
        {
            this.node.active = false;
        }

        this.showInfo(false);
        
        //lblNumber.active = (this.itemNum>1);
    };

    showInfo(isShow) {
        let ndInfo = this.node.getChildByName('ndInfo');
        ndInfo.active = isShow;

        let lblNumber = this.node.getChildByName('lblNumber');
        lblNumber.active = isShow;
    };

    setItemSize(itemSize) {
        this.size = itemSize;
        let curSize = this.node.getContentSize();
        this.node.setScale(itemSize/curSize.width, itemSize/curSize.height);
    };

    onComposeItemClick(msg) {
        let evt = new cc.Event.EventCustom('onComposeItemClick', true);
        let itemClass = this.node.getComponent(ComposeItem);
        evt.setUserData(itemClass);
        this.node.dispatchEvent(evt); 
    };
}

