import UIBase from "../common/UIBase";

//商会成员列表
const {ccclass, property} = cc._decorator;

@ccclass
export default class UIUnionMember extends UIBase {
    selPage: number;
    constructor(){
        super();
        this.selPage = 3;
    };

    onLoad () {};

    start () {

    };
    onEnable() {
        let layoutTitle = this.node.getChildByName('layoutTitle');
        layoutTitle.active = false;

        let self = this;
        this.node.on('onTilteClick', function (event) {
            self.onTilteClick(event);
        });

        this.node.on('onTickClick', function (event) {
            self.onTickClick(event);
        });

        this.node.on('onItemClick', function (event) {
            self.onItemClick(event);
        });

        this.node.on('onClickAgree', function (event) {
            self.onClickAgree(event);
        });

        this.node.on('onClickRefuse', function (event) {
            self.onClickRefuse(event);
        });


        global.Module.GameData.setMaskSound(true,null);
    };

    onDisable() {
        this.node.off('onTilteClick');
        this.node.off('onTickClick');
        this.node.off('onItemClick');
        this.node.off('onClickAgree');
        this.node.off('onClickRefuse');

        global.Module.GameData.setMaskSound(false,null);
    };

    show(members) {
        this.ndBtnsActive(true);
        this.reflashSelPage(this.selPage);
        this.reflashMembers(members);
        let lblOnlineNum = this.node.getChildByName('lblOnlineNum');
        let onlineNum = global.Module.UnionData.getOnlineNum();
        lblOnlineNum.getComponent(cc.Label).string = "人数："+onlineNum.toString() + '/' + members.length.toString();
        
        
    };
    ndBtnsActive(isShow){
        this.node.getChildByName('ndBtns').active = isShow;
    };

    reflashSelPage(page) {
        let ndBtns = this.node.getChildByName('ndBtns').children;
        for (let key in ndBtns) {
            let btn = ndBtns[key].getComponent(cc.Button);
            let tagEx = parseInt(btn.clickEvents[0].customEventData);
            btn.node.getChildByName('spSelPage').active = (tagEx == page);
        }
    };

    reflashMembers(members) {
        let ndMembers = this.node.getChildByName('spBack1').getChildByName('members');
        let ndView = this.node.getChildByName('spBack1').getChildByName('members').getChildByName('view');
        let ndItems = ndView.getChildByName('content');
        let ndTempMemberItem = this.node.getChildByName('ndTempMemberItem');
        ndItems.removeAllChildren();

        ndMembers.active = true;
        for (let key in members) {
            
            let item = members[key];
            let memberValue = global.Module.UnionData.memberValue(item, key);

            let newNode:any = cc.instantiate(ndTempMemberItem);
            newNode.active = true;

            ndItems.addChild(newNode, cc.macro.MAX_ZINDEX);
            newNode.setPosition(cc.v2(0, 0));

            let itemClass = newNode.getComponent(global.CommonClass.UnionMemberItem);
            itemClass.setData(memberValue);

            let mode = 1;
            if (this.selPage == 5)
                mode = 2;
            itemClass.setMode(mode);
        }
    };

    reflashApplys(applys) {
        let ndView = this.node.getChildByName('spBack1').getChildByName('applyers').getChildByName('view');
        let ndItems = ndView.getChildByName('content');
        let ndTempApplyItem = this.node.getChildByName('ndTempApplyItem');
        ndItems.removeAllChildren();


        for (let key in applys) {
            let item = applys[key];

            let newNode:any = cc.instantiate(ndTempApplyItem);
            newNode.active = true;

            ndItems.addChild(newNode, cc.macro.MAX_ZINDEX);

            let itemClass = newNode.getComponent(global.CommonClass.UnionApplyItem);
            itemClass.setData(item);
        }
    };

    reflashMember(member) {
        let ndView = this.node.getChildByName('spBack1').getChildByName('members').getChildByName('view');
        let ndItems:any = ndView.getChildByName('content');
        let ndItem = global.CommonClass.Functions.getChildTagEx(ndItems,member.baseInfo.roleId);
        if (ndItem != null) {
            let itemClass = ndItem.getComponent(global.CommonClass.UnionMemberItem);
            itemClass.setData(member);
        }
    };

    onTilteClick(event) {
        let ndItem = event.getUserData();

        let layoutTitle = this.node.getChildByName('layoutTitle');
        layoutTitle.active = true;

        // let ndBack = layoutTitle.getChildByName('ndBack');
        // let curPosition = ndItem.getChildByName('btnChangeTilte').getPosition();

        // let point = ndItem.convertToWorldSpaceAR(curPosition);
        // let position = layoutTitle.convertToNodeSpaceAR(point);
        // ndBack.setPosition(position);

        layoutTitle.tagEx = ndItem.tagEx;
    };

    onTickClick(event) {
        var self = this;
        let roleID = event.getUserData().tagEx;

        let member = global.Module.UnionData.getMemberByID(roleID);
        let dec = "是否将成员 " + member.baseInfo.roleName + " 剔除";
        global.CommonClass.UIDialog.create("剔除成员", dec, function (isYes) {
            if (isYes) {
                let data = { roleId: roleID };
                global.Instance.MsgPools.send('guildKick', data, function (msg) {
                    if (msg.errorID == 0) {
                        let members = global.Module.UnionData.getMembers();
                        self.reflashMembers(members);
                    }
                });
            }
        });

    };

    onItemClick(event) {
        let target = event.getUserData();

        let ndView = this.node.getChildByName('spBack1').getChildByName('members').getChildByName('view');
        let ndItems:any = ndView.getChildByName('content').children;
        for (let key in ndItems) {
            let item = ndItems[key].getComponent(global.CommonClass.UnionMemberItem);
        }
        let layoutTitle = this.node.getChildByName('layoutTitle');
        layoutTitle.active = false;
    };

    onClickAgree(event) {
        let self = this;

        let roleData = event.getUserData();
        let roleID = roleData.baseInfo.roleId;

        let data = { roleId: roleID, agree: true };
        global.Instance.MsgPools.send('guildApprove', data, function (msg) {
            if (msg.errorID == 0) {
                let applys = global.Module.UnionData.getApplys();
                self.reflashApplys(applys);
            }
        });
    };

    onClickRefuse(event) {
        let self = this;

        let roleData = event.getUserData();
        let roleID = roleData.baseInfo.roleId;
        let data = { roleId: roleID, agree: false };
        global.Instance.MsgPools.send('guildApprove', data, function (msg) {
            if (msg.errorID == 0) {
                let applys = global.Module.UnionData.getApplys();
                self.reflashApplys(applys);
            }
        });
    };

    btnChangeTitle(event, arg) {
        let layoutTitle = this.node.getChildByName('layoutTitle');
        layoutTitle.active = false;

        let roleID = layoutTitle.tagEx;

        let member = global.Module.UnionData.getMemberByID(roleID);
        let newPost = parseInt(arg);

        if (newPost == member.guildPost) {
            global.CommonClass.UITip.showTipTxt('当前职位一样', global.Enum.TipType.TIP_BAD);
            return;
        }

        let upDown = "提升";
        if (newPost > member.guildPost)
            upDown = "降职";
        let titleDec = global.Module.UnionData.getTitleDec(newPost);
        let dec = "是否将成员 " + member.baseInfo.roleName + " 职位" + upDown + "为: " + titleDec;

        var self = this;
        global.CommonClass.UIDialog.create("改变职务", dec, function (isYes) {
            if (isYes) {
                let data = { roleId: roleID, post: newPost }
                global.Instance.MsgPools.send('guildAdjustPost', data, function (msg) {
                    if (msg.errorID == 0) {
                        self.reflashMember(member);
                    }
                })
            }
        });
    };
    /**
     * 商会成员
     * @param {*} event 
     * @param {3贡献*5职务} arg 
     */
    btnSortMember(event, arg) {
        let layoutTitle = this.node.getChildByName('layoutTitle');
        layoutTitle.active = false;
        let sortType = parseInt(arg);
        this.selPage = sortType;

        let members = global.Module.UnionData.sortMembers(sortType);
        this.reflashMembers(members);
        this.reflashSelPage(this.selPage);

        this.node.getChildByName('spBack1').getChildByName('members').active = true;
        this.node.getChildByName('spBack1').getChildByName('applyers').active = false;
    };
    /**
     * 商会成员申请
     * @param {*} event 
     * @param {*7申请} arg 
     */
    btnApply(event, arg) {
        let layoutTitle = this.node.getChildByName('layoutTitle');
        layoutTitle.active = false;
        let sortType = parseInt(arg);
        this.selPage = sortType;
        this.reflashSelPage(this.selPage);

        let self = this;

        global.Instance.MsgPools.send('guildApplyList', {}, function (msg) {
            let applys = global.Module.UnionData.getApplys();
            self.reflashApplys(applys);

            self.node.getChildByName('spBack1').getChildByName('members').active = false;
            self.node.getChildByName('spBack1').getChildByName('applyers').active = true;
        });
    };

    btnClose(evnet, arg) {
        let panel = global.Manager.UIManager.get('UIUnion');
        if (panel != null)
            panel.SwithMain(true);
        let UIUnionOther = global.Manager.UIManager.get('UIUnionOther');
        if (UIUnionOther != null)
            UIUnionOther.SwithMain(true);
        global.Manager.UIManager.close('UIUnionMember');
    };

    // update (dt) {}
}
