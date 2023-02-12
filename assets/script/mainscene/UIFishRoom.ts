import UIBase from "../common/UIBase";


const {ccclass, property} = cc._decorator;

@ccclass
export default class UIFishRoom extends UIBase {
    @property({ type: cc.Node, displayName: "helpNode", tooltip: "引导" })
    helpNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "caculateBtn", tooltip: "结算" })
    caculateBtn: cc.Node = null;
    
    opRoot: any;
    ndFishs: any;
    bornPoint: any;
    ndPaoPao: any;
    curPickFish: any;
    ndMovePoints: any;
    canGetMoeny: boolean;
    fishItem: any;
    UIFishBag: any;
    curSelIdx: number;
    moneyDrop: cc.Node;
    makeItemData: any;
    itemSize: any;
    itemSpace: any;
    maxFishNum: number;
    constructor(){
        super();
        this.maxFishNum = 30;
        this.opRoot = null;
        this.ndFishs = null;
        this.bornPoint = null;
        this.ndPaoPao = null;
        this.curPickFish = null;
        this.ndMovePoints  = null;
        this.canGetMoeny   = false;

        this.fishItem     = null;
    };

    onLoad () {
        global.Instance.AudioEngine.stopMusic("farmpark");
        global.Instance.AudioEngine.playMusic("paopao", true, 1.5);

        this.opRoot = this.node.getChildByName('roomScroll').getChildByName('view').getChildByName('content');

        this.ndFishs        =  this.opRoot.getChildByName("ndFishs");
        this.bornPoint      =  this.opRoot.getChildByName('bornpoint').getPosition();
        this.ndMovePoints   =  this.opRoot.getChildByName('ndMovePoints2');

        this.ndPaoPao      =  this.opRoot.getChildByName('ndPaoPaos');
        this.fishItem       =  this.node.getChildByName('fishItem');
        this.fishItem.active = false;
        let UIFishBag:any = this.node.getChildByName('UIFishBag')
        this.UIFishBag = UIFishBag.getComponent(global.CommonClass.UIFishBag);
        this.UIFishBag.setDragEndCall(this.onDragItemEnd.bind(this));
        this.UIFishBag.setShowEndCall(this.onShowEnd.bind(this));
        this.UIFishBag.setAutoHide(true);
        this.UIFishBag.setShowHideBtn(false);

        this.ndFishs.removeAllChildren();

        this.reflashNumber();
        this.reflashHelp();
    };
    reflashHelp() {
        var data = global.Module.TaskData.getHasAcceptTaskData();
        if (!data)
            return;
        if (data.taskId == 10016 && data.state == 1)
            if (this.helpNode)
                this.helpNode.active = true;
            else
                this.helpNode.active = false;
    };

    start () {

    };
    onEnable()
    {
        let roomScroll = this.node.getChildByName('roomScroll');

        roomScroll.on(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);	
        roomScroll.on(cc.Node.EventType.TOUCH_END, this.touchEvent, this);	
        roomScroll.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);	
        roomScroll.on(cc.Node.EventType.TOUCH_START, this.touchEvent, this);	

        this.scrollToCenter();

        this.reflashInfo();
        this.reflashFishs();

        cc.director.getScheduler().schedule(this.randPlayPaoPao, this,  3,  cc.macro.REPEAT_FOREVER , 0, false);

        global.Module.GameData.setMaskSound(true,null);
    };

    onDisable()
    {
        let roomScroll = this.node.getChildByName('roomScroll');
        roomScroll.off(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);	
        roomScroll.off(cc.Node.EventType.TOUCH_END, this.touchEvent, this);	
        roomScroll.off(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);
        roomScroll.off(cc.Node.EventType.TOUCH_START, this.touchEvent, this);

        
        cc.director.getScheduler().unschedule(this.randPlayPaoPao, this);

        global.Module.GameData.setMaskSound(false,null);
    };

    touchEvent(event)
    {
        if (event.type==cc.Node.EventType.TOUCH_START)
        {
           // this.randPlayPaoPao();
            let touchPoint = event.getLocation();
            for (let key in this.ndFishs._children)
            {
                let curND = this.ndFishs._children[key];
                let boundingBox = curND.getBoundingBoxToWorld();
                let isPick = boundingBox.contains(touchPoint);
                if (isPick)
                {
                    this.curPickFish = curND;

                    let fishIdx = curND.tagEx;
                    let fish = global.Module.PreciousRoomData.getItem(1,fishIdx,0);

                    if (fish != null)
                    {
                       curND.stopAllActions();

                       let self = this;

                       let roomScroll = this.node.getChildByName('roomScroll').getComponent(cc.ScrollView);
                       let showEnd = function()
                       {
                            self.randFishMove(fishIdx);
                            self.curPickFish = null;
                            roomScroll.enabled = true;
                       };

                       roomScroll.enabled = false;
                       global.Manager.UIManager.open('DlgShowFish', null, function(panel)
                       {
                            panel.show(fish, showEnd);
                       });
                    }
                    
                    break;
                }
            }
        }
        else if(event.type==cc.Node.EventType.TOUCH_END)
        {
            if (this.curPickFish != null)
            {
               
            }
        }
    };
    showValue(isShow)
    {
        let fishs = this.ndFishs.children;
        for (let key in fishs)
        {
            let ndFish = fishs[key];
            let lblValue = ndFish.getChildByName('lblValue');
            lblValue.active = isShow;
        }
    };

    reflashInfo()
    {
        let self = this;
        let data = {type:1};
        global.Instance.MsgPools.send('showTableInfo', data, function(msg)
        {
            self.canGetMoeny = (msg.state==0);

            if (!self.canGetMoeny)
                self.caculateBtn.color = cc.color(90, 96, 96, 255);
            else
                self.caculateBtn.color = cc.color(255, 255, 255, 255);
        })

        this.moneyDrop = this.node.getChildByName('moneyDrop');
        this.moneyDrop.active = false;
    };

    reflashNumber()
    {
        let fishs = global.Module.PreciousRoomData.getPageItems(1,null);
        let count = 0;
        for (let key in fishs)
            ++count;

        let lblNumber = this.node.getChildByName('lblNumber').getComponent(cc.Label);
        lblNumber.string = count.toString()+'/' + this.maxFishNum.toString();
    };

    reflashFishs()
    {
        let fishs = global.Module.PreciousRoomData.getPageItems(1,null);
        for (let key in fishs)
        {
            let fish = fishs[key];
            this.createFish(fish, this.bornPoint,null);
        }
    };

    getShowImageByID(ID)
    {
        let showImage = "images/pictrue/items/default";
        let data = global.Manager.DBManager.findData('Items', 'ID', ID);
        // let data = global.Manager.DBManager.findData('Fish', 'ID', ID);
        if (data != null) showImage = data.path+data.picName;

        return showImage;
    };
    onClickShowList() {
        this.helpNode.active = false;
        let UIFishBag =  global.Manager.UIManager.get('UIFishBag');
        if (UIFishBag != null) {
            UIFishBag.show(true,null);
        }
    };
   

    setFishAngle(fish, targetPos)
    {
        let fishPos = fish.getPosition();
        let moveVec = cc.v2(targetPos.x-fishPos.x, targetPos.y-fishPos.y);
        // let moveVec = cc.vec(100, 100);
         let sqrDis = Math.sqrt(moveVec.x*moveVec.x+moveVec.y*moveVec.y);
         let cosAngle = moveVec.y/sqrDis;
         let angle = Math.acos(cosAngle)*180/3.14;
        
         let spFish = fish.getChildByName('spFish');
        // let lblValue = fish.getChildByName('lblValue');
         if (moveVec.x>0)
         {
            spFish.scaleX = 1;
         }
         else
         {
            spFish.scaleX = -1;
         
         }
    };

    randFishMove(fishID)
    {
        let self = this;

        let fish = global.CommonClass.Functions.getChildTagEx(this.ndFishs,fishID);
        if(fish==null)
            return;
        let randMovePos = function()
        {
            let moveNum = self.ndMovePoints.children.length;
            let idx = Math.ceil(Math.random()*moveNum)+1;
            let name = 'movepoint'+idx.toString();
            let movePos = self.ndMovePoints.getChildByName(name).getPosition();

            return movePos;
        }
        
        let movePos = randMovePos();
        while( movePos.sub(fish.getPosition()).mag()<10)
            movePos = randMovePos();
        
        let onEnd = function()
        {
            self.randFishMove(fishID);
        }
        
        let position = fish.getPosition();
       
        let distance =  position.sub(movePos).mag();
        let speed = 600;
        let timeCost = distance/speed;

        let curTime = 5;
        let curSpeed = distance/curTime;
        if (curSpeed < speed)
            timeCost = curTime;

        let moveAction = cc.moveTo(timeCost,movePos);
        let endFunction = cc.callFunc(onEnd);
        let seq = cc.sequence(moveAction, endFunction);
        
        this.setFishAngle(fish, movePos);
        fish.runAction(seq);
    };

    createFish(fish, position, needWait)
    {
       // let fish = global.Module.FishData.addFishToRoom(fish);
        let self = this;
      

        if (fish != null)
        {
            let fishID = fish.templateID;
            let picPath = this.getShowImageByID(fishID);
            let ndFish = cc.instantiate(this.fishItem);
            ndFish.active = true;

            let spFish = ndFish.getChildByName('spFish');
            global.CommonClass.Functions.setTexture(spFish, picPath,null);

            ndFish.setPosition(position);
            ndFish.tagEx = (fish.index);
            this.ndFishs.addChild(ndFish);

            let lblValue = ndFish.getChildByName('lblValue').getComponent(cc.Label);
            let itemData = global.Manager.DBManager.getItemNew(fishID);
            if (itemData != null)
                lblValue.string = global.CommonClass.Functions.formatMoney(itemData.gold)

            if (needWait)
            {
                let animState = null;
                let animation = ndFish.getComponent(cc.Animation);
                if (animation != null)
                {
                      animState = animation.play('fishWait');
                      animState.wrapMode = cc.WrapMode.Loop;
                }

                ndFish.setScale(2);
                let spBack = ndFish.getChildByName('spBack');
                spBack.active = true;
                let waitEnd = function()
                {
                    if (animState != null)
                        animState.stop();

                    spBack.active = false;
                    ndFish.setScale(1);
                    ndFish.opacity = 0;

                    let fadeIn = cc.fadeIn(1);
                    let fadeEnd = function()
                    {
                        self.randFishMove(fish.index);
                    };

                    let callEnd = cc.callFunc(fadeEnd);
                    let seq = cc.sequence(fadeIn, callEnd);

                    ndFish.stopAllActions();
                    ndFish.runAction(seq);
                }

                let endFunction = cc.callFunc(waitEnd);
                let timeDelay   = cc.delayTime(1);
                let seq = cc.sequence(timeDelay, endFunction);
                this.node.runAction(seq);
            }
            else
            {
                this.randFishMove(fish.index);
            }
           
        }
    };

    scrollToCenter()
    {
        let roomScroll = this.node.getChildByName('roomScroll');
        let totalSize  = this.opRoot.getContentSize();
        let roomSize   = roomScroll.getContentSize();
        let offset     = totalSize.width/2-roomSize.width/2;

        roomScroll.getComponent(cc.ScrollView).stopAutoScroll();
        roomScroll.getComponent(cc.ScrollView).scrollToOffset(cc.v2(offset, 0));
    };
    //养鱼
    onPutFish(itemID, touchPos)
    {
       // global.Manager.UIManager.close('UIFishBag');

       // var self = global.Manager.UIManager.get('UIFishRoom');

        let self = this;

        let fishs = global.Module.PreciousRoomData.getPageItems(1,null);
        
        let count = 0;
        let maxIdx = 0;
        for (let key in fishs)
        {
            let fishItem = fishs[key];
            if (fishItem.index>maxIdx)
                maxIdx = fishItem.index;

            ++count;
        }
        //水下世界安全保护
        if (global.Module.TaskData.taskguard(10016))
            return;

        if (this.maxFishNum <= count) {
            global.CommonClass.UITip.showTipTxt('达到上限', global.Enum.TipType.TIP_BAD);
        } else {
            let data:any = {type:1, index:maxIdx+1, itemId:itemID, x:0, y:0};
            global.Instance.MsgPools.send('showTablePutOn', data, function(msg) {
                if (!msg.errorID) {
                   global.Instance.AudioEngine.replaySound('fish', false, 3);
                    let position = self.ndFishs.convertToNodeSpaceAR(touchPos);

                    data.templateID = itemID;
                    self.createFish(data, position,true);
                    self.UIFishBag.show(false);
                    // global.Manager.UIManager.close('UIFishBag');
                    global.Proxys.ProxyGuide.stepNextGuide('DragFish');
                    self.reflashNumber();
                } 
                else if(msg.errorID == 64)
                {
                    global.CommonClass.UITip.showTipTxt('物品数量不足', global.Enum.TipType.TIP_BAD);
                }
            });
        }
    };

    randPlayPaoPao()
    {
        let paopaos = this.ndPaoPao.children;
        let num = paopaos.length;
        let randIdxs = {};
        for (let i=0; i < num; ++i)
        {
            let idx = Math.ceil(Math.random()*num);
            randIdxs[idx] = true;
        }

        let offset = this.node.getChildByName('roomScroll').getComponent(cc.ScrollView).getScrollOffset().x;
        let orignX = -this.opRoot.getContentSize().width/2;
        let curX   = -offset+orignX;
        for (let key in randIdxs)
        {
            let idx = parseInt(key);
            let ndPaoPao = paopaos[idx-1];

            let aniPaoPao = ndPaoPao.getChildByName('animPaoPao');
            let animation = aniPaoPao.getComponent(cc.Animation);

            let clips = animation.getClips();
            let name = clips[0].name;
            let animState = animation.getAnimationState(name);
            if (!animState.isPlaying)
            {
                let randRangX = Math.ceil(Math.random()*1000)+100;
                let randRangY = Math.ceil(Math.random()*100)-375;

                ndPaoPao.active = true;
                ndPaoPao.setPosition(cc.v2(randRangX+curX,randRangY));
                animState.wrapMode = cc.WrapMode.Normal;
                animation.play(name);
            }
        }
    };

   /* btnPutFish()
    {
        let self = this;
        global.Manager.UIManager.open('UIFishBag', null, function(panel)
        {
            panel.show(self.onPutFish.bind(self));
        });

        global.Proxys.ProxyGuide.stepNextGuide('OpenFishBag');
    };*/

    pickScrollIdx(isBack)
    {
        let itemScroll = this.node.getChildByName('ndTarget').getChildByName('itemScorll');
        let scrollView = itemScroll.getComponent(cc.ScrollView);
        let offset = scrollView.getScrollOffset();

        let beginOffset = 0;
        let offTimes = (offset.y+beginOffset)/(this.itemSize.height+this.itemSpace);
        let idx = Math.floor(offTimes);

        if (isBack)
            idx +=3;

        //let makeItemData = global.Manager.DBManager.getData("ManufactureMakeData");

        if (idx<0)
        {
            idx = 0;
        }
        else if(idx>=this.makeItemData.length)
        {
            idx = this.makeItemData.length-1;
        }

        return idx;
    };

    stopMove(isStop)
    {
        let fishs = this.ndFishs.children;
        for (let key in fishs)
        {
            let ndFish = fishs[key];
            ndFish.stopAllActions();
            let fishID = ndFish.tagEx;
            if (!isStop)
                this.randFishMove(fishID);
        }
    };

    onDragItemEnd(itemID, touchPos)
    {
        // this.UIDragBag.show(false);
        this.onPutFish(itemID, touchPos);
    };
    
    onShowEnd(isShow)
    {
        if (isShow)
        {
            this.UIFishBag.showItems(2, function(item)
            {
                let itemNum = global.Module.PackageData.getItemCount(item.ID);
                // itemNum>0 &&
                let isFit = ( item.subType==10);
                return isFit;
            });

            global.Proxys.ProxyGuide.stepNextGuide('OpenFishBag');
        }
    };

    btnClose()
    {
        
        global.Instance.AudioEngine.stopMusic("paopao");
        let data = global.Manager.DBManager.findData('SceneMusic', 'name', "FarmParkScene");
        if (data != null)
            global.Instance.AudioEngine.playMusic(data.backMusic, true, data.volume);
        global.Proxys.ProxyGuide.stepNextGuide('CloseFishRoom');
        global.Manager.UIManager.close('UIFishRoom');

       // global.Module.MainMapData.centerMap();
    };


    btnChangeMode(event, arg)
    {
        let data = parseInt(arg);
        this.ndMovePoints = this.opRoot.getChildByName('ndMovePoints'+data.toString());
        let roomScroll = this.node.getChildByName('roomScroll').getComponent(cc.ScrollView);

        let btnBig = this.node.getChildByName('btnBigMode');
        let btnSmall = this.node.getChildByName('btnSmallMode');
        btnBig.active = data==1;
        btnSmall.active = data==2;

        if (data==2)     //放大
        {
            roomScroll.enabled = true;
        }
        else if (data==1)        //缩小
        {
            this.scrollToCenter();

            roomScroll.enabled = false;

            let fishs = this.ndFishs.children;
            for (let key in fishs)
            {
                let ndFish = fishs[key];
                ndFish.stopAllActions();
                ndFish.setPosition(this.bornPoint);

                let fishID = ndFish.tagEx;
                this.randFishMove(fishID);
            }
        }
    };

    playMoneyDrop()
    {
        let moneyDrop = this.node.getChildByName('moneyDrop');
        moneyDrop.active = true;

        let playEnd = function()
        {
            moneyDrop.active = false;
        };

        let animation = moneyDrop.getChildByName('ndMoeny').getComponent(cc.Animation);
        if (animation != null)
        {
            let animState = animation.play('moneyDrop');
            animState.wrapMode = cc.WrapMode.Normal;
      
            animation.on('finished', playEnd);
        }
    };

    playMoneyFly(ndFish, callBack)
    {
        let spMoneyFly = ndFish.getChildByName('spMoneyFly');
        let curPos = spMoneyFly.getPosition();
        curPos.y += 100;

        global.CommonClass.ItemDrop.createAndDrop2(1, 0, curPos, ndFish, null, null, callBack);
    };

    playCoinFly(callBack)
    {
        //let ndItems = this.node.getChildByName('selfLayer').getChildByName('ndItems'); 
        let items   = this.ndFishs.children;

        let isFirst = false;

        for (let key in items)
        {
            let ndItem = items[key];
            if (!isFirst)
            {
                this.playMoneyFly(ndItem, callBack);
                isFirst = true;
            }
            else
            {
                this.playMoneyFly(ndItem,null);
            }
        }
    };

    autoRemove(index)
    {
        let items   = this.ndFishs.children;
        for (let key in items)
        {
            let item = items[key];
            let fishIdx = item.tagEx;
            if (index==fishIdx)
            {
                let fadeOut = cc.fadeOut(2);
                let endFadeOut = function()
                {
                    item.removeFromParent();
                };
                
                let endFadeOutFun = cc.callFunc(endFadeOut);
                let seq = cc.sequence(fadeOut, endFadeOutFun);
                item.tagEx = (-1);
                item.runAction(seq);
            }
        }

        this.reflashNumber();
    };

    btnCaculate(msg)
    {
        let self = this;
       // self.playMoneyDrop();

       if (this.canGetMoeny)
       {
           let data = {type:0};
           global.Instance.MsgPools.send('showTablePrize', data, function(msg)
           {
               if (msg.errorID==0)
               {
                    self.stopMove(true);
                    self.playCoinFly(function()
                    {
                        // global.Manager.UIManager.open('DlgCaculate', null, function(panel)
                        // {
                        //     panel.show(msg.goldNum);
                        // });

                        self.stopMove(false);
                    });
                    global.Instance.Log.debug('',"UIfishRoom");
                   global.Instance.AudioEngine.replaySound('gold', false,null);
               }
               else
               {
                   global.CommonClass.UITip.showTipTxt('不能结算', global.Enum.TipType.TIP_BAD);
               }

               self.canGetMoeny = false;
               self.caculateBtn.color = cc.color(90,96,96,255);
           });
        }
        else
        {
            global.CommonClass.UITip.showTipTxt('不能结算', global.Enum.TipType.TIP_BAD);
        }

    };

    btnHideValue()
    {
        let btnShowValue = this.node.getChildByName('btnShowValue');
        let btnHideValue = this.node.getChildByName('btnHideValue');

        btnShowValue.active = true;
        btnHideValue.active = false;

        this.showValue(false);
    };

    btnShowValue()
    {
        let btnShowValue = this.node.getChildByName('btnShowValue');
        let btnHideValue = this.node.getChildByName('btnHideValue');

        btnShowValue.active = false;
        btnHideValue.active = true;

        this.showValue(true);
    };

    btnCount()
    {
        let data = {};
        let fishs = global.Module.PreciousRoomData.getPageItems(1,null);
        for (let key in fishs)
        {
            let fish = fishs[key];
            if (data[fish.templateID]==null)
            {
                data[fish.templateID] = 1;
            }
            else
            {
                data[fish.templateID]++;
            }
        };

        global.Manager.UIManager.open('DlgFishCount', null, function(panel)
        {
            if (panel != null)
            {
                panel.show(data);
            }
        });
    };


    // update (dt) {}
}
