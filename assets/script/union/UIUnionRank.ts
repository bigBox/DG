import UIBase from "../common/UIBase";


const { ccclass, property } = cc._decorator;

@ccclass
export default class UIUnionRank extends UIBase {
    @property({ type: cc.Node, displayName: "helpNode", tooltip: "引导" })
    helpNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "unionestaNode", tooltip: "unionestaNode" })
    unionestaNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "unionscreenNode", tooltip: "unionscreenNode" })
    unionscreenNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "spBack", tooltip: "spBack" })
    spBack: cc.Node = null;
    @property({ type: cc.EditBox, displayName: "edtName", tooltip: "edtName" })
    edtName: cc.EditBox = null;
    @property({ type: cc.EditBox, displayName: "edtNameLabel", tooltip: "edtNameLabel" })
    edtNameLabel: cc.EditBox = null;
    rankType: number;
    curData: any;
    isMove: boolean;
    curSelItem: any;
    ndRoot: any;
    constructor() {
        super();
        this.rankType = 0;
        this.curData = [];
        this.isMove = false;

        this.curSelItem = null;
    };
    onLoad() {
        this.rankType = 13;
        this.ndRoot = this.node.getChildByName('ndRootScroll');
    };

    start() {

    };
    onEnable() {
        let self = this;
        this.node.on('onAddCamp', function (event) {
            self.onAddCampClick(event);
        });

        this.node.on('onQuitCamp', function (event) {
            self.onQuitCampClick(event);
        });

        this.node.on('onLookCamp', function (event) {
            self.onLookClick(event);
        });

        this.node.on('onItemClick', function (event) {
            self.onItemClick(event);
        });

        

        global.Module.GameData.setMaskSound(true,null);
        this.helpNode.active = false;
        var data = global.Module.TaskData.getHasAcceptTaskData();
        if (!data)
            return;
        if (data.taskId == '10024' && data.state == 1){
            this.helpNode.active = true;
            // if(this.curData.length == 0 )
            this.helpNode.children[1].active = false;
        }
        this.show();    
    };
    onDisable() {
        this.node.off('onAddCamp');
        this.node.off('onQuitCamp');
        this.node.off('onLook');
        global.Module.GameData.setMaskSound(false,null);
    };

    getRankType() {
        return this.rankType;
    };

    show() {
        if (this.rankType == 0)
            this.curData = global.Module.UnionData.getShearch(null);
        else
            this.curData = global.Module.UnionData.getRankList();

        this.reflashUnions(this.curData);
    };

    reflashUnions(unions) {
        this.unionscreenNode.active = false;
        this.unionestaNode.active = false;
        this.spBack.active = true;
        let ndView = this.spBack.getChildByName('itemScorll').getChildByName('view');
        let ndItems = ndView.getChildByName('content');

        let ndTemplateItem = this.ndRoot.getChildByName('ndTemplateItem');
        ndTemplateItem.active = false;
        ndItems.removeAllChildren();

        let mode = 1;
        if (this.rankType != 13)
            mode = 2;

        for (let key in unions) {
            let randkData = unions[key];

            let newNode = cc.instantiate(ndTemplateItem);
            ndItems.addChild(newNode, cc.macro.MAX_ZINDEX);
            newNode.tagEx = randkData.ID;
            newNode.active = true;
            let itemClass = newNode.getComponent(global.CommonClass.UnionRankItem);
            itemClass.setData(randkData);
            itemClass.setMode(mode);
        }
    };

    sortUnions(sortType) {
        global.CommonClass.Functions.sort(this.curData, function (lhs, rhs) {
            if (sortType == 1)
                return lhs.ID > rhs.ID;
            else if (sortType == 2)
                return lhs.level > rhs.level;
            else if (sortType == 3)
                return lhs.curMemberNums > rhs.curMemberNums;
            else if (sortType == 4)
                return lhs.sorce > rhs.sorce;
            else if (sortType == 5)
                return lhs.sorceAll > rhs.sorceAll;
            else if (sortType == 6)
                return lhs.needLevel > rhs.needLevel;
            else if (sortType == 7)
                return lhs.activeLevel > rhs.activeLevel;
            return false;
        });
        for (let idx = 0; idx < this.curData.length; ++idx) {
            let item = this.curData[idx];
            item.index = idx;
        }
        return this.curData;
    };

    selectUnion(condition) {
        /* {index:j, ID:j+10000, name:"商会"+j.toString(), level:2+j, 
                                 memberNum:j*20%100+10, onlineAll:j*20%100,  headID:1,
                                 sorce:j*10, sorceAll:j*30, needLevel:20+j, activeLevel:j%3, title:j%3, 
                                 outNote:"这个是公告", inNote:"这里要填内部公告", activeDec:"2018.8.8(周六)18:30竞标赛",
                                 activeDiamond:100, activeTime:-1,
                                 exp:30,nextExp:130, weChat:13874111, QQ:94222043}*/

        let tempData = global.Module.UnionData.getAllUnion();
        this.curData = [];

        for (let i = 0; i < tempData.length; ++i) {
            let item = tempData[i];
            let isFit = true;

            for (let key in condition) {
                let conditionItem = condition[key];
                if (key == 'name') {
                    if (item.name != conditionItem) {
                        isFit = false;
                        break;
                    }
                }
                else {
                    if (item[key] < conditionItem.min || item[key] > conditionItem.max) {
                        isFit = false;
                        break;
                    }
                }
            }

            if (isFit)
                this.curData.push(item);
        }

        this.reflashUnions(this.curData);
    };

    reverseUnions() {
        this.curData.reverse();

        for (let idx = 0; idx < this.curData.length; ++idx) {
            let item = this.curData[idx];
            item.index = idx;
        }

        return this.curData;
    };

    scrolling() {
        global.Instance.Log.debug('','scroll...');
    };

    btnClose(evnet, arg) {
        global.Manager.UIManager.close('UIUnionRank');
    };
    /**
     * 俱乐部列表
     * @param {*} event 
     * @param {*} arg 13 人等级 5积分
     */
    btnRank(event, arg) {
        let rankType = parseInt(arg);
        this.rankType = rankType;
        this.spBack.active = true;
        this.unionestaNode.active = false;
        this.unionscreenNode.active = false;
        global.Proxys.ProxyUnion.reflashRank();
        this.helpNode.active = false;
        let ndBtns = this.ndRoot.getChildByName('ndBtns').getChildren();
        for (let key in ndBtns) {
            let btn = ndBtns[key];
            btn.getChildByName('spPageSel').active = (btn == event.target);
        }
    };
    /**
     * 筛选俱乐部页面
     * @param {*} event 
     * @param {*} arg 
     */
    btnSelect(event) {
        // global.Manager.UIManager.open('UIUnionSelect');
        this.curData = [];
        this.rankType = 0;
        this.edtNameLabel.string = '';
        this.unionscreenNode.active = true;
        this.unionestaNode.active = false;
        this.spBack.active = false;
        let ndBtns = this.ndRoot.getChildByName('ndBtns').getChildren();
        for (let key in ndBtns) {
            let btn = ndBtns[key];
            btn.getChildByName('spPageSel').active = (btn == event.target);
        }
    };
    /**
     * 创建俱乐部页面
     * 
     */
    btnCreate(event) {
        let selfUnion = global.Module.UnionData.getSelfUnion();
        this.helpNode.active = false;
        if (selfUnion == null || selfUnion.id <= 0) {
            this.unionestaNode.active = true;
            this.unionscreenNode.active = false;
            this.spBack.active = false;
            this.edtName.string = '';
            let ndBtns = this.ndRoot.getChildByName('ndBtns').getChildren();
            for (let key in ndBtns) {
                let btn = ndBtns[key];
                btn.getChildByName('spPageSel').active = (btn == event.target);
            }
        } else {
            global.CommonClass.UITip.showError('UNION_EXIST');
        }
    };
    btnYes() {
        let unionName = this.edtName.string;
        if (unionName.length < 2||unionName.length > 5) {
            // global.CommonClass.UITip.showError('NAME_EMPTY');
            global.CommonClass.UITip.showTipTxt('商会名称要在2-5之间', global.Enum.TipType.TIP_GOOD);
            return;
        }
        //创建商会任务安全保护
        if (global.Module.TaskData.taskguard(10024))
            return;
        let dec = "是否消耗100个令牌创建 " + unionName + " 商会";
        global.CommonClass.UIDialog.create("创建商会", dec, function (isYes) {
            if (isYes) {
                let data = { name: unionName, tokenID: 609990004, tokenCount: 100 }
                global.Instance.MsgPools.send('createGuild', data, function (msg) {
                    if (msg.errorID == 0) {
                        global.CommonClass.UITip.showTipTxt('创建商会成功', global.Enum.TipType.TIP_GOOD);
                        global.Manager.UIManager.close('UIUnionCreate');
                    }
                });
            }
        });
    };
    btnSeleYes(event) {
        let strName = this.edtNameLabel.string;
        if (strName.length < 2||strName.length > 5) {
            global.CommonClass.UITip.showTipTxt('商会名称要在2-5之间', global.Enum.TipType.TIP_GOOD);
            return;
        }
        //加入商会任务安全保护
        if (global.Module.TaskData.taskguard(10024))
            return;

        global.Instance.MsgPools.send('guildSearch', { type: 2, id: 0, name: strName }, function (msg) {
            if (msg.errorID == 0) {
                let panel = global.Manager.UIManager.get('UIUnionRank');
                if (panel != null)
                    panel.reflashUnions(msg.guilds);
            }
        });
    };

    onAddCampClick(event) {
        let selfUnion = global.Module.UnionData.getSelfUnion();
        this.helpNode.active = false;
        if (selfUnion == null || selfUnion.id == 0) {

            let unionID = event.getUserData().tagEx;
            let union = global.Module.UnionData.getUnion(unionID);

            this.helpNode.active = false;

            global.Manager.UIManager.open('UIUnionApply', null, function (panel) {
                if (panel)
                    panel.show(union);
            });
        }
        else {
            global.CommonClass.UITip.showError('UNION_EXIST');
        }
    };

    onQuitCampClick(event) {
        // var self = this;
        let tagEx = event.getUserData().tagEx;
        let union = global.Module.UnionData.getUnion(tagEx);

        let dec = "是否离开 " + union.name + " 商会";
        global.CommonClass.UIDialog.create("离开商会", dec, function (isYes) {
            if (isYes) {
                global.Proxys.ProxyUnion.leaveUnion(function (isSuccess) {
                    if (isSuccess) {
                        global.Proxys.ProxyUnion.reflashRank();
                    }
                });
            }
            else {
            }
        });
    };


    onLookClick(event) {
        let selfUnion = global.Module.UnionData.getSelfUnion();

        let item = event.getUserData();

        let itemClass = item.getComponent(global.CommonClass.UnionRankItem);
        let data = itemClass.getData();

        if (selfUnion != null && selfUnion.id == data.id) {
            global.Manager.UIManager.open('UIUnion', null, function (panel) {

            });
        }
        else {
            global.Instance.MsgPools.send('guildSearch', { type: 1, id: data.id, name: '' }, function (msg) {
                if (msg.errorID == 0) {
                    if (msg.guilds[0]) {
                        global.Manager.UIManager.open('UIUnionOther', null, function (panel) {
                            panel.show(msg.guilds[0]);
                        });  
                    }
                   
                }
            });

        }

    };

    onItemClick(event) {
        // let selfUnion = global.Module.UnionData.getSelfUnion();

        let item = event.getUserData();
        let itemClass = item.getComponent(global.CommonClass.UnionRankItem);
        //  let data = itemClass.getData();

        // if (selfUnion!=null && selfUnion.id==data.id)
        //{

        // }
        // else
        //  {
        if (this.curSelItem != null)
            this.curSelItem.showLook(false);

        itemClass.showLook(true);
        //}

        this.curSelItem = itemClass;
    };

    // update (dt) {}
}
