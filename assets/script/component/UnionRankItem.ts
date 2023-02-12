
const {ccclass, property} = cc._decorator;
@ccclass
export default class UnionRankItem extends cc.Component {
    data: any;
    constructor() {
        super();
    };
    static create(randkData, parent, position, callback) {
            let filePath =  "prefab/component/UnionRankItem";
            cc.loader.loadRes(filePath, function (err, prefab) 
            {
                if (err==null)
                {
                    let newNode = cc.instantiate(prefab);
                    parent.addChild(newNode, cc.macro.MAX_ZINDEX);
                    newNode.setPosition(position);
                    newNode.tagEx = randkData.ID;
                  
                    let itemClass = newNode.getComponent(UnionRankItem);
                    itemClass.setData(randkData);

                    if (callback)
                        callback(itemClass);
                }
            });
        };

    // use this for initialization
    onLoad() {
        

    };

    onEnable()
    {
        this.setMode(1);
        this.showLook(false);
    };

    setData(rankData) {
        //{ID, name, level, memberNum, onlineAll, sorce, sorceAll, needLevel, activeLevel, title, note}
        this.data  = rankData;

        let lblIndex        = this.node.getChildByName('lblIndex');
        let lblName         = this.node.getChildByName('lblName');
        let lblLevel        = this.node.getChildByName('spStar').getChildByName('lblLevel');
        let lblMemberNum    = this.node.getChildByName('lblMemberNum');
        let lblSorce        = this.node.getChildByName('lblSorce');
       // let lblNeedLevel    = this.node.getChildByName('lblNeedLevel');
        let lblActiveLevel  = this.node.getChildByName('lblActiveLevel');
        let lblNote         = this.node.getChildByName('lblNote');
        let btnAdd          = this.node.getChildByName('btnAdd');
        let btnLeave        = this.node.getChildByName('btnLeave');     

        let index = (rankData.index+1);
        lblIndex.getComponent(cc.Label).string      = index.toString();


        lblName.getComponent(cc.Label).string       = rankData.name;
        lblLevel.getComponent(cc.Label).string      = rankData.level.toString();
        lblMemberNum.getComponent(cc.Label).string  = rankData.curMemberNums.toString()+'/'+rankData.level.toString();

        let socreDec = rankData.sorce.toString()+'/'+ global.Module.UnionData.getUnionActiveDec(rankData.activeLevel);
        lblSorce.getComponent(cc.Label).string      = socreDec;
        lblActiveLevel.getComponent(cc.Label).string = global.Module.UnionData.getUnionActiveDec(rankData.activeLevel);

        lblNote.getComponent(cc.Label).string       = rankData.summary;
      
        let selfUnion = global.Module.UnionData.getSelfUnion();
        let selfID = selfUnion==null?0:selfUnion.id;
        
        btnAdd.active = (selfID!=rankData.id);
        btnLeave.active = (selfID==rankData.id);
        let rankId = rankData.id;
        this.node.tagEx = rankId;
    };

    getData() {
        return this.data;
    };

    showLook(isShow) {
        let btnLook = this.node.getChildByName('btnLook');

        if (btnLook != null)
            btnLook.active = isShow;
    };

    setMode(mode) {  //1.等级模式 2.积分模式
    
        let spStar          = this.node.getChildByName('spStar');
        let lblActiveLevel  = this.node.getChildByName('lblActiveLevel');

        let lblMemberNum    = this.node.getChildByName('lblMemberNum');
        let lblSorce        = this.node.getChildByName('lblSorce');

        spStar.active         = (mode==1);
        lblActiveLevel.active = (mode==2);

        lblMemberNum.active = (mode==1);
        lblSorce.active     = (mode==2);
    };

    btnAddCampClick(event, arg) {
       // this.layoutTitle.active = true;
       let evt = new cc.Event.EventCustom('onAddCamp', true);
       evt.setUserData(this.node);
       this.node.dispatchEvent(evt); 
    };

    btnQuitCampClick(event, arg) {
        let evt = new cc.Event.EventCustom('onQuitCamp', true);
        evt.setUserData(this.node);
        this.node.dispatchEvent(evt); 
    };

    btnRankItemClick(event, arg) {
        let evt = new cc.Event.EventCustom('onItemClick', true);
        evt.setUserData(this.node);
        this.node.dispatchEvent(evt); 
    };

    btnLookClick(event, arg) {
        let evt = new cc.Event.EventCustom('onLookCamp', true);
        evt.setUserData(this.node);
        this.node.dispatchEvent(evt); 
    };

    // update (dt) {}
}
