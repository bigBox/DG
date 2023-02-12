var _root = require('protobuf').newBuilder({})['import']({
    "package": "Protocols",
    "syntax": "proto2",
    "options": {
        "java_multiple_files": true,
        "java_package": "com.dj.protobuf.test"
    },
    "messages": [
        {
            "name": "TestReq",
            "syntax": "proto2",
            "fields": []
        },
        {
            "name": "TestRsp",
            "syntax": "proto2",
            "fields": []
        },
        {
            "name": "TestReq2Logic",
            "syntax": "proto2",
            "fields": [
                {
                    "rule": "optional",
                    "type": "uint64",
                    "name": "roleID",
                    "id": 1
                }
            ]
        },
        {
            "name": "TestRsp2Logic",
            "syntax": "proto2",
            "fields": []
        },
        {
            "name": "Ceshi",
            "syntax": "proto2",
            "fields": [
                {
                    "rule": "repeated",
                    "type": "int32",
                    "name": "SceneClothes",
                    "id": 1
                }
            ]
        }
    ],
    "isNamespace": true
});
module.exports = _root;