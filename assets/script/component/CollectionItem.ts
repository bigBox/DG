
const {ccclass, property} = cc._decorator;
@ccclass
export default class CollectionItem extends cc.Component {
    ndItems: cc.Node;
    ndItemScroll: any;
    data: any;

    // use this for initialization
    onLoad() {
        
        this.ndItems = this.node.getChildByName('ndItems');

    };

    onEnable()
    {
        this.ndItemScroll =  this.ndItems.getChildByName('itemScorll');

        this.node.on(cc.Node.EventType.TOUCH_START,  this.touchEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE,   this.touchEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_END,    this.touchEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);
        this.enableScrollClick(true);
    };

    onDisable()
    {
        this.node.off(cc.Node.EventType.TOUCH_START,  this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE,   this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_END,    this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);
        this.enableScrollClick(false);
    };

    enableScrollClick(isEnable)
    {
        if (isEnable)
        {
            this.ndItemScroll.on(cc.Node.EventType.TOUCH_MOVE,   this.touchEvent, this);	
            this.ndItemScroll.on(cc.Node.EventType.TOUCH_END,    this.touchEvent, this);	
            this.ndItemScroll.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);	
            this.ndItemScroll.on(cc.Node.EventType.TOUCH_START,  this.touchEvent, this);	
        }
        else
        {
            this.ndItemScroll.off(cc.Node.EventType.TOUCH_MOVE);	
            this.ndItemScroll.off(cc.Node.EventType.TOUCH_END);	
            this.ndItemScroll.off(cc.Node.EventType.TOUCH_CANCEL);	
            this.ndItemScroll.off(cc.Node.EventType.TOUCH_START);	
        }
    };

    touchEvent(event)
    {
        if (event.type == cc.Node.EventType.TOUCH_START)
        {
           
        }
        else if(event.type == cc.Node.EventType.TOUCH_MOVE)
        {
            
        }
        else if(event.type == cc.Node.EventType.TOUCH_END)
        {
            let data =  this.data;
            global.Manager.UIManager.open('UICollectionDetail', null, function(panel)
            {
                if (panel != null)
                    panel.show(data);
            })
        }
    };

    setData(data)
    {
        this.data  = data;

        let itemSpace = -60;

        let ID = data.id;
        let collectData = global.Manager.DBManager.findData('CollectionData', 'ID', ID);

        let items = data.items;
      
        let ndTempLate = this.ndItems.getChildByName('ndTemplateItem');
        ndTempLate.active = false;

        let ndView     =  this.ndItems.getChildByName('itemScorll').getChildByName('view');
        let ndItems    = ndView.getChildByName('content');
        let itemSize   = ndTempLate.getContentSize();

        let itemNum = items.length;
        let total   = itemNum;

        let sizeHeight = ndItems.getContentSize().height;
        let sizeWidth  = itemSize.width*total+itemSpace*(total-1);
        ndItems.setContentSize(sizeWidth, sizeHeight);
        ndItems.removeAllChildren();

        let itemPosX = itemSize.width/2+20;
        let idx = 0;

        for (idx=0; idx<itemNum; ++idx)
        {
            let newNode = cc.instantiate(ndTempLate);
            ndItems.addChild(newNode);

            newNode.active = true;

            let item = items[idx];

            let spItem = newNode.getChildByName('spItem');
            global.CommonClass.Functions.setItemTexture(spItem, item.id,null);

            let lblNumber = newNode.getChildByName('lblNumber');
            lblNumber.getComponent(cc.Label).string = 'X'+item.count.toString();

            newNode.setPosition(cc.v2(itemPosX, 0));

            itemPosX += itemSize.width+itemSpace;
        }

        let ndSelect = this.node.getChildByName('ndSelect');
        let lblName = ndSelect.getChildByName('lblName');
        lblName.getComponent(cc.Label).string = collectData.name;
        lblName.active = false;

        let lblNum = this.node.getChildByName('ndReward').getChildByName('lblNum');
        lblNum.getComponent(cc.Label).string  = 'X'+collectData.rewardGold.toString();

        let spSelect = this.node.getChildByName('spSelect');
        spSelect.active = false;
        
       // let btnReward = ndSelect.getChildByName('btnReward');
        //btnReward.active = (data.state!=0);
        
    };

    getData()
    {
        return this.data;
    };

    showReward(isShow)
    {
         let ndSelect = this.node.getChildByName('ndSelect');
         ndSelect.active = isShow;

         let btnClick = this.node.getChildByName('btnClick');
         btnClick.active = !isShow;

         let spSelect = this.node.getChildByName('spSelect');
         spSelect.active = isShow;
    };

    btnItemClick(event, arg)
    {
        let evt = new cc.Event.EventCustom('onColletItemClick', true);
        evt.setUserData(this);
        this.node.dispatchEvent(evt); 
    };

    btnRewardClick(event, arg)
    {
        let evt = new cc.Event.EventCustom('onRewardClick', true);
        evt.setUserData(this);
        this.node.dispatchEvent(evt); 

        event.target.active = false;
    };

    btnDetailClick(event, arg)
    {
        let evt = new cc.Event.EventCustom('onDetailClick', true);
        evt.setUserData(this);
        this.node.dispatchEvent(evt); 
    };
}
