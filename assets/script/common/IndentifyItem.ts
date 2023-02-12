
let self: any;
const {ccclass, property} = cc._decorator
@ccclass
export default class IndentifyItem extends cc.Component {

    @property({  displayName: "isFriend", tooltip: "isFriend" })
    isFriend: boolean = false;
    @property({ type: cc.Node, displayName: "recallNode", tooltip: "立即鉴定" })
    recallNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "ndItemNode", tooltip: "ndItemNode" })
    ndItemNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "ndUpItemNode", tooltip: "ndUpItemNode" })
    ndUpItemNode: cc.Node = null;
    @property({ type: cc.Label, displayName: "lblName", tooltip: "lblName" })
    lblName: cc.Label = null;
    @property({ type: cc.Label, displayName: "lblTimeLabel", tooltip: "lblTimeLabel" })
    lblTimeLabel: cc.Label = null;
    @property({ type: cc.Node, displayName: "background", tooltip: "background" })
    background: any =  [];
    itemScale: number;
    unIndentifyItem: number;
    unIndentifyID: number;
    helpNode: any;
    isSelfInditify: any;
    data: any;

        
    constructor() {
        super();
        this.data = {};

        this.itemScale = 1;
        this.unIndentifyItem = 0;

        this.unIndentifyID = 0;
        this.helpNode = null;

        //this.isInPlayTimeChange = false;
    };

    static create(itemData, parent, position) {
            let filePath =  "prefab/component/IdentifyItem";
            global.CommonClass.Functions.setCreate(filePath, function (prefab) {
                if (prefab != null) {
                    let newNode = cc.instantiate(prefab);
                    parent.addChild(newNode, cc.macro.MAX_ZINDEX);
                    newNode.setPosition(position);
                    newNode.setName(itemData.index.toString());
                  
                    let itemClass = newNode.getComponent(global.CommonClass.IndentifyItem);
                    itemClass.setData(itemData);
                }
            });
        };

    // use this for initialization
    onLoad() {
       self = this;
    };

    onEnable()
    {
        this.node.scale = 1;
    };


    getData()
    {
        return this.data;
    };

    setData(itemData: { state?: any; }) {
        if (itemData != null) {  
            this.data = itemData;
            this.data.isIndentify = this.data.state==2;

            if(!this.data.isIndentify)
                this.unIndentifyID = this.data.itemID;
            this.setItemID(this.data.itemID);
            this.setTime(this.data.pickTime);
        }else {
            this.data = null;
            this.setItemID(-1);
            this.setTime(0);
        }
        this.reflashBtns(itemData.state);
        this.setbootindex();
        
    };
    setbootindex() {
        let bootindex = global.Module.IdentifyData.getBootindex();
        let taskdata = global.Module.TaskData.getHasAcceptTaskData();
        let pickTime = 0;
        if (this.data != null)
            pickTime = this.data.pickTime;
        let leftTime = global.CommonClass.Functions.getLeftTime(pickTime);
        let getCurType =  global.Module.IdentifyData.getCurOpType()
        if(getCurType== 1){
            if ((taskdata && taskdata.taskId == 10001 && taskdata.state == 1 && this.data.index == bootindex)) {
                let helpNode1 = this.node.getChildByName('help1');
                let helpNode2 = this.node.getChildByName('help2');
                helpNode1.active = !(this.data.state == 1 && leftTime > 0);
                helpNode2.active = (this.data.state == 1 && leftTime > 0);
            }
        }else{
            let helpNode1 = this.node.getChildByName('help1'); 
            helpNode1.active =((taskdata && taskdata.taskId == 10009 && taskdata.state == 1)&&(this.data.state == 1 && leftTime > 0))
        }
        
      
    };
    hidebootindex() {
        let helpNode = this.node.getChildByName('help1');
        if (helpNode)
            helpNode.active = false;
    };

    reflashBtns(state) {
      
        if(this.recallNode != null) {
            this.recallNode.active =(state == 1);
            if(state == 1){
                let pickTime = this.data.pickTime;
                let leftTime = global.CommonClass.Functions.getLeftTime(pickTime);

                var taskdata = global.Module.TaskData.getHasAcceptTaskData();
                if (taskdata && taskdata.taskId == 10001 && taskdata.state == 1 && this.data.itemID == '500401')
                    leftTime = 0;
                let data = global.Manager.DBManager.findData('Sundry', 'name', 'accelerateConsumption');
                let itemNum = Math.ceil(leftTime / (data.value * 60));
                this.recallNode.getChildByName('timeLabel').getComponent(cc.Label).string = itemNum.toString();

            }
          
        }
        // this.setTime(0);
    };

    scaleItem(scale) {
        let realScale = this.itemScale*scale;
        this.ndUpItemNode.setScale(realScale);
    };
    setItemID(itemID) {
        this.data.ID = itemID;
        let spUpItem    = this.ndUpItemNode.getChildByName('spUpItem');
        if (itemID && itemID != -1) {
            let data=global.Manager.DBManager.getItemNew(this.data.ID); 
            let name = data.name;
            if(name.length>5)
                name = name.substr(0, 5);
            this.lblName.string = name
            let precious = global.Manager.DBManager.findData('THandBook', 'ID', data.perfect);
            global.Instance.Log.debug('data.scale1',precious)
            if(precious != null) {
                this.ndUpItemNode.scale = precious.scale1;
                this.itemScale = precious.scale1;
                let iconFile = 'images/pictrue/precious/'+ data.picName;
                spUpItem.setPosition(precious.adjustRight/this.itemScale,precious.adjustUp/this.itemScale)
                // spUpItem.setPosition(0,0)
                global.CommonClass.Functions.setTexture(spUpItem, iconFile, function(spTexture) {
                    
                });

                let showItemId = this.unIndentifyID;
                if(showItemId == 0)
                    showItemId = itemID;
            }
        } else {
            this.ndItemNode.active       = false;
        }
    };

    setTime(pickTime) {
        let leftTime = global.CommonClass.Functions.getLeftTime(pickTime);
        if(leftTime <= 0)
            leftTime = 0;
        let data = global.CommonClass.Functions.formatSeconds3(leftTime);
        let str= ''
        str = data.time1+data.timeLabel1+data.time2+data.timeLabel2
        this.lblTimeLabel.string = str
        this.lblTimeLabel.node.active = this.data.state == 1 && leftTime > 0;
        this.background[0].active = this.data.state == 1 && leftTime > 0;
        this.background[1].active = leftTime <= 0&&this.data.state == 2;
        this.lblName.node.active =(leftTime <= 0&&this.data.state == 2);
    };

    setItemSelfInditify() {
        let spQuality2   = this.ndUpItemNode.getChildByName("spUpItem").getChildByName('spQuality');

        let qualityImge = 'images/pictrue/identify/quality0';
        global.CommonClass.Functions.setTexture(spQuality2, qualityImge,null);

        this.isSelfInditify = true;
    };

    playScaleOut() {
        this.ndItemNode.active = true;
    };

    //播放缩放大小动画
    playShowItemScale(callback) {
      
        let ndBaseItem  = this.ndItemNode.getChildByName('ndBaseItem');
        this.ndItemNode.active       = true;
        ndBaseItem.active   = false;




    };

    //鉴定放大动画
    playItemUp(callback) {
        global.Instance.Log.debug('鉴定放大动画', "playItemUp");
        let helpNode1 = this.node.getChildByName('help1');
        let helpNode2 = this.node.getChildByName('help2')
        helpNode1.opacity = 0;
        helpNode2.opacity = 0;
        this.ndItemNode.active = false;
        if (callback)
            callback();

    };

    runTimeAction() {   //数字变化动画
        let lblTime = this.node.getChildByName('lblFlyTime');
        let scale    = lblTime.scale;
        let oldColor = lblTime.color;

        // let targetScale = scale+0.3;
        // lblTime.color  = cc.color(255, 0, 0, 255);

        let scaleOut = cc.moveTo(0, 0, 290);

        let scaleIn = cc.moveBy(2, 0, 50)
        let callBack = function () {
            lblTime.color = oldColor;
            lblTime.active = false;
        };
        let endFunction = cc.callFunc(callBack);

        let seq1 = cc.sequence(scaleOut,scaleIn, endFunction);
        lblTime.runAction(seq1);
    };

    playChangeTime(time) {

        let lblFlyTime = this.node.getChildByName('lblFlyTime');
        lblFlyTime.active = true;
        // global.CommonClass.UITip.showTipTxt('帮助好友缩短鉴定时间'+time.toString()+'分钟', global.Enum.TipType.TIP_BAD);
        lblFlyTime.getComponent(cc.Label).string = "鉴定时间"+time.toString()+'分钟';
        this.runTimeAction();
    };
    //加速
    btnRecallNode() {
        if(this.data.ID>=0) {
            let evt = new cc.Event.EventCustom('onItemQuick', true);
            evt.setUserData(this.node);
            this.node.dispatchEvent(evt); 
        }
    };
   
    //添加
    btnAdd() {
        //state == 0 时，上面还没有鉴定物品，可以添加鉴定
        if(this.data.state != 0 || this.isFriend)
            return;
        //鉴定任务安全保护
        if(global.Module.TaskData.taskguard(10001))
            return;
        if(this.data.ID >= 0) {
            let evt = new cc.Event.EventCustom('onAddItemClick', true);
            evt.setUserData(this.node);
            this.node.dispatchEvent(evt);
        }
    };
    //鉴定
    btnIndentify() {
        //state == 1 时，未鉴定
        if(this.data.state!=1)
            return;
        // //好友鉴定安全保护
        if(global.Module.TaskData.taskguard(10009))
            return;
        if(this.data.ID>=0) {
          
            this.hidebootindex();
            let evt = new cc.Event.EventCustom('onIndentifyItemClick', true);
            evt.setUserData(this.node);
            this.node.dispatchEvent(evt); 
        }
    };
    //可取
    btnGet() {
        //state == 2 时，已鉴定
        if(this.data.state != 2)
            return;
        if(this.data.ID >= 0) {
            let helpNode1 = this.node.getChildByName('help1');
            let helpNode2 = this.node.getChildByName('help2');
            helpNode1.active = false;
            helpNode2.active = false;
            let evt = new cc.Event.EventCustom('onGetItemClick', true);
            evt.setUserData(this.node);
            this.node.dispatchEvent(evt);
        }
    };

}
