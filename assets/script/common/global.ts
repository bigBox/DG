
    import Enum from "./Enum";
    window["Enum"] = new Enum;
//-------------------  Manager 页面  ---------------------------
import UIManager from "../manager/UIManager";
import DBManager from "../manager/DBManager";
import UITipManager from "../manager/UITipManager";
import UIPaoPaoTipManager from "../manager/UIPaoPaoTipManager";
import UICoinDropManager from "../manager/UICoinDropManager";
import UICoinManager from "../manager/UICoinManager";
import DigGolderManager from "../diggold/DigGolderManager";
import UIDlgTipManager from "../manager/UIDlgTipManager";
import Sdk from "../sdk/Sdk";
// import UICoinManager from "../manager/UICoinManager";
window["Manager"] = {
        UIManager: new UIManager(),
        DBManager: new DBManager(),
        UITipManager: new UITipManager(),
        UIPaoPaoTipManager: new UIPaoPaoTipManager(),
        UICoinDropManager: new UICoinDropManager(),
        UICoinManager: new UICoinManager(),
        DigGolderManager: new DigGolderManager(),
        UIDlgTipManager: new UIDlgTipManager(),
        Sdk: new Sdk(),
}




//-------------------  CommonClass 逻辑处理类  --------------------------
import FindPath from "./FindPath";////探险逻辑处理
import UIBase from "./UIBase";
import ProxyBase from "./ProxyBase";
import UITip from "./UITip";
import UserData from "./UserData";
import Functions from "./Functions";
import ItemDrop from "../component/ItemDrop";//物品掉落动画
import FactoryBase from "../factorys/FactoryBase";//
import MaterialUtils from "./MaterialUtils";
import Geometry from "./Geometry";
import UIDialog from "./UIDialog";
import SceneBase from "../scene/SceneBase";
import ObstacleBase from "../factorys/ObstacleBase";
import Prismatic from "../component/Prismatic";
import TownMapBase from "../npctown/TownMapBase";
import TownFactoryBase from "../npctown/TownFactoryBase";
import DragLayer from "./DragLayer";
import Honeycomb from "../factorys/Honeycomb";
import UIPaoPaoTip from "./UIPaoPaoTip";
import CellBase from "./CellBase";
import ItemIcon from "../component/ItemIcon";
import ItemNeed from "./ItemNeed";
import PickItem from "../component/PickItem";
import PopPackageItem from "../component/PopPackageItem";
import PopIndentifyItem from "../component/PopIndentifyItem";
import PreciousItem from "../component/PreciousItem";
import GuJiGoodsItem from "../component/GuJiGoodsItem";
import GuJiCellItem from "../component/GuJiCellItem";
import GuJiCellMask from "../component/GuJiCellMask";
import FactoryItem from "../component/FactoryItem";
import MineCell from "../component/MineCell";
import UICommonBar from "./UICommonBar";
import UICommonCoin from "./UICommonCoin";
import PickPanel from "./PickPanel";
import FrogJump from "./FrogJump";
import MoveObject from "./MoveObject";
import UICountChange from "./UICountChange";
import TradeNoteItem from "../component/TradeNoteItem";
import UnionMemberItem from "../component/UnionMemberItem";
import UnionApplyItem from "../component/UnionApplyItem";
import UnionRankItem from "../component/UnionRankItem";
import UnionTaskItem from "../component/UnionTaskItem";
import FriendItem from "../component/FriendItem";
import RankItem from "../component/RankItem";
import RankndItem from "../component/RankndItem";
import PreciousRankItem from "../component/PreciousRankItem";
import MakeGoodsItem from "../component/MakeGoodsItem";
import ComposeItem from "../component/ComposeItem";
import FarmBagItem from "./FarmBagItem";
import IndentifyItem from "./IndentifyItem";
import IndentifyBagItem from "../component/IndentifyBagItem";
import IndentifyHistoryItem from "../component/IndentifyHistoryItem";
import HandBookItem from "../component/HandBookItem";
import HandBookLookItem from "../component/HandBookLookItem";
import CollectionItem from "../component/CollectionItem";
import MsgBase from "./MsgBase";
import DigGolderPlayer from "../diggold/DigGolderPlayer";//挖矿其他玩家
import DigGolderMainPlayer from "../diggold/DigGolderMainPlayer";
import CoinDrop from "../component/CoinDrop";
import FarmItem from "../component/FarmItem";
import GuideHelp from "../component/GuideHelp";
import UIGuideMask from "../component/UIGuideMask";
import DigHelp from "../component/DigHelp";
import FactoryItemNew from "../component/FactoryItemNew";
import TradeItem from "../component/TradeItem";
import UIDragBag from "./UIDragBag";
import UIFishBag from "./UIFishBag";
import UIPreciousBag from "../mainscene/UIPreciousBag";
import UISpecimenBag from "../mainscene/UISpecimenBag";
import SpecimenItem from "../mainscene/SpecimenItem";
import PaintItem from "../component/PaintItem";
import ShopItem from "../component/ShopItem";
import FarmParkCell from "../component/FarmParkCell";
import FarmFish from "../component/FarmFish";
import FarmParkItem from "../component/FarmParkItem";
import FarmParkAniItem from "../component/FarmParkAniItem";
import ParkAnimal from "../factorys/ParkAnimal";
import UIHelp from "./UIHelp";
import HelpItem from "../component/HelpItem";
import UIFactoryTalk from "./UIFactoryTalk";
import GuideSpeek from "../component/GuideSpeek";
import ChatCell from "../chat/ChatCell";
import UnionFightItem from "../component/UnionFightItem";
import GuJiListItem from "../component/GuJiListItem";
import ChipItem from "../component/ChipItem";
import TownListItem from "../component/TownListItem";
import TownCellItem from "../component/TownCellItem";
import NpcListItem from "../component/NpcListItem";
import UIFirstTalk from "../mainscene/UIFirstTalk";
import UIData from "../component/UIData";

window['CommonClass'] ={        
        UIBase:UIBase,
        FactoryBase:FactoryBase,
        SceneBase:SceneBase,
        ObstacleBase:ObstacleBase,
        TownMapBase:TownMapBase,
        TownFactoryBase:TownFactoryBase,
        DragLayer:DragLayer,
        Functions:Functions,
        Geometry:Geometry,
        Honeycomb:Honeycomb,
        UITip:UITip,
        UIPaoPaoTip:UIPaoPaoTip,
        CellBase:CellBase,
        UserData:UserData,
        ProxyBase:ProxyBase,
        ItemIcon:ItemIcon,
        ItemNeed:ItemNeed,
        PickItem:PickItem,
        Prismatic:Prismatic,
        PopPackageItem:PopPackageItem,
        PopIndentifyItem:PopIndentifyItem,
        PreciousItem:PreciousItem,
        GuJiGoodsItem:GuJiGoodsItem,
        GuJiCellItem:GuJiCellItem,
        GuJiCellMask:GuJiCellMask,
        FactoryItem:FactoryItem,
        MineCell:MineCell,
        UIDialog:UIDialog,
        UICommonBar:UICommonBar,
        UICommonCoin:UICommonCoin,
        PickPanel:PickPanel,
        FrogJump:FrogJump,
        MoveObject:MoveObject,
        UICountChange:UICountChange,
        TradeNoteItem:TradeNoteItem,
        UnionMemberItem:UnionMemberItem,
        UnionApplyItem:UnionApplyItem,
        UnionRankItem:UnionRankItem,
        UnionTaskItem:UnionTaskItem,
        FriendItem:FriendItem,
        RankItem:RankItem,
        RankndItem:RankndItem,
        PreciousRankItem:PreciousRankItem,
        MakeGoodsItem:MakeGoodsItem,
        ComposeItem:ComposeItem,
        FarmBagItem:FarmBagItem,
        IndentifyItem:IndentifyItem,
        IndentifyBagItem:IndentifyBagItem,
        IndentifyHistoryItem:IndentifyHistoryItem,
        HandBookItem:HandBookItem,
        HandBookLookItem:HandBookLookItem,
        CollectionItem:CollectionItem,
        FindPath:FindPath, 
        MsgBase:MsgBase,
        DigGolderPlayer:DigGolderPlayer,
        DigGolderMainPlayer:DigGolderMainPlayer,
        ItemDrop:ItemDrop,
        CoinDrop:CoinDrop,
        FarmItem:FarmItem,
        GuideHelp:GuideHelp,
        UIGuideMask:UIGuideMask,
        DigHelp:DigHelp,
        FactoryItemNew:FactoryItemNew,
        TradeItem:TradeItem,
        UIDragBag:UIDragBag,
        UIFishBag:UIFishBag,
        UIPreciousBag:UIPreciousBag,
        UISpecimenBag:UISpecimenBag,
        SpecimenItem:SpecimenItem,
        PaintItem:PaintItem,
        ShopItem:ShopItem,
        FarmParkCell:FarmParkCell,
        FarmFish:FarmFish,
        FarmParkItem:FarmParkItem,
        FarmParkAniItem:FarmParkAniItem,
        ParkAnimal:ParkAnimal,
        UIHelp:UIHelp,
        HelpItem:HelpItem,
        UIFactoryTalk:UIFactoryTalk,
        MaterialUtils:MaterialUtils,
        GuideSpeek:GuideSpeek,
        ChatCell:ChatCell,
        UnionFightItem:UnionFightItem,
        GuJiListItem:GuJiListItem,
        ChipItem:ChipItem,
        TownListItem:TownListItem,
        TownCellItem:TownCellItem,
        NpcListItem:NpcListItem,
        UIFirstTalk:UIFirstTalk,
        UIData:UIData,  
}


//-------------------  Module 数据  --------------------------
import MainPlayerData from "../module/MainPlayerData";//用户个人信息数据类
import GameData from "../module/GameData";//账号登陆信息游戏平台信息数据类
import PackageData from "../module/PackageData";//用户所有物品数据类
import MakeGoodsData from "../module/MakeGoodsData";//用户所有物品数据类
import MainMapData from "../module/MainMapData";//大本营数据类
import RankData from "../module/RankData";//排行榜数据类
import FriendData from "../module/FriendData";//好友数据类
import PreciousRoomData from "../module/PreciousRoomData";//展厅数据类
import IdentifyData from "../module/IdentifyData";//鉴定数据类
import FarmData from "../module/FarmData";//鉴定数据类
import FarmParkData from "../module/FarmParkData";//生态园数据类
import TradeData from "../module/TradeData";//交易数据类
import UnionData from "../module/UnionData";//公会数据类
import TaskData from "../module/TaskData";//任务数据类
import UnionTaskData from "../module/UnionTaskData";//工会任务数据类
import GuildBattleData from "../module/GuildBattleData";//工会对战数据类
import CatchGoodsNetData from "../module/CatchGoodsNetData";//
import HandBookData from "../module/HandBookData";//图鉴数据类
import CollectData from "../module/CollectData";//
import ShopData from "../module/ShopData";//商店数据类
import SummonData from "../module/SummonData";//精灵召唤数据类
import CatchGoodsData from "../module/CatchGoodsData";//
import ChatData from "../module/ChatData";//
import TownNpcData from "../module/TownNpcData";//苏州府数据类

//-------------------  Proxys 游戏主要逻辑  ---------------------------
import ProxyReLogin from "../login/ProxyReLogin";//连接webscoket断线重连逻辑处理
import ProxyDigGold from "../diggold/ProxyDigGold";////挖矿逻辑处理
import ProxyGuJi from "../guji/ProxyGuJi";////探险逻辑处理
import ProxyFarm from "../factorys/ProxyFarm";
import ProxyWorldMap from "../worldmap/ProxyWorldMap";////户外逻辑处理
import ProxyGuide from "../playerguide/ProxyGuide";
import ProxyNewFactory from "../mainscene/ProxyNewFactory";

//-------------------  Instance 公共类  ---------------------------
import websocket from "../socket/websocket";
import MsgPools from "../socket/MsgPools";
import AudioEngine from "../component/AudioEngine";
import Log from "./Log";
import GuideTaskData from "../module/GuideTaskData";
import PlayerMapData from "../module/PlayerMapData";
import FriendChooseData from "../module/FriendChooseData";
import ProxyFactoryGuide from "../playerguide/ProxyFactoryGuide";
import ProxyUnion from "../union/ProxyUnion";
import TownMapData from "../module/TownMapData";
import FishPoolData from "../module/FishPoolData";






window["Module"] = {
    FishPoolData:new FishPoolData(),
    GameData: new GameData(),
    MainPlayerData: new MainPlayerData(),
    PackageData: new PackageData(),
    MakeGoodsData: new MakeGoodsData(),
    MainMapData: new MainMapData(),
    RankData: new RankData(),
    FriendData: new FriendData(),
    PreciousRoomData: new PreciousRoomData(),
    IdentifyData: new IdentifyData(),
    FarmData: new FarmData(),
    FarmParkData: new FarmParkData(),
    TradeData: new TradeData(),
    UnionData: new UnionData(),
    TaskData: new TaskData(),
    UnionTaskData: new UnionTaskData(),
    GuildBattleData: new GuildBattleData(),
    CatchGoodsNetData: new CatchGoodsNetData(),
    HandBookData: new HandBookData(),
    CollectData: new CollectData(),
    GuideTaskData: new GuideTaskData(),
    PlayerMapData: new PlayerMapData(),
    ShopData: new ShopData(),
    SummonData: new SummonData(),
    CatchGoodsData: new CatchGoodsData(),
    ChatData: new ChatData(),
    TownNpcData: new TownNpcData(),
    FriendChooseData: new FriendChooseData(),
    TownMapData:new TownMapData(),
};
window["Proxys"] = {
    ProxyDigGold: new ProxyDigGold(),
    ProxyGuJi: new ProxyGuJi(),
    ProxyFarm: new ProxyFarm(),
    ProxyWorldMap: new ProxyWorldMap(),
    // ProxyPlayerScene: new (require("ProxyPlayerScene"))(),
    ProxyGuide: new ProxyGuide(),
    ProxyFactoryGuide: new ProxyFactoryGuide(),
    ProxyNewFactory: new ProxyNewFactory(),
    ProxyUnion: new ProxyUnion(),
    ProxyReLogin: new ProxyReLogin(),
    // // ProxyCityMapEditor:new(require("ProxyCityMapEditor"))(),
};
window["Instance"] = {
    Socket: new websocket(),
    MsgPools: new MsgPools(),
    Dynamics: new Map(),
    AudioEngine: new AudioEngine(),
    Log: new Log,
};

export let ConfigPath ={
    UIChat:{filePath:"prefab/chat/UIChat",name:"UIChat",zOrder:global.Enum.PanelZOrder.PanelZ_TOP + 1,tooltip:'聊天'},

    // DlgBoxTips:{filePath:"prefab/dialog/DlgBoxTips",name:"DlgBoxTips",zOrder: null,tooltip:'偷碎片 展架保存界面'},

    
    UIProgress:{filePath:"prefab/common/UIProgress",name:"UIProgress",zOrder:null,tooltip:'切换场景页面'},
    UILevelUpNew:{filePath:"prefab/common/UILevelUpNew",name:"UILevelUpNew",zOrder:null,tooltip:'升级界面'},


    UIHandCode:{filePath:"prefab/login/UIHandCode",name:"UIHandCode",zOrder:null,tooltip:'手机验证码页面'},
    UIRealAgree:{filePath:"prefab/login/UIRealAgree",name:"UIRealAgree",zOrder:null,tooltip:'确认注册协议'},
    UIRegister:{filePath:"prefab/login/UIRegister",name:"UIRegister",zOrder:null,tooltip:'注册页面'},
    UICypher:{filePath:"prefab/login/UICypher",name:"UICypher",zOrder:null,tooltip:'修改密码页面'},
    UIRealauthen:{filePath:"prefab/login/UIRealauthen",name:"UIRealauthen",zOrder:null,tooltip:'实名认证界面'},


    UIHelpList:{filePath:"prefab/common/UIHelpList",name:"UIHelpList",zOrder:null,tooltip:'游戏介绍'},
    UIHelpSpeek:{filePath:"prefab/common/UIHelpSpeek",name:"UIHelpSpeek",zOrder: null,tooltip:'场景介绍'},
    UIAbout:{filePath:"prefab/common/UIAbout",name:"UIAbout",zOrder: null,tooltip:'游戏背景介绍'},





    UIFirstTalk:{filePath:"prefab/mainscene/UIFirstTalk",name:"UIFirstTalk",zOrder:global.Enum.PanelZOrder.PanelZ_TOP,tooltip:'新手引导页面'},
    UIHelpTip:{filePath:"prefab/common/UIHelpTip",name:"UIHelpTip",zOrder:global.Enum.PanelZOrder.PanelZ_TOP,tooltip:'图文提示'},
    UITaskTip:{filePath:"prefab/common/UITaskTip",name:"UITaskTip",zOrder:global.Enum.PanelZOrder.PanelZ_TOP,tooltip:'提示'},



    UIRole:{filePath:"prefab/role/UIRole",name:"UIRole",zOrder: null,tooltip:'个人信息'},

    UISocketLock:{filePath:"prefab/common/UISocketLock",name:"UISocketLock",zOrder:global.Enum.PanelZOrder.PanelZ_TOP,tooltip:'请求接口等待页面'},
    UITask:{filePath:"prefab/mainscene/UITask",name:"UITask",zOrder:null,tooltip:'任务界面'},
    UITaskHelp:{filePath:"prefab/mainscene/UITaskHelp",name:"UITaskHelp",zOrder:null,tooltip:'任务帮助'},


    
    UITaskDaily:{filePath:"prefab/mainscene/UITaskDaily",name:"UITaskDaily",zOrder:global.Enum.PanelZOrder.PanelZ_TOP,tooltip:'日常任务'},
    UITaskDetail:{filePath:"prefab/mainscene/UITaskDetail",name:"UITaskDetail",zOrder:null,tooltip:'任务界面二级页面'},
    UIIdentify:{filePath:"prefab/mainscene/UIIdentify",name:"UIIdentify",zOrder:null,tooltip:'鉴定界面'},
    UIIdentifyFriend:{filePath:"prefab/playerscene/UIIdentifyFriend",name:"UIIdentifyFriend",zOrder:null,tooltip:'好友鉴定界面'},
    UIFriendChoose:{filePath:"prefab/friend/UIFriendChoose",name:"UIFriendChoose",zOrder:global.Enum.PanelZOrder.PanelZ_UP_UI,tooltip:'好友列表'},
    UIFriend:{filePath:"prefab/friend/UIFriend",name:"UIFriend",zOrder:null,tooltip:'主页下方好友列表'},
    UIIdentifyBag:{filePath:"prefab/mainscene/UIIdentifyBag",name:"UIIdentifyBag",zOrder:null,tooltip:'鉴定选择物品界面'},
    DlgIdentifySpeed:{filePath:"prefab/dialog/DlgIdentifySpeed",name:"DlgIdentifySpeed",zOrder:null,tooltip:'鉴定加速'},
    UIUnionTaskSpeek:{filePath:"prefab/dialog/UIUnionTaskSpeek",name:"UIUnionTaskSpeek",zOrder:null,tooltip:''},

    UIHandBook03: { filePath: "prefab/mainscene/UIHandBook03", name: "UIHandBook03", zOrder: null, tooltip: '图鉴一级菜单' },
    UIHandBook05: { filePath: "prefab/mainscene/UIHandBook05", name: "UIHandBook05", zOrder: null, tooltip: '图鉴一级菜单' },

    UIForum:{filePath:"prefab/mainscene/UIForum",name:"UIForum",zOrder:null,tooltip:'论坛页面'},
    UIIndentifyHistory:{filePath:"prefab/mainscene/UIIndentifyHistory",name:"UIIndentifyHistory",zOrder:null,tooltip:'拜访记录'},
    UIPreciousRoom:{filePath:"prefab/mainscene/UIPreciousRoom",name:"UIPreciousRoom",zOrder:null,tooltip:'展厅'},
    UIPreciousFriend:{filePath:"prefab/playerscene/UIPreciousFriend",name:"UIPreciousFriend",zOrder:null,tooltip:'好友展厅'},
    UIPackageShow:{filePath:"prefab/mainscene/UIPackageShow",name:"UIPackageShow",zOrder: global.Enum.PanelZOrder.PanelZ_TOP,tooltip:'展厅物品详情'},
    UICollectionNew:{filePath:"prefab/mainscene/UICollectionNew",name:"UICollectionNew",zOrder: null,tooltip:'宝贝收集'},
    UICollectionPrize:{filePath:"prefab/mainscene/UICollectionPrize",name:"UICollectionPrize",zOrder: null,tooltip:'宝贝收集奖'},

    UIHandBook02:{filePath:"prefab/mainscene/UIHandBook02",name:"UIHandBook02",zOrder: null,tooltip:'图鉴'},
    UIHandBook06:{filePath:"prefab/mainscene/UIHandBook06",name:"UIHandBook06",zOrder: null,tooltip:'图鉴一级菜单'},
    UIShopNew:{filePath:"prefab/mainscene/UIShopNew",name:"UIShopNew",zOrder: null,tooltip:'商城'},
    UIPayment:{filePath:"prefab/payment/UIPayment",name:"UIPayment",zOrder: null,tooltip:'支付界面'},
    DlgCollectDrop:{filePath:"prefab/dialog/DlgCollectDrop",name:"DlgCollectDrop",zOrder: null,tooltip:'掉落通用'},
    UIPackage:{filePath:"prefab/mainscene/UIPackage",name:"UIPackage",zOrder: null,tooltip:'仓库'},
    UIMakeGoods:{filePath:"prefab/mainscene/UIMakeGoods",name:"UIMakeGoods",zOrder: null,tooltip:'制作'},
    DlgCostItem:{filePath:"prefab/dialog/DlgCostItem",name:"DlgCostItem",zOrder: null,tooltip:'制作加速'},
    UITrade:{filePath:"prefab/trade/UITrade",name:"UITrade",zOrder: null,tooltip:'交易所主页面'},
    UITradeDlg:{filePath:"prefab/trade/UITradeDlg",name:"UITradeDlg",zOrder: null,tooltip:'交易所交易页面'},
    UITradePop:{filePath:"prefab/trade/UITradePop",name:"UITradePop",zOrder: null,tooltip:'交易所确定交易页面'},
    UITradeNote:{filePath:"prefab/trade/UITradeNote",name:"UITradeNote",zOrder: null,tooltip:'交易所确定交易页面'},
    UITradeKLine:{filePath:"prefab/trade/UITradeKLine",name:"UITradeKLine",zOrder: null,tooltip:'交易所K线图'},
    UIRank:{filePath:"prefab/rank/UIRank",name:"UIRank",zOrder: null,tooltip:'排行榜'},

    UIUnionRank:{filePath:"prefab/union/UIUnionRank",name:"UIUnionRank",zOrder: null,tooltip:'商会排行榜'},
    UIUnionApply:{filePath:"prefab/union/UIUnionApply",name:"UIUnionApply",zOrder: null,tooltip:'申请加入商会'},
    UIUnionTask:{filePath:"prefab/union/UIUnionTask",name:"UIUnionTask",zOrder: null,tooltip:'商会任务'},
    UIUnion:{filePath:"prefab/union/UIUnion",name:"UIUnion",zOrder: null,tooltip:'商会页面'},
    UIUnionNews:{filePath:"prefab/union/UIUnionNews",name:"UIUnionNews",zOrder: null,tooltip:'商会信息页面'},
    UIUnionOther:{filePath:"prefab/union/UIUnionOther",name:"UIUnionOther",zOrder: null,tooltip:'好友商会页面'},
    UIUnionFightOver:{filePath:"prefab/union/UIUnionFightOver",name:"UIUnionFightOver",zOrder: null,tooltip:'商会战斗结束界面'},
    UIUnionFight:{filePath:"prefab/union/UIUnionFight",name:"UIUnionFight",zOrder: null,tooltip:'商会战斗抢矿界面'},
    UICatchGoodsNet:{filePath:"prefab/minigame/UICatchGoodsNet",name:"UICatchGoodsNet",zOrder: null,tooltip:'商会多人pk界面'},



    UIUnionLevelUp:{filePath:"prefab/common/UIUnionLevelUp",name:"UIUnionLevelUp",zOrder: global.Enum.PanelZOrder.PanelZ_DIALOG,tooltip:'商会升级界面'},



    UIUnionMember:{filePath:"prefab/union/UIUnionMember",name:"UIUnionMember",zOrder: null,tooltip:'商会成员页面'},
    UICatchGoods:{filePath:"prefab/minigame/UICatchGoods",name:"UICatchGoods",zOrder: null,tooltip:'小游戏接鸡蛋'},
    UIDailyReward:{filePath:"prefab/mainscene/UIDailyReward",name:"UIDailyReward",zOrder: null,tooltip:'每日奖励'},
    UIGMCode:{filePath:"prefab/common/UIGMCode",name:"UIGMCode",zOrder: null,tooltip:'GmCode页面'},

    UIWorldMap:{filePath:"prefab/worldmap/UIWorldMap",name:"UIWorldMap",zOrder: global.Enum.PanelZOrder.PanelZ_DONW_UI,tooltip:'精灵'},
   
    UITownNpcLead:{filePath:"prefab/npctown/UITownNpcLead",name:"UITownNpcLead",zOrder: global.Enum.PanelZOrder.PanelZ_TASK_SPEEK,tooltip:'游戏主角回复'},
    UITownNpcTalk:{filePath:"prefab/npctown/UITownNpcTalk",name:"UITownNpcTalk",zOrder: global.Enum.PanelZOrder.PanelZ_TASK_SPEEK,tooltip:'对诗第一层级'},
    UITownPoetry:{filePath:"prefab/npctown/UITownPoetry",name:"UITownPoetry",zOrder: global.Enum.PanelZOrder.PanelZ_TASK_SPEEK,tooltip:'对诗三选项'},
    UITownThings:{filePath:"prefab/npctown/UITownThings",name:"UITownThings",zOrder: global.Enum.PanelZOrder.PanelZ_TASK_SPEEK,tooltip:'对诗两选项'},
    UIRacing:{filePath:"prefab/npctown/UIRacing",name:"UIRacing",zOrder: global.Enum.PanelZOrder.PanelZ_TASK_SPEEK,tooltip:'赛马'},
    UIRobbery:{filePath:"prefab/npctown/UIRobbery",name:"UIRobbery",zOrder: global.Enum.PanelZOrder.PanelZ_TASK_SPEEK,tooltip:'小混混打劫'},

    UIFishRoom:{filePath:"prefab/mainscene/UIFishRoom",name:"UIFishRoom",zOrder: null,tooltip:'海底世界'},
    UIAnimalPools:{filePath:"prefab/mainscene/UIAnimalPools",name:"UIAnimalPools",zOrder: null,tooltip:'动物园'},
    UISummon:{filePath:"prefab/summon/UISummon",name:"UISummon",zOrder: global.Enum.PanelZOrder.PanelZ_DONW_UI+1,tooltip:'精灵界面'},
    UIDemoReplace:{filePath:"prefab/summon/UIDemoReplace",name:"UIDemoReplace",zOrder: null,tooltip:'精灵替换'},
    summonAnima:{filePath:"prefab/summon/summonAnima",name:"summonAnima",zOrder: 4,tooltip:'精灵动画'},
    UISummonEvent:{filePath:"prefab/summon/UISummonEvent",name:"UISummonEvent",zOrder: global.Enum.PanelZOrder.PanelZ_DONW_UI+1,tooltip:'精灵剧情'},
    UISummonFoot:{filePath:"prefab/summon/UISummonFoot",name:"UISummonFoot",zOrder: null,tooltip:'精灵批量领取结算页面'},

    DlgFarmAnimal:{filePath:"prefab/dialog/DlgFarmAnimal",name:"DlgFarmAnimal",zOrder: null,tooltip:'陆地动物通用详情弹框'},
    DlgShowFish:{filePath:"prefab/dialog/DlgShowFish",name:"DlgShowFish",zOrder: null,tooltip:'水底动物通用详情弹框'},
    
    UIGuJiEffect:{filePath:"prefab/gujimap/UIGuJiEffect",name:"UIGuJiEffect",zOrder: null,tooltip:'宝藏特效'},
    UIGuJiGetShow:{filePath:"prefab/gujimap/UIGuJiGetShow",name:"UIGuJiGetShow",zOrder: null,tooltip:'宝藏获得掉落'},
    UIGuJiList:{filePath:"prefab/gujimap/UIGuJiList",name:"UIGuJiList",zOrder: null,tooltip:'宝藏进入时的页面'},
    UIGujiFoot:{filePath:"prefab/gujimap/UIGujiFoot",name:"UIGujiFoot",zOrder: null,tooltip:'宝藏探险结算'},
    DlgGuJiDrop:{filePath:"prefab/dialog/DlgGuJiDrop",name:"DlgGuJiDrop",zOrder: null,tooltip:'宝藏掉落'},
    DlgTreasureDrop:{filePath:"prefab/dialog/DlgTreasureDrop",name:"DlgTreasureDrop",zOrder: null,tooltip:'大宝藏掉落'},

    DlgExtendMap:{filePath:"prefab/dialog/DlgExtendMap",name:"DlgExtendMap",zOrder: null,tooltip:'开地任务'},
    DlgAddPower:{filePath:"prefab/dialog/DlgAddPower",name:"DlgAddPower",zOrder: null,tooltip:'补充体力'},
    DlgOver:{filePath:"prefab/dialog/DlgOver",name:"DlgOver",zOrder: null,tooltip:'小游戏结算'},
    DlgAdult:{filePath:"prefab/dialog/DlgAdult",name:"DlgAdult",zOrder: global.Enum.PanelZOrder.PanelZ_TOP,tooltip:'防沉迷'},
    DlgAdultConfirm:{filePath:"prefab/dialog/DlgAdultConfirm",name:"DlgAdultConfirm",zOrder: global.Enum.PanelZOrder.PanelZ_TOP,tooltip:'防沉迷确定'},
    DlgAdultTip:{filePath:"prefab/dialog/DlgAdultTip",name:"DlgAdultTip",zOrder: global.Enum.PanelZOrder.PanelZ_TOP,tooltip:'防沉迷提示'},
    DlgCaculate:{filePath:"prefab/dialog/DlgCaculate",name:"DlgCaculate",zOrder:null,tooltip:'展会收入'},
    DlgDigItem:{filePath:"prefab/dialog/DlgDigItem",name:"DlgDigItem",zOrder:null,tooltip:'矿石介绍'},
    DlgItemDrop:{filePath:"prefab/dialog/DlgItemDrop",name:"DlgItemDrop",zOrder:null,tooltip:'单个物品'},
    DlgItemDec:{filePath:"prefab/dialog/DlgItemDec",name:"DlgItemDec",zOrder:global.Enum.PanelZOrder.PanelZ_TOP,tooltip:'物品介绍'},
    DlgUpdate:{filePath:"prefab/dialog/DlgUpdate",name:"DlgUpdate",zOrder:global.Enum.PanelZOrder.PanelZ_TOP,tooltip:'官网'},












}