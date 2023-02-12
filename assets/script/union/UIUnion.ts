import UIBase from "../common/UIBase";


const { ccclass, property } = cc._decorator;

@ccclass
export default class UIUnion extends UIBase {
    @property({ type: cc.Label, displayName: "lblName", tooltip: "标题" })
    lblName: cc.Label = null;
    @property({ type: cc.Label, displayName: "lblInNote", tooltip: "对外商会公告" })
    lblInNote: cc.Label = null;
    @property({ type: cc.Label, displayName: "lblOutNote", tooltip: "对内商会公告" })
    lblOutNote: cc.Label = null;
    @property({ type: cc.Node, displayName: "ndMdifyNote", tooltip: "修改公告弹框" })
    ndMdifyNote: cc.Node = null;
    @property({ type: cc.Node, displayName: "MainNode", tooltip: "MainNode" })
    MainNode: cc.Node = null;
    curModify: number;

    constructor() {
        super();
        this.curModify = 0;/** 1 对外公告 2 对内公告*/
    };

    onLoad() { };

    start() {

    };
    onEnable() {
        this.show();
        global.Module.GameData.setMaskSound(true,null);
    };
    onDisable() {
        global.Module.GameData.setMaskSound(false,null);
    };
    show() {
        let data = global.Module.UnionData.getSelfUnion();
        if (data && data.id > 0) {
            this.lblName.string = data.name;
            this.lblInNote.string = data.innerSummary;
            this.lblOutNote.string = data.summary;
        }
    };
    /**
     * 打开关闭主页内容
     * @param {true*false} isShow
     */
    SwithMain(isShow) {
        this.MainNode.active = isShow;
    };
    /**
     * 打开商会信息与成员页面
     * @param {*} event 
     * @param {*} eventData 
     */
    unionclick(event, eventData) {
        let self = this;
        switch (eventData) {
            case "商会信息":
                global.Instance.MsgPools.send('guildList', {}, function (msg) {
                    if (msg.errorID == 0 && msg.guilBaseInfo != null) {
                        self.SwithMain(false);
                        global.Manager.UIManager.open('UIUnionNews', null, function (panel) { 
                            panel.show(msg.guilBaseInfo)
                        });
                    } else {
                        global.CommonClass.UIDialog.create("商会不存在", '请先加入商会', null);
                    }
                });
                break;
            case "商会成员":
                global.Instance.MsgPools.send('guildMemberList', {}, function (msg) {
                    if (msg.errorID == 0) {
                        global.Instance.Log.debug('商会成员',msg)
                        self.SwithMain(false);
                        global.Manager.UIManager.open('UIUnionMember', null, function (panel) {
                            panel.show(msg.members);
                         });
                    }
                });
                break;
            default:
                break;
        }
    };
    /**
     * 打开修改对外商会弹框
     */
    btnModifyOutNote() {
        let data = global.Module.UnionData.getSelfUnion();
        this.ndMdifyNote.getChildByName('edtNote').getComponent(cc.EditBox).string = '';
        this.ndMdifyNote.active = true;
        this.curModify = 1;
    };
    /**
    * 打开修改对内商会公告弹框
    */
    btnModifyInNote() {
        let data = global.Module.UnionData.getSelfUnion();
        this.ndMdifyNote.getChildByName('edtNote').getComponent(cc.EditBox).string = '';//data.innerSummary;
        this.ndMdifyNote.active = true;
        this.curModify = 2;
    };
    /**
    * 提交商会公告修改
    */
    btnModifyYes() {
        let self = this;
        let ndMdifyNote = this.ndMdifyNote;
        let str = this.ndMdifyNote.getChildByName('edtNote').getComponent(cc.EditBox).string;
        if (this.curModify == 1) {
            global.Instance.MsgPools.send('guildModifySummary', { summary: str, type: 1 }, function (msg) {
                if (msg.errorID == 0) {
                    self.lblOutNote.string = msg.summary;
                    ndMdifyNote.active = false;
                } else {
                    ndMdifyNote.getChildByName('edtNote').getComponent(cc.EditBox).string = '';
                }
            });
        } else if (this.curModify == 2) {
            global.Instance.MsgPools.send('guildModifySummary', { summary: str, type: 2 }, function (msg) {
                if (msg.errorID == 0) {
                    self.lblInNote.string = msg.summary;
                    ndMdifyNote.active = false;
                } else {
                    ndMdifyNote.getChildByName('edtNote').getComponent(cc.EditBox).string = '';
                }
            });
        }
    };
    //关闭修改公告弹框
    btnModifyNo() {
        this.ndMdifyNote.active = false;
    };
    //关闭商会
    btnClose() {
        global.Manager.UIManager.close('UIUnionNews');
        global.Manager.UIManager.close('UIUnionMember');
        global.Manager.UIManager.close('UIUnion');
    };
    // update (dt) {}
}
