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
exports.writeData = exports.getData = exports.getText = void 0;
const fs = __importStar(require("fs-extra"));
//读取text目录下的文件文本内容
function getText(name) {
    return fs.readFileSync(`${__dirname}/text/${name}.txt`).toString().trim();
}
exports.getText = getText;
//读取data目录下的文件文本内容
function getData(name) {
    return fs.readFileSync(`${__dirname}/data/${name}.txt`).toString().trim();
}
exports.getData = getData;
//在data目录下的文件文本内容行末追加内容
function writeData(name, text) {
    let o = fs.readFileSync(`${__dirname}/data/${name}.txt`).toString().trim();
    let w = o + "\n" + text;
    fs.writeFileSync(`${__dirname}/data/${name}.txt`, w);
}
exports.writeData = writeData;
