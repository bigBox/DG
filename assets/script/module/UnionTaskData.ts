
let Common =window["Common"];
let Man =window["Man"];
//工会任务数据类
const {ccclass, property} = cc._decorator;

@ccclass
export default class UnionTaskData {
    data: any[];
    handdata: any;

    constructor() {
        this.data = [];
        this.handdata = null;
    };

    getQuest(idx: string | number){
        return this.data[idx];
    };

    getQuestLst() {
        return this.data;
    };
    gethandLst() {
        return this.handdata;
    };

    getQuestCount() {   //获取队列里的任务数量
        if (this.data != null)
            return this.data.length;

        return 0;
    };

    getCanComit(idx: any) {
        let task = this.getQuest(idx);
        if (task!=null)
        {
            let data = global.Manager.DBManager.findData('Tasks', 'ID', task.taskId);
            if (data == null)
                return false;
    
            return task.actionTime >= data.actionTime;
            
        }
        return false;
    };
    getCurUnionTask (params: any) {
        for (let i = 0; i < this.data.length; i++) {
           if (this.data[i].state!=0)
               return this.data[i];
        }
        return null;
    };
    onGuildTaskListRsp (msg: { errorID: any; tasks: { [x: string]: any; }; }) {
        if (!msg.errorID) {
            this.handdata = null;
            this.data = [];
            global.Instance.Log.debug('',msg)
            for (let key in msg.tasks) {
                let task = msg.tasks[key];
                this.data.push(task);
                if (task.state != 0){
                    this.handdata = task;
                }  
            }
        }
        cc.systemEvent.emit('Union');
    };

    onGuildTaskAcceptRsp(msg: { errorID: number; req: { index: string | number; }; task: any; })
    {
        if(msg.errorID==0)
        {
            this.data[msg.req.index] = msg.task;
        }
    };

    onGuildTaskUpdateNtf(msg: { task: { index: any; }; }) {
        let uiUnionTask = global.Manager.UIManager.get('UIUnionTask');
        if (uiUnionTask)
        {
            uiUnionTask.reflashTaskByIdx(msg.task.index, msg.task);
            uiUnionTask.playRelashAction(msg.task.index);
        }
        global.Instance.MsgPools.send('guildTaskList', {},null); //请求工会列表
    };

    onGuildTaskRemoveRsp(msg: any) {

    };

    onGuildTaskSpeedUpRsp(msg: any) {

    }
}
