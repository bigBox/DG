import TownMapBase from "./TownMapBase";


const {ccclass, property} = cc._decorator;

@ccclass
export default class TownMap1001 extends TownMapBase {
    constructor(){
        super();
    };
    onLoad () {
        
        this.reflashHelp();
    };
    reflashHelp() {
        //箭头 helpNode 华府
        var data = global.Module.TaskData.getHasAcceptTaskData();
        let helpNode = this.node.getChildByName('HelpNode');
        if (helpNode.getChildByName('helpNode'))
            helpNode.getChildByName('helpNode').active = false;
        if (!data || !helpNode)
            return;
        if (data.state == 1 && (data.taskId == 10023))
            if (helpNode.getChildByName('helpNode'))
                helpNode.getChildByName('helpNode').active = true;
    };

    start () {
    
    };
    dealFactoryEvent(factoryData, touchPoint) {
        global.Instance.Log.debug('dealFactoryEvent',factoryData)
        if (factoryData.key == 'task') {
        }
        else if (factoryData.key == 'huafu' || factoryData.key == 'zhuozhengyuan' || factoryData.key == 'hanshanshi') {
            this.visitNpc(factoryData, touchPoint);
        }
     };

    onClickFactory(factory,state, touchPoint) {
        let self = this;
        let ID = factory.getID();
        let factoryData = global.Manager.DBManager.findData('CityScene', 'ID', ID);
        let cellIndex = factoryData.cellIndex;
        this.gotoTarget(cellIndex,state, function () {
            self.dealFactoryEvent(factoryData, touchPoint);
        });
     };

    visitNpc(factoryData, touchPoint) {
        
        global.Instance.Log.debug('visitNpc',touchPoint);
        let AllEnd = function (params, isRight) {
            global.Module.TaskData.setIsAgree(true);//所有场景结束可以提示任务完成
        }.bind(this);
       
        let npcPoetryEnd = function (params, isRight) {
            params.stage = 3;
            global.Manager.UIManager.open('UITownNpcTalk', null, function (panel) {
                if (panel == null) {
                    return;
                }
                if (isRight == true) 
                    params.result = 1;
                 else
                    params.result = 0;
                panel.show(params,false, AllEnd);
                panel.setIsShow(true);
            });
        }.bind(this);

        let npcThingsEnd = function (params, isRight) {
            params.stage = 3;
            if (isRight == true){
                params.result = 1;
                global.Manager.UIManager.open('UITownNpcTalk', null, function (panel) {
                    if (panel == null) {
                        return;
                    }
                    panel.show(params,false,  AllEnd);
                    panel.setIsShow(true);
                });
            }else{
                params.result = 0;
                if(params.eventType == 103){
                    global.Manager.UIManager.open('UITownNpcLead', null, function (panel) {
                        if (panel == null) {
                            return;
                        }
                        panel.show(params, AllEnd);
                    }); 
                }else{
                    global.Manager.UIManager.open('UITownNpcTalk', null, function (panel) {
                        if (panel == null) {
                            return;
                        }
                        panel.show(params,false,  AllEnd);
                        panel.setIsShow(true);
                    });
                }
              
            }
        }.bind(this);

        let npcTalkEnd1 = function (params) {
             params.stage = 2;
            if (params.eventType == 101) {
                global.Manager.UIManager.open('UITownPoetry', null, function (panel) {
                    if (panel == null) {
                        return;
                    }
                    panel.show(params, npcPoetryEnd);
                });
            }else if (params.eventType == 102) {
                global.Manager.UIManager.open('UIRacing', null, function (panel) {
                    if (panel == null)
                        return;
                }.bind(this));
            } else if (params.eventType == 103||params.eventType == 104) {
                global.Manager.UIManager.open('UITownThings', null, function (panel) {
                    if (panel == null) {
                        return;
                    }
                    panel.show(params, npcThingsEnd);
                });
            }
        }.bind(this);

        global.Instance.Log.debug('visitNpc',factoryData)
        let helpNode = this.node.getChildByName('HelpNode');
        if (helpNode.getChildByName('helpNode'))
            helpNode.getChildByName('helpNode').active = false;
        global.Module.TaskData.setIsAgree(false);
        global.Instance.MsgPools.send('npcVisit', { sceneID: factoryData.ID }, function (msg) {
            global.Instance.Log.debug('npcVisit',msg)
            if (msg.errorID != 0) {
                return;
            }
            let params = {
                eventID: msg.eventID,//事件ID
                eventType: msg.eventType,//事件类型100没有人，101对诗，102赛马，103要金币，104要东西，105打劫，106赞美NPC
                talkContent: '',//对话内容
                sceneID: msg.req.sceneID,//建筑ID
                stage:1,//第几回合
                result:0,//成功失败
                eventContent:msg.eventContent,//题目
            }
                if (msg.eventType == 100) {
                   
                    global.Manager.UIManager.open('UITownNpcLead', null, function (panel) {
                        if (panel == null) {
                            return;
                        }
                        panel.show(params, AllEnd);
                    });
                }else{
                    global.Manager.UIManager.open('UITownNpcTalk', null, function (panel) {
                        if (panel == null)
                            return;
                        panel.show(params, false, npcTalkEnd1);
                    }.bind(this));
                }

           

        }.bind(this));
    }
    // update (dt) {}
}
