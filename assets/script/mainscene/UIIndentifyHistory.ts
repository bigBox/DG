

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIIndentifyHistory extends cc.Component {
    ndRoot: cc.Node;

    onLoad () {};

    start () {

    };
    onEnable()
    {
        this.ndRoot = this.node.getChildByName('ndScrollRoot');

        let itemScroll =   this.ndRoot.getChildByName('spBack1').getChildByName('scroll')
        itemScroll.on('scrolling', this.scrolling, this);	
        itemScroll.getComponent(cc.ScrollView).scrollToOffset(cc.v2(0,0));
        
        this.show();
    };

    onDisable()
    {
        
    };

    show()
    {
        let itemSpace = 20;

        let historys = global.Module.IdentifyData.getHistory();
        let ndTemplateItem = this.node.getChildByName('ndTemplateItem');
        ndTemplateItem.active  = false;

        let page =   this.ndRoot.getChildByName('spBack1')
        let ndView = page.getChildByName('scroll').getChildByName('view');
        let ndItems = ndView.getChildByName('content');
        let itemSize = ndTemplateItem.getContentSize();
        let itemNum = historys.length;

        let sizeWidth = ndItems.getContentSize().width;
        ndItems.setContentSize(sizeWidth, (itemSize.height+itemSpace)*itemNum);
        ndItems.removeAllChildren();
        
        let itemPosY = -itemSize.height/2;
        let index = 1;
        for (let key in historys)
        {
            let history = historys[key];

            let newNode:any = cc.instantiate(ndTemplateItem);
        
            ndItems.addChild(newNode, cc.macro.MAX_ZINDEX);
            newNode.setPosition(cc.v2(0, itemPosY));
            newNode.active = true;
            let name = (index-1).toString();
            newNode.setName(name)

            let itemClass = newNode.getComponent(global.CommonClass.IndentifyHistoryItem);
            itemClass.setData(index, history);

            itemPosY -= (itemSize.height+itemSpace);

            index++;
        }
    };  

    scrolling()
    {
    };

    btnClose()
    {
        global.Manager.UIManager.close('UIIndentifyHistory');
    };
    // update (dt) {}
}
