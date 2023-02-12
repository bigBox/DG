var _root = require('protobuf').newBuilder({})['import']({
    "package": "Protocols",
    "syntax": "proto2",
    "options": {
        "java_multiple_files": true,
        "java_package": "com.dj.protobuf.common"
    },
    "messages": [
        {
            "name": "BaseRoleInfo",
            "syntax": "proto2",
            "fields": [
                {
                    "rule": "optional",
                    "type": "uint64",
                    "name": "roleId",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "roleName",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "int32",
                    "name": "level",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "int32",
                    "name": "experience",
                    "id": 4
                },
                {
                    "rule": "optional",
                    "type": "uint64",
                    "name": "guildId",
                    "id": 5
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "signature",
                    "id": 6
                },
                {
                    "rule": "optional",
                    "type": "int32",
                    "name": "reputation",
                    "id": 7
                },
                {
                    "rule": "optional",
                    "type": "int32",
                    "name": "reputationLevel",
                    "id": 8
                },
                {
                    "rule": "optional",
                    "type": "int32",
                    "name": "showTable",
                    "id": 9
                },
                {
                    "rule": "optional",
                    "type": "int32",
                    "name": "showTableLevel",
                    "id": 10
                },
                {
                    "rule": "optional",
                    "type": "ERoleFiveEle",
                    "name": "fiveEle",
                    "id": 11
                }
            ]
        },
        {
            "name": "RoleInfo",
            "syntax": "proto2",
            "fields": [
                {
                    "rule": "optional",
                    "type": "uint64",
                    "name": "roleId",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "roleName",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "int32",
                    "name": "level",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "int32",
                    "name": "gold",
                    "id": 4
                },
                {
                    "rule": "optional",
                    "type": "int32",
                    "name": "diamond",
                    "id": 5
                },
                {
                    "rule": "optional",
                    "type": "int32",
                    "name": "ecology",
                    "id": 6
                },
                {
                    "rule": "optional",
                    "type": "uint64",
                    "name": "guildId",
                    "id": 7
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "signature",
                    "id": 8
                },
                {
                    "rule": "optional",
                    "type": "int32",
                    "name": "experience",
                    "id": 9
                }
            ]
        }
    ],
    "enums": [
        {
            "name": "FortuneType",
            "syntax": "proto2",
            "values": [
                {
                    "name": "Coin",
                    "id": 1
                },
                {
                    "name": "Diamond",
                    "id": 2
                },
                {
                    "name": "Stamina",
                    "id": 3
                },
                {
                    "name": "Experience",
                    "id": 4
                },
                {
                    "name": "VipExp",
                    "id": 32
                }
            ]
        },
        {
            "name": "ItemType",
            "syntax": "proto2",
            "values": [
                {
                    "name": "Plant",
                    "id": 1
                },
                {
                    "name": "Animal",
                    "id": 2
                },
                {
                    "name": "Food",
                    "id": 3
                },
                {
                    "name": "Industry",
                    "id": 4
                },
                {
                    "name": "Treasure",
                    "id": 5
                },
                {
                    "name": "Item",
                    "id": 6
                },
                {
                    "name": "Baby",
                    "id": 7
                },
                {
                    "name": "Not_Into_Store",
                    "id": 100
                }
            ]
        },
        {
            "name": "ERoleFiveEle",
            "syntax": "proto2",
            "values": [
                {
                    "name": "Gold",
                    "id": 1
                },
                {
                    "name": "wood",
                    "id": 2
                },
                {
                    "name": "water",
                    "id": 3
                },
                {
                    "name": "fire",
                    "id": 4
                },
                {
                    "name": "earth",
                    "id": 5
                }
            ]
        },
        {
            "name": "SceneUpdateType",
            "syntax": "proto2",
            "values": [
                {
                    "name": "Total",
                    "id": 0
                },
                {
                    "name": "Update",
                    "id": 1
                }
            ]
        }
    ],
    "isNamespace": true
});
module.exports = _root;