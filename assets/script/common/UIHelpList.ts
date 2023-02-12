

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIHelpList extends cc.Component {
    arg: number;
    helpKey: string;
    ndRoot: cc.Node;
    constructor(){
        super();
        this.arg = 0;
        this.helpKey = '';
    };
    onLoad () {};

    start () {

    };
    onEnable() {
        let self = this;
        this.node.on('onItemClick', function (event) {
            self.onItemClick(event);
        });

        this.ndRoot = this.node.getChildByName('ndScrollRoot');

        let itemScroll = this.ndRoot.getChildByName('spBack1').getChildByName('scroll');
        itemScroll.getComponent(cc.ScrollView).scrollToOffset(cc.v2(0, 0));
    };

    onDisable() {
        this.node.off('onItemClick');
    };
    show(helpKey) {
        this.helpKey = helpKey;
        global.Instance.Log.debug("helpKey",helpKey)
        let itemSpace = 18;
        let page = this.ndRoot.getChildByName('spBack1')

        let ndTemplateItem = this.node.getChildByName('ndTemplateItem');
        ndTemplateItem.active = false;

        let helps = global.Manager.DBManager.findDatas('illustrate', 'key', helpKey);

        let ndView = page.getChildByName('scroll').getChildByName('view');
        let ndItems = ndView.getChildByName('content');
        let itemSize = ndTemplateItem.getContentSize();
        let itemNum = helps.length+1;
        let sizeWidth = ndItems.getContentSize().width;
        ndItems.setContentSize(sizeWidth, (itemSize.height + itemSpace) * itemNum);
        ndItems.removeAllChildren();
          
        // let itemPosY = -itemSize.height / 2;
       if(helpKey == 'MainSceneHelp' ) {
            let newNode:any = cc.instantiate(ndTemplateItem);

            ndItems.addChild(newNode, cc.macro.MAX_ZINDEX);
            newNode.active = true;
            let itemClass = newNode.getComponent(global.CommonClass.HelpItem);
            itemClass.setData(-1, 0);
        }
        let index = 0;
        for (let key in helps) {
            let help = helps[key];
            let tasks= global.Module.TaskData.getTasksByType(global.Enum.ETaskType.eGrowUp);

            if(help.ID!=15||(help.ID == 15&&(!tasks||tasks.length==0))){
                let newNode:any = cc.instantiate(ndTemplateItem);

                ndItems.addChild(newNode, cc.macro.MAX_ZINDEX);
                // itemPosY -= (itemSize.height + itemSpace);
                // newNode.setPosition(cc.v2(0, itemPosY));
                newNode.active = true;
                let name = (index - 1).toString();
                newNode.setName(name)
    
                let itemClass = newNode.getComponent(global.CommonClass.HelpItem);
                itemClass.setData(index, help.ID);
                if (index != -1) {
                    var data = global.Module.TaskData.getHasAcceptTaskData();
                    if (data) {
                        let contentData = global.Proxys.ProxyGuJi.getContentData();
    
                        if (data.state == 1 && (data.taskId == 10003)&&contentData.ID == 2) {
                            let data = JSON.parse(cc.sys.localStorage.getItem('10003'));
                            if (data != null) {
                                if (data.indexOf(1) == -1 && help.ID == 3) {
                                    let help1 = this.node.getChildByName('help1');
                                    help1.active = true;
                                }
                                if (data.indexOf(2) == -1 && help.ID == 4) {
                                    let help2 = this.node.getChildByName('help2');
                                    help2.active = true;
                                }
                            }
                        }
                    }
                }
            }

           
            

            index++;
        }
        
    };
    onItemClick(event) {
        let itemClass = event.getUserData();
        let helpData = itemClass.getData();
        let help1 = this.node.getChildByName('help1');
        let help2 = this.node.getChildByName('help2');
        if(itemClass.data){
            if (itemClass.data.ID == 3||itemClass.data.ID == 4) {
                if(help1.active == true||help2.active == true){
                    let date = JSON.parse(cc.sys.localStorage.getItem('10003'));
               
                    if (itemClass.data.ID == 3 && date.indexOf(1) == -1) {
                        date.push(1);
                        help1.active = false;
                    }
                    if (itemClass.data.ID == 4 && date.indexOf(2) == -1) {
                        date.push(2);
                        help2.active = false;
                    }
                        
                    if (date.indexOf(1) != -1 && date.indexOf(2) != -1&& date.indexOf(4) == -1){
                        date.push(4)
                        if(date.indexOf(5) != -1){
                            global.Instance.MsgPools.send('robCompleteGuide', {}, null);
                        }
                    }
                        
                    
                    cc.sys.localStorage.setItem('10003', JSON.stringify(date));
                }
                
            }
           
            if (helpData.state == 1) {
                global.Manager.UIManager.close('UIHelpList');
                global.Manager.UIManager.open('UIHelpTip', null, function (panel) {
                    panel.show(helpData);
                    panel.setCloseCB(function () {
                        global.Manager.UIManager.open('UIHelpList', null, function (panel) {
                            panel.show(helpData.key);
                        });
                    })
                });
            } else {
                global.Manager.UIManager.open('UIHelpSpeek', null, function (panel) {
                    panel.show(helpData);
                });
            }


        }else{
            global.Instance.Log.debug('helpData', helpData)
            global.Manager.UIManager.open('UIAbout', null, null);
        }
       
    };

    btnClose() {
        let uiGuJi = global.Manager.UIManager.get('UIGuJi');
        if (uiGuJi)
            uiGuJi.getndHelp();
        global.Manager.UIManager.close('UIHelpList');
    };

    // update (dt) {}
}
