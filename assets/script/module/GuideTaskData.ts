

const { ccclass, property } = cc._decorator;

@ccclass
export default class GuideTaskData extends cc.Component {
    data: { taskId: number; state: number; arg: number; };
    isFinishAll: boolean;

    constructor() {
        super();
        this.data = { taskId: 1, state: 0, arg: 0 }
        this.isFinishAll = false;
        //this.loadLocal(); 
    };

    getData() {
        return this.data;
    };

    getCurTask() {
        return this.data.taskId;
    };

    setCurTask(ID) {
        this.data.taskId = ID;
    };

    getCurState() {
        return this.data.state;
    };

    makeState(guide) {
        if (guide.taskStage == 0)
            return global.Enum.TaskState.TASK_OPEN;
        else if (guide.isFinish == 0)
            return global.Enum.TaskState.TASK_ACCEPT;
        else
            return global.Enum.TaskState.TASK_FINISH;
    };

    updateByGuide(guideID) {
        //this.data.state = state;
        let guide = global.Manager.DBManager.findData('NewGuide', 'ID', guideID);
        if (guide != null) {
            this.data.taskId = guide.taskId;
            this.data.arg = guide.taskStage;
            this.data.state = this.makeState(guide);

            this.data.taskId = guide.taskId;

            let endGuide = global.Manager.DBManager.findData('NewGuide', 'guideKey', 'EndGuide');
            this.isFinishAll = guideID >= endGuide.ID;
        }
    };

    getArg() {
        return this.data.arg;
    };

    getIsFinishAll() {
        return this.isFinishAll;
    };

}
