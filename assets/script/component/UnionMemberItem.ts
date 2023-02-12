
const {ccclass, property} = cc._decorator;
@ccclass
export default class UnionMemberItem extends cc.Component {
    data: any;

    constructor() {
        super();
        this.data = null;
    };

    static create(memberData, parent, position) {
            let filePath =  "prefab/component/UnionMemberItem";
            cc.loader.loadRes(filePath, function (err, prefab) 
            {
                if (err==null)
                {
                    let newNode = cc.instantiate(prefab);
                    parent.addChild(newNode, 999999);
                    newNode.setPosition(position);
                    newNode.tagEx = memberData.id;
                    let itemClass = newNode.getComponent(UnionMemberItem);
                    itemClass.setData(memberData);
                }
            });
        };

    // use this for initialization
    onLoad() {

    };

    setData(data) {
        this.data = data;

        let lblName = this.node.getChildByName('lblName');
        let lblWeekPay = this.node.getChildByName('lblWeekPay');
        let lblTitle = this.node.getChildByName('lblTitle');


        lblName.getComponent(cc.Label).string = data.baseInfo.roleName;
        lblWeekPay.getComponent(cc.Label).string = data.weekPay.toString()+'/'+data.allPay.toString();

        let titleDec = global.Module.UnionData.getTitleDec(data.guildPost);
        lblTitle.getComponent(cc.Label).string = titleDec;

        let roleId = data.baseInfo.roleId;
        this.node.tagEx = roleId;
    };


    setMode(mode: number) { //1.显示删除按钮 2.显示调整按钮
        let selfData = global.Module.UnionData.getMySelf();
        let guildID = global.Module.MainPlayerData.getguildID()
        if(guildID == this.data.baseInfo.guildId){
            if(selfData&&selfData)
            this.node.getChildByName('btnTick').active          = (mode==1 &&selfData&& selfData.guildPost<this.data.guildPost);
            this.node.getChildByName('btnChangeTilte').active   = (mode==2 &&selfData&& selfData.guildPost<this.data.guildPost);
        }else{
            this.node.getChildByName('btnTick').active = false;
            this.node.getChildByName('btnChangeTilte').active = false;
        }
       
    };

    btnTilteClick(event, arg) {
       let evt = new cc.Event.EventCustom('onTilteClick', true);
       evt.setUserData(this.node);
       this.node.dispatchEvent(evt); 
    };

    btnTick(event, arg) {
        let evt = new cc.Event.EventCustom('onTickClick', true);
        evt.setUserData(this.node);
        this.node.dispatchEvent(evt); 
    };

    btnClick(event, arg) {
        let evt = new cc.Event.EventCustom('onItemClick', true);
        evt.setUserData(this.node);
        this.node.dispatchEvent(evt); 
    };;
}
