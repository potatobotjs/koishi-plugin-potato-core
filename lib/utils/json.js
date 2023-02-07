"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONLength = void 0;
// 取 json 长度
function JSONLength(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key))
            size++;
    }
    return size;
}
exports.JSONLength = JSONLength;
;
