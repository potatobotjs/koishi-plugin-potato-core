"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.add = exports.what2eat_10x = exports.what2eat = void 0;
const pbrFile = __importStar(require("./file"));
const other_1 = require("./utils/other");
async function what2eat(_) {
    let array = pbrFile.getData('meal_list').split('\n');
    let meal = array[(0, other_1.genRandom)(array.length - 1, 0)].split(':')[0].trim();
    _.session.send(`吃${meal}怎么样？`);
}
exports.what2eat = what2eat;
async function what2eat_10x(_) {
    // let array = pbrFile.getData('meal_list').split('\n')
    // let meal = array[genRandom(array.length - 1, 0)].split(':')[0].trim()
    // _.session.send(`吃${meal}怎么样？`)
}
exports.what2eat_10x = what2eat_10x;
async function add(_, m) {
    let code = 0;
    let array = pbrFile.getData('meal_list').split('\n');
    if (typeof (m) === "number") {
        code = 2;
    }
    m = m.toString();
    for (let i = 0; i < array.length; i++) {
        if (array[i].split(':')[0] == m) {
            code = 1;
        }
    }
    if (m.indexOf("CQ:") != -1) {
        code = 2;
    }
    if (code == 0) {
        pbrFile.writeData('meal_list', `${m}:${_.session.userId}`);
        _.session.send("添加完成。");
        return;
    }
    switch (code) {
        case 1:
            _.session.send("条目已存在。");
            break;
        case 2:
            _.session.send("请不要试图添加一些奇怪的东西。");
            break;
    }
}
exports.add = add;
