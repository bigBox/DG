import UIBase from "../common/UIBase";


const {ccclass, property} = cc._decorator;

@ccclass
export default class UIGuJiGetShow extends UIBase {
    callback: any;

    onLoad () {}

    start () {

    }
    constructor()
    {
        super();
        this.callback = null;
    };

    onEnable()
    {
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);	
        this.node.on(cc.Node.EventType.TOUCH_END,  this.touchEvent, this);	
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);	
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchEvent, this);	
    };

    onDisable()
    {
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.touchEvent, this);	
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);	
        this.node.off(cc.Node.EventType.TOUCH_START, this.touchEvent, this);	
    };

    btnClose()
    {
        if (this.callback)
            this.callback();

        global.Manager.UIManager.close('UIGuJiGetShow');
    };

    show(type, getItem, callback)
    {
        this.callback = callback;

        let robData = global.Manager.DBManager.findData('RobFunc', 'ID', type);
        let getShow = robData.getShow;
        if (getShow.length>0)
        {
            var needs = getShow.split(';');
            let length = needs.length;
            let idx = Math.floor(Math.random() * length);
            let showPic = needs[idx];
            let path = 'images/pictrue/items/'+showPic;

            let spGet = this.node.getChildByName('spGet');
            global.CommonClass.Functions.setTexture(spGet, path,null);
        }

        let mainPlayer:any = this.node.getChildByName('mainPlayer');
        let playClass = mainPlayer.getComponent(global.CommonClass.MoveObject);
        if (type==7||type==8)
        {
            playClass.play('sawang', true); //池塘
        }
        else
        {
            let itemData = global.Manager.DBManager.getItemNew(getItem);
            if (itemData != null)
            {
                if (itemData.subType==10 )   //金鱼
                {
                    playClass.play('sawang', true);
                }
                else if(itemData.subType==25 || itemData.subType==9) //标本或稀有动物
                {
                    playClass.play('taomasuo', true);
                }
                else                           //宝物
                {
                    playClass.play('shouge', true);
                }
            }
        }

    };

    touchEvent(event)
    {
        if (event.type==cc.Node.EventType.TOUCH_END)
        {
           // this.btnClose();
        }
    };

    // update (dt) {}
}
