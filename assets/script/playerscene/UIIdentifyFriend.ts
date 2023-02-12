import UIBase from "../common/UIBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIIdentifyFriend extends UIBase {
    curPickIdx: number;
    spItem: any;
    needAdjust: boolean;
    selectIdx: number;
    midX: number;
    topEmpty: number;
    buttomEmpty: number;
    itemSpace: number;
    lockOp: boolean;
    curDec: string;
    curDecIdx: number;
    curGetItem: number;
    isAtLast: boolean;
    isInScroll: boolean;
    startX: number;
    delayTime: number;
    isFirstUpdate: boolean;
    oldNum: number;
    ndNpc: cc.Node;
    ndTemplateItem: cc.Node;
    clickMask: cc.Node;
    curScroll: cc.Node;
    moveSchedule: any;
    curPickSpItem: any;

    constructor() {
        super();
        this.curPickIdx = -1;
        this.spItem     = null;

        this.needAdjust  = false;
        this.selectIdx   = -1;
        this.midX        = 0;

        this.topEmpty    = 0;
        this.buttomEmpty = 0;

        this.itemSpace = 140;
        this.lockOp    = false;

        this.curDecIdx = 0;
        this.curDec = '';

        this.curGetItem = 0;
        this.isAtLast   = false;
        this.isInScroll = false;

        this.startX     = 0;
        this.isFirstUpdate = true;
        this.delayTime = 0;

        this.oldNum    = 0;
    };

    // use this for initialization
    onLoad() {

        this.spItem  = this.node.getChildByName('Identify').getChildByName('spItem');
        this.ndNpc   = this.node.getChildByName('ndNpc');

        this.ndTemplateItem = this.node.getChildByName('ndTemplateItem');

        this.clickMask =  this.node.getChildByName('clickMask');
        this.clickMask.active = false;
    };
    start () {

    }
    reflashHelp() {
        var taskdata = global.Module.TaskData.getHasAcceptTaskData();
        let btnHome = this.node.getChildByName('btnHome');
        let helpNode = btnHome.getChildByName('help');
        if (helpNode)
        helpNode.active = (taskdata&&taskdata.taskId == 10009 && taskdata.state == 2 )
       
    };

    onEnable()
    {
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE,  this.touchEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_END,   this.touchEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL,this.touchEvent, this);
        {
            let windowSize=cc.winSize;
            let width = windowSize.width
            this.itemSpace = parseInt((width - 240*5)/6+'');
        }
        let self = this;
        this.node.on('onItemClick', function (event) {
            self.onItemClick(event);
          });

          this.node.on('onAddItemClick', function (event) {
            self.onAddItemClick(event);
          });
          this.node.on('onIndentifyItemClick', function (event) {
            self.onIndentifyItemClick(event);
          });
          this.node.on('onGetItemClick', function (event) {
            self.onGetItemClick(event);
          });

          this.node.on('onIdentifyPick', function (event) {
            self.onIdentifyPick(event);
            });
        this.node.on('onIdentifyUpdate', function (event) {
            self.onIdentifyUpdate(event);
            });

          global.Module.IdentifyData.setPanel(this);

        this.curScroll = this.node.getChildByName('buttom').getChildByName('itemScorll');
        this.curScroll.on('scrolling',    this.onScrolling,   this);	
        this.curScroll.on('scroll-ended', this.onScollEnd,    this);
        this.curScroll.on('scroll-began', this.onScollBegan,  this);

        this.randTalk(true);

        // let ID = global.Module.IdentifyData.getCurRoleID();
        // let friend = global.Module.FriendData.getFriend(ID);
        // if (friend)
        // {
        //     let lblName = this.node.getChildByName('UITitle').getChildByName('lblName');
        //     lblName.getComponent(cc.Label).string = friend.roleInfo.roleName+'的鉴定室';
        // }

        let ndIdentify   = this.node.getChildByName('Identify');
        ndIdentify.active = false;

        //this.enableTouchItem(false);

        this.checkSelect();
        this.scheduleOnce(this.reflash, 0.02);

        this.playAllItemJump(true);

        global.Module.GameData.setMaskSound(true,null);
    };

    onDisable()
    {
        this.node.off(cc.Node.EventType.TOUCH_START,    this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE,     this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_END,      this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL,   this.touchEvent, this);

        this.node.off('onItemClick');
        this.node.off('onAddItemClick');
        this.node.off('onIndentifyItemClick');
        this.node.off('onPutItemClick');
        this.node.off('onIdentifyPick');
        this.node.off('onIdentifyUpdate');

        global.Module.IdentifyData.setPanel(null);

        global.Manager.UIManager.close('UIFriendChoose');

        global.Module.GameData.setMaskSound(false,null);
    };

    enableTouchItem(isEnable)
    {
        let ndItemShow = this.node.getChildByName('ndItemShow');
        ndItemShow.active = isEnable;

        if (isEnable)
        {
            ndItemShow.on(cc.Node.EventType.TOUCH_START,    this.touchShowItem, this);
            ndItemShow.on(cc.Node.EventType.TOUCH_MOVE,     this.touchShowItem, this);
            ndItemShow.on(cc.Node.EventType.TOUCH_END,      this.touchShowItem, this);
            ndItemShow.on(cc.Node.EventType.TOUCH_CANCEL,   this.touchShowItem, this);
        }
        else
        {
            ndItemShow.on(cc.Node.EventType.TOUCH_START,    this.touchShowItem, this);
            ndItemShow.on(cc.Node.EventType.TOUCH_MOVE,     this.touchShowItem, this);
            ndItemShow.on(cc.Node.EventType.TOUCH_END,      this.touchShowItem, this);
            ndItemShow.on(cc.Node.EventType.TOUCH_CANCEL,   this.touchShowItem, this);

            this.stopTalk();
            let ndSpeek = this.node.getChildByName('ndSpeek');
            ndSpeek.active = false;
        }
    };
    friendBlick() {
        let UIFriendChoose = global.Manager.UIManager.get('UIFriendChoose');
        if (UIFriendChoose) {
            UIFriendChoose.move(true);
        } else {
            global.Manager.UIManager.open('UIFriendChoose', null, function (panel) {
                panel.show();
                panel.move(true);
            })
        }
    };
    reflashInfo()
    {
        //this.startX = this.caculateStart();

        // let lblItemNum = this.node.getChildByName('lblItemNum');
        // let total = global.Module.IdentifyData.getTotalItem(2);

        // lblItemNum.getComponent(cc.Label).string = total.toString();
    };

    onScrolling()
    {
        this.adjustScale();
        this.onScrollUpdate();

        this.isInScroll = true;
      //  global.Instance.Log.debug('scorlling..');
    };

    onScollBegan()
    {
        this.needAdjust = true;
       // this.playLight(false, true);

        this.changeState(true);
    };

    onScollEnd()
    {
        if (this.needAdjust)
        {
            //this.scrollToItem(this.selectIdx, false);
           // this.changeSelIndex(this.selectIdx);
            this.needAdjust = false;
        }
       
        this.changeState(false);
       // this.playLight(true, true);
    };

    caculateStart()
    {
        let ndView    =  this.curScroll.getChildByName('view');
        let totalSize = ndView.getContentSize();
        let midX      = totalSize.width/2;

       // let itemSize = this.ndTemplateItem.getContentSize();
       // let startX  = midX+(itemSize.width/2+this.itemSpace);

        return midX;
    };

    changeState(isInScroll)
    {
        this.playAllItemJump(!isInScroll);
        
        this.isInScroll = isInScroll;

    };


    changeSelIndex(index)
    {
        if (this.selectIdx != index)
        {

            this.isAtLast = global.Module.IdentifyData.isLast(2);
        
            this.selectIdx = index;
        }
    };

    playAllItemJump(isPlay)
    {
        if (isPlay)
        {
            let itemNum = global.Module.IdentifyData.getUnIdentifyNum();
            let showNum = itemNum;
            if (showNum>7)
                showNum = 7;
    
            let halfNum     = Math.ceil(showNum/2);
            let timeSpace   = halfNum*0.8;
    
            let self = this;
            let playAnimation = function(itemIdx, startDelay)
            {
                if (itemIdx>=0 && itemIdx<itemNum)
                {
                    let callBack = function()
                    {    
                        self.playItemJump(itemIdx, timeSpace);
                    };
                    let endFunction = cc.callFunc(callBack);
                    let timeDelay   = cc.delayTime(startDelay);
    
                    let seq = cc.sequence(timeDelay, endFunction);
                    let itemClass = self.getItemClass(itemIdx);
                    if (itemClass != null)
                        itemClass.node.runAction(seq);
                }
            };

            playAnimation(this.selectIdx, 0.1);
            for (let j=1; j<halfNum; ++j)
            {
                let indexL = this.selectIdx-j;
                playAnimation(indexL, j*0.8);
                   
                let indexR = this.selectIdx+j;
                playAnimation(indexR, j*0.8);
            }
        }
        else
        {
            let ndView   = this.curScroll.getChildByName('view');
            let ndItems  = ndView.getChildByName('content').children;
            for (let key in ndItems)
            {
                let ndItem = ndItems[key];
                ndItem.stopAllActions();
            }
        }
    };

    playItemJump(index, timeSpace)
    {
        let ndView   = this.curScroll.getChildByName('view');
        let ndItems  = ndView.getChildByName('content');
        let ndItem   = ndItems.getChildByName(index.toString());
      
        if (ndItem == null)
            return;

      //  let contentSize = spItem.getContentSize();
        let spItem   = ndItem.getChildByName('ndItem');
        let position = spItem.getPosition();
       // position.y   = -contentSize.height/2+20;
      
        spItem.stopAllActions();
        spItem.setPosition(position);

        let goodsAct1    = cc.moveTo(0.2, cc.v2(position.x, position.y+15));
        let goodsBack1   = cc.moveTo(0.2, cc.v2(position.x, position.y));
        let goodsAct2    = cc.moveTo(0.1, cc.v2(position.x, position.y+5));
        let goodsBack2   = cc.moveTo(0.1, cc.v2(position.x, position.y));
        let delayEnd     = cc.delayTime(timeSpace);

        let seq     = cc.sequence(goodsAct1, goodsBack1, goodsAct2, goodsBack2, delayEnd);
        let repeat  = cc.repeatForever(seq);
        
        spItem.runAction(repeat);
    };

    indentifyActionEnd()
    {
        let ndIdentify = this.node.getChildByName('Identify');
     
        let ndAnimItem = ndIdentify.getChildByName('ndAnimItem');
        let ndCricle = ndIdentify.getChildByName('ndCricle');

        ndAnimItem.active   = false;
        ndCricle.active     = false;
     
        let slAnimItem = ndAnimItem.getComponent(sp.Skeleton);
        slAnimItem.paused = true;

        let animation = ndCricle.getChildByName('spCricle').getComponent(cc.Animation);
        animation.stop();
    };

    runIndentifyAction(callback)
    {
        let self = this;

        let ndIdentify  = this.node.getChildByName('Identify');
      
        let ndAnimItem  = ndIdentify.getChildByName('ndAnimItem');
        let ndCricle    = ndIdentify.getChildByName('ndCricle');

        //let itemID      = self.curGetItem;
      //  let spinePath   = this.getSpinePath(itemID);
        //let hasSpine    = spinePath!=null;

        ndAnimItem.active   = false;
        ndCricle.active     = true;

        let delay = cc.delayTime(1);
        let onDelayEnd = function()
        {
            self.playLight(false, false,null);
            self.indentifyActionEnd();

            if (callback)
                callback();
        }
        this.node.stopAllActions();
        let endFun = cc.callFunc(onDelayEnd);
        let seq = cc.sequence(delay, endFun);
        this.node.runAction(seq);

  

        let animation = ndCricle.getChildByName('spCricle').getComponent(cc.Animation);
        let animState = animation.play("btnCricle");
        animState.wrapMode = cc.WrapMode.Loop;
    };

    runCricleAction(isRun, ndTarget, callBack) {
        let ndIdentify  = this.node.getChildByName('Identify');
        let ndCricle    = ndIdentify.getChildByName('ndCricle');
        let ndLight    = ndIdentify.getChildByName('ndLight');

        ndIdentify.active   = isRun;
        ndCricle.active     = isRun;
        ndLight.active      = false;

        global.CommonClass.Functions.setNodePosToTarget(ndCricle, ndTarget, cc.v2(0, 250));

        let animation = ndCricle.getChildByName('spCricle').getComponent(cc.Animation);
        if (isRun)
        {
            let animState = animation.play("btnCricle");
            animState.wrapMode = cc.WrapMode.Loop;

            let delay = cc.delayTime(0.7);
            let onDelayEnd = function()
            {
                ndIdentify.active = false;

                if (callBack)
                    callBack();
            }
            this.node.stopAllActions();
            let endFun = cc.callFunc(onDelayEnd);
            let seq = cc.sequence(delay, endFun);
            this.node.runAction(seq);
        }
        else
        {
            animation.stop("btnCricle");
        }
    };

    playLight(isShow, isPlay, showIdx)
    {
        let showPosY = 0;
        let hidePosY = 372;

        let ndIdentify   = this.node.getChildByName('Identify');
        let ndLight      = ndIdentify.getChildByName('ndLight');
        let spLight      = ndLight.getChildByName('spLight');
        ndIdentify.active   = isShow;
        spLight.opacity     = 100;

       let animation       = spLight.getComponent(cc.Animation);

        if (isPlay)
        {
            let animState = animation.play("fadeInOut");
            animState.wrapMode = cc.WrapMode.Loop;
        }
        else
        {
         //   animation.stop("fadeInOut");
        }

        let curPos = ndIdentify.getPosition();
        if (isShow)
        {
            let ndView  = this.curScroll.getChildByName('view');
            let ndItems = ndView.getChildByName('content');

            let item    = global.Module.IdentifyData.getUnIdentifyItem(showIdx);
            let ndItem  = ndItems.getChildByName(item.index.toString());
        
            if (ndItem != null)
            {
                let worldPos = ndItem.convertToWorldSpaceAR(cc.v2(0,0));
                let position = this.node.convertToNodeSpaceAR(worldPos);
             
                ndIdentify.setPosition(cc.v2(position.x, curPos.y));
                ndLight.stopAllActions();

                let action = cc.moveTo(0.3, cc.v2(0, showPosY));
                ndLight.runAction(action);
            }
        }
        else
        {
           // ndLight.setPosition(cc.v2(curPos.x, curPos.y));
            ndLight.stopAllActions();

            let action = cc.moveTo(0.3, cc.v2(0, hidePosY));
            ndLight.runAction(action);
        }
        
    };

    checkSelect()
    {
        let itemNum = global.Module.IdentifyData.getUnIdentifyNum();
        if (this.selectIdx>=itemNum || this.isAtLast)
            this.selectIdx = itemNum-1;

        if (itemNum<=0)
            this.selectIdx = -1;
        else
        {
            if (this.selectIdx < 0)
                this.selectIdx = 0;
        }
    };

    centerToItem(itemIdx)
    {
        let viewIdx = itemIdx+this.topEmpty;

        let scrollView = this.curScroll;
        let viewClass = scrollView.getComponent(cc.ScrollView);

        let curOffset = viewClass.getScrollOffset();

        let itemSize = this.ndTemplateItem.getContentSize();
        let offset = (this.itemSpace+itemSize.width)*(viewIdx-this.topEmpty);
       // offset -= scrollView.getContentSize().width;

        let speed = 800;
        let distance = Math.abs(offset+curOffset.x);
        let time = distance/speed;

        let maxOffset:any = viewClass.getMaxScrollOffset();
        if (offset >maxOffset)
            offset = maxOffset;
        else if(offset<0)
            offset = 0;

        viewClass.stopAutoScroll();
        viewClass.scrollToOffset(cc.v2(offset, 0), time);

        return time;
    };

    adjustScale()
    {
        let maxAddScale = 0.2;

        let ndView   = this.curScroll.getChildByName('view');
        let ndItems  = ndView.getChildByName('content');
        let itemNum = global.Module.IdentifyData.getUnIdentifyNum();

        for(let i=0; i<itemNum; ++i)
        {
            let ndItem:any  = ndItems.getChildByName(i.toString());
            if (ndItem != null)
            {
                let position = ndItem.getPosition();
                let itemSize = this.ndTemplateItem.getContentSize();
                let oneDistance = itemSize.width+this.itemSpace;
    
                let itemClass = ndItem.getComponent(global.CommonClass.IndentifyItem);
                let distance = Math.abs(position.x-this.midX);
                if (distance > oneDistance)
                {
                    itemClass.scaleItem(0.8);
                }
                else
                {
                    let reduction = Math.abs(oneDistance-distance)/oneDistance*maxAddScale;
                    let scale = 0.8+reduction;
                    itemClass.scaleItem(scale);
                }
            }
            else
            {
                //global.Instance.Log.debug('yyyyy');
            }
        }
    };

    onScrollUpdate()
    {
        let scrollView = this.curScroll;
        let viewClass  = scrollView.getComponent(cc.ScrollView);
        let offset     = viewClass.getScrollOffset();

        let itemSize    = this.ndTemplateItem.getContentSize();
        let oneDistance = this.itemSpace+itemSize.width;

        let itemIdx = Math.ceil(-offset.x/oneDistance-0.5);
        if (itemIdx<0)itemIdx = 0;

        this.changeSelIndex(itemIdx);

        let ndView    = this.curScroll.getChildByName('view');
        let itemWidth = ndView.getContentSize().width;
        this.midX     = itemWidth/2-offset.x;

        this.adjustScale();
    };

    scrollToItem(itemIdx, isImmed)      //begin form 0
    {
        let scrollView = this.curScroll;
        let viewClass = scrollView.getComponent(cc.ScrollView);

        let itemSize = this.ndTemplateItem.getContentSize();
        let offset = (this.itemSpace+itemSize.width)*(itemIdx);

        let maxOffset = viewClass.getMaxScrollOffset();
        if (offset >maxOffset.x)
            offset = maxOffset.x;
        else if(offset<0)
            offset = 0;

        viewClass.stopAutoScroll();
        if (!isImmed)
            viewClass.scrollToOffset(cc.v2(offset, 0),2);
        else
            viewClass.scrollToOffset(cc.v2(offset, 0));
    };

    enableSpeakTouch(isEnable)
    {
        let ndSpeek = this.node.getChildByName('ndSpeek');
        ndSpeek.active = isEnable;

        if (isEnable)
        {
            ndSpeek.on(cc.Node.EventType.TOUCH_START,  this.touchSpeak, this);
            ndSpeek.on(cc.Node.EventType.TOUCH_MOVE,   this.touchSpeak, this);
            ndSpeek.on(cc.Node.EventType.TOUCH_END,    this.touchSpeak, this);
            ndSpeek.on(cc.Node.EventType.TOUCH_CANCEL, this.touchSpeak, this);
        }
        else
        {
            ndSpeek.off(cc.Node.EventType.TOUCH_START,  this.touchSpeak, this);
            ndSpeek.off(cc.Node.EventType.TOUCH_MOVE,   this.touchSpeak, this);
            ndSpeek.off(cc.Node.EventType.TOUCH_END,    this.touchSpeak, this);
            ndSpeek.off(cc.Node.EventType.TOUCH_CANCEL, this.touchSpeak, this);
        }
    };

    touchSpeak(event)
    {
        if (event.type==cc.Node.EventType.TOUCH_END)
        {
            this.stopTalk();

            let ndSpeek = this.node.getChildByName('ndSpeek');
            ndSpeek.active = false;
        }
    };

    reflashHeadInfo()
    {
        let headInfo = this.node.getChildByName('headInfo');
        let lblLevel = headInfo.getChildByName('lblLevel').getComponent(cc.Label);
        let lblName  = headInfo.getChildByName('lblName').getComponent(cc.Label);

        let level = global.Module.MainPlayerData.getDataByKey('Level');
        if (level != null)
            lblLevel.string = level.toString()+'级';
        else
            lblLevel.string = '1级';

        let name = global.Module.MainPlayerData.getRoleName();
        if (name != null)
            lblName.string = name;
        else
            lblName.string = '';
    };

    reflashSelfInfo()
    {
        let honor = global.Module.MainPlayerData.getDataByKey('Reputation');
        let honorLevel = global.Module.MainPlayerData.getDataByKey('ReputationLevel');

        if (honorLevel<=0)
            honorLevel = 1;

        let ndBarHonor = this.node.getChildByName('barHonor');
       
        let barHonor       = ndBarHonor.getComponent(cc.ProgressBar);
        let lblHonor       = ndBarHonor.getChildByName('lblHonor').getComponent(cc.Label);
        let lblHonorTitle  = ndBarHonor.getChildByName('lblTitle').getComponent(cc.Label);
        let lblHonorLevel  = ndBarHonor.getChildByName('lblHonorLev').getComponent(cc.Label);
        
        let data = global.Manager.DBManager.findData('ReputationLevel', 'Id', honorLevel);

        if (honor != null)
        {
            if (data != null)
            {
                let allData = global.Manager.DBManager.getData('ReputationLevel');
                let nextNeed = 0;
                let preNeed  = 0;

                for (let k in allData)
                {
                    let value = allData[k];
                    if (honorLevel == value.Id)
                    {
                        nextNeed = value.UpLevelExp;
                        preNeed  = value.UpLevelTotalExp;
                        break;
                    }
                }

                let showHonor      = Math.floor((honor-preNeed));
                let showNextNeed   = Math.floor(nextNeed);

                lblHonor.string = honor.toString();

                if (showNextNeed==0 || showHonor==0)
                    barHonor.progress = 0.001;
                else
                    barHonor.progress = showHonor/showNextNeed;
            
                lblHonorTitle.string = data.name;
                lblHonorLevel.string = honorLevel.toString();
            }
            else
            {
                barHonor.progress = 1;
                lblHonor.string = '0';
                lblHonorTitle.string = '';
                lblHonorLevel.string = '0';
            }
        }
        else
        {
            barHonor.progress = 0.001;
            lblHonorTitle.string = '';
            lblHonor.string = '0';
        }
    };

    reflash()
    {
        this.startX = this.caculateStart();

        this.reloadTableView();
        this.reflashSelfInfo();
        this.reflashHeadInfo();
    
        let itemNum = global.Module.IdentifyData.getUnIdentifyNum();
        if (itemNum > 0)
        {
            this.selectIdx = 2;
            this.scrollToItem(this.selectIdx,null);
            this.onScrollUpdate();
            this.adjustScale();
        }
        this.reflashInfo();
    };

    newItem (data, itemPosX)
    {
        if (data != null)
        {
            let ndView  = this.node.getChildByName('buttom').getChildByName('itemScorll').getChildByName('view');
            let ndItems = ndView.getChildByName('content');

            let sizeHeight = ndItems.getContentSize().height;

            let newNode:any = cc.instantiate(this.ndTemplateItem);
            ndItems.addChild(newNode, cc.macro.MAX_ZINDEX);
            newNode.active = true;
            newNode.setPosition(cc.v2(itemPosX, -sizeHeight/2));

            if (data.index != null)
                newNode.name = data.index.toString();
            else
                global.Instance.Log.debug('','eeeeee');

            let itemClass = newNode.getComponent(global.CommonClass.IndentifyItem);
            itemClass.setData(data);


            return newNode;
        }
        return null;
    };

    reloadTableView()
    {
        let items = global.Module.IdentifyData.getUnIdentify();

        let ndView  = this.node.getChildByName('buttom').getChildByName('itemScorll').getChildByName('view');
        let ndItems = ndView.getChildByName('content');
        let ndTempLate  = this.ndTemplateItem;
        ndTempLate.active = false;
        let itemSize    = ndTempLate.getContentSize();

        let itemNum = items.length;
        let total = this.topEmpty+this.buttomEmpty+itemNum;

        let midx = ndView.getContentSize().width/2;

        let info = midx.toString() + '   ' + ndView.getContentSize().width.toString();
        let lblInfo = this.node.getChildByName('lblInfo').getComponent(cc.Label);
        lblInfo.string = info;

        let itemPosX = this.startX;
        let exWidth = (this.startX-itemSize.width/2)*2;

        let sizeHeight = ndItems.getContentSize().height;
        let totalWidth  = itemSize.width*total+this.itemSpace*(total-1)+exWidth;

        ndItems.setContentSize(totalWidth, sizeHeight);
        ndItems.removeAllChildren();

        let idx = 0;
      
        for (idx=0; idx<this.topEmpty; ++idx)
        {
            let itemData = {index:-1, itemID:null, isIndentify:false, state:-1};
            this.newItem(itemData, itemPosX);
            itemPosX += itemSize.width+this.itemSpace;
        }

        for (idx=0; idx<itemNum; ++idx)
        {
            let item = items[idx];

            let itemData = {index:item.index, itemID:item.itemID, isIndentify:false, state:item.state, pickTime:item.pickTime};
            let newNode = this.newItem(itemData, itemPosX);
            newNode.tagEx = (idx);
      
            itemPosX += itemSize.width+this.itemSpace;
        }

    };

    getIconFileByItem(itemID)
    {
        let iconFile = "images/pictrue/items/default";
        let data=global.Manager.DBManager.getItemNew(itemID);   
        if (data != null)
           // iconFile = data.showImage;
           iconFile = data.path+data.picName;

        return iconFile;
    };

    getShowImageByID(itemID)
    {
        let iconFile = '';
        let data = global.Manager.DBManager.findData("Precious", 'ID', itemID);;   
        if (data != null)
            iconFile = data.showImage;

        if (iconFile.length <= 0)
            iconFile = global.CommonClass.Functions.getItemPicPathNew(itemID);

        return iconFile;
    };

    getSpinePath(itemID)
    {
        let data = global.Manager.DBManager.findData("Precious", 'ID', itemID);;   
        if (data!=null && data.spine.length>0)
        {
            return data.spine;
        }

        return null;
    };
    
    getItemClass(itemIdx)
    {
        let ndView  = this.node.getChildByName('buttom').getChildByName('itemScorll').getChildByName('view');
        let ndItems = ndView.getChildByName('content');
        let item:any    = ndItems.getChildByName(itemIdx.toString());

        let itemClass   = null;
        if (item != null)
            itemClass   = item.getComponent(global.CommonClass.IndentifyItem);
       
        return itemClass;
    };

    getItemByShowIdx(showIdx)
    {
        let ndView  = this.node.getChildByName('buttom').getChildByName('itemScorll').getChildByName('view');
        let ndItems = ndView.getChildByName('content').children;

        for (let key in ndItems)
        {
            let item:any = ndItems[key];
            let itemIdx = item.tagEx;
            if (showIdx==itemIdx)
            {
                return item.getComponent(global.CommonClass.IndentifyItem);
            }
        }
    
        return null;
    };



  
    makeTalkDec(identifyItem, type)
    {
        let itemData = global.Manager.DBManager.getItemNew(identifyItem.itemID);
        let itemQuality = itemData.color;
        let rare        = itemData.rare;

        let ID = type*100+rare*10+itemQuality;
        let decData = global.Manager.DBManager.findData('IdentifyTalk', 'ID', ID);
        if (decData != null)
        {
            let dec = decData.talk;

            let itemDec = itemData.name;
            dec = dec.replace(/BMW/, itemDec);
    
            let name = global.Module.MainPlayerData.getRoleName();
            let nameDec = name;
            dec = dec.replace(/ZRM/, nameDec);
    
            if (identifyItem.verifyName)
            {
                let identifyName = identifyItem.verifyName;
                dec = dec.replace(/HYM/, identifyName);
            }
    
            return dec;
        }
        else
        {
            global.Instance.Log.debug('','err..makeTalkDec');
            return '';
        }
        
    };

    playIndentifyTalk(isTalk, identifyItem, type)        //type: 1添加 2:取回 3:鉴定
    {
        this.stopTalk();
        this.enableSpeakTouch(true);
      //  let typeDec = {1:'添加', 2:'取回', 3:'鉴定'};
        //let rereDec = {1:'普通', 2:'稀有'};
       // let qualityDec = {1:'未鉴定',  2:'完美', 3:'瑕疵', 4:'破损', 5:'残破'};
       
        if (isTalk)
        {
            let dec =  this.makeTalkDec(identifyItem, type);

            this.curDec     = dec;
            this.curDecIdx  = 0;

            let ndSpeek = this.node.getChildByName('ndSpeek');
            let lblDec = ndSpeek.getChildByName('lblDec').getComponent(cc.Label);
            lblDec.string = '';
    
            let perSpeed = 0.03;
            cc.director.getScheduler().schedule(this.updataTalk,this,  perSpeed,  cc.macro.REPEAT_FOREVER, 0, false);
        }
        else
        {
            if (this.curDecIdx >= 0)
            {
                this.curDecIdx = -1;
                cc.director.getScheduler().unschedule(this.updataTalk, this);
            }
        }
    };

    addNewItem(isAddEnd)
    {
       let itemNum  = global.Module.IdentifyData.getUnIdentifyNum();
       let itemSize = this.ndTemplateItem.getContentSize();
       let offset   = this.itemSpace+itemSize.width;

       if (isAddEnd)
       {
           let posX = this.startX+offset*itemNum;

           let item = global.Module.IdentifyData.getUnIdentifyItem(itemNum-1);
           let data = {index:item.index, ID:item.itemID, isIndentify:false};

           this.newItem(data, posX);
       }
       else
       {
            let posX = this.startX-offset;
            let item = global.Module.IdentifyData.getUnIdentifyItem(0);
            let data = {index:item.index, ID:item.itemID, isIndentify:false};

            this.newItem(data, posX);
       }
    };

    autoMoveItems(startIdx, callBack)        //鉴定后自动移动一格其它物品
    {
        let self     = this;

        let ndView   = this.curScroll.getChildByName('view');
        let ndItems  = ndView.getChildByName('content');
        let itemNum  = global.Module.IdentifyData.getUnIdentifyNum();
        let maxShow = global.Module.IdentifyData.getMaxItem(2);

        let needAddItem = itemNum==maxShow;
        let isEnd       = (startIdx==this.oldNum-1);

        //改变编号
        if (!isEnd)
        {
            for (let oldIdx=startIdx+1; oldIdx<this.oldNum; ++oldIdx)
            {
                let itemClass = this.getItemClass(oldIdx);
                if (itemClass != null)
                    itemClass.setIndex(oldIdx-1);
            }
        }
        else
        {
            if (needAddItem)
            {
                for (let oldIdx=startIdx-1; oldIdx>=0; --oldIdx)
                {
                    let itemClass = this.getItemClass(oldIdx);
                    if (itemClass != null)
                        itemClass.setIndex(oldIdx+1);
                }
            }
        }

        if (needAddItem)
            this.addNewItem(!isEnd);

        let isFirstMove = true;
        let moveItem = function(idx, isEnd)
        {
            let ndItem = ndItems.getChildByName(idx.toString());

            if (ndItem != null)
            {
                let itemSize = self.ndTemplateItem.getContentSize();
                let offset   = self.itemSpace+itemSize.width;
    
                if (isEnd)
                    offset = -offset;
    
                let action   = cc.moveBy(1, cc.v2(-offset, 0));
                ndItem.stopAllActions();
    
                if (isFirstMove)
                {
                    self.moveSchedule = cc.director.getScheduler().schedule(self.adjustScale, self, 0.01,  cc.macro.REPEAT_FOREVER, 0, false );

                    let endFunction = function()
                    {
                        if (self.moveSchedule > 0)
                        { 
                            cc.director.getScheduler().unschedule(self.adjustScale, self);
                            self.moveSchedule = -1;
                        }

                        if (callBack)
                            callBack();
                    };

                    let callFunc = cc.callFunc(endFunction);
                    let seque    = cc.sequence(action, callFunc);
                    ndItem.runAction(seque);

                    isFirstMove = false;
                }
                else
                {
                    ndItem.runAction(action);
                }
            }
        }

        if (!isEnd)
        {
             for (let idx=startIdx; idx<itemNum; ++idx)
                moveItem(idx, isEnd);
        }
        else
        {
            if (needAddItem)
            {
                for (let idx=startIdx; idx>=0; --idx)
                    moveItem(idx, isEnd);
            }
            else
            {
                for (let idx=startIdx-1; idx>=0; --idx)
                    moveItem(idx, isEnd);
            }
        }
    };

    showGetItem(itemID, isShow)
    {
        this.enableTouchItem(isShow);
        if (isShow)
        {
            let ndItemShow = this.node.getChildByName('ndItemShow');
            let spItem = ndItemShow.getChildByName('spItem');
          
            let iconFile = "images/pictrue/items/default";
            let preciousData = global.Manager.DBManager.findData('Precious', 'ID', itemID);
            if (preciousData != null)
                iconFile =  'images/pictrue/precious/'+preciousData.showImage;
            global.CommonClass.Functions.setTexture(spItem, iconFile,null);

            let itemData=global.Manager.DBManager.getItemNew(itemID);  
            let spQuality = spItem.getChildByName('spQuality');
            spQuality.active = itemData.color>1;
            let qualityImge = 'images/pictrue/identify/quality'+itemData.color.toString();
            global.Instance.Log.debug('',qualityImge)
            global.CommonClass.Functions.setTexture(spQuality, qualityImge,null);
        }
    };

    playGetSound(itemID)
    {
        let itemData    = global.Manager.DBManager.getItemNew(itemID);
        let itemQuality = itemData.color;

        //let qualityDec = {};
      //  qualityDec[2] = '完美';
       // qualityDec[3] = '瑕疵';
       // qualityDec[4] = '破损';
       // qualityDec[5] = '残破';

        if (itemQuality==2)
            global.Instance.AudioEngine.replaySound('drop2', false,null);
        else if(itemQuality==3)
            global.Instance.AudioEngine.replaySound('drop1', false,null);
        else if(itemQuality==4)
            global.Instance.AudioEngine.replaySound('seed', false,null);
        else if(itemQuality==5)
            global.Instance.AudioEngine.replaySound('seed', false,null);
    };

    getItem(showIdx)
    {
        this.playAllItemJump(false);
        this.sendToIndentifyItem(showIdx);
    };

    onItemClick(event)
    {
       // this.playLight(false, true);

        let item = event.getUserData();

        let itemClass   = item.getComponent(global.CommonClass.IndentifyItem);
        let itemData    = itemClass.getData();

        this.playAllItemJump(false);
    
        let showIdx = item.tagEx;
        if (itemData.state == 1)
            this.getItem(showIdx);
        else
        {
           // if (itemData.state==2)
               // this.playIndentifyTalk(true, itemData, 2);
                
            this.centerToItem(showIdx);
        }
    };

    onIndentifyItemClick(event)
    {
        let item = event.getUserData();

        let showIdx = item.tagEx;
        this.getItem(showIdx);
    };

    onGetItemClick(event)
    {
        global.CommonClass.UITip.showTipTxt('需要好友自己来取', global.Enum.TipType.TIP_NORMAL); 
    };

    onAddItemClick(event)
    {
        global.CommonClass.UITip.showTipTxt('需要好友自己添加物品', global.Enum.TipType.TIP_NORMAL); 
    };

    
    onIdentifyPick(msg)
    {
        let index    = msg.idx;
        let data = msg.pickItem;

        let itemClass   = this.getItemByShowIdx(index);
        if (itemClass != null)
            itemClass.reflashBtns(data.state);
    };

    onIdentifyUpdate(msg)
    {
        let index    = msg.idx;
        let pickTime = msg.pickTime;

        let itemClass   = this.getItemByShowIdx(index);
        if (itemClass != null)
            itemClass.setTime(pickTime);
    };

    onCloseGetItemTalk()
    {
       /* this.checkSelect();
        this.reloadTableView();
        this.onScrollUpdate();
 
        let itemNum = global.Module.IdentifyData.getUnIdentifyNum();
        if (itemNum > 0)
             this.playLight(true, true);
        else
             this.playLight(false, false);*/
 
        this.clickMask.active = false;
    };
    
    updataTalk()
    {
        if(this.curDecIdx>=this.curDec.length && this.curDecIdx>=0)
        {
            this.curDecIdx = -1;
            cc.director.getScheduler().unschedule( this.updataTalk, this);

            let self = this;
            let ndSpeek = this.node.getChildByName('ndSpeek');
            let callBack = function()
            {    
                //self.stopTalk();
            };
            let endFunction = cc.callFunc(callBack);
            let delay = cc.delayTime(2);
            let seq1  = cc.sequence(delay, endFunction);
            ndSpeek.runAction(seq1);
        }
        else if (this.curDecIdx>=0)
        {
            let lblDec = this.node.getChildByName('ndSpeek').getChildByName('lblDec').getComponent(cc.Label);
            let newDec = this.curDec.substr(0,this.curDecIdx+1);
            lblDec.string = newDec;
        }
        this.curDecIdx++;
    };

    randTalk(isTalk)
    {
        let ID = global.Module.IdentifyData.getCurRoleID();
        let friend = global.Module.FriendData.getFriend(ID);
        let dec = '';
        let hasUnIdentify = global.Module.IdentifyData.getHasUnIdentify();
        if (hasUnIdentify)
            dec = '欢迎光临'+ friend.roleInfo.roleName+'的宝贝馆';
        else
            dec = '欢迎光临，'+ friend.roleInfo.roleName +'的宝贝馆新到一批宝贝，麻烦您帮助看看质地如何';

        let ndSpeek = this.node.getChildByName('ndSpeek');
        this.enableSpeakTouch(isTalk);

        if (isTalk) {
            this.curDec     = dec;
            this.curDecIdx  = 0;

            let lblDec = ndSpeek.getChildByName('lblDec').getComponent(cc.Label);
            lblDec.string = '';
    
            let perSpeed =0.03;
            cc.director.getScheduler().schedule( this.updataTalk,  this,perSpeed,  cc.macro.REPEAT_FOREVER, 0, false  );
        }
        else
        {
            if (this.curDecIdx >= 0)
            {
                this.curDecIdx = -1;
                cc.director.getScheduler().unschedule( this.updataTalk, this);
            }
        }
    };

    stopTalk()
    {
        cc.director.getScheduler().unschedule( this.updataTalk, this);
        this.enableSpeakTouch(false);
    };


    sendToIndentifyItem(showIdx)
    {  
        if (showIdx >= 0) {
            let roleId   = global.Module.IdentifyData.getCurRoleID();
            let item   = global.Module.IdentifyData.getUnIdentifyItem(showIdx);
            let data     = {roleId:roleId, index:item.index, itemId:item.itemID};
            let self = this;
            this.clickMask.active = true;
            this.oldNum =  global.Module.IdentifyData.getUnIdentifyNum();

            let ndView   = this.curScroll.getChildByName('view');
            let ndItems  = ndView.getChildByName('content');
            let ndItem:any   = ndItems.getChildByName(item.index.toString());
            let itemClass   = ndItem.getComponent(global.CommonClass.IndentifyItem);

            global.Instance.MsgPools.send('verifyItem', data, function(msg) {
               if (!msg.errorID) {
                    let endCall = function() {
                        self.clickMask.active = false;
                        self.reflashHelp();
                        itemClass.playChangeTime(-60);
                        
                    };
                    self.runCricleAction(true, ndItem, endCall);

                    let itemData    = global.Module.IdentifyData.getUnIdentifyItem(showIdx);
                  
                    itemClass.setData(itemData);
               }
               else
               {
                    self.clickMask.active = false;

                    if (msg.errorID==10374)
                        global.CommonClass.UITip.showTipTxt('今天已经鉴定过该物品', global.Enum.TipType.TIP_BAD); 
                        
               }
            });
        }

       // event.target.active = false;
    };

    update(dt)
    {
        if (this.isFirstUpdate)
        {
            this.delayTime += dt;

            if (this.delayTime>0.2)
            {
              
    
                this.isFirstUpdate = false;
            }
        }
    };

    btnHome() {
        let roleId   = global.Module.IdentifyData.getCurRoleID();
        let data = {roleId:roleId}
        global.Instance.MsgPools.send('verifyLeave', data, function (msg) {
            if (!msg.errorID) {
                let name = global.CommonClass.Functions.getSceneName();
                if (name == 'MainScene') {
                    global.Manager.UIManager.close('UIIdentifyFriend');
                    let UIPlayerScene = global.Manager.UIManager.get('UIPlayerScene');
                    if (UIPlayerScene) {
                        UIPlayerScene.reflashHelp();
                    };
                } else {
                    global.CommonClass.Functions.loadScene('MainScene', null);
                }
            }
        })
    };

    btnHeadClick() {
        return;
        let roleId = global.Module.IdentifyData.getCurRoleID();
        global.Manager.UIManager.open('UIRole', null, function(panel) {
            panel.show(roleId);
        });
    };

    btnClose() {
        let roleId   = global.Module.IdentifyData.getCurRoleID();
        let data = {roleId:roleId}
        global.Instance.MsgPools.send('verifyLeave', data, function(msg) {
            if (!msg.errorID) {
                global.Manager.UIManager.close('UIIdentifyFriend');

                let roleInfo = global.Module.PlayerMapData.getRoleInfo();
                if (roleInfo==null || roleId!=roleInfo.roleId) {
                    let friend = global.Module.FriendData.getFriend(roleId);
                    global.Module.PlayerMapData.setRoleInfo(friend.roleInfo);

                    global.Instance.MsgPools.send('scenePosition', {roleId:roleId}, function(msg) {
                        global.CommonClass.Functions.loadScene("PlayerScene",null);
                    });
                }else{
                    let UIPlayerScene = global.Manager.UIManager.get('UIPlayerScene');
                    if (UIPlayerScene) {
                        UIPlayerScene.reflashHelp();
                    };
                }
               
            }
        })
       // global.Module.IndentifyData.setCurOpType(0);
    };

    touchShowItem(event)
    {
        if (event.type==cc.Node.EventType.TOUCH_START || event.type==cc.Node.EventType.TOUCH_END || event.type==cc.Node.EventType.TOUCH_CANCEL)
        {
            this.enableTouchItem(false);

            this.curPickSpItem.active = true;
        }
    };

    touchEvent()
    {

    };

 
    // update (dt) {}
}
