const {ccclass, property} = cc._decorator;
@ccclass
export default class ItemDrop extends cc.Component {
    itemID: any;
    isShowDec: any;
    decOpactiy: any;
    number: { toString: () => string; };

    static create(itemID: any, parent: { addChild: (arg0: any, arg1: number) => void; }, callBack: (arg0: any) => void) {
        let filePath =  "prefab/component/ItemDrop";
        cc.loader.loadRes(filePath, function (err, prefab) 
        {
            if (err==null)
            {
                let newNode = cc.instantiate(prefab);
                if (parent == null)
                    parent = global.CommonClass.Functions.getRoot();
                    
                    parent.addChild(newNode, cc.macro.MAX_ZINDEX);

                let itemDrop = newNode.getComponent(ItemDrop);
                itemDrop.setItem(itemID);

                if (callBack)
                    callBack(itemDrop);
            }
        });
    };
    static createAndDrop(itemID: any, itemNum: any, closeCB: null) {
        let position = global.Module.GameData.getDropStartPos();
        position.x += Math.ceil(Math.random()*80)-40;

        let parent = global.CommonClass.Functions.getRoot();

        let itemData = global.Manager.DBManager.getItemNew(itemID);
        let isShowDec = true;
        if (itemData != null)
        {
            isShowDec = global.Module.GameData.getNeedShowDropDec(itemID);
        }
        
        global.CommonClass.ItemDrop.createAndDrop2(itemID, itemNum, position, parent, closeCB, isShowDec,null);
    };

    static createAndDrop2(itemID: any, number: any, position: any, parent: any, closeCB: any, isShowDec: any, dropEnd: any){
        let data = global.Manager.DBManager.getItemNew(itemID);
        if (data.rare>=2)
        {
            global.Manager.UIManager.create('DlgItemDrop', null, function(panel: { setCloseCB: (arg0: any) => void; show: (arg0: any, arg1: any) => void; })
            {
                panel.setCloseCB(closeCB);
                panel.show(itemID, number);
            });
        }
        else
        {
            global.CommonClass.ItemDrop.create(itemID, parent, function(newItem)
            {
                let needShowDec = isShowDec&&global.Module.GameData.getNeedShowDropDec(itemID);
                
                newItem.node.setPosition(position);
                newItem.setNumber(number);
                newItem.setShowDec(needShowDec);
                newItem.playDrop(closeCB, dropEnd);
            });
        }
    };

    static createOneDrop(itemID: any, itemNum: any, parent: any, position: any, dropEnd: any){
        if (position == null)
            position = global.Module.GameData.getDropStartPos();

        position.x += Math.ceil(Math.random()*80)-40;

        let item = {itemID:itemID, itemNum:itemNum, type:0}
        let goods = [];
        goods.push(item);

        this.createMultiDrop(goods, parent, position, dropEnd);
    };

    static createMultiDrop(goods: string | any[], parent: any, position,  allDropEnd: () => void) {
        if (position == null)
            position = global.Module.GameData.getDropStartPos();

        if (parent==null)
            parent = global.CommonClass.Functions.getRoot();

        let dropItems = [];
        let showItems = [];
        let num = goods.length;
        for (let i=0; i<num; ++i)
        {
            let item     = goods[i];
            let itemData = global.Manager.DBManager.getItemNew(item.itemID);
            if (itemData.rare==2)
                showItems.push(item);
            else 
                dropItems.push(item);
        }

        let dropNum = dropItems.length;
        let showNum = showItems.length;

        let showDatas = [];
        for (let j=0; j<showNum; ++j)
        { 
            let showItem = showItems[j];
            let  data = {itemID:showItem.itemID, itemNum:showItem.itemNum, type:showItem.type};    //type 类型1、无；2、虚拟物品；3、故事；4奇遇； 5地图碎片；6植物 7陆地动物8水动物
            showDatas.push(data);
        }

        if (showNum> 0)
        {
            global.Manager.UIManager.open('DlgCollectDrop', parent, function(panel: { show: (arg0: any[]) => void; setCloseCB: (arg0: any) => void; })
            {
                panel.show(showDatas);
                panel.setCloseCB(allDropEnd);
               // panel.node.zIndex=(0);
            })
            global.Instance.AudioEngine.replaySound('drop2', false, 1);
        }

        let dropEnd = function()
        {
            dropNum--;
            if (dropNum <= 0)
            {
                if (showNum<=0 && allDropEnd)
                    allDropEnd();
            }
        }

        if (showNum<=0 && dropNum>=1)
            global.Instance.AudioEngine.playSound('drop1', false, 0.5,null);

        let rangeX = 500;
        let rangeY = 250;
        if (dropNum <= 1)
        {
            rangeX = 0;
            rangeY = 0;
        }
        
        for (let i=0; i<dropNum; ++i)
        {
            let dropItem = dropItems[i];
            let curPos = cc.v2(position.x, position.y);

            if (rangeX>0 && rangeY>0)
            {
                curPos.x +=  Math.ceil(Math.random()*rangeX)-rangeX/2;
                curPos.y +=  Math.ceil(Math.random()*rangeY)-rangeY/2;
            }
          
            global.CommonClass.ItemDrop.createAndDrop2(dropItem.itemID, dropItem.itemNum, curPos, parent, null, false, dropEnd);
        }
    };
    setItem(itemId: any){

        this.itemID = itemId;
        let iconFile = "images/pictrue/items/default";
        let data=global.Manager.DBManager.getItemNew(itemId);   
        if (data != null)
            iconFile = data.path+data.picName;

        let ndItem = this.node.getChildByName('ndItem');
        let ndSpItem = ndItem.getChildByName('spItem');
        // let ndNode = ndItem.getChildByName('ndNode');
        // let lblName = ndNode.getChildByName('lblName').getComponent(cc.Label);
        // lblName.string = data.name;

        global.CommonClass.Functions.setTexture(ndSpItem, iconFile, function (item) {
            if (ndSpItem&&item)
                item.scale = global.CommonClass.Functions.getToscale(item, 120, 120);
        });
    };
     
    setShowDec(isShow: any, decOpactiy: any) {
        this.isShowDec = isShow;
        this.decOpactiy = decOpactiy;
    };

    setNumber(number: { toString: () => string; }) {
        this.number = number;

		let data=global.Manager.DBManager.getItemNew(this.itemID); 
        
        if (data != null)
        {
            let ndItem    = this.node.getChildByName('ndItem');
            let ndNode = ndItem.getChildByName('ndNode');
            let lblNumber = ndNode.getChildByName('lblNumber');
            if(number>0)
            lblNumber.getComponent(cc.Label).string ='+'+number.toString();
            else
            lblNumber.getComponent(cc.Label).string =number.toString();
        }
    };

    playDrop(closeCB: () => void, dropEnd: () => void) {
        let ndItem    = this.node.getChildByName('ndItem');
        let animation = ndItem.getComponent(cc.Animation);
        let animState = animation.play("itemDrop");
        animState.wrapMode = cc.WrapMode.Normal;

        let self = this;
        let itemID = this.itemID;

        let playEnd = function()
        {
            if (dropEnd)
                dropEnd();

            let data=global.Manager.DBManager.getItemNew(itemID);   
            if (data.rare > 1)
            {
                global.Manager.UIManager.create('DlgItemDrop', null, function(panel: { show: (arg0: any, arg1: any, arg2: any) => void; setCloseCB: (arg0: any) => void; })
                {
                    panel.show(itemID, self.number, data.rare);
                    panel.setCloseCB(closeCB);
                   // panel.setBackOpacity(self.decOpactiy);
                });
            }
            else
            {
                if (closeCB)
                    closeCB();
            }
            self.node.removeFromParent();
          
        };

        animation.on('finished', playEnd);
    };
}
