var _root = require('protobuf').newBuilder({})['import']({
    "package": "Protocols",
    "syntax": "proto2",
    "options": {
        "java_multiple_files": true,
        "java_package": "com.dj.protobuf.reason"
    },
    "messages": [
        {
            "name": "AttrChangeReason",
            "syntax": "proto2",
            "fields": [
                {
                    "rule": "optional",
                    "type": "EAttrChangeReason",
                    "name": "reason",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "para1",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "para2",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "para3",
                    "id": 4
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "para4",
                    "id": 5
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "para5",
                    "id": 6
                },
                {
                    "rule": "optional",
                    "type": "int32",
                    "name": "IntPara1",
                    "id": 7
                }
            ]
        }
    ],
    "enums": [
        {
            "name": "EAttrChangeReason",
            "syntax": "proto2",
            "values": [
                {
                    "name": "None",
                    "id": 0
                },
                {
                    "name": "GmSet",
                    "id": 1
                },
                {
                    "name": "Achievement",
                    "id": 2
                },
                {
                    "name": "ActivityAccRecharge",
                    "id": 3
                },
                {
                    "name": "ActivityFirstRecharge",
                    "id": 4
                },
                {
                    "name": "ActivityGradeUpGift",
                    "id": 5
                },
                {
                    "name": "ActivityLevelReward",
                    "id": 6
                },
                {
                    "name": "ActivityOnlineReward",
                    "id": 7
                },
                {
                    "name": "ActivityVipGiftBag",
                    "id": 8
                },
                {
                    "name": "BoyFriend",
                    "id": 9
                },
                {
                    "name": "Character",
                    "id": 10
                },
                {
                    "name": "Guild",
                    "id": 11
                },
                {
                    "name": "Manufacture",
                    "id": 12
                },
                {
                    "name": "Quest",
                    "id": 13
                },
                {
                    "name": "FashionMatch",
                    "id": 14
                },
                {
                    "name": "Item",
                    "id": 15
                },
                {
                    "name": "Level",
                    "id": 16
                },
                {
                    "name": "Chat",
                    "id": 17
                },
                {
                    "name": "Competition",
                    "id": 18
                },
                {
                    "name": "ExpandValuePurchase",
                    "id": 19
                },
                {
                    "name": "Friend",
                    "id": 20
                },
                {
                    "name": "SignIn",
                    "id": 21
                },
                {
                    "name": "TreasureBox",
                    "id": 22
                },
                {
                    "name": "Mail",
                    "id": 23
                },
                {
                    "name": "Pay",
                    "id": 24
                },
                {
                    "name": "Mall",
                    "id": 25
                },
                {
                    "name": "Scripts",
                    "id": 26
                },
                {
                    "name": "ActivitySevenDayLogin",
                    "id": 27
                },
                {
                    "name": "Activity",
                    "id": 28
                },
                {
                    "name": "SocialShare",
                    "id": 29
                },
                {
                    "name": "Quiz",
                    "id": 30
                },
                {
                    "name": "Level2",
                    "id": 31
                },
                {
                    "name": "GiftBagSell",
                    "id": 32
                },
                {
                    "name": "DiamondReturn",
                    "id": 33
                },
                {
                    "name": "Scene",
                    "id": 34
                },
                {
                    "name": "GiftBag",
                    "id": 35
                },
                {
                    "name": "DoubleSeventh",
                    "id": 36
                },
                {
                    "name": "ActivityExchange",
                    "id": 37
                },
                {
                    "name": "LimitTimeRank",
                    "id": 38
                },
                {
                    "name": "Task",
                    "id": 39
                }
            ]
        }
    ],
    "isNamespace": true
});
module.exports = _root;