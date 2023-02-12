
const {ccclass, property} = cc._decorator;
@ccclass
export default class PreciousRankItem extends cc.Component {
    titleDec: { 1: string; 2: string; 3: string; 4: string; };
    data: any;

    constructor() {
        super();
        this.titleDec = {1:'新手', 2:'收藏达人', 3:'收藏专家', 4:'收藏大师'};
    };

    static create(randkData, parent, position)
        {
            let filePath =  "prefab/component/PreciousRankItem";
            cc.loader.loadRes(filePath, function (err, prefab) 
            {
                if (err==null)
                {
                    let newNode = cc.instantiate(prefab);
                    parent.addChild(newNode, cc.macro.MAX_ZINDEX);
                    newNode.setPosition(position);
                    newNode.tagEx =randkData.roleInfo.roleId;
                  
                    let itemClass = newNode.getComponent(PreciousRankItem);
                    itemClass.setData(randkData);
                }
            });
        };

    // use this for initialization
    onLoad () {
        

    };

    setData(rankData) {
       //findItem = {index:i,  fortune:1000+i*2, name:"F"+item.ID.toString()+'-'+i.toString(), head:i%4, findnum:i+i%5,  perfectNum:i, ownerNum:i*2+5};
       // perfectItem = {index:i, fortune:1000+i, name:"P"+item.ID.toString()+'-'+i.toString(), head:i%4, findnum:20+i,perfectNum:i,  ownerNum:i*2};
        //ownerRankItem = {index:i, fortune:1000+i*3, name:"O"+item.ID.toString()+'-'+i.toString(), head:i%4, findnum:i*2,perfectNum:i,  ownerNum:10+i};
       // let rankItem = {ID:item.ID, findRank:findRankArray, perfectRank:perfectRankArray, ownerRank:ownerRankArray};

       this.data  = rankData;

       let lblIndex        = this.node.getChildByName('lblIndex');
       let lblName         = this.node.getChildByName('lblName');
       let lblLevel        = this.node.getChildByName('lblLevel');
     //  let spHead          = this.node.getChildByName('spHead');
       let lblNumber       = this.node.getChildByName('lblNumber');
       let lblTitle        = this.node.getChildByName('lblTitle');
       let lblDec          = this.node.getChildByName('lblDec');

       lblIndex.getComponent(cc.Label).string      = (rankData.order+1).toString();
       lblName.getComponent(cc.Label).string       = rankData.roleInfo.roleName;
       lblLevel.getComponent(cc.Label).string      = rankData.roleInfo.level.toString()+'级';
       lblNumber.getComponent(cc.Label).string     = rankData.score.toString();
       lblTitle.getComponent(cc.Label).string      = this.titleDec[2];
       lblDec.getComponent(cc.Label).string        = rankData.roleInfo.roleName;//rankData.roleInfo.Signature;
       
       this.node.tagEx = rankData.roleInfo.roleId;
    };

    getData() {
        return this.data;
    };

    btnRankItemClick(event, arg) {
        let evt = new cc.Event.EventCustom('onPreciousRankClick', true);

        let type = parseInt(arg);
        let itemID = event.target.tagEx;

        let data = {itemID:itemID, rankType:type};
        evt.setUserData(data);
        this.node.dispatchEvent(evt); 
    };

}
