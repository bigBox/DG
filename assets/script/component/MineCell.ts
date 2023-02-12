
const {ccclass, property} = cc._decorator;

@ccclass
export default class MineCell extends cc.Component {
    item: any;

    constructor() {
        super();
        this.item = null;
    };

    static create(item, position, parent, size)
        {
            let filePath =  "prefab/component/MineCell";
            cc.loader.loadRes(filePath, function (err, prefab) 
            {
                if (err==null)
                {
                    let newNode = cc.instantiate(prefab);
                    if (parent != null)
                        parent.addChild(newNode, cc.macro.MAX_ZINDEX);

                    newNode.name = 'mimecell'+item.idx.toString();
                    newNode.setPosition(position.x, position.y);
                    newNode.tagEx = item.idx;

                    let mineCell = newNode.getComponent(MineCell);
                    mineCell.reflashItem(item);
                    mineCell.setItemSize(size);
                }
            });
        };


    reflashItem(item)  {
        this.item = item;
        let mineData =global.Manager.DBManager.findData('DigGold', 'type', item.type);
        if (mineData!=null) {
            let spMine = this.node.getChildByName('spMine');
            let spItem =  this.node.getChildByName('spItem');
            spItem.active = false;
            if (mineData != null)
            {
                let picPath = 'images/pictrue/diggold/mine'+mineData.showType.toString()+'/mine'+mineData.showType.toString()+'_'+item.picIdx.toString();
                if (item.type == -1) {                                    //挖光
                    picPath = 'images/pictrue/diggold/digged';
                } else if (item.type >= 103000 && item.type < 104000) {   //恐龙蛋

                    let itemPic = 'images/pictrue/diggold/items/fossil';
                    global.CommonClass.Functions.setTexture(spItem, itemPic, null);
                    spItem.active = item.isShow;
                } else if (item.type >= 102000 && item.type < 103000 || item.type == 104001) {    //物品

                    let itemPic = ""
                    let items = global.Manager.DBManager.findData('Items', 'ID', mineData.itemGet);
                    if (item.type != 104001)
                        itemPic = 'images/pictrue/items/' + items.picName.toString();
                    else
                        itemPic = 'images/pictrue/items/700000017';

                        spItem.active = item.isShow;
                    global.CommonClass.Functions.setTexture(spItem, itemPic, function () {
                        spItem.setScale(0.7);
                    });

                }
                
                spMine.active = true;
               
                global.CommonClass.Functions.setTexture(spMine, picPath,null);
            }else {
                spMine.active = false;
                spItem.active = false;
            }
        }
        
        let lblIndex = this.node.getChildByName('lblIndex').getComponent(cc.Label);
        lblIndex.string = item.idx.toString();

        let lblType = this.node.getChildByName('lblType').getComponent(cc.Label);
        lblType.string = 'type'+item.type.toString()+'idx'+item.idx.toString();
       
    };

    setItemSize(size) {
        let curSize = this.node.getContentSize();
        let scaleX = size.width/curSize.width;
        let scaleY = size.height/curSize.height;

        this.node.scaleX = scaleX;
        this.node.scaleY = scaleY;
    };
}
