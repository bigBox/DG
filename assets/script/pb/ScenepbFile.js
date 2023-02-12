var _root = require('protobuf').newBuilder({})['import']({
    "package": null,
    "syntax": "proto2",
    "options": {
        "java_package": "com.dj.protobuf"
    },
    "messages": [
        {
            "name": "Protocols",
            "fields": [],
            "syntax": "proto2",
            "options": {
                "java_multiple_files": true,
                "java_package": "com.dj.protobuf.scene"
            },
            "messages": [
                {
                    "name": "DateTime",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "sint64",
                            "name": "value",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "TimeSpanScale",
                            "name": "scale",
                            "id": 2,
                            "options": {
                                "default": "DAYS"
                            }
                        }
                    ],
                    "enums": [
                        {
                            "name": "TimeSpanScale",
                            "syntax": "proto2",
                            "values": [
                                {
                                    "name": "DAYS",
                                    "id": 0
                                },
                                {
                                    "name": "HOURS",
                                    "id": 1
                                },
                                {
                                    "name": "MINUTES",
                                    "id": 2
                                },
                                {
                                    "name": "SECONDS",
                                    "id": 3
                                },
                                {
                                    "name": "MILLISECONDS",
                                    "id": 4
                                },
                                {
                                    "name": "TICKS",
                                    "id": 5
                                },
                                {
                                    "name": "MINMAX",
                                    "id": 15
                                }
                            ]
                        }
                    ]
                },
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
                },
                {
                    "name": "SceneBriefInfo",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "name",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "level",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "themeId",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "curPlayerNum",
                            "id": 6
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "maxPlayerNum",
                            "id": 7
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "isNeedPassword",
                            "id": 8
                        }
                    ]
                },
                {
                    "name": "OtomeVector3D",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "x",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "y",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "z",
                            "id": 3
                        }
                    ]
                },
                {
                    "name": "SceneRoleSkillStatus",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "skillId",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "srcRoleId",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "targetRoleId",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "ESceneUseSkillType",
                            "name": "type",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "type": "OtomeVector3D",
                            "name": "srcRoleDirection",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "OtomeVector3D",
                            "name": "targetRoleDirection",
                            "id": 6
                        }
                    ]
                },
                {
                    "name": "SceneRoleInfo",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "BaseRoleInfo",
                            "name": "roleBaseInfo",
                            "id": 1
                        },
                        {
                            "rule": "repeated",
                            "type": "int32",
                            "name": "SceneClothes",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "ESceneRolePost",
                            "name": "post",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "DateTime",
                            "name": "attendTime",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "type": "OtomeVector3D",
                            "name": "position",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "OtomeVector3D",
                            "name": "direction",
                            "id": 6
                        },
                        {
                            "rule": "optional",
                            "type": "SceneRoleSkillStatus",
                            "name": "skillStatus",
                            "id": 7
                        },
                        {
                            "rule": "optional",
                            "type": "DateTime",
                            "name": "doubleExpire",
                            "id": 8
                        }
                    ]
                },
                {
                    "name": "SceneDetailInfo",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "SceneBriefInfo",
                            "name": "briefInfo",
                            "id": 1
                        },
                        {
                            "rule": "repeated",
                            "type": "SceneRoleInfo",
                            "name": "attenders",
                            "id": 2
                        }
                    ]
                },
                {
                    "name": "ListSceneReq",
                    "syntax": "proto2",
                    "fields": []
                },
                {
                    "name": "ListSceneRsp",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "ErrorID",
                            "name": "errorID",
                            "id": 1
                        },
                        {
                            "rule": "repeated",
                            "type": "SceneBriefInfo",
                            "name": "personalScenes",
                            "id": 2
                        }
                    ]
                },
                {
                    "name": "SceneBriefInfoNtf",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "repeated",
                            "type": "SceneBriefInfo",
                            "name": "scenes",
                            "id": 1
                        }
                    ]
                },
                {
                    "name": "JoinSceneReq",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "password",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "ESceneRebornPos",
                            "name": "pos",
                            "id": 3
                        }
                    ]
                },
                {
                    "name": "JoinSceneRsp",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "ErrorID",
                            "name": "errorID",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "JoinSceneReq",
                            "name": "req",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "SceneDetailInfo",
                            "name": "detailInfo",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "firstFlag",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "resetCountDown",
                            "id": 5
                        }
                    ]
                },
                {
                    "name": "JoinSceneNtf",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "SceneRoleInfo",
                            "name": "joinRoleInfo",
                            "id": 1
                        }
                    ]
                },
                {
                    "name": "SceneDetailInfoNtf",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "SceneDetailInfo",
                            "name": "detailInfo",
                            "id": 3
                        }
                    ]
                },
                {
                    "name": "LeaveSceneReq",
                    "syntax": "proto2",
                    "fields": []
                },
                {
                    "name": "LeaveSceneRsp",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "ErrorID",
                            "name": "errorID",
                            "id": 1
                        }
                    ]
                },
                {
                    "name": "LeaveSceneNtf",
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
                            "type": "uint64",
                            "name": "sceneId",
                            "id": 2
                        }
                    ]
                },
                {
                    "name": "SceneMovementReq",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "ESceneMoveType",
                            "name": "moveType",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "OtomeVector3D",
                            "name": "pos",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "float",
                            "name": "speed",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "OtomeVector3D",
                            "name": "direction",
                            "id": 4
                        }
                    ]
                },
                {
                    "name": "SceneMovementRsp",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "ErrorID",
                            "name": "errorID",
                            "id": 1
                        }
                    ]
                },
                {
                    "name": "SceneMovementNtf",
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
                            "type": "ESceneMoveType",
                            "name": "moveType",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "OtomeVector3D",
                            "name": "pos",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "float",
                            "name": "speed",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "type": "OtomeVector3D",
                            "name": "direction",
                            "id": 5
                        }
                    ]
                },
                {
                    "name": "SceneUseSkillReq",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "skillId",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "targetRoleId",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "ESceneUseSkillType",
                            "name": "type",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "OtomeVector3D",
                            "name": "srcRoleDirection",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "type": "OtomeVector3D",
                            "name": "targetRoleDirection",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "skillCount",
                            "id": 6
                        },
                        {
                            "rule": "optional",
                            "type": "OtomeVector3D",
                            "name": "targetPos",
                            "id": 7
                        }
                    ]
                },
                {
                    "name": "SceneUseSkillRsp",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "ErrorID",
                            "name": "errorID",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "SceneUseSkillReq",
                            "name": "req",
                            "id": 2
                        }
                    ]
                },
                {
                    "name": "SceneUseSkillNtf",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "skillId",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "targetRoleId",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "srcRoleId",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "OtomeVector3D",
                            "name": "targetRolePos",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "type": "ESceneUseSkillType",
                            "name": "type",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "OtomeVector3D",
                            "name": "scrRolePos",
                            "id": 6
                        },
                        {
                            "rule": "optional",
                            "type": "OtomeVector3D",
                            "name": "srcRoleDirection",
                            "id": 7
                        },
                        {
                            "rule": "optional",
                            "type": "OtomeVector3D",
                            "name": "targetRoleDirection",
                            "id": 8
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "skillCount",
                            "id": 9
                        },
                        {
                            "rule": "optional",
                            "type": "OtomeVector3D",
                            "name": "targetPos",
                            "id": 10
                        }
                    ]
                },
                {
                    "name": "SceneCell",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "x",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "y",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "ESceneCellType",
                            "name": "type",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "stage",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "type": "bool",
                            "name": "isShow",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "robId",
                            "id": 6
                        }
                    ]
                },
                {
                    "name": "SceneMapNtf",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "repeated",
                            "type": "SceneCell",
                            "name": "cells",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "SceneUpdateType",
                            "name": "type",
                            "id": 2
                        }
                    ]
                },
                {
                    "name": "ScenePosReq",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "roleId",
                            "id": 1
                        }
                    ]
                },
                {
                    "name": "ScenePosRsp",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "ErrorID",
                            "name": "errorID",
                            "id": 1
                        },
                        {
                            "rule": "map",
                            "type": "OtomeVector3D",
                            "keytype": "int32",
                            "name": "pos",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "ScenePosReq",
                            "name": "req",
                            "id": 3
                        }
                    ]
                },
                {
                    "name": "ScenePosUpdateReq",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "x",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "y",
                            "id": 3
                        }
                    ]
                },
                {
                    "name": "ScenePosUpdateRsp",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "ErrorID",
                            "name": "errorID",
                            "id": 1
                        }
                    ]
                },
                {
                    "name": "CheckSceneReq",
                    "syntax": "proto2",
                    "fields": []
                },
                {
                    "name": "CheckSceneRsp",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "ErrorID",
                            "name": "errorID",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "SceneDetailInfo",
                            "name": "sceneDetailInfo",
                            "id": 2
                        },
                        {
                            "rule": "repeated",
                            "type": "SceneCell",
                            "name": "cells",
                            "id": 3
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
                },
                {
                    "name": "ESceneMoveType",
                    "syntax": "proto2",
                    "values": [
                        {
                            "name": "Mov_Start",
                            "id": 1
                        },
                        {
                            "name": "Mov_Stop",
                            "id": 2
                        },
                        {
                            "name": "Mov_Sync",
                            "id": 3
                        }
                    ]
                },
                {
                    "name": "ESceneRolePost",
                    "syntax": "proto2",
                    "values": [
                        {
                            "name": "Owner",
                            "id": 1
                        },
                        {
                            "name": "Guest",
                            "id": 2
                        }
                    ]
                },
                {
                    "name": "ESceneUseSkillType",
                    "syntax": "proto2",
                    "values": [
                        {
                            "name": "Skill_Start",
                            "id": 1
                        },
                        {
                            "name": "Skill_Cancel",
                            "id": 2
                        }
                    ]
                },
                {
                    "name": "ESceneRebornPos",
                    "syntax": "proto2",
                    "values": [
                        {
                            "name": "RebornPos",
                            "id": 0
                        },
                        {
                            "name": "RebornPos1",
                            "id": 109001
                        },
                        {
                            "name": "RebornPos2",
                            "id": 109002
                        },
                        {
                            "name": "RebornPos3",
                            "id": 109003
                        },
                        {
                            "name": "RebornPos4",
                            "id": 109004
                        },
                        {
                            "name": "RebornPos5",
                            "id": 109005
                        },
                        {
                            "name": "RebornPos6",
                            "id": 109006
                        }
                    ]
                },
                {
                    "name": "ESceneCellType",
                    "syntax": "proto2",
                    "values": [
                        {
                            "name": "Empty",
                            "id": -1
                        },
                        {
                            "name": "Unknown",
                            "id": 0
                        },
                        {
                            "name": "Coal",
                            "id": 101001
                        },
                        {
                            "name": "Iron",
                            "id": 101002
                        },
                        {
                            "name": "Silver_Mine",
                            "id": 101003
                        },
                        {
                            "name": "Gold_Mine",
                            "id": 101004
                        },
                        {
                            "name": "Soil",
                            "id": 101005
                        },
                        {
                            "name": "Stone",
                            "id": 101006
                        },
                        {
                            "name": "Element_1",
                            "id": 102001
                        },
                        {
                            "name": "Element_2",
                            "id": 102002
                        },
                        {
                            "name": "Element_3",
                            "id": 102003
                        },
                        {
                            "name": "Element_4",
                            "id": 102004
                        },
                        {
                            "name": "Element_5",
                            "id": 102005
                        },
                        {
                            "name": "Egg_1",
                            "id": 103001
                        },
                        {
                            "name": "Egg_2",
                            "id": 103002
                        },
                        {
                            "name": "Egg_3",
                            "id": 103003
                        },
                        {
                            "name": "Egg_4",
                            "id": 103004
                        },
                        {
                            "name": "friend_right_position1",
                            "id": 109001
                        },
                        {
                            "name": "friend_left_position2",
                            "id": 109002
                        },
                        {
                            "name": "friend_right_position3",
                            "id": 109003
                        },
                        {
                            "name": "friend_left_position4",
                            "id": 109004
                        },
                        {
                            "name": "friend_right_position5",
                            "id": 109005
                        },
                        {
                            "name": "friend_left_position6",
                            "id": 109006
                        },
                        {
                            "name": "Map_Piece",
                            "id": 104001
                        },
                        {
                            "name": "Rob_Diamond",
                            "id": 105001
                        }
                    ]
                }
            ],
            "isNamespace": true
        }
    ],
    "enums": [
        {
            "name": "ErrorID",
            "syntax": "proto2",
            "values": [
                {
                    "name": "OK",
                    "id": 0
                },
                {
                    "name": "SYSTEM_ERROR",
                    "id": -1
                },
                {
                    "name": "SYSTEM_PARAM_ERROR",
                    "id": -2
                },
                {
                    "name": "SYSTEM_INTERNAL_ERROR",
                    "id": -3
                },
                {
                    "name": "SYSTEM_REDIS_ERROR",
                    "id": -4
                },
                {
                    "name": "SYSTEM_MYSQL_ERROR",
                    "id": -5
                },
                {
                    "name": "SYSTEM_CONFIG_NOT_EXISTS",
                    "id": -6
                },
                {
                    "name": "SYSTEM_SAVE_ERROR",
                    "id": -7
                },
                {
                    "name": "SYSTEM_AREA_SERVER_NOT_START",
                    "id": -8
                },
                {
                    "name": "SYSTEM_REQUEST_ERROR",
                    "id": -9
                },
                {
                    "name": "SYSTEM_LOCK_FAILED",
                    "id": -10
                },
                {
                    "name": "SYSTEM_GET_MODEL_ERROR",
                    "id": -11
                },
                {
                    "name": "SYSTEM_SERVICE_DOWN",
                    "id": -12
                },
                {
                    "name": "COMMON_DATA_ERROR",
                    "id": 1
                },
                {
                    "name": "COMMON_CONFIG_ERROR",
                    "id": 2
                },
                {
                    "name": "COMMON_OTHER_ERROR",
                    "id": 3
                },
                {
                    "name": "COMMON_PARAM_ERROR",
                    "id": 4
                },
                {
                    "name": "COMMON_COOLING_DOWN",
                    "id": 5
                },
                {
                    "name": "COMMON_PLAYER_NOT_FOUND",
                    "id": 100
                },
                {
                    "name": "COMMON_PLAYER_GOLD_LESS",
                    "id": 101
                },
                {
                    "name": "COMMON_PLAYER_DIAMOND_LESS",
                    "id": 102
                },
                {
                    "name": "COMMON_PLAYER_ITEM_LESS",
                    "id": 103
                },
                {
                    "name": "COMMON_PLAYER_LEVEL_LESS",
                    "id": 104
                },
                {
                    "name": "COMMON_PLAYER_STAMINA_LESS",
                    "id": 105
                },
                {
                    "name": "COMMON_PLAYER_ACTION_LESS",
                    "id": 106
                },
                {
                    "name": "COMMON_PLAYER_ECOLOGY_LESS",
                    "id": 107
                },
                {
                    "name": "COMMON_PLAYER_GUILD_SCORE_LESS",
                    "id": 108
                },
                {
                    "name": "CHANNEL_NOT_EXITS",
                    "id": 10001
                },
                {
                    "name": "ACCOUNT_IS_EXITS",
                    "id": 10002
                },
                {
                    "name": "ACCOUNT_PASS_ERROR",
                    "id": 10003
                },
                {
                    "name": "ACCOUNT_NAME_ILLEGAL",
                    "id": 10004
                },
                {
                    "name": "ACCOUNT_BLOCKED",
                    "id": 10005
                },
                {
                    "name": "PLEASE_RELOGIN",
                    "id": 10006
                },
                {
                    "name": "IDCARD_ERROR",
                    "id": 10007
                },
                {
                    "name": "ADDICTION_LIMIT_TIME",
                    "id": 10008
                },
                {
                    "name": "ADDICTION_LIMIT_WEEK",
                    "id": 10009
                },
                {
                    "name": "ACCOUNT_NAME_ERROR",
                    "id": 10010
                },
                {
                    "name": "IDCARD_IS_EXITS",
                    "id": 10011
                },
                {
                    "name": "IDCARD_IS_TOO_SHORT",
                    "id": 10012
                },
                {
                    "name": "IDCARD_IS_TOO_LONG",
                    "id": 10013
                },
                {
                    "name": "IDCARD_IS_NOT_RIGHT",
                    "id": 10014
                },
                {
                    "name": "NOT_IN_MINE_ROOM",
                    "id": 10020
                },
                {
                    "name": "PLAYER_NAME_LENGTH_SHORT",
                    "id": 10054
                },
                {
                    "name": "PLAYER_NAME_IS_EXITS",
                    "id": 10055
                },
                {
                    "name": "PLAYER_NAME_IS_ILLEGAL",
                    "id": 10056
                },
                {
                    "name": "PLAYER_NAME_IS_TOO_LONG",
                    "id": 10057
                },
                {
                    "name": "PLAYER_SIGNATURE_IS_ILLEGAL",
                    "id": 10060
                },
                {
                    "name": "PLAYER_SIGNATURE_IS_TOO_LONG",
                    "id": 10061
                },
                {
                    "name": "PLAYER_SIGNATURE_IS_TOO_SHORT",
                    "id": 10062
                },
                {
                    "name": "PLAYER_SIGNATURE_IS_NOT_RIGHT",
                    "id": 10063
                },
                {
                    "name": "REWARD_DRAW_NEED_MONTH_CARD",
                    "id": 10070
                },
                {
                    "name": "SEARCH_NOT_SAME_PLAYER",
                    "id": 10071
                },
                {
                    "name": "INPUT_WORD_IS_ILLEGAL",
                    "id": 10072
                },
                {
                    "name": "INPUT_WORD_IS_TOO_LONG",
                    "id": 10073
                },
                {
                    "name": "INPUT_WORD_IS_TOO_SHORT",
                    "id": 10074
                },
                {
                    "name": "INPUT_WORD_IS_NOT_RIGHT",
                    "id": 10075
                },
                {
                    "name": "REWARD_RECEIVED",
                    "id": 10100
                },
                {
                    "name": "TASK_NOT_FINISH",
                    "id": 10101
                },
                {
                    "name": "TASK_NOT_ACCEPT",
                    "id": 10102
                },
                {
                    "name": "TASK_GROWUP_CANNT_TWO_ACCEPT",
                    "id": 10103
                },
                {
                    "name": "TASK_GUILD_CANNT_TWO_ACCEPT",
                    "id": 10104
                },
                {
                    "name": "SUMMON_NOT_EXIT",
                    "id": 10110
                },
                {
                    "name": "SUMMON_SENDING",
                    "id": 10111
                },
                {
                    "name": "SUMMON_NOT",
                    "id": 10112
                },
                {
                    "name": "SUPPORT_LIMIT",
                    "id": 10113
                },
                {
                    "name": "NO_REWARD_CAN_DRAW",
                    "id": 10114
                },
                {
                    "name": "SUPPORT_TODAY_TWICE_LIMIT",
                    "id": 10115
                },
                {
                    "name": "SUMMON_MAIL_LIMIT",
                    "id": 10116
                },
                {
                    "name": "SUMMON_PICKUP_INVEST_REWARD_TIME_LIMIT",
                    "id": 10117
                },
                {
                    "name": "SUMMON_PICKUP_ED_INVEST_REWARD",
                    "id": 10118
                },
                {
                    "name": "SUMMON_EVENT_NOT_HANDLER",
                    "id": 10119
                },
                {
                    "name": "GUILD_NO_JOIN",
                    "id": 10200
                },
                {
                    "name": "GUILD_NAME_HAS_EXIT",
                    "id": 10201
                },
                {
                    "name": "GUILD_HAS_JOIN",
                    "id": 10202
                },
                {
                    "name": "GUILD_NOT_EXIT",
                    "id": 10203
                },
                {
                    "name": "GUILD_POST_NOT_ENOUGH",
                    "id": 10204
                },
                {
                    "name": "GUILD_CANNT_EXIT",
                    "id": 10205
                },
                {
                    "name": "GUILD_BATTLE_ALREADY_SIGNUP",
                    "id": 10206
                },
                {
                    "name": "FARM_NOT_CLEARING",
                    "id": 10300
                },
                {
                    "name": "FARM_NOT_RIPE",
                    "id": 10301
                },
                {
                    "name": "PARK_CELL_HAS_PLANT",
                    "id": 10302
                },
                {
                    "name": "PARK_CELL_NO_PLANT",
                    "id": 10303
                },
                {
                    "name": "PARK_GREEN_NOT_ENOUGH",
                    "id": 10304
                },
                {
                    "name": "PARK_PLACE_LIMIT",
                    "id": 10305
                },
                {
                    "name": "PARK_HONEY_DRAW_CD",
                    "id": 10306
                },
                {
                    "name": "PARK_CANT_PLACE_INVALID",
                    "id": 10307
                },
                {
                    "name": "MEET_EGG_IN_CD",
                    "id": 10350
                },
                {
                    "name": "MEET_ERROR",
                    "id": 10351
                },
                {
                    "name": "BATTLE_ROOM_TIME_STOP",
                    "id": 10352
                },
                {
                    "name": "BATTLE_BUILD_ME_HOLD",
                    "id": 10353
                },
                {
                    "name": "BATTLE_BUILD_IN_GAME",
                    "id": 10354
                },
                {
                    "name": "BATTLE_ROLE_IN_CD",
                    "id": 10355
                },
                {
                    "name": "BATTLE_BUILD_HAS_HOLD",
                    "id": 10356
                },
                {
                    "name": "BATTLE_BUILD_NO_HOLD",
                    "id": 10357
                },
                {
                    "name": "BATTLE_NO_MATCH",
                    "id": 10358
                },
                {
                    "name": "TREASURE_IS_VERIFIED",
                    "id": 10370
                },
                {
                    "name": "VERIFIY_XIAOXUN_TODAY",
                    "id": 10371
                },
                {
                    "name": "VERIFIY_AUTO_TODAY_LIMIT",
                    "id": 10372
                },
                {
                    "name": "VERIFIY_AUTO_LEVEL_LIMIT",
                    "id": 10373
                },
                {
                    "name": "VERIFIY_ONCE_LIMIT",
                    "id": 10374
                },
                {
                    "name": "MINE_QUICK",
                    "id": 10380
                },
                {
                    "name": "COLLECTION_NOT_GATHER_ALL",
                    "id": 10390
                },
                {
                    "name": "BOOK_NO_HAVE",
                    "id": 10400
                },
                {
                    "name": "FRIEND_LEAVE_LITTLE",
                    "id": 10410
                },
                {
                    "name": "PLEASE_COMPLATE_CUR_TASK",
                    "id": 10420
                },
                {
                    "name": "PAY_AMOUNT_OUT_AGE",
                    "id": 10430
                }
            ]
        }
    ],
    "isNamespace": true
});
module.exports = _root;