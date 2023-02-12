import UIBase from "../common/UIBase";


const { ccclass, property } = cc._decorator;

@ccclass
export default class UIIdentify extends UIBase {
    @property({ type: cc.Node, displayName: "helpNode", tooltip: "提示" })
    helpNode: cc.Node = null;
    
    ndTouch: any;
    itemSpace: number;
    mode: number;
    btnIndentify: any;
    curScroll: any;
    clickMask: any;
    buttomEmpty: number;
    selectIdx: number;
    needAdjust: boolean;
    midX: number;
    curDecIdx: number;
    curDec: string;
    ndItemDec: any;
    talkType: number;
    moveSchedule: any;
    oldNum: number;
    simpleMode: any;
    delayTime: number;
    isFirstUpdate: boolean;
    isInGetItem: boolean;
    startX: number;
    isInScroll: boolean;
    isAtLast: boolean;
    maxShowNum: number;
    curGetItem: number;
    ndTemplateItem: cc.Node;
    constructor() {
        super();
        this.ndTouch = null;

        this.itemSpace = 20;
        this.mode = 1;                    //1.取物品 2.放物品
        this.btnIndentify = null;
        this.curScroll = null;
        this.clickMask = null;//阴影遮罩

        this.buttomEmpty = 0;
        this.needAdjust = false;
        this.selectIdx = -1;
        this.midX = 0;


        this.curDecIdx = 0;
        this.curDec = '';
        this.ndItemDec = null;

        this.curGetItem = 0;
        this.maxShowNum = 7;

        this.isAtLast = false;
        this.isInScroll = false;
        this.startX = 0;
        this.isInGetItem = false;

        this.isFirstUpdate = true;
        this.delayTime = 0;

        this.simpleMode = 0;

        this.moveSchedule = -1;
        this.oldNum = 0;

        this.talkType = -1;
    };

    onLoad() {
        this.ndTouch = this.node.getChildByName('ndTouch');

        this.ndItemDec = this.node.getChildByName('ndItemDec');
        this.curScroll = this.node.getChildByName('buttom').getChildByName('itemScorll');
        this.ndTemplateItem = this.node.getChildByName('ndTemplateItem');
        this.ndTemplateItem.active = false;

        this.clickMask = this.node.getChildByName('clickMask');
        this.clickMask.active = false;
    };

    onEnable() {

        {
            let windowSize = cc.winSize;
            let width = windowSize.width
            this.itemSpace = parseInt(((width - 240 * 5) / 6).toString());
        }

        this.ndTouch = this.node.getChildByName('ndTouch');
        this.playTalk(true, null);

        let self = this;


        this.node.on('onAddItemClick', function (event) {
            self.onAddItemClick(event);
        });

        this.node.on('onIndentifyItemClick', function (event) {
            self.onIndentifyItemClick(event);
        });

        this.node.on('onGetItemClick', function (event) {
            self.onGetItemClick(event);
        });

        this.node.on('onItemQuick', function (event) {
            self.onItemQuick(event);
        });

        this.node.on('onIdentifyPick', function (event) {
            self.onIdentifyPick(event);
        });
        this.node.on('onIdentifyUpdate', function (event) {
            self.onIdentifyUpdate(event);
        });
        this.curScroll.on('scroll-ended', this.onScollEnd, this);
        this.curScroll.on('scroll-began', this.onScollBegan, this);

        this.playLight(false, false, null);

        this.enableTouchItem(false);

        this.checkSelect();
        this.scheduleOnce(this.reflash, 0);

        global.Module.GameData.setMaskSound(true, null);

        global.Module.IdentifyData.setPanel(this);
    };

    onDisable() {

        this.node.off('onAddItemClick');
        this.node.off('onIndentifyItemClick');
        this.node.off('onPutItemClick');
        this.node.off('onIdentifyPick');
        this.node.off('onIdentifyUpdate');

        global.Manager.UIManager.close('UIFriendChoose');

        global.Module.GameData.setMaskSound(false, null);

        global.Module.IdentifyData.setPanel(null);
    };
    //结束效果
    enableTouchItem(isEnable) {
        global.Module.TaskData.setIsAgree(!isEnable);
        let ndItemShow = this.node.getChildByName('ndItemShow');
        ndItemShow.active = isEnable;
        let makeNode = this.node.getChildByName('makeNode');
        makeNode.active = isEnable;
        if (isEnable) {
            ndItemShow.on(cc.Node.EventType.TOUCH_START, this.touchShowItem, this);
            ndItemShow.on(cc.Node.EventType.TOUCH_MOVE, this.touchShowItem, this);
            ndItemShow.on(cc.Node.EventType.TOUCH_END, this.touchShowItem, this);
            ndItemShow.on(cc.Node.EventType.TOUCH_CANCEL, this.touchShowItem, this);
        } else {
            ndItemShow.off(cc.Node.EventType.TOUCH_START, this.touchShowItem, this);
            ndItemShow.off(cc.Node.EventType.TOUCH_MOVE, this.touchShowItem, this);
            ndItemShow.off(cc.Node.EventType.TOUCH_END, this.touchShowItem, this);
            ndItemShow.off(cc.Node.EventType.TOUCH_CANCEL, this.touchShowItem, this);

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
    playShowItemFly() {
        let ndItemShow = this.node.getChildByName('ndItemShow');
        let spPackage = this.node.getChildByName('spPackage');
        spPackage.active = true;
        this.clickMask.active = true;

        ndItemShow.stopAllActions();
        ndItemShow.active = true;

        let start = ndItemShow.getPosition();
        ndItemShow.setPosition(start);

        let end = spPackage.getPosition();

        let position = start;
        let endPosition = end;

        if (endPosition == null || position == null)
            return false;

        let midPosition = cc.v2((endPosition.x + position.x) / 2, position.y + 500);

        let self = this;
        let callBack = function () {
            ndItemShow.setPosition(cc.v2(0, 0));
            ndItemShow.scale = 1;
            self.enableTouchItem(false);
            self.clickMask.active = false;
            spPackage.active = false;

            // var taskdata = global.Module.TaskData.getHasAcceptTaskData();
            // if (this.helpNode)
            // this.helpNode.active = (taskdata&&taskdata.taskId == 10001 && taskdata.state == 2 )

        };

        let scaleInBack = cc.scaleTo(1, 0.1);

        let bezier = [position, midPosition, endPosition];
        let bezierTo = cc.bezierTo(1, bezier);

        let endFunction = cc.callFunc(callBack);
        let seq2 = cc.sequence(bezierTo, endFunction);
        let spawn = cc.spawn(scaleInBack, seq2);

        ndItemShow.runAction(spawn);

        return true;
    };

    enableTouchLock(isEnable) {
        if (isEnable) {
            this.ndTouch.active = true;
            this.ndTouch.on(cc.Node.EventType.TOUCH_START, this.touchLockEvent, this);
            this.ndTouch.on(cc.Node.EventType.TOUCH_MOVE, this.touchLockEvent, this);
            this.ndTouch.on(cc.Node.EventType.TOUCH_END, this.touchLockEvent, this);
            this.ndTouch.on(cc.Node.EventType.TOUCH_CANCEL, this.touchLockEvent, this);
        } else {
            this.ndTouch.active = false;
            this.ndTouch.off(cc.Node.EventType.TOUCH_START, this.touchLockEvent, this);
            this.ndTouch.off(cc.Node.EventType.TOUCH_MOVE, this.touchLockEvent, this);
            this.ndTouch.off(cc.Node.EventType.TOUCH_END, this.touchLockEvent, this);
            this.ndTouch.off(cc.Node.EventType.TOUCH_CANCEL, this.touchLockEvent, this);
        }
    };

    onScollBegan() {
        this.needAdjust = true;
        this.changeState(true);

        this.isInScroll = true;
    };

    onScollEnd() {
        if (this.needAdjust) {
            this.changeSelIndex(this.selectIdx);

            this.needAdjust = false;
        }

        this.changeState(false);
        this.isInScroll = false;
    };

    enableSpeakTouch(isEnable) {
        let ndSpeek = this.node.getChildByName('ndSpeek');
        ndSpeek.active = isEnable;

        if (isEnable) {
            ndSpeek.on(cc.Node.EventType.TOUCH_START, this.touchSpeak, this);
            ndSpeek.on(cc.Node.EventType.TOUCH_MOVE, this.touchSpeak, this);
            ndSpeek.on(cc.Node.EventType.TOUCH_END, this.touchSpeak, this);
            ndSpeek.on(cc.Node.EventType.TOUCH_CANCEL, this.touchSpeak, this);
        } else {
            ndSpeek.off(cc.Node.EventType.TOUCH_START, this.touchSpeak, this);
            ndSpeek.off(cc.Node.EventType.TOUCH_MOVE, this.touchSpeak, this);
            ndSpeek.off(cc.Node.EventType.TOUCH_END, this.touchSpeak, this);
            ndSpeek.off(cc.Node.EventType.TOUCH_CANCEL, this.touchSpeak, this);
        }
    };

    touchSpeak(event) {
        if (event.type == cc.Node.EventType.TOUCH_END) {
            this.stopTalk();
            let ndSpeek = this.node.getChildByName('ndSpeek');
            ndSpeek.active = false;

            let ndItemShow = this.node.getChildByName('ndItemShow');
            if (ndItemShow.active)
                this.playShowItemFly();
        }
    };

    checkSelect() {
        let itemNum = global.Module.IdentifyData.getIdentifyNum();
        if (this.selectIdx >= itemNum || this.isAtLast)
            this.selectIdx = itemNum - 1;

        if (itemNum <= 0)
            this.selectIdx = -1;
        else {
            if (this.selectIdx < 0)
                this.selectIdx = 0;
        }
    };

    changeState(isInScroll) {
        this.playAllItemJump(!isInScroll);
    };

    playAllItemJump(isPlay) {
        if (isPlay) {
            let itemNum = global.Module.IdentifyData.getIdentifyNum();

            let showNum = itemNum;
            if (showNum > this.maxShowNum)
                showNum = this.maxShowNum;

            let halfNum = Math.ceil(showNum / 2);
            let timeSpace = halfNum * 0.8;

            let self = this;
            let playAnimation = function (itemIdx, startDelay) {
                if (itemIdx >= 0 && itemIdx < itemNum) {
                    let callBack = function () {
                        self.playItemJump(itemIdx, timeSpace);
                    };
                    let endFunction = cc.callFunc(callBack);
                    let timeDelay = cc.delayTime(startDelay);

                    let seq = cc.sequence(timeDelay, endFunction);
                    let itemClass = self.getItemClass(itemIdx);
                    if (itemClass != null)
                        itemClass.node.runAction(seq);
                }
            };

            playAnimation(this.selectIdx, 0.1);
            for (let j = 1; j < halfNum; ++j) {
                let indexL = this.selectIdx - j;
                playAnimation(indexL, j * 0.8);

                let indexR = this.selectIdx + j;
                playAnimation(indexR, j * 0.8);
            }
        } else {
            let ndView = this.curScroll.getChildByName('view');
            let ndItems = ndView.getChildByName('content').getChildren();
            for (let key in ndItems) {
                let ndItem = ndItems[key];
                ndItem.stopAllActions();
            }
        }
    };

    playItemJump(index, timeSpace) {
        let ndView = this.curScroll.getChildByName('view');
        let ndItems = ndView.getChildByName('content');
        let ndItem = ndItems.getChildByName(index.toString());

        if (ndItem == null)
            return;
        let spItem = ndItem.getChildByName('ndItem');
        //  let contentSize = spItem.getContentSize();

        let position = spItem.getPosition();
        // position.y   = -contentSize.height/2+20;

        spItem.stopAllActions();
        spItem.setPosition(position);

        let goodsAct1 = cc.moveTo(0.2, cc.v2(position.x, position.y + 15));
        let goodsBack1 = cc.moveTo(0.2, cc.v2(position.x, position.y));
        let goodsAct2 = cc.moveTo(0.1, cc.v2(position.x, position.y + 5));
        let goodsBack2 = cc.moveTo(0.1, cc.v2(position.x, position.y));
        let delayEnd = cc.delayTime(timeSpace);

        let seq = cc.sequence(goodsAct1, goodsBack1, goodsAct2, goodsBack2, delayEnd);
        let repeat = cc.repeatForever(seq);

        spItem.runAction(repeat);
    };

    indentifyActionEnd(callback) {
        let ndIdentify = this.node.getChildByName('Identify');
        let ndCricle = ndIdentify.getChildByName('ndCricle');
        ndCricle.active = false;

       

        let animation = ndCricle.getChildByName('spCricle').getComponent(cc.Animation);
        animation.stop();

        this.playLight(false, false, null);

        if (callback)
            callback();
    };
    //运行放大镜动画
    runIndentifyAction(callback) {
        let self = this;

        let ndIdentify = this.node.getChildByName('Identify');

        let ndCricle = ndIdentify.getChildByName('ndCricle');
        ndCricle.active = true;

        let delay = cc.delayTime(1.5);
        let onDelayEnd = function () {
            self.indentifyActionEnd(callback);
        }
        this.node.stopAllActions();
        let endFun = cc.callFunc(onDelayEnd);
        let seq = cc.sequence(delay, endFun);
        this.node.runAction(seq);

        let animation = ndCricle.getChildByName('spCricle').getComponent(cc.Animation);
        let animState = animation.play("btnCricle");
        animState.wrapMode = cc.WrapMode.Loop;
    };

    playLight(isShow, isPlay, showIdx) {
        let ndIdentify = this.node.getChildByName('Identify');
        ndIdentify.active = isShow;
    };

    reflash() {
        this.startX = this.caculateStart();

        this.reloadTableView();

        let itemNum = global.Module.IdentifyData.getIdentifyNum();
        if (itemNum > 0) {
            this.selectIdx = 2;


            this.scrollToItem(this.selectIdx, true);
            this.onScrollUpdate();
            this.adjustScale();
        }

        if (this.selectIdx >= 0)
            this.playAllItemJump(true);
    };

    caculateStart() {
        let ndView = this.curScroll.getChildByName('view');
        let totalSize = ndView.getContentSize();
        let midX = totalSize.width / 2;
        return midX;
    };
    //加载数据
    newItem(data, itemPosX) {
        let ndView = this.curScroll.getChildByName('view');
        let ndItems = ndView.getChildByName('content');

        if (data != null) {

            let newNode: any = cc.instantiate(this.ndTemplateItem);
            ndItems.addChild(newNode, cc.macro.MAX_ZINDEX);
            newNode.active = true;
            newNode.setPosition(cc.v2(itemPosX, -265));

            if (data.index != null)
                newNode.setName(data.index.toString());

            let itemClass = newNode.getComponent(global.CommonClass.IndentifyItem);
            if (data.state == 2)//待揭晓
                itemClass.setItemSelfInditify(false);

            itemClass.setData(data);

            this.showSelect(data.index, this.selectIdx == data.index);
            return newNode;
        }

        return null;
    };
    /**
     * 遍历鉴定列表数据
     */
    reloadTableView() {
        let items = global.Module.IdentifyData.getIdentify();
        this.curScroll.active = true;
        let ndView = this.curScroll.getChildByName('view');
        let ndItems = ndView.getChildByName('content');
        let ndTempLate = this.ndTemplateItem;
        let itemSize = ndTempLate.getContentSize();

        let itemNum = items.length;
        let total = itemNum;

        let exWidth = (this.startX - itemSize.width / 2) * 2;

        let sizeHeight = ndItems.getContentSize().height;
        let sizeWidth = itemSize.width * total + this.itemSpace * (total - 1) + exWidth;
        ndItems.setContentSize(sizeWidth, sizeHeight);
        ndItems.removeAllChildren();

        let itemPosX = this.startX;
        let idx = 0;

        for (idx = 0; idx < itemNum; ++idx) {
            let item = items[idx];

            let itemData = { index: item.index, itemID: item.itemID, isIndentify: false, state: item.state, pickTime: item.pickTime };
            let newNode = this.newItem(itemData, itemPosX);
            newNode.tagEx = idx;
            itemPosX += itemSize.width + this.itemSpace;
        }


    };
    stepGetItemGuide() {
        let guideData = this.getOpenGetItemGuide();
        if (guideData != null) {
            global.Proxys.ProxyGuide.stepNextGuide(guideData.guideKey);
        }
    };

    getShowImageByID(itemID) {
        let iconFile = '';
        let data = global.Manager.DBManager.findData("Precious", 'ID', itemID);;
        if (data != null)
            iconFile = data.showImage;

        if (iconFile.length <= 0)
            iconFile = global.CommonClass.Functions.getItemPicPathNew(itemID);

        return iconFile;
    };

    getSpinePath(itemID) {
        let data = global.Manager.DBManager.findData("Precious", 'ID', itemID);;
        if (data != null && data.spine.length > 0) {
            return data.spine;
        }

        return null;
    };

    addNewItem(isAddEnd) {
        let itemNum = global.Module.IdentifyData.getIdentifyNum();
        let itemSize = this.ndTemplateItem.getContentSize();
        let offset = this.itemSpace + itemSize.width;

        if (isAddEnd) {
            let posX = this.startX + offset * itemNum;

            let item = global.Module.IdentifyData.getIdentifyItem(itemNum - 1);
            let data = { index: item.index, ID: item.itemID, isIndentify: false };

            this.newItem(data, posX);
        }
        else {
            let posX = this.startX - offset;
            let item = global.Module.IdentifyData.getIdentifyItem(0);
            let data = { index: item.index, ID: item.itemID, isIndentify: false };

            this.newItem(data, posX);
        }
    };

    /*  1 改编号 		不在末尾时候,右边都减少一个,在末尾时，有新物品就左边加1， 否则不变
        2 加新节点      看老的数量和新的是否一样，是的话就加新节点，如果是在末尾就加在最前面，否则就加最后
        3 移动          在末尾时候就左侧元素往右移动，否则就右侧往左移动

        4 如何判断是否末尾 老的数量-1是否等于开始的下标
    */
    autoMoveItems(startIdx, callBack)        //鉴定后自动移动一格其它物品
    {
        let self = this;

        let ndView = this.curScroll.getChildByName('view');
        let ndItems = ndView.getChildByName('content');
        let itemNum = global.Module.IdentifyData.getIdentifyNum();
        let maxShow = global.Module.IdentifyData.getMaxItem(1);

        let needAddItem = itemNum == maxShow;
        let isEnd = (startIdx == this.oldNum - 1);

        //改变编号
        if (!isEnd) {
            for (let oldIdx = startIdx + 1; oldIdx < this.oldNum; ++oldIdx) {
                let itemClass = this.getItemClass(oldIdx);
                if (itemClass != null)
                    itemClass.setIndex(oldIdx - 1);
            }
        }
        else {
            if (needAddItem) {
                for (let oldIdx = startIdx - 1; oldIdx >= 0; --oldIdx) {
                    let itemClass = this.getItemClass(oldIdx);
                    if (itemClass != null)
                        itemClass.setIndex(oldIdx + 1);
                }
            }
        }

        if (needAddItem)
            this.addNewItem(!isEnd);

        let isFirstMove = true;
        let moveItem = function (idx, isEnd) {
            let ndItem = ndItems.getChildByName(idx.toString());

            if (ndItem != null) {
                let itemSize = self.ndTemplateItem.getContentSize();
                let offset = self.itemSpace + itemSize.width;

                if (isEnd)
                    offset = -offset;

                let action = cc.moveBy(1, cc.v2(-offset, 0));
                ndItem.stopAllActions();

                if (isFirstMove) {
                    self.moveSchedule = cc.director.getScheduler().schedule(self.adjustScale, self, 0.01, cc.macro.REPEAT_FOREVER, 0, false);

                    let endFunction = function () {
                        if (self.moveSchedule > 0) {
                            cc.director.getScheduler().unschedule(self.adjustScale, self);
                            self.moveSchedule = -1;
                        }

                        if (callBack)
                            callBack();
                    };

                    let callFunc = cc.callFunc(endFunction);
                    let seque = cc.sequence(action, callFunc);
                    ndItem.runAction(seque);

                    isFirstMove = false;
                }
                else {
                    ndItem.runAction(action);
                }
            }
        }

        if (!isEnd) {
            for (let idx = startIdx; idx < itemNum; ++idx)
                moveItem(idx, isEnd);
        }
        else {
            if (needAddItem) {
                for (let idx = startIdx; idx >= 0; --idx)
                    moveItem(idx, isEnd);
            }
            else {
                for (let idx = startIdx - 1; idx >= 0; --idx)
                    moveItem(idx, isEnd);
            }
        }
    };

    showSelect(idx, isSelect) {
        let ndView = this.curScroll.getChildByName('view');
        let ndItems = ndView.getChildByName('content');
        let ndItem = ndItems.getChildByName(idx.toString());
        if (ndItem != null) {
          
        }
    };

    changeSelIndex(index) {
        if (this.selectIdx != index) {
            if (this.selectIdx != null)
                this.showSelect(this.selectIdx, false);

            this.selectIdx = index;

            this.isAtLast = global.Module.IdentifyData.isLast(1);

            this.showSelect(this.selectIdx, true);
        }
    };

    centerToItem(itemIdx) {
        let viewIdx = itemIdx;

        let scrollView = this.curScroll;
        let viewClass = scrollView.getComponent(cc.ScrollView);

        let itemSize = this.ndTemplateItem.getContentSize();
        let offset = (this.itemSpace + itemSize.width) * viewIdx;
        // offset -= scrollView.getContentSize().width;
        let curOffset = viewClass.getScrollOffset();

        let speed = 800;
        let distance = Math.abs(offset + curOffset.x);
        let time = distance / speed;

        let maxOffset = viewClass.getMaxScrollOffset();
        if (offset > maxOffset)
            offset = maxOffset;
        else if (offset < 0)
            offset = 0;

        viewClass.stopAutoScroll();
        viewClass.scrollToOffset(cc.v2(offset, 0), time);

        return time;
    };

    adjustScale() {
        let maxAddScale = 0.2;

        let ndView = this.curScroll.getChildByName('view');
        let ndItems = ndView.getChildByName('content');
        let itemNum = global.Module.IdentifyData.getIdentifyNum();

        for (let i = 0; i < itemNum; ++i) {
            let ndItem = ndItems.getChildByName(i.toString());

            if (ndItem != null) {
                let position = ndItem.getPosition();

                let itemSize = this.ndTemplateItem.getContentSize();
                let oneDistance = itemSize.width + this.itemSpace;

                let itemClass = ndItem.getComponent(global.CommonClass.IndentifyItem);
                let distance = Math.abs(position.x - this.midX);
                if (distance > oneDistance) {
                    itemClass.scaleItem(1);
                }
                else {
                    let reduction = Math.abs(oneDistance - distance) / oneDistance * maxAddScale;
                    let scale = 1 + reduction;
                    itemClass.scaleItem(1);
                }
            }
            else {
            }
        }
    };

    onScrollUpdate() {
        let scrollView = this.curScroll;
        let viewClass = scrollView.getComponent(cc.ScrollView);
        let offset = viewClass.getScrollOffset();

        let itemSize = this.node.getChildByName('ndTemplateItem').getContentSize();
        let oneDistance = this.itemSpace + itemSize.width;

        let itemIdx = Math.ceil((-offset.x) / oneDistance - 0.5);
        if (itemIdx < 0) itemIdx = 0;

        this.changeSelIndex(itemIdx);

        let ndView = this.curScroll.getChildByName('view');
        let itemWidth = ndView.getContentSize().width;
        this.midX = itemWidth / 2 - offset.x;

        this.adjustScale();
    };

    getItemClass(itemIdx) {
        let ndView = this.node.getChildByName('buttom').getChildByName('itemScorll').getChildByName('view');
        let ndItems = ndView.getChildByName('content');
        let item: any = ndItems.getChildByName(itemIdx.toString());
        if (item != null) {
            let itemClass = item.getComponent(global.CommonClass.IndentifyItem);
            return itemClass;
        }
        return null;
    };

    getItemByShowIdx(showIdx) {
        let ndView = this.node.getChildByName('buttom').getChildByName('itemScorll').getChildByName('view');
        let ndItems: any = ndView.getChildByName('content').children;
        for (let key in ndItems) {
            let item = ndItems[key];
            if (item.tagEx == showIdx) {
                return item.getComponent(global.CommonClass.IndentifyItem);
            }
        }

        return null;
    };

    adjustToCenter() {
        this.scrollToItem(this.selectIdx, false);
        this.needAdjust = false;

        return this.selectIdx;
    };

    scrollToItem(itemIdx, isImmed)      //begin form 0
    {
        let scrollView = this.curScroll;
        let viewClass = scrollView.getComponent(cc.ScrollView);

        let itemSize = this.node.getChildByName('ndTemplateItem').getContentSize();
        let offset = (this.itemSpace + itemSize.width) * (itemIdx);

        let maxOffset = viewClass.getMaxScrollOffset();
        if (offset > maxOffset.x)
            offset = maxOffset.x;
        else if (offset < 0)
            offset = 0;

        viewClass.stopAutoScroll();
        if (!isImmed)
            viewClass.scrollToOffset(cc.v2(offset, 0), 2);
        else
            viewClass.scrollToOffset(cc.v2(offset, 0));
    };


    playPutItemAction(index) {
        let itemClass = this.getItemClass(index);
        if (itemClass != null)
            itemClass.playScaleOut();
    };

    makeTalkDec(identifyItem, type) {

        let itemData = global.Manager.DBManager.getItemNew(identifyItem.itemID);
        if (itemData == null)
            return '';
        let itemQuality = itemData.color;
        let rare = itemData.rare;
        let ID = type * 100 + rare * 10 + itemQuality;
        let decData = global.Manager.DBManager.findData('IdentifyTalk', 'ID', ID);
        if (decData != null) {
            let dec = decData.talk;

            let itemDec = ' ' + itemData.name + ' ';
            dec = dec.replace('BMW', itemDec);

            let name = global.Module.MainPlayerData.getRoleName();
            let nameDec = ' ' + name + ' ';
            dec = dec.replace('ZRM', nameDec);

            if (identifyItem.state == 2) {
                let identifyName = ' ' + identifyItem.verifyName + ' ';
                dec = dec.replace('HYM', identifyName);
            }

            return dec;
        }
        return '';
    };

    playIndentifyTalk(isTalk, identifyItem, type) {        //type: 1添加 2:鉴定 3:取回
        this.talkType = type;
        this.stopTalk();
        this.enableSpeakTouch(true);

        if (isTalk) {
            let dec = this.makeTalkDec(identifyItem, type);

            this.curDec = dec;
            this.curDecIdx = 0;

            let perSpeed = 0.03;
            cc.director.getScheduler().schedule(this.updataTalk, this, perSpeed, cc.macro.REPEAT_FOREVER, 0, false);
        } else {
            if (this.curDecIdx >= 0) {
                this.curDecIdx = -1;
                cc.director.getScheduler().unschedule(this.updataTalk, this);
            }
        }
    };



    playGetSound(itemID) {
        let itemData = global.Manager.DBManager.getItemNew(itemID);
        let itemQuality = itemData.color;
        if (itemQuality == 2)
            global.Instance.AudioEngine.replaySound('drop2', false, null);
        else if (itemQuality == 3)
            global.Instance.AudioEngine.replaySound('drop1', false, null);
        else if (itemQuality == 4)
            global.Instance.AudioEngine.replaySound('seed', false, null);
        else if (itemQuality == 5)
            global.Instance.AudioEngine.replaySound('seed', false, null);
    };

    getItem(showIdx) {
        this.playAllItemJump(false);

     
        this.clickMask.active = true;
        let time = this.centerToItem(showIdx);
        let self = this;
        let endFun = function () {
            self.playLight(true, false, showIdx);
            self.sendToGetItem(showIdx);
            self.clickMask.active = false;
        }

        let endFunction = cc.callFunc(endFun);
        let timeDelay = cc.delayTime(time);
        let seq = cc.sequence(timeDelay, endFunction);
        this.node.stopAllActions();
        this.node.runAction(seq);
    };
    //自动完成鉴定
    auotIndetify(item) {
        //暂时关闭自动鉴定
        // let self     = this;
        // let roleId   = global.Module.MainPlayerData.getRoleID();
        // let data     = {roleId:roleId, index:item.index, itemId:item.itemID};

        // global.Instance.MsgPools.send('verifyItem', data, function(msg)
        // {
        //     if (!msg.errorID)
        //     {
        //         let itemData    = global.Module.IdentifyData.getIdentifyItemByID(item.index);
        //         let itemClass   = self.getItemClass(item.index);
        //         itemClass.setData(itemData);
        //         itemClass.showQulity(false);

        //         global.Proxys.ProxyGuide.stepNextGuide('PutIndentifyItem');

        //         self.enableTouchLock(false);
        //         global.CommonClass.UITip.showTipTxt('自动完成鉴定', global.Enum.TipType.TIP_GOOD); 
        //     }
        // });
    };

    onPutItemCB(index) {   //index:ID
        let itemClass = this.getItemClass(index);

        let data = global.Module.IdentifyData.getIdentifyItemByID(index);
        itemClass.setData(data);

        this.playPutItemAction(index);

        this.playIndentifyTalk(true, data, 1);

        let level = global.Module.MainPlayerData.getLevel();
        if (level < 10 && global.Module.IdentifyData.getCanAutoIdentify()) {
            let callBack = this.auotIndetify.bind(this, data);
            let endFunction = cc.callFunc(callBack);
            let timeDelay = cc.delayTime(2);
            let seq = cc.sequence(timeDelay, endFunction);
            this.node.runAction(seq);

            // this.enableTouchLock(true);
        }
    };

    onIndentifyItemClick(event) {
        global.CommonClass.UITip.showTipTxt('需要好友来鉴定', global.Enum.TipType.TIP_NORMAL);
    };
    //鉴定 可取
    onGetItemClick(event) {
        
        let item = event.getUserData();
        let showIdx = item.tagEx;
        this.getItem(showIdx);
    };
    //加速
    onItemQuick(event) {
        let item = event.getUserData();

        let showIdx = item.tagEx;
        let itemClass = item.getComponent(global.CommonClass.IndentifyItem);
        let itemData = itemClass.getData();

        let pickTime = itemData.pickTime;
        let leftTime = global.CommonClass.Functions.getLeftTime(pickTime);

        let callBack = function (errorID) {
            if (errorID == 0) {

                let data = global.Module.IdentifyData.getIdentifyItem(showIdx);
                itemClass.setData(data);
                itemClass.setItemSelfInditify(false);

                global.Instance.Log.debug('speed..idx..' + showIdx.toString() + 'state..', data.state.toString());
            }
            else {
            }
        };
        var taskdata = global.Module.TaskData.getHasAcceptTaskData();
        if (taskdata && taskdata.taskId == 10001 && taskdata.state == 1 && itemData.itemID == '500401')
            leftTime = 0;
        global.Manager.UIManager.open('DlgIdentifySpeed', null, function (panel) {
            if (panel)
                panel.show(leftTime, itemData.index, callBack);
        });

    };
    //打开鉴定列表
    onAddItemClick(event) {

        var idx = global.Module.IdentifyData.getBootindex()
        if (idx != -1) {
            global.Module.IdentifyData.setBootindex(-1)
        }

        let item = event.getUserData();
        let itemClass = item.getComponent(global.CommonClass.IndentifyItem);
        let itemData = itemClass.getData();

        let self = this;
        global.Manager.UIManager.open('UIIdentifyBag', null, function (panel) {
            panel.show(itemData.index, self.onPutItemCB.bind(self));
        });
    };

 

    updataTalk() {
        if (this.curDecIdx >= this.curDec.length && this.curDecIdx >= 0) {
            let self = this;
            this.curDecIdx = -1;
            cc.director.getScheduler().unschedule(this.updataTalk, this);

            let ndSpeek = this.node.getChildByName('ndSpeek');
            let callBack = function () {
                // if (self.talkType != 3) //可取
                // self.stopTalk();
            };
            let endFunction = cc.callFunc(callBack);
            let delay = cc.delayTime(2);
            let seq1 = cc.sequence(delay, endFunction);
            ndSpeek.runAction(seq1);
        }
        else if (this.curDecIdx >= 0) {
            let lblDec = this.node.getChildByName('ndSpeek').getChildByName('lblDec').getComponent(cc.Label);
            let newDec = this.curDec.substr(0, this.curDecIdx + 1);
            lblDec.string = newDec;
        }
        this.curDecIdx++;
    };

    playTalk(isTalk, dec) {
        let ndSpeek = this.node.getChildByName('ndSpeek');
        this.enableSpeakTouch(isTalk)

        if (isTalk) {

            this.curDec = dec;
            this.curDecIdx = 0;

            let lblDec = ndSpeek.getChildByName('lblDec').getComponent(cc.Label);
            lblDec.string = '';

            let perSpeed = 0.03;
            cc.director.getScheduler().schedule(this.updataTalk, this, perSpeed, cc.macro.REPEAT_FOREVER, 0, false);
        }
        else {
            if (this.curDecIdx >= 0) {
                this.curDecIdx = -1;
                cc.director.getScheduler().unschedule(this.updataTalk, this);
            }
        }
    };

    btnHeadClick() {
        return;
        let selfID = global.Module.MainPlayerData.getRoleID();
        global.Manager.UIManager.open('UIRole', null, function (panel) {
            panel.show(selfID);
        });
    };

    stopTalk() {
        cc.director.getScheduler().unschedule(this.updataTalk, this);
        this.enableSpeakTouch(false);

    };

    showGetItem(itemID, curGetItem, isShow) {
        this.enableTouchItem(isShow);
        if (isShow) {
            let ndItemShow = this.node.getChildByName('ndItemShow');
            let spItem = ndItemShow.getChildByName('spItem');
            ndItemShow.active = true;
            let data = global.Manager.DBManager.findData('Items', 'ID', curGetItem);
            let precious = global.Manager.DBManager.findData('THandBook', 'ID', data.perfect);
            let iconFile = "images/pictrue/items/default";
            if (data != null)
                iconFile = 'images/pictrue/precious/' + data.picName;
            if (precious != null)
                spItem.scale = precious.scale1;

            let position = cc.v2(0, -158);
            if (precious) {
                position.x = 0 + precious.adjustRight;
                position.y = -158 + precious.adjustUp
            }
            let preciousData = global.Manager.DBManager.findData('Items', 'ID', itemID);
            let THandBook = global.Manager.DBManager.findData('THandBook', 'ID', itemID);
            ndItemShow.setPosition(position)
            global.CommonClass.Functions.setTexture(spItem, iconFile, function (msg) {
               
                let spQuality = ndItemShow.getChildByName('spQuality');
                let scale = global.CommonClass.Functions.getToscale(spItem, 300, 350);
                spQuality.active = false;
                cc.tween(spItem)
                .to(0.5, { scale: ( scale) })
                .delay(1)
                    .call(() => {
                        if (preciousData != null) {
                            iconFile = 'images/pictrue/precious/' + preciousData.picName;
                            global.CommonClass.Functions.setTexture(spItem, iconFile, function (spImage) {
                                
                                spQuality.active = true;
                                spItem.x += THandBook.adjustRight
                            })
                          
                        }
                        if (preciousData != null) {
                            let qualityImge = 'images/pictrue/identify/quality' + preciousData.color.toString();
                            var url = "appgrade" + (preciousData.color.toString() - 1);
                            global.Instance.AudioEngine.playSound(url, false, 2, null);
                            global.CommonClass.Functions.setTexture(spQuality, qualityImge, function () {
                                spQuality.active = true;
                            });
                        }
                    })
                .start()
            });
           
        }
    };
    //鉴定
    sendToGetItem(showIdx) {
        let self = this;
        let itemClass = this.getItemByShowIdx(showIdx);

        let itemData = global.Module.IdentifyData.getIdentifyItem(showIdx);
        this.curGetItem = itemData.itemID;
        let spStaticItem = itemClass.node.getChildByName('spStaticItem');
        let data = { index: itemData.index };
        this.clickMask.active = true;

        let dataClone = Object.assign({}, itemData);

        global.Instance.MsgPools.send('verifyDequeue', data, function (msg) {
            if (!msg.errorID) {
                let runEnd = function () {
                 
                    self.clickMask.active = false;
                    dataClone.itemID = msg.resultItem;
                    self.playIndentifyTalk(true, dataClone, 3);
                    self.playGetSound(self.curGetItem);//播放音乐

                };

                itemClass.playItemUp(function () {
                    self.runIndentifyAction(runEnd);
                    let msgData = { index: data.index, itemID: 0, isIndentify: false, state: 0, pickTime: 0 };
                    itemClass.setData(msgData);
                    self.showGetItem(msg.resultItem, self.curGetItem, true);
                });
            }
            else {
                self.clickMask.active = false;
            }
        });
    };

    getOpenIndentifyGuide() {
        let guideData = null;
        if (global.Proxys.ProxyGuide.getIsOpen('IndentifyFly')) {
            guideData = global.Manager.DBManager.findData('NewGuide', 'guideKey', 'IndentifyFly');
        }
        else if (global.Proxys.ProxyGuide.getIsOpen('IndentifyVessel')) {
            guideData = global.Manager.DBManager.findData('NewGuide', 'guideKey', 'IndentifyVessel');
        }
        else if (global.Proxys.ProxyGuide.getIsOpen('IndentifyPaint')) {
            guideData = global.Manager.DBManager.findData('NewGuide', 'guideKey', 'IndentifyPaint');
        }

        return guideData;
    };

    getOpenGetItemGuide() {
        let guideData = null;
        if (global.Proxys.ProxyGuide.getIsOpen('GetIndentifyFly')) {
            guideData = global.Manager.DBManager.findData('NewGuide', 'guideKey', 'GetIndentifyFly');
        }
        else if (global.Proxys.ProxyGuide.getIsOpen('GetIndentifyVessel')) {
            guideData = global.Manager.DBManager.findData('NewGuide', 'guideKey', 'GetIndentifyVessel');
        }
        else if (global.Proxys.ProxyGuide.getIsOpen('GetIndentifyPanit')) {
            guideData = global.Manager.DBManager.findData('NewGuide', 'guideKey', 'GetIndentifyPanit');
        }

        return guideData;
    };

    onIdentifyPick(msg) {
        let index = msg.idx;
        let data = msg.pickItem;

        let itemClass = this.getItemByShowIdx(index);
        if (itemClass != null)
            itemClass.setData(data);
    };

    onIdentifyUpdate(msg) {
        let index = msg.idx;
        let pickTime = msg.pickTime;

        let itemClass = this.getItemByShowIdx(index);
        if (itemClass != null)
            itemClass.setTime(pickTime);
    };

    touchLockEvent(event) {
        if (event.type == cc.Node.EventType.TOUCH_START) {
            if (this.ndTouch.active) {
                global.CommonClass.UITip.showError('OP_LOCK');
            }
        }
    };
    touchShowItem(event) {
        if (event.type == cc.Node.EventType.TOUCH_START || event.type == cc.Node.EventType.TOUCH_END || event.type == cc.Node.EventType.TOUCH_CANCEL) {
            this.playShowItemFly();
        }
    };
    btnHistory() {
        global.Manager.UIManager.open('UIIndentifyHistory', null, function (panel) {
        });
    };
    btnClose() {
        let name = global.CommonClass.Functions.getSceneName();
        if (name == 'MainScene') {
            global.Manager.UIManager.close('UIIdentify');
        } else {
            global.CommonClass.Functions.loadScene('MainScene', null);
        }
    };

    btnSimple() {
        let uiFriendChoose = global.Manager.UIManager.get('UIFriendChoose');
        if (uiFriendChoose != null) {
            this.simpleMode = !this.simpleMode;
            uiFriendChoose.showSimple(this.simpleMode);
        }
    };


    // update (dt) {}
}

