const { ccclass, property } = cc._decorator;

@ccclass
export default class Enum  {
     Direct: { NONE: number; LEFT: number; RIGHT: number; UP: number; DOWN: number; };//接鸡蛋小游戏
     RankType: { LEVEL: number; SELL: number; COLLECTION: number; APPLY: number; };//排行榜定义
     CollectionType: { TOOLS: number; FOODS: number; CLOTHING: number; };
     PopBagType: { PRECIOUS_ROOM: number; INDETIFY: number; PRECIOUS_RANK: number; };
     //个人信息定义
     CoinType: { COIN_EXP: number; COIN_MONEY: number; COIN_DIAMOND: number; COIN_HONOR: number; COIN_POWER: number; COIN_CHARM: number; COIN_MAGIC: number; COIN_ECOLOGICAL: number; COIN_UNION: number; COIN_ITEM: number; };
     DlgTipType: { DLG_LEVELUP: number; DLG_HANDBOOK: number; DLG_ITEMGET: number; DLG_MULITEMGET: number; DLG_MULDROP: number; DLG_FUNCTION: number; DLG_COINDROP: number; };
     TaskState: { TASK_NULL: number; TASK_OPEN: number; TASK_ACCEPT: number; TASK_FINISH: number; };
     FarmType: {
        FARM_NULL: number; //空
        FARM_PLANT: number; //植物
        FARM_FISH: number; //鱼塘
        FARM_ANIMAL: number; //动物
        PARKBAG_RARE_ANIMAL: number; //珍惜动物
    };
     ParkBagType: {
        PARKBAG_NULL: number; PARKBAG_STRAW: number; //花草
        PARKBAG_PLANT: number; //蔬果
        PARKBAG_TREE: number; //树木
        PARKBAG_ANIMAL: number; //动物
        PARKBAG_RARE_ANIMAL: number; //珍惜动物
        PARKBAG_FISH: number;
    };
     FarmTypeOp: {
        FARMOP_NULL: number;
        FARMOP_READY_HARVEST_PLANT: number; //植物
        FARMOP_HARVEST_PLANT: number; //收获植物
        FARMOP_READY_HARVEST_ANIMAL: number; //动物
        FARMOP_HARVEST_ANIMAL: number; //收获动物
        FARMOP_READY_HARVEST_FINSH: number; //鱼塘
        FARMOP_HARVEST_FINSH: number; //收获鱼塘
        FARMOP_READY_SHOVEL_PLANT: number; 
        FARMOP_SHOVEL_PLANT: number; 
        FARMOP_READY_SHOVEL_ANIMAL: number; 
        FARMOP_SHOVEL_ANIMAL: number; 
        FARMOP_GROW: number; //植物播种种子状态
        FARMOP_FINSH: number;
    };
    //任务
     TradeType: { TRADE_NONE: number; TRADE_WANT_SELL: number; TRADE_WANT_BUY: number; TRADE_SELL: number; TRADE_BUY: number; };
     TipType: { TIP_NORMAL: number; TIP_GOOD: number; TIP_BAD: number; };
     FriendMode: { MODE_LEVEL: number; MODE_FORTUNE: number; };
     PanelZOrder: {
        PanelZ_DEFAULT: number; //默认层级
        PanelZ_TASK_SPEEK: number; //任务图标层级
        PanelZ_DONW_UI: number; //比较低的层级 打开时候任务图标不会被覆盖
        PanelZ_UP_UI: number; //比较高的层级 打开时候任务图标会被覆盖
        PanelZ_DIALOG: number; //更高层级适合对话框
        PanelZ_TOP: number; //最高层级适合对话框之上
    };
     ChatChannel: { CHAT_UNION: number; CHAT_DIG: number; CHAT_NUM: number; };
     PageType: {
        PageBegin: number; //封面
        PageFirst: number; //首页
        PageLast: number; //尾页
        PageEnd: number; //封尾
        PageNone: number; //空白
        PageLeft: number; PageRight: number;
    };
     ETaskType: {
        eGrowUp: number; // 成长任务
        eDaily: number; // 日任
        eMonth: number; // 月任
        eSpecial: number; // 特任
        eGuild: number;
    };
    //图鉴图片加载路径
    handBookPath:{
        pathLoss:string;//破损路径
        pathPerfect:string;//完美路径
        pathWorn:string;//未鉴定路径
    }
    constructor() {
        // super();
        //接鸡蛋小游戏
        this.Direct = {
            NONE: 0,//无
            LEFT: 1,//左
            RIGHT: 2,//右
            UP: 3,//上
            DOWN: 4,//下
        };
        //排行榜定义
        this.RankType = {
            SELL: 1,//好友推荐
            APPLY: 3,//好友申请
            COLLECTION: 7,//馆藏排行
            LEVEL: 9,//等级排行
        };
        //弃用
        this.CollectionType = {
            TOOLS: 1,
            FOODS: 2,
            CLOTHING: 3,
        };
        //弃用
        this.PopBagType = {
            PRECIOUS_ROOM: 1,
            INDETIFY: 2,
            PRECIOUS_RANK: 3,
        };
        //个人信息定义
        this.CoinType = {
            COIN_EXP: 1,
            COIN_MONEY: 2,
            COIN_DIAMOND: 3,
            COIN_HONOR: 4,//声誉
            COIN_POWER: 5,
            COIN_CHARM: 6,
            COIN_MAGIC: 7,
            COIN_ECOLOGICAL: 8,//生态园
            COIN_UNION: 9,
            COIN_ITEM: 14,
        };
        //提示消息定义
        this.DlgTipType = {
            DLG_LEVELUP: 1,
            DLG_HANDBOOK: 2,
            DLG_ITEMGET: 3,
            DLG_MULITEMGET: 4,
            DLG_MULDROP: 5,
            DLG_FUNCTION: 6,
            DLG_COINDROP: 7,
        };
        //弃用
        this.TaskState = {
            TASK_NULL: 0,
            TASK_OPEN: 1,
            TASK_ACCEPT: 2,
            TASK_FINISH: 3,
        };
        //生态园动物定义
        this.FarmType = {
            FARM_NULL: 0,//空
            FARM_PLANT: 1,//植物
            FARM_FISH: 2,//鱼塘
            FARM_ANIMAL: 3,//动物
            PARKBAG_RARE_ANIMAL: 4,//珍惜动物
        };
        //生态园植物定义
        this.ParkBagType = {
            PARKBAG_NULL: 0,
            PARKBAG_STRAW: 0,//花草
            PARKBAG_PLANT: 1,//蔬果
            PARKBAG_TREE: 2,//树木
            PARKBAG_ANIMAL: 3,//动物
            PARKBAG_RARE_ANIMAL: 4,//珍惜动物
            PARKBAG_FISH: 5,//鱼塘
        };
        //定义
        this.FarmTypeOp = {
            FARMOP_NULL: 0,

            FARMOP_READY_HARVEST_PLANT: 1,//植物
            FARMOP_HARVEST_PLANT: 2,//收获植物

            FARMOP_READY_HARVEST_ANIMAL: 3,//动物
            FARMOP_HARVEST_ANIMAL: 4,//收获动物

            FARMOP_READY_HARVEST_FINSH: 5,//鱼塘
            FARMOP_HARVEST_FINSH: 6,//收获鱼塘


            FARMOP_READY_SHOVEL_PLANT: 5,
            FARMOP_SHOVEL_PLANT: 6,

            FARMOP_READY_SHOVEL_ANIMAL: 7,
            FARMOP_SHOVEL_ANIMAL: 8,

            FARMOP_GROW: 9,//植物播种种子状态
            FARMOP_FINSH: 9,//鱼塘播种
        };
        //交易
        this.TradeType = {
            TRADE_NONE: 0,//交易所总
            TRADE_WANT_BUY: 1,//交易所交易购买
            TRADE_WANT_SELL: 2,//交易所交易售卖
            TRADE_SELL: 3,//交易所售卖
            TRADE_BUY: 4,//交易所购买
        };
        //提示类型
        this.TipType = {
            TIP_NORMAL: 1,
            TIP_GOOD: 2,
            TIP_BAD: 3,
        };
        //好友数据排名
        this.FriendMode = {
            MODE_LEVEL: 1,
            MODE_FORTUNE: 2,
            // MODE_TITLE      : 3,
        };
        //UI层级
        this.PanelZOrder = {
            PanelZ_DEFAULT: 20,         //默认层级
            PanelZ_TASK_SPEEK: 10,         //任务图标层级
            PanelZ_DONW_UI: 7,          //比较低的层级 打开时候任务图标不会被覆盖
            PanelZ_UP_UI: 30,         //比较高的层级 打开时候任务图标会被覆盖
            PanelZ_DIALOG: 99,         //更高层级适合对话框
            PanelZ_TOP: 200         //最高层级适合对话框之上
        };
        this.ChatChannel = {
            CHAT_UNION: 1,
            CHAT_DIG: 2,
            CHAT_NUM: 3,
        };
        this.PageType = {
            PageBegin: -1,        //封面
            PageFirst: -2,        //首页
            PageLast: -3,        //尾页
            PageEnd: -4,        //封尾
            PageNone: -5,        //空白
            PageLeft: -6,
            PageRight: -7,

        };
        this.ETaskType = {
            eGrowUp: 1,      // 成长任务
            eDaily: 2,       // 日任
            eMonth: 3,       // 月任
            eSpecial: 4,     // 特任
            eGuild: 5,       // 商会任务

        };
        this.handBookPath={
            pathLoss:'images/ui/handbook/loss/',//破损路径
            pathPerfect:'images/ui/handbook/perfect/',//完美路径
            pathWorn:'images/ui/handbook/worn/',//未鉴定路径
        }
    };
}

