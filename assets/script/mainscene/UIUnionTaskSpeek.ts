import UIBase from "../common/UIBase";


const {ccclass, property} = cc._decorator;

@ccclass
export default class UIUnionTaskSpeek extends UIBase {
    callback: any;
    decs: any[];
    curIdx: number;
    isShowSpeek: boolean;
    UIUnionDele: boolean;

    constructor()
    {
        super();
        this.callback = null;

        this.decs = [];
        this.curIdx = 0;

        this.isShowSpeek = true;
        this.UIUnionDele = true;
    };

    // use this for initialization
    onLoad() {

    };

    onEnable()
    {
        let ndHelp = this.node.getChildByName('ndHelp');
        ndHelp.on(cc.Node.EventType.TOUCH_END,   this.touchEvent, this);	
        ndHelp.on(cc.Node.EventType.TOUCH_START, this.touchEvent, this);	
        ndHelp.on(cc.Node.EventType.TOUCH_MOVE,  this.touchEvent, this);
        ndHelp.on(cc.Node.EventType.TOUCH_CANCEL,this.touchEvent, this);
        ndHelp.on(cc.Node.EventType.MOUSE_WHEEL, this.touchEvent, this);

        //this.show('FirstTalk');

        this.node.getChildByName('flyItem').active = false;
    };

    onDisable()
    {
        let ndHelp = this.node.getChildByName('ndHelp');
        ndHelp.off(cc.Node.EventType.TOUCH_END,   this.touchEvent, this);	
        ndHelp.off(cc.Node.EventType.TOUCH_START, this.touchEvent, this);	
        ndHelp.off(cc.Node.EventType.TOUCH_MOVE,  this.touchEvent, this);
        ndHelp.off(cc.Node.EventType.TOUCH_CANCEL,this.touchEvent, this);
        ndHelp.off(cc.Node.EventType.MOUSE_WHEEL, this.touchEvent, this);
    };

    touchEvent(event) {
        global.Instance.Log.debug('touchEvent',this.UIUnionDele)
        if (event.type==cc.Node.EventType.TOUCH_END&&this.UIUnionDele) {
            this.btnClose();
        }
    };

    showPage(idx)
    {
        if (this.decs.length > 0)
        {
            let ndHelp      = this.node.getChildByName('ndHelp');

            let lblDec      = ndHelp.getChildByName('lblDec').getComponent(cc.RichText);
            lblDec.string   = this.decs[idx];
    
            let btnNext     = ndHelp.getChildByName('btnNext');
            btnNext.active  = this.curIdx<this.decs.length-1;
            let btnPre =ndHelp.getChildByName('btnPre');
            btnPre.active = (this.curIdx > 0);
        }
    };

    show(task)
    {

        let ndHelp   = this.node.getChildByName('ndHelp');
        let lblTitle = ndHelp.getChildByName('lblTitle').getComponent(cc.Label);
        let rhxDec   = ndHelp.getChildByName('rhxDec').getComponent(cc.RichText);
        global.Instance.Log.debug('show',task)
        if (task==null)
        {
            let dec = '去任商会接取任务';
            lblTitle.string = '接取任务';
            rhxDec.string = dec;
        }
        else
        {
            let taskData = global.Manager.DBManager.findData('Tasks', 'ID', task.taskId);
            if (taskData != null)
            {
                lblTitle.string = taskData.title1;
              
                let color = '#ff0000';
                if (task.actionTime >= taskData.actionTime)
                    color = '#00ff00';
    
                let dec  = '<color=#773900>'+taskData.title2+'('+'</color>';
                dec += '<color=' +color+'>'+ task.actionTime.toString()+'/'+taskData.actionTime.toString()+'</color>';
                dec += '<color=#773900>'+')'+'</color>';
                rhxDec.string = dec;

                let spBackground = this.node.getChildByName('btnGuideIcon').getChildByName('spBackGround');
                let iconFile = 'images/pictrue/items/'+taskData.taskIcon;
                global.CommonClass.Functions.setTextureNew(spBackground, iconFile,null);
            }
        }

        this.showSpeek(true);
    };

    showSpeek(isShow)
    {
        this.isShowSpeek = isShow;

        let btnGuideIcon = this.node.getChildByName('btnGuideIcon');
        btnGuideIcon.active = !isShow;

        let ndHelp = this.node.getChildByName('ndHelp');
        if (ndHelp != null)
            ndHelp.active = isShow;

        this.showPage(this.curIdx);
    };

    playFlyActionDelay(taskItem, callback)
    {
        
        this.scheduleOnce(function () {
            this.playFlyAction.bind(this, taskItem, callback)
        }, 0.02);
    };

    playFlyAction(taskItem, callback)
    {
        let taskData = taskItem.getData();
        this.UIUnionDele = false;
        let  flyItemNode:any = this.node.getChildByName('flyItem');
        let  flyItem = flyItemNode.getComponent(global.CommonClass.UnionTaskItem);
        flyItem.setData(taskData);

        global.CommonClass.Functions.setNodePosToTarget(flyItem.node, taskItem.node,null);

        let btnGuideIcon = this.node.getChildByName('btnGuideIcon');
        btnGuideIcon.active = false;

        let start = flyItem.node.getPosition();
        let end   = btnGuideIcon.getPosition();
        let mid   = cc.v2((end.x+start.x)/2, start.y+200);

        let scaleIn     = cc.scaleTo(0.2, 0.1);
        let scaleOut    = cc.scaleTo(1.4, 1.5);
        let scaleInBack = cc.scaleTo(0.4, 1.16);
        let seq1        = cc.sequence(scaleIn, scaleOut, scaleInBack);

        let bezier = [start, mid, end];
        let bezierTo = cc.bezierTo(2, bezier);
      
        let endFun = function() {
            global.Instance.Log.debug('ggggg','ggggggg')
            flyItem.node.active = false;
            btnGuideIcon.active = true;
            this.UIUnionDele = true;
            if (callback){
                callback();
            }
               
        };

        let endFunction = cc.callFunc(endFun,this);
        let seq2  = cc.sequence(bezierTo, endFunction);
        let spawn = cc.spawn(seq1, seq2);

        flyItem.node.active = true;
        flyItem.node.stopAllActions();
        flyItem.node.runAction(spawn);
    };

    btnPage(event, arg)
    {
        let flag = parseInt(arg);
        
        this.curIdx+=flag;
        if (this.curIdx >=this.decs.length)
        {
            this.curIdx = this.decs.length-1;
            this.showSpeek(false);
        }
        else if(this.curIdx<0)
            this.curIdx = 0;

        if(this.curIdx <this.decs.length)
            this.showPage(this.curIdx);
    };

    btnClose()
    {
        global.Manager.UIManager.close('UIUnionTaskSpeek');
    };

    btnClickGuideIcon(event)
    {
        global.Instance.Log.debug('btnClickGuideIcon',this.node)
        this.curIdx = 0
        this.showSpeek(true);
    };

    // update (dt) {}
}
