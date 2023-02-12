
const { ccclass, property } = cc._decorator;

@ccclass
export default class HandBookLookItem extends cc.Component {
    ID: number;
    data: any;

    constructor() {
        super();
        this.ID = 0;
        this.data = {};
    };
    onLoad() {
    };

    setData(data) {
        this.data = data;
        if (data != null) {
            let isLeftPage = data.pageIdx % 2 == 0;

            let spBack = this.node.getChildByName('spBack');
            let ndDec = this.node.getChildByName('ndDec');
            let ndItem = this.node.getChildByName('ndItem');

            ndDec.active = !isLeftPage;
            ndItem.active = isLeftPage;

            let activeNone = isLeftPage ? ndItem : ndDec;

            let itemId = data.itemId;
            if (itemId) {
                let spItem = ndItem.getChildByName('spItem');

                global.CommonClass.Functions.setItemTexture(spItem, itemId, null);

                let spSprite = spItem.getComponent(cc.Sprite)
                //  cc.CommonClass.Functions.grayTexture(spSprite, data.state==0);
                if (data.state == 0) {
                    global.CommonClass.MaterialUtils.useMaterial(spSprite, global.CommonClass.MaterialUtils.MAT.COLOR, null);
                } else {
                    global.CommonClass.MaterialUtils.useMaterial(spSprite, global.CommonClass.MaterialUtils.MAT.DEFAULT, null);
                }

                //let spLight = ndPage.getChildByName('spLight');
                //spLight.active = data.state==2;

                let lblName = activeNone.getChildByName('lblName').getComponent(cc.Label);
                let itemData = global.Manager.DBManager.getItemNew(itemId);
                lblName.string = itemData.name;
                lblName.node.active = false;
                if (isLeftPage) {
                    lblName.node.active = true;
                }

                let lblPageIdx = activeNone.getChildByName('lblPageIdx').getComponent(cc.Label);
                lblPageIdx.string = data.pageIdx.toString();
                if (isLeftPage == false) {
                    if (data.isEndPage == true) {
                        lblPageIdx.string = "END";
                    }
                }

                let rhxDec = ndDec.getChildByName('rhxDec');
                rhxDec.getComponent(cc.RichText).string = itemData.dec;
                rhxDec.active = data.state != 0;

                let lblUnknown = ndDec.getChildByName('lblUnknown');
                lblUnknown.active = data.state == 0;

                let lblMoney = ndItem.getChildByName('ndMoney').getChildByName('lblMoney');
                lblMoney.getComponent(cc.Label).string = itemData.recyclePrice.toString();

                if (data.state == 0) {
                    let spItemBack = ndItem.getChildByName('spBack');
                    let picPath = 'images/plist/handbook/bookGray';
                    global.CommonClass.Functions.setTexture(spItemBack, picPath, null);
                    lblName.string = '???';
                } else {
                    let spItemBack = ndItem.getChildByName('spBack');
                    let picPath = 'images/plist/handbook/bookColor';
                    global.CommonClass.Functions.setTexture(spItemBack, picPath, null);
                }
            }

            if (itemId == null) {
                ndDec.active = false;
                ndItem.active = false;
            }

            spBack.active = data.pageIdx != global.Enum.PageType.PageNone;

            if (spBack.active) {
                let picPath = 'images/plist/handbook/';

                if (isLeftPage)
                    picPath += 'pageFirst';
                else
                    picPath += 'pageLast';

                global.CommonClass.Functions.setTexture(spBack, picPath, null);
            }
        }
    };

    getData() {
        return this.data;
    };

    getItemID() {
        return this.data.itemId;
    };

    onChangeBook() {
        let evt = new cc.Event.EventCustom('onChangeBook', true);
        evt.setUserData(this);
        this.node.dispatchEvent(evt);
    };
}
