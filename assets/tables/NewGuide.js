module.exports = new Array(
	{ID:1, guideKey:'FirstTalk', taskID:1, taskStage:0, isFinish:0, guideTip:'首次对话', scene:'MainScene', centerBuild:0, UI:'', arg:'0', talkKey:'GoTask', talkIdx:'1_1', talkToNext:1},
	{ID:2, guideKey:'ClickTask', taskID:1, taskStage:0, isFinish:0, guideTip:'点击任务建筑', scene:'MainScene', centerBuild:7013, UI:'', arg:'', talkKey:'GoTask', talkIdx:'2_2', talkToNext:0},
	{ID:3, guideKey:'AcceptGuJi', taskID:1, taskStage:0, isFinish:0, guideTip:'接取古迹任务', scene:'MainScene', centerBuild:7013, UI:'', arg:'', talkKey:'', talkIdx:'', talkToNext:0},
	{ID:4, guideKey:'ClickTaskIcon', taskID:1, taskStage:1, isFinish:0, guideTip:'点击任务提示', scene:'MainScene', centerBuild:7013, UI:'UIGuideTask', arg:'', talkKey:'AccpetTask', talkIdx:'1_1', talkToNext:0},
	{ID:5, guideKey:'ShowGuider', taskID:1, taskStage:2, isFinish:0, guideTip:'显示助手', scene:'MainScene', centerBuild:7013, UI:'UIGuideTask', arg:'', talkKey:'Guider', talkIdx:'1_1', talkToNext:1},
	{ID:6, guideKey:'CloseTask', taskID:1, taskStage:3, isFinish:0, guideTip:'关闭任务', scene:'MainScene', centerBuild:7013, UI:'UIGuideTask', arg:'', talkKey:'Guider', talkIdx:'2_2', talkToNext:0},
	{ID:7, guideKey:'ClickSet', taskID:1, taskStage:4, isFinish:0, guideTip:'点击设置', scene:'MainScene', centerBuild:0, UI:'UIMainScene', arg:'', talkKey:'ClickGuJi', talkIdx:'1_1', talkToNext:0},
	{ID:8, guideKey:'ClickGuJiMap', taskID:1, taskStage:5, isFinish:0, guideTip:'点击进入古迹', scene:'MainScene', centerBuild:7031, UI:'UIMainScene', arg:'', talkKey:'ClickGuJi', talkIdx:'2_2', talkToNext:0},
	{ID:9, guideKey:'ClickGuJiHelp', taskID:1, taskStage:6, isFinish:0, guideTip:'点击古迹帮助', scene:'GuJiScene', centerBuild:7031, UI:'', arg:'', talkKey:'ClickGuJiHelp', talkIdx:'1_1', talkToNext:0},
	{ID:10, guideKey:'LookHelp1', taskID:1, taskStage:7, isFinish:0, guideTip:'点击古迹帮助1', scene:'GuJiScene', centerBuild:7031, UI:'UIGuJi', arg:'0', talkKey:'', talkIdx:'', talkToNext:0},
	{ID:11, guideKey:'FirstHelpTalk', taskID:1, taskStage:8, isFinish:0, guideTip:'第一次帮助对话', scene:'GuJiScene', centerBuild:7031, UI:'UIHelpList', arg:'', talkKey:'', talkIdx:'', talkToNext:0},
	{ID:12, guideKey:'CloseHelp1', taskID:1, taskStage:9, isFinish:0, guideTip:'关闭帮助1', scene:'GuJiScene', centerBuild:7031, UI:'', arg:'0', talkKey:'', talkIdx:'', talkToNext:0},
	{ID:13, guideKey:'LookHelp2', taskID:1, taskStage:10, isFinish:0, guideTip:'点击古迹帮助2', scene:'GuJiScene', centerBuild:7031, UI:'UIHelpList', arg:'0', talkKey:'', talkIdx:'', talkToNext:0},
	{ID:14, guideKey:'CloseHelp2', taskID:1, taskStage:11, isFinish:0, guideTip:'关闭帮助2', scene:'GuJiScene', centerBuild:7031, UI:'', arg:'0', talkKey:'', talkIdx:'', talkToNext:0},
	{ID:15, guideKey:'CloseHelpTalk', taskID:1, taskStage:12, isFinish:0, guideTip:'关闭古迹帮助对话', scene:'GuJiScene', centerBuild:7031, UI:'', arg:'0', talkKey:'ClickGuJiHelp', talkIdx:'2_2', talkToNext:1},
	{ID:16, guideKey:'CloseGuJiHelp', taskID:1, taskStage:13, isFinish:0, guideTip:'关闭古迹帮助', scene:'GuJiScene', centerBuild:7031, UI:'UIHelpList', arg:'0', talkKey:'ClickGuJiHelp', talkIdx:'3_3', talkToNext:0},
	{ID:17, guideKey:'FindPaint', taskID:1, taskStage:14, isFinish:0, guideTip:'开始寻宝对话', scene:'GuJiScene', centerBuild:7031, UI:'', arg:'75', talkKey:'GoGuJi', talkIdx:'1_1', talkToNext:0},
	{ID:18, guideKey:'GuJiBackTalk', taskID:1, taskStage:15, isFinish:0, guideTip:'返回主页对话', scene:'GuJiScene', centerBuild:7031, UI:'', arg:'', talkKey:'GetGuJiItem', talkIdx:'1_1', talkToNext:1},
	{ID:19, guideKey:'GoGuJiBack', taskID:1, taskStage:16, isFinish:0, guideTip:'返回主页', scene:'GuJiScene', centerBuild:7031, UI:'UIGuJi', arg:'', talkKey:'GetGuJiItem', talkIdx:'2_2', talkToNext:0},
	{ID:20, guideKey:'BackToTask', taskID:1, taskStage:17, isFinish:0, guideTip:'点击任务建筑', scene:'MainScene', centerBuild:7013, UI:'', arg:'', talkKey:'FinishTask', talkIdx:'1_1', talkToNext:0},
	{ID:21, guideKey:'FinishGuJi', taskID:1, taskStage:18, isFinish:1, guideTip:'完成古迹任务', scene:'MainScene', centerBuild:0, UI:'', arg:'', talkKey:'', talkIdx:'', talkToNext:0},
	{ID:22, guideKey:'BackToMain', taskID:1, taskStage:19, isFinish:0, guideTip:'返回主页', scene:'MainScene', centerBuild:0, UI:'UIGuideTask', arg:'', talkKey:'FinishTask', talkIdx:'2_2', talkToNext:0},
	{ID:23, guideKey:'FinishTalk', taskID:1, taskStage:20, isFinish:0, guideTip:'结束引语', scene:'MainScene', centerBuild:0, UI:'', arg:'', talkKey:'FinishTalk', talkIdx:'1_2', talkToNext:1},
	{ID:24, guideKey:'GoGrowTalk', taskID:1, taskStage:21, isFinish:0, guideTip:'去点成长任务', scene:'MainScene', centerBuild:7013, UI:'', arg:'', talkKey:'FinishTalk', talkIdx:'3_4', talkToNext:1},
	{ID:25, guideKey:'EndTip', taskID:1, taskStage:22, isFinish:0, guideTip:'点任务帮助', scene:'MainScene', centerBuild:0, UI:'UITask', arg:'', talkKey:'GrowTask', talkIdx:'1_2', talkToNext:1},
	{ID:26, guideKey:'EndGuide', taskID:2, taskStage:23, isFinish:0, guideTip:'结束对话', scene:'MainScene', centerBuild:0, UI:'', arg:'', talkKey:'', talkIdx:'', talkToNext:0},
);