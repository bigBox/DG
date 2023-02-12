import UIBase from "../common/UIBase";


const { ccclass, property } = cc._decorator;

@ccclass
export default class UIIdentifyBag extends UIBase {
    targetIdx: number;
    puItemCB: any;
    constructor() {
        super();
        this.targetIdx = 0;      //鉴定物品ID不是显示位置
        this.puItemCB = null;
    };

    onLoad() { }

    start() {

    }
    onEnable() {

        let self = this;
        this.node.on('onPutItemClick', function (event) {
            self.onPutItemClick(event);
        });

        let itemScroll = this.node.getChildByName('spBack1').getChildByName('scroll')
        itemScroll.on('scrolling', this.scrolling, this);
        itemScroll.getComponent(cc.ScrollView).scrollToOffset(cc.v2(0, 0));
    };

    onDisable() {
        this.node.off('onPutItemClick');
    };



    show(targetIdx, puItemCB) {
        this.targetIdx = targetIdx;
        this.puItemCB = puItemCB;

        let data = global.Module.IdentifyData.getBagItems();
        global.Instance.Log.debug('UIIdentifyBag', data)

        this.reflashItems(data);
    };
    reflashItems(data) {
        let itemSpace = 3;
        let page = this.node.getChildByName('spBack1');

        let ndTemplateItem = this.node.getChildByName('ndTemplateItem');
        ndTemplateItem.active = false;

        let ndView = page.getChildByName('scroll').getChildByName('view');
        let ndItems = ndView.getChildByName('content');
        let itemSize = ndTemplateItem.getContentSize();
        let itemNum = data.length;
        let sizeWidth = ndItems.getContentSize().width;
        ndItems.setContentSize(980, (Math.ceil(itemNum/2)) * (273+5));
        ndItems.removeAllChildren();

        let itemPosY = -136.5;
        let itemPosX = -246.5;
        let k = 0;

        for (let key in data) {
            k++;
            itemPosY = -((Math.ceil(k / 2) - 1) * (273 + 5) + 136.5)
            if (k % 2 == 0)
                itemPosX = 240.5
            else
                itemPosX = -246.5
            let itemData = data[key];
            let newNode: any = cc.instantiate(ndTemplateItem);

            ndItems.addChild(newNode);
            newNode.setPosition(cc.v2(itemPosX, itemPosY));
            let index = parseInt(key);
            newNode.tagEx = index;

            newNode.active = true;

            let itemClass = newNode.getComponent(global.CommonClass.IndentifyBagItem);
            itemClass.setData(itemData);

            // itemPosY -= (itemSize.height + itemSpace);
        }
    };

    onPutItemClick(event) {
        let item = event.getUserData();
        let itemClass = item.getComponent(global.CommonClass.IndentifyBagItem);
        let itemData = itemClass.getData();

        let index = this.targetIdx;
        let self = this;
        var taskdata = global.Module.TaskData.getHasAcceptTaskData();
        if(taskdata && taskdata.taskId == 10001 && taskdata.state == 1 && itemData.itemId != '500401'){
            global.CommonClass.UITip.showTipTxt('请先鉴定虎首', global.Enum.TipType.TIP_BAD);
            return;
        }
        
        let data = { index: index, itemId: itemData.itemId }
        global.Instance.MsgPools.send('verifyEnqueue', data, function (msg) {
            if (!msg.errorID) {
                if (self.puItemCB)
                    self.puItemCB(index);
            }
        });

        global.Manager.UIManager.close('UIIdentifyBag');
    };

    scrolling() {
    };

    btnClose() {
        global.Manager.UIManager.close('UIIdentifyBag');
    }
    // update (dt) {}
}
