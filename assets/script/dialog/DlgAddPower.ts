import UIBase from "../common/UIBase";


const {ccclass, property} = cc._decorator;

@ccclass
export default class DlgAddPower extends UIBase {
    itemID: number;
    callback: any;

    constructor()
    {
        super();
        this.itemID = 609990003;
        this.callback = null;
    }

    // use this for initialization
    onLoad () {

    }

    onEnable()
    {
      
      
    }

    onDisable()
    {
       
    }

    show(callback)
    {
        this.callback = callback;

        let itemID  = this.itemID;
        let itemCount = global.Module.PackageData.getItemCount(itemID);

        let itemNeed:any = this.node.getChildByName('itemNeed');
        let itemNeedclass = itemNeed.getComponent(global.CommonClass.ItemIcon);
        itemNeedclass.setItem(itemID, itemCount);

        let numChange:any = this.node.getChildByName('numChange');
        let numChangeclass = numChange.getComponent(global.CommonClass.UICountChange);
        numChangeclass.setNumber(1);
        numChangeclass.setMax(itemCount);
        numChangeclass.setMin(1);
    }

    btnYes()
    {
        let numChange:any = this.node.getChildByName('numChange')
        let numChangeclass =numChange.getComponent(global.CommonClass.UICountChange);
        let curNum = numChangeclass.getCurNumber();

        global.Instance.MsgPools.send('UsePowerBarAddStamina', {count:curNum}, function(msg)
        {
            if (msg.errorID == 0)
            {
                global.CommonClass.UITip.showTipTxt('兑换成功', global.Enum.TipType.TIP_GOOD);
            }
            else
            {
                global.CommonClass.UITip.showTipTxt('兑换失败', global.Enum.TipType.TIP_BAD);
            }
        })

        if (this.callback)
            this.callback(true);

            global.Manager.UIManager.close('DlgAddPower');
    }

    btnNo()
    {
        if (this.callback)
            this.callback(false);

        global.Manager.UIManager.close('DlgAddPower');
    }

    touchEvent(event)
    {

    }

    // update (dt) {}
}
