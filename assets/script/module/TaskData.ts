//任务数据类
const {ccclass, property} = cc._decorator;

@ccclass
export default class TaskData {
    data: {};
    addata: any[];
    taskNums: {};
    growUpTaskID: number;
    maxShow: number;
    hasOpenUI: boolean;
    isAcceptTaskData: any;
    isAcceptTask: boolean;
    uiFirstTalkShow: boolean;
    taskphase: any[];
    isTaskId: boolean;
    isTask: boolean;
    isAgree: boolean;

    constructor () {
        this.data = {};
        this.addata = [];
        this.taskNums = {};
        this.growUpTaskID = 0; //成长任务ID
        this.maxShow = 10;
        this.hasOpenUI = false;
        this.isAcceptTaskData = null;//领取成长任务内容
        this.isAcceptTask = false;//是否领取成长任务
        this.uiFirstTalkShow = false;//引导
        this.taskphase = [];//成长任务阶段
        this.isTaskId = false; 
        this.isTask = false;//是收到成长任务完成消息
        this.isAgree = true;//是否同意展示成长任务完成
      };
    setIsAgree(isAgree){
        this.isAgree = isAgree;
    }
    setIsTaskId(isTaskId) {
        this.isTaskId = isTaskId;
    }
    getIsTaskId() {
        return this.isTaskId;
    }
    getAllTasks () {
        return this.data;
    };
    taskFactoryTips(node){
        let touchPoint:any = node.parent.convertToWorldSpaceAR(node.position);
        let canvas =  cc.find('Canvas')
        let boundingBox = canvas.getBoundingBoxToWorld();
        let isPick = boundingBox.contains(touchPoint);
    };

    // 根据任务类型获取任务
    getTasksByType (type: string | number) {
        return this.data[type];
    };

    getQuest (page: any, idx: any) {
        let tmp = this.getQuestLst(page);
        for (let i = 0; i < tmp.length; i++) {
            let task = tmp[i];
            if (task.taskId == idx) {
                return task;
            }
        }
        return null; //this.data[page][idx];
    };

    getQuestByID (id: any) {
        for (let key in this.data) {
            let pageData = this.data[key];

            for (let idx in pageData) {
                let value = pageData[idx];
                if (value.id == id)
                    return value;
            }
        }

        return null;
    };

    getQuestLst (page: string | number) {
        return this.data[page];
    };

    getQuestCount (page: string | number)    //获取队列里的任务数量
    {
        if (this.data[page] != null)
            return this.data[page].length;

        return 0;
    };

    getQuestNum (page: string | number)      //获取服务器那里的任务总数
    {
        if (this.taskNums[page] != null) {
            return this.taskNums[page];
        }
        return 0;
    };

    getCanComit (page: any, idx: number) {
        let task = this.getQuest(page, idx);
        if (task != null) {
            let data = global.Manager.DBManager.findData('Tasks', 'ID', task.taskId);
            if (data == null)
                return false;

            if (data.actionType == 0) {
                return this.isItemEnough(page, idx);
            }
            else {
                return task.actionTime >= data.actionTime;
            }
        }
        return false;
    };

    getAcceptTask () {
        let tasks = this.data[1];   //成长任务
        for (let key in tasks) {
            let task = tasks[key];
            if (task.state == 1)
                return task;
        }

        return null;
    };

    getCurUnionTask () {
        global.Instance.Log.debug('商会任务',this.data)
        if (this.data[5] != null) {
            return this.data[5][0];  //商会任务
        }

        return null;
    };

    getMaxShow () {
        return this.maxShow;
    };

    getNeedRead (page: number, idx: any) {
        if (page != 1)
            return false;
        else {
            let task = this.getQuest(page, idx);
            return task && !task.first;
        }
    };

    getCanComitNum (page: string | number) {
        let num = 0;
        global.Instance.Log.debug("getCanComitNum",this.data)

        if (this.data[page] != null) {
            for (let i = 0; i < this.data[page].length; ++i) {
                if (this.data[page] == null)
                    return 0;

                if (this.getCanComit(page, i)) {
                    ++num;
                }
            }
        }

        return num;
    };

    cloneQuest (page: string | number, idx: string | number) {
        let data = this.data[page][idx];
        if (data != null) {
            let newData = {};
            for (let key in data) {
                newData[key] = data[key];
            }

            return newData;
        }

        return null;
    };

    setNewQuest (page: string | number, index: string | number, newValue: any) {
        this.data[page][index] = newValue;
    };
    isItemEnough2 (taskID: any) {
        let taskData = this.getQuestByID(taskID);
        if (taskData == null) {
            return true;
        }
        let taskId = taskData.taskId;
        let task = global.Manager.DBManager.findData('Tasks', 'ID', taskId);
        if (task.needItem2 == '0') {
            return true;
        } else {
            if (task.needItem2 != null) {
                let needs = task.needItem2.split(';');
                for (let key in needs) {
                    let value = needs[key];

                    let itemNeed = value.split('-');
                    let itemID = parseInt(itemNeed[0]);
                    let itemCount = parseInt(itemNeed[1]);

                    if (itemID > 0) {
                        let item = global.Module.PackageData.getItem(itemID);
                        let hasNum = item == null ? 0 : item.Count;

                        if (hasNum < itemCount)
                            return false;
                    }
                }
            }
        }
        return true;
    };

    isItemEnough (page: any, idx: any) {
        let data = this.getQuest(page, idx);
        if (data != null) {
            let taskId = data.taskId;
            let task = global.Manager.DBManager.findData('Tasks', 'ID', taskId);
            if (task.needItem2 == '0') {
                return true;
            }
            else {
                if (task.needItem2 != null) {
                    let needs = task.needItem2.split(';');
                    for (let key in needs) {
                        let value = needs[key];

                        let itemNeed = value.split('-');
                        let itemID = parseInt(itemNeed[0]);
                        let itemCount = parseInt(itemNeed[1]);

                        if (itemID > 0) {
                            let item = global.Module.PackageData.getItem(itemID);
                            let hasNum = item == null ? 0 : item.Count;

                            if (hasNum < itemCount)
                                return false;
                        }
                    }
                }
            }
        }
        return true;
    };
 
    deleteTask (type: string | number, id: any) {
        let taskLst = this.data[type];
        if (taskLst && taskLst.length > 0) {
            for (let idx = 0; idx < taskLst.length; ++idx) {
                let task = taskLst[idx];
                if (task.taskId == id) {
                    taskLst.splice(idx, 1);
                    return;
                }
            }
        }
    };

    hasGrowTask () {
        if (this.data != null && this.data[1] != null) {
            return this.data[1].length > 0;
        }

        return false;
    };

    isInBombTask () {
        let task = this.getAcceptTask();
        if (task && task.taskId == 10039) {
            return true;
        }

        let unionTask = this.getCurUnionTask();
        if (unionTask && unionTask.taskId == 50007) {
            return true;
        }

        return false;
    };

    dealBombTask () {
        if (this.isInBombTask()) {
            global.Instance.MsgPools.send('robBombMonster', {},null);
        }
    };

    getHasOpenUI () {
        return this.hasOpenUI;
    };

    setHasOpenUI () {
        this.hasOpenUI = true;
    };

    setHasAcceptTask (isAccept: boolean) {
        this.isAcceptTask = isAccept;
    };

    getHasAcceptTask ()     //是否借取过成长任务
    {
        return this.isAcceptTask;
    };
    setHasAcceptTaskData (data: number) {
        this.isAcceptTaskData = data;
    };

    getHasAcceptTaskData ()     //领取成长任务内容
    {
        return this.isAcceptTaskData;
    };
    /**
     * 任务列表
     * @param {接口返回值} msg 
     */
    onTaskLstRsp (msg: { errorID: any; tasks: { [x: string]: any; }; }) {
        global.Instance.Log.debug("------任务列表---------", msg)
        let isAcceptTask = false;
        if (!msg.errorID) {
            this.data = {};
            this.taskNums = {};
            for (let key in msg.tasks) {
                let task = msg.tasks[key];
                task.spineIdx = 0;

                let taskData = global.Manager.DBManager.findData('Tasks', 'ID', task.taskId);
                if (taskData != null) {
                    task.spineIdx = taskData.needer - 1;
                    if (taskData.taskType == 1 && task.state != 0) {
                        this.setHasAcceptTask(true);
                    }
                }
                if (task.type == global.Enum.ETaskType.eGrowUp && task.state != 0) {
                    isAcceptTask = true;
                    this.setHasAcceptTaskData(task);
                }
                let type = task.type;
                if (this.data[type] == null) {
                    this.data[type] = [];
                }
                this.data[type].push(task);
            }

            for (let key in this.data) {
                this.taskNums[key] = this.data[key].length;
            }
        }
      
        global.Instance.Log.debug("addata",this.addata)
        this.isAcceptTask = isAcceptTask;
    };
    /**
     * 新增成长任务
     */
    addeGrowUp(data: { tasks: string | any[]; }) {
        this.addata = [];
        for (let i = 0; i < data.tasks.length; i++)
            this.addata.push(data.tasks[i]);
    };
    setAddata() {
        this.addata = [];
    };
    getAddata(){
     return  this.addata;   
    };
    /**
     * 领取任务奖励
     * @param {接口返回值} msg 
     */
    onTaskRewardRsp (msg: { errorID: any; req: { type: any; index: any; }; task: { taskId: any; spineIdx: number; }; }) {
        global.Instance.Log.debug("------领取任务奖励---------",msg)
        if (!msg.errorID) {
            let type = msg.req.type;
            let index = msg.req.index;
            if (msg.task != null) {
                let taskData = global.Manager.DBManager.findData('Tasks', 'ID', msg.task.taskId);
                if (taskData != null)
                    msg.task.spineIdx = taskData.needer - 1;
                else
                    msg.task.spineIdx = 0;
            }

            if (type != 5 && msg.task != null)
                this.data[type][index] = msg.task;
            //请求成长任务阶段
            global.Instance.MsgPools.send('TaskStateList', {},null);
            let uiTask = global.Manager.UIManager.get('UITask');
            if (uiTask != null)
                uiTask.addGrowUprefresh();
        }
};
    
    /**
     * 接受任务
     * @param {接口返回值} msg 
     */
    onTaskAcceptRsp (msg: { errorID: any; req: { type: number; }; taskId: any; }) {
        global.Instance.Log.debug("------接受任务---------",msg)
        if (!msg.errorID) {
            let task = this.getQuest(msg.req.type, msg.taskId);
            if (task != null) {
                task.state = 1;
                this.isAcceptTask = true;
                this.setHasAcceptTaskData(task);
            }
            if(msg.taskId == 10003){
                let date = [];
                cc.sys.localStorage.setItem('10003', JSON.stringify(date));
            }
           
            this.settaskphase(msg.taskId, 1);
            if (msg.req.type == 1)
                global.Module.TaskData.growUpTaskID = msg.taskId;
            cc.systemEvent.emit('dirhelp');
            this.setHasAcceptTask(true);
        }
    };
    /**
     * 首次打开任务
     * @param {接口返回值} msg 
     */
    onTaskFirstRsp (msg: { errorID: any; req: { type: any; taskId: any; }; }) {
        global.Instance.Log.debug("------首次打开任务---------",msg)
        if (!msg.errorID) {
            let task = this.getQuest(msg.req.type, msg.req.taskId);
            if (task != null)
                task.first = 1;
        }
    };
    /**
     * 任务埋点
     * @param {接口返回值} msg 
     */

    onTaskPointRsp (msg: { errorID: any; }) {
        global.Instance.Log.debug("------任务埋点---------",msg)
        if (!msg.errorID) {

        }
    };
    /**
     * 删除任务
     * @param {接口返回值} msg 
     */
    onTaskRemoveRsp (msg: { errorID: any; req: { type: any; index: any; }; task: any; }) {
        global.Instance.Log.debug("------删除任务---------",msg)
        if (!msg.errorID) {
            let type = msg.req.type;
            let index = msg.req.index;
            this.setNewQuest(type, index, msg.task);
        }
    };
    /**
     * 刷新任务
     * @param {接口返回值} msg 
     */
    onTaskRefreshRsp (msg: { errorID: any; req: { type: any; taskId: any; }; task: { type: any; taskId: any; spineIdx: number; }; count: any; }) {
        global.Instance.Log.debug("------刷新任务---------",msg)
        if (!msg.errorID) {
            let type = msg.req.type;
            let taskId = msg.req.taskId;

            let task = this.getQuest(msg.task.type, msg.task.taskId);

            let taskData = global.Manager.DBManager.findData('Tasks', 'ID', task.taskId);
            msg.task.spineIdx = taskData.needer - 1;

            this.setNewQuest(type, taskId, msg.task);

            this.taskNums[type] = msg.count;
        }
    };
    /**
     * 推送任务刷新
     * @param {接口返回值} msg 
     */
    onTaskUpdateNtf (msg: any) {
        global.Instance.Log.debug("------推送任务刷新---------",msg);
        let type = msg.type;
        if (msg.type != 0)
            this.data[msg.type] = [];
        this.addeGrowUp(msg);
        for (let key in msg.tasks) {
            let task = msg.tasks[key];
            let taskData = global.Manager.DBManager.findData('Tasks', 'ID', task.taskId);
            if (taskData != null)
                task.spineIdx = taskData.needer - 1;
            else
                task.spineIdx = 0;
            this.data[type].push(task);
            if (type == 5)//商会任务
                global.Module.GameData.showTaskHelp();
        }

        this.taskNums[type] = msg.count;
    };
    /**
     * 成长任务完成
     * @param {接口返回值} msg 
     */
    onTaskFinishNtf (msg:any) {
        global.Instance.Log.debug("------成长任务完成---------",msg)
        if (msg.task) {
            this.setHasAcceptTaskData(msg.task);
            this.settaskphase(msg.task.taskId,2)
            global.Instance.MsgPools.send('taskList', {},null);
            cc.systemEvent.emit('10001');
            this.isTask = true;
            let s = cc.director.getScheduler();
            s.enableForTarget(this)
            s.schedule(this.callback, this, 1, cc.macro.REPEAT_FOREVER, 0, false);
            let guideID = global.Module.MainPlayerData.getguideID()+1;
            let state = global.Module.MainPlayerData.getGuideState();
            global.Instance.Log.debug('guideID'+guideID,'state'+state)
            if (msg.task.taskId == 10000 && guideID == 8011 && state != 1) {
       
                this.setIsTaskId(true)
                global.Instance.MsgPools.send('updateGuide', { guideId: 8020, state: 1 }, function (data: any) {
                    if (msg.errorID == 0) {
                        global.Module.MainPlayerData.setguideState(state);
                    }
                });
            }

        }
    };
    settaskphase(id: string | number,state: number){
        if (this.taskphase[id])
            this.taskphase[id].state = state;
    };
    /**
     * 通过ID获取任务
     * @param id 
     * @returns 
     */
    gettaskphase(id: string | number){
        if (id)
            return this.taskphase[id];
        else
            return this.taskphase;  
    };
    /**
     * 领取任务前置任务
     * @param {} id 
     */
    taskRont(id: any){
        let TaskData = this.getHasAcceptTaskData();//当前已领取任务
        if (TaskData == null) {
            let data = global.Manager.DBManager.findData('Tasks', 'ID', id);
            if(data.ront!=0){
                let Farmdata = global.Module.TaskData.gettaskphase(data.ront);
                if (!Farmdata || Farmdata.state != 3) {
                    let data = global.Manager.DBManager.findData('Tasks', 'ID', Farmdata.taskId);
                    let title = data.title1
                    if (title.slice(title.slice(title.length - 2)) != "任务")
                        title = title + '任务'
                    global.CommonClass.UITip.showTipTxt('请先领取' + data.title1, global.Enum.TipType.TIP_BAD);
                    return true;
                }
            }
        } else {
            let data = global.Manager.DBManager.findData('Tasks', 'ID', TaskData.taskId);
            let title = data.title1
            if (title.slice(title.slice(title.length - 2)) != "任务")
                title = title + '任务'
            global.CommonClass.UITip.showTipTxt('请先完成已接任务', global.Enum.TipType.TIP_BAD);
            return true;
        }
        return false;
    };
    /**
     * 任务安全保护
     * @param {} id 
     */
    taskguard(id: any){
        global.Instance.Log.debug('id',id);
        global.Instance.Log.debug('taskphase',this.taskphase);
        global.Instance.Log.debug('当前已领取任务',this.getHasAcceptTaskData());
        let TaskData = this.getHasAcceptTaskData();
        let Farmdata = global.Module.TaskData.gettaskphase(id);
        // global.Instance.Log.debug('Farmdata',Farmdata);
        if(!Farmdata || Farmdata.state==0){
            if(TaskData == null){
                let data = global.Manager.DBManager.findData('Tasks', 'ID', id);
                let title =data.title1
                if (title.slice(title.slice(title.length-2)) != "任务")
                    title = title+'任务'
                global.CommonClass.UITip.showTipTxt('请先领取' + data.title1, global.Enum.TipType.TIP_BAD);
                return true;
            }else if(TaskData.taskId != id){
                let data = global.Manager.DBManager.findData('Tasks', 'ID', TaskData.taskId);
                let title =data.title1
                if (title.slice(title.slice(title.length-2)) != "任务")
                    title = title+'任务'
                global.CommonClass.UITip.showTipTxt('请先完成已接任务', global.Enum.TipType.TIP_BAD);
                return true; 
            }
    
        }
       
        return false;
    };
    onTaskStateListRsp (msg: { errorID: number; taskState: string | any[]; }) {
        global.Instance.Log.debug("成长任务阶段",msg)
        this.taskphase = []
        if (msg.errorID==0) {
            for (let i = 0; i < msg.taskState.length; i++) {
                this.taskphase[msg.taskState[i].taskId] = msg.taskState[i]
            }
        }
    };
    callback(){
        if (this.isTask == true && this.isAgree == true) {
            cc.systemEvent.emit('ArrowHead');
                
            this.isTask = false;
            cc.director.getScheduler().unschedule(this.callback,this);
            let TaskData = this.getHasAcceptTaskData();
            let taskData = global.Manager.DBManager.findData('Tasks', 'ID', TaskData.taskId);
            let taskDec = '完成(' + taskData.title1 + ')';
            if(this.isAcceptTaskData!=null){
                this.isAcceptTaskData.state = 2;
            }else{
                global.Instance.MsgPools.send('taskList', {},null);
            }
       
            let clickAnim = global.Manager.UIManager.getResident('clickAnim');
            if (clickAnim) {
                clickAnim.reflashEntry();
                
                clickAnim.reflash(taskDec);
            }
               
        }

    }
}
