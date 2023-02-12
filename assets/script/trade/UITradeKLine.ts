//股票K线图
import UIBase from "../common/UIBase";
const {ccclass, property} = cc._decorator;

@ccclass
export default class UITradeKLine extends UIBase {
    @property({ type: cc.Node, displayName: "nodeContent", tooltip: "nodeContent" })
    nodeContent: cc.Node = null;
    @property({ type: cc.Node, displayName: "nodeTrade", tooltip: "nodeTrade" })
    nodeTrade: cc.Node = null;
    @property({ type: cc.Node, displayName: "nodeDayLine", tooltip: "nodeDayLine" })
    nodeDayLine: cc.Node = null;
    @property({ type: cc.Node, displayName: "nodeDrawKLine", tooltip: "nodeDrawKLine" })
    nodeDrawKLine: cc.Node = null;
    @property({ type: cc.Node, displayName: "nodeDrawTrade", tooltip: "nodeDrawTrade" })
    nodeDrawTrade: cc.Node = null;
    @property({ type: cc.Node, displayName: "nodeDrawDayLine", tooltip: "nodeDrawDayLine" })
    nodeDrawDayLine: cc.Node = null;
    @property({ type: cc.Node, displayName: "lblTitle", tooltip: "标题" })
    lblTitle: cc.Node = null;
    @property({ type: cc.Node, displayName: "lblValMin", tooltip: "lblValMin" })
    lblValMin: cc.Node = null;
    @property({ type: cc.Node, displayName: "lblValMax", tooltip: "lblValMax" })
    lblValMax: cc.Node = null;
    data: any[];
    touchStart: cc.Vec2;
    touchStart1: any;
    isMoved: boolean;
    startPos: number;
    itemID: any;
    itemData: any;
    time1: number;
    isShow: boolean;

    constructor(){
        super();
        this.data = [];
        this.touchStart = cc.v2(0, 0);
        this.touchStart1 = cc.v2(0, 0);
        this.isMoved = true;
        this.startPos = 0;
    };

    onLoad () {}

    start () {

    }
    onEnable() {
        this.nodeContent.on(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
        this.nodeContent.on(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
        this.nodeContent.on(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
        this.nodeContent.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);
    };

    onDisable() {
        this.nodeContent.off(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
        this.nodeContent.off(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
        this.nodeContent.off(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
        this.nodeContent.off(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);
    };

    touchEvent(event) {
        if (this.isShow == false)
            return;
        let touchPoint = event.getLocation();
        if (event.type == cc.Node.EventType.TOUCH_START) {
            this.touchStart = touchPoint;
            this.touchStart1 = touchPoint;
            this.time1 = new Date().getTime();
        } else if (event.type == cc.Node.EventType.TOUCH_MOVE) {
            let touchPointX0 = this.touchStart.x; // 起始位置
            let touchPointX1 = touchPoint.x; // 新位置
            if (Math.abs(touchPointX0 - touchPointX1) > 25) {
                let curHistory = global.Module.TradeData.getHistoryData();
                this.data = [];
                if ((touchPointX1 - touchPointX0) > 0.0) {
                    // 右移动
                    this.startPos -= 1;
                    if (this.startPos < 0) {
                        this.startPos = 0;
                    }
                } else {
                    this.startPos += 1;
                    if (this.startPos > curHistory.historyPrices.length - 110) {
                        this.startPos = curHistory.historyPrices.length - 110;
                    }
                }
                this.touchStart = touchPoint;
                let count = 0;
                for (let i = this.startPos; i < curHistory.historyPrices.length; i++) {
                    if (count > 110) {
                        break;
                    }
                    let date = curHistory.historyPrices[i];
                    let endPrice1 = 0;
                    let yesterData = curHistory.historyPrices[i-1]
                    if(yesterData){
                        endPrice1 = parseInt(yesterData.endPrice);
                    }else{
                        endPrice1 = this.itemData.recyclePrice
                    }

                    let data = {
                        date: date.date,
                        day5: parseInt(date.day5),
                        day10: parseInt(date.day10),
                        day30: parseInt(date.day30),
                        endPrice: parseInt(date.endPrice),
                        highestPrice: parseInt(date.highestPrice),
                        lowestPrice: parseInt(date.lowestPrice),
                        month: parseInt(date.month),
                        startPrice: parseInt(date.startPrice),
                        turnover: parseInt(date.turnover),
                        endPrice1:endPrice1
                    }
                    this.data.push(data);
                    count++;
                }
                this.drawKLine();
            }
        } else if (event.type == cc.Node.EventType.TOUCH_END || event.type == cc.Node.EventType.TOUCH_CANCEL) {
            let time = new Date().getTime();
            if (time - this.time1 < 500 && this.touchStart1 != null) {
                this.isShow = false;
                let touchPointX0 = this.touchStart1.x; // 起始位置
                let touchPointX1 = touchPoint.x; // 新位置
                let interval: number = 0.1; // 以秒为单位的时间间隔
                let repeat = Math.ceil(Math.abs(touchPointX0 - touchPointX1) / 200);; // 重复次数
                let delay = 0.02; // 开始延时 : 延迟10秒执行该循环。
                let i = 0;
                /** 每隔n秒 执行一次 ，循环多次 ---- 例如：某个任务需要在10秒后开始执行，每5秒执行一次回调，重复3次。*/
                this.schedule(function () {
                    i++;
                    {
                        let curHistory = global.Module.TradeData.getHistoryData();
                        this.data = [];
                        if ((touchPointX1 - touchPointX0) > 0.0) {
                            // 右移动
                            this.startPos -= 1;
                            if (this.startPos < 0) {
                                this.startPos = 0;
                            }
                        } else {
                            this.startPos += 1;
                            if (this.startPos > curHistory.historyPrices.length - 110) {
                                this.startPos = curHistory.historyPrices.length - 110;
                            }
                        }
                        let count = 0;
                        for (let i = this.startPos; i < curHistory.historyPrices.length; i++) {
                            if (count > 110) {
                                break;
                            }
                            let date = curHistory.historyPrices[i];
                            let endPrice1 = 0;
                            let yesterData = curHistory.historyPrices[i - 1]
                            if (yesterData) {
                                endPrice1 = parseInt(yesterData.endPrice);
                            } else {
                                endPrice1 = this.itemData.recyclePrice
                            }

                            let data = {
                                date: date.date,
                                day5: parseInt(date.day5),
                                day10: parseInt(date.day10),
                                day30: parseInt(date.day30),
                                endPrice: parseInt(date.endPrice),
                                highestPrice: parseInt(date.highestPrice),
                                lowestPrice: parseInt(date.lowestPrice),
                                month: parseInt(date.month),
                                startPrice: parseInt(date.startPrice),
                                turnover: parseInt(date.turnover),
                                endPrice1: endPrice1
                            }
                            this.data.push(data);
                            count++;
                        }
                        this.drawKLine();
                    }
                    if (i == repeat) {
                        this.isShow = true;
                        this.touchStart1 == null;
                        this.touchStart == null;
                    }
                }, interval, repeat, delay);
            }
        }
    };

    show(itemID) {

        this.itemID = itemID;

        global.Module.TradeData.calKLine();
        let curHistory = global.Module.TradeData.getHistoryData();
        global.Instance.Log.debug('',curHistory);

        this.itemData = global.Manager.DBManager.getItemNew(curHistory.req.itemID);
        this.lblTitle.getComponent(cc.Label).string = this.itemData.name;

        this.data = [];
        this.startPos = 0;
        if (curHistory.historyPrices.length > 110) {
            this.startPos = curHistory.historyPrices.length - 110;
        }
        for (let i = this.startPos; i < curHistory.historyPrices.length; i++) {
            let date = curHistory.historyPrices[i];
            let endPrice1 = 0;
            let yesterData = curHistory.historyPrices[i - 1]
            if (yesterData) {
                endPrice1 = parseInt(yesterData.endPrice);
            } else {
                endPrice1 = this.itemData.recyclePrice
            }
            let data = {
                date: date.date,
                day5: parseInt(date.day5),
                day10: parseInt(date.day10),
                day30: parseInt(date.day30),
                endPrice: parseInt(date.endPrice),
                highestPrice: parseInt(date.highestPrice),
                lowestPrice: parseInt(date.lowestPrice),
                month: parseInt(date.month),
                startPrice: parseInt(date.startPrice),
                turnover: parseInt(date.turnover),
                endPrice1:endPrice1
            }
            this.data.push(data);
        }
        this.drawKLine();
    };
    numberFormat(maxPrice,minPrice) {
        let param = {};
        let sizes = ['', '万', '亿', '万亿'];
        let k = 0;
        if (maxPrice < 10000) {
            k = 0;
            maxPrice = maxPrice + 1;
            minPrice = minPrice - 1;
        } else if (maxPrice < 100000000) {
            k = 1;
            maxPrice = Math.ceil((maxPrice + 1) / 10000);
            minPrice = Math.floor((minPrice - 1) / 10000);
        } else if (maxPrice < 1000000000000) {
            k = 2;
            maxPrice = Math.ceil((maxPrice + 1) / 100000000);
            minPrice = Math.floor((minPrice - 1) / 100000000);
        } else {
            maxPrice = Math.ceil((maxPrice + 1) / 1000000000000);
            minPrice = Math.floor((minPrice - 1) / 1000000000000);
            k = 3;
        }
        this.node.getChildByName('xian1').getChildByName('numLabel').getComponent(cc.Label).string = minPrice+sizes[k]
        this.node.getChildByName('xian2').getChildByName('numLabel').getComponent(cc.Label).string = Math.round((maxPrice-minPrice)/2+minPrice)+sizes[k]
        this.node.getChildByName('xian3').getChildByName('numLabel').getComponent(cc.Label).string = maxPrice+sizes[k]
    };
    drawKLine() {

        let maxPrice = 0;
        let minPrice = 0;
        let maxTrade = 0;
        let minTrade = 0;
        if(this.data[0]){
            minPrice = this.data[0].lowestPrice;
        }
        if(this.data[0]){
            minTrade = this.data[0].turnover;
        }
        for (let i = 0; i < this.data.length; i++) {
            let tmpData = this.data[i];
            if(tmpData.turnover > maxTrade){

            }else{
            }
            maxPrice = tmpData.highestPrice > maxPrice ? tmpData.highestPrice : maxPrice;
            minPrice = tmpData.lowestPrice < minPrice ? tmpData.lowestPrice : minPrice;
            maxTrade = Number(tmpData.turnover) > maxTrade ? Number(tmpData.turnover) : maxTrade;
            minTrade = Number(tmpData.turnover) < minTrade ? Number(tmpData.turnover) : minTrade;

        }
        this.numberFormat(maxPrice,minPrice);

        global.Instance.Log.debug("maxPrice:" + maxPrice + " minPrice:" + minPrice , " maxTrade:" + maxTrade + " minTrade:" + minTrade);

        let showHighest = false;
        let showLowest = false;

        let lineDrawKLine = this.nodeDrawKLine.getComponent(cc.Graphics);
        lineDrawKLine.clear();

        let lineDrawTrade = this.nodeDrawTrade.getComponent(cc.Graphics);
        lineDrawTrade.clear();

        let lineDrawDayLine = this.nodeDrawDayLine.getComponent(cc.Graphics);
        lineDrawDayLine.clear();
        let id = 0;
        for (let i = 1; i < 5; i++) {
            this.nodeContent.getChildByName('timeLabel'+i).active = false;
        }
        for (let i = 0; i < this.data.length; i++) {
            let tmpData = this.data[i];
           
            {
                let startPosX = 7 / 2 + (i) * 7 + i * 2;
                let height = tmpData.turnover / maxTrade * 80;
                // cc.color(255, 48, 0)#ff3000红     cc.color(46, 228, 0)#2ee400绿
                this.drawRect(lineDrawTrade, startPosX - 7.0 / 2.0, 0, 7, height, (tmpData.endPrice <= tmpData.endPrice1) ? cc.color(0x2e, 0xe4, 0x00):cc.color(0xff, 0x30, 0x00));
                let dateArr = tmpData.date.split("-");
                if(dateArr[2]=="01"){
                    id++;
                    if(id == 1){
                        if(startPosX<100){
                            this.node.getChildByName('xian1').getChildByName('numLabel').active = false; 
                        }else{
                            this.node.getChildByName('xian1').getChildByName('numLabel').active = true; 
                        }
                    }
                    
                    this.nodeContent.getChildByName('timeLabel'+id).active = true;
                    this.nodeContent.getChildByName('timeLabel'+id).getComponent(cc.Label).string = dateArr[0]+'-'+dateArr[1];
                    this.nodeContent.getChildByName('timeLabel'+id).x =  startPosX;
                   
                  
                }
            }
            {
                let posX = 7 / 2 + (i) * 7 + i * 2;
                let posY = (tmpData.startPrice - minPrice) / (maxPrice - minPrice) * 340.0;

                let singlePixel = 340 / (maxPrice - minPrice);
                let topHeight = (tmpData.highestPrice - tmpData.startPrice) * singlePixel;
                let lowHeight = (tmpData.startPrice - tmpData.lowestPrice) * singlePixel;

                if (showHighest == false && tmpData.highestPrice == maxPrice) {
                    this.lblValMax.getComponent(cc.Label).string = tmpData.highestPrice;
                    this.lblValMax.active = true;
                    this.lblValMax.x = posX+5;
                    this.lblValMax.y = posY + topHeight;
                    showHighest = true;
                }

                if (showLowest == false && tmpData.lowestPrice == minPrice) {
                    this.lblValMin.getComponent(cc.Label).string = tmpData.lowestPrice;
                    this.lblValMin.active = true;
                    this.lblValMin.x = posX+5;
                    this.lblValMin.y = posY - lowHeight;
                    showLowest = true;
                }

                let color = cc.color(0xff, 0x30, 0x00);//红
                if (tmpData.endPrice < tmpData.startPrice) {
                    color = cc.color(0x2e, 0xe4, 0x00);//绿
                }else if (tmpData.endPrice == tmpData.startPrice){
                    color = cc.color(255, 255, 255,255);//白
                }

                this.drawRect(lineDrawKLine, posX - 0.5, posY, 1, topHeight, color);
                this.drawRect(lineDrawKLine, posX - 0.5, posY - lowHeight, 1, lowHeight, color);
                {
                    if (tmpData.startPrice < tmpData.endPrice) {
                        {
                            let height = (tmpData.endPrice - tmpData.startPrice) * singlePixel;
                            this.drawRect(lineDrawKLine, posX - 7.0 / 2.0, posY, 7, height, color);
                        }
                    } else if (tmpData.startPrice > tmpData.endPrice) {
                        {
                            let height = (tmpData.startPrice - tmpData.endPrice) * singlePixel;
                            this.drawRect(lineDrawKLine, posX - 7.0 / 2.0, posY - height, 7, height, color);
                        }
                    } else {
                        this.drawRect(lineDrawKLine, posX - 7.0 / 2.0, posY, 7, 0.5, color);
                        this.drawRect(lineDrawKLine, posX - 7.0 / 2.0, posY - 0.5, 7, 0.5, color);
                    }
                }
            }
            {
                if (i + 1 < this.data.length) {
                    let data1 = this.data[i];
                    let data2 = this.data[i + 1];

                    if (data1.day5 != -1 && data2.day5 != -1) {
                        let startPosX = 7 / 2 + (i) * 7 + i * 2;
                        let startPosY = (data1.day5 - minPrice) / (maxPrice - minPrice) * 340.0;

                        let endPosX = 7 / 2 + (i + 1) * 7 + (i + 1) * 2;
                        let endPosY = (data2.day5 - minPrice) / (maxPrice - minPrice) * 340.0;
                        // global.Instance.Log.debug(i, data1.day5, data2.day5, startPosX, startPosY, endPosX, endPosY);
                        //白色
                        this.drawLine(lineDrawDayLine, cc.v2(startPosX, startPosY), cc.v2(endPosX, endPosY), cc.color(255, 255, 255, 255),null);
                    }

                    if (data1.day10 != -1 && data2.day10 != -1) {
                        let startPosX = 7 / 2 + (i) * 7 + i * 2;
                        let startPosY = (data1.day10 - minPrice) / (maxPrice - minPrice) * 340.0;

                        let endPosX = 7 / 2 + (i + 1) * 7 + (i + 1) * 2;
                        let endPosY = (data2.day10 - minPrice) / (maxPrice - minPrice) * 340.0;
                        // global.Instance.Log.debug(i, data1.day10, data2.day10, startPosX, startPosY, endPosX, endPosY);
                        //  cc.color(255,220,54,255)#ffdc36 黄线
                        this.drawLine(lineDrawDayLine, cc.v2(startPosX, startPosY), cc.v2(endPosX, endPosY), cc.color(0xff, 0xdc, 0x36, 255),null);
                    }

                    if (data1.day30 != -1 && data2.day30 != -1) {
                        let startPosX = 7 / 2 + (i) * 7 + i * 2;
                        let startPosY = (data1.day30 - minPrice) / (maxPrice - minPrice) * 340.0;

                        let endPosX = 7 / 2 + (i + 1) * 7 + (i + 1) * 2;
                        let endPosY = (data2.day30 - minPrice) / (maxPrice - minPrice) * 340.0;
                        // global.Instance.Log.debug(i, data1.day30, data2.day30, startPosX, startPosY, endPosX, endPosY);
                        //  cc.color(38,156,204,255)#269ccc 蓝线
                        this.drawLine(lineDrawDayLine, cc.v2(startPosX, startPosY), cc.v2(endPosX, endPosY), cc.color(0x26, 0x9c, 0xcc, 255),null);
                    }
                }
            }
        }
    };

    drawRect(lineDraw, x, y, width, height, color) {
        lineDraw.lineWidth = 1;
        lineDraw.fillColor = color;       //底线
        lineDraw.moveTo(x, y);
        lineDraw.fillRect(x, y, width, height);
        lineDraw.fill();
    };

    drawLine(lineDraw, begin, end, color, width) {
        if (width == null)
            width = 3;

        lineDraw.lineWidth = width;
        lineDraw.strokeColor = color;       //底线
        lineDraw.moveTo(begin.x, begin.y);
        lineDraw.lineTo(end.x, end.y);
        lineDraw.stroke();
    };

    btnClose() {
        global.Manager.UIManager.close('UITradeKLine');
    };

    // update (dt) {}
}
