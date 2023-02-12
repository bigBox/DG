var _root = require('protobuf').newBuilder({})['import']({
    "package": "Protocols",
    "syntax": "proto2",
    "options": {
        "java_multiple_files": true,
        "java_package": "com.dj.protobuf.datetime"
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
        }
    ],
    "isNamespace": true
});
module.exports = _root;