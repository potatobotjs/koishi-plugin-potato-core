"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.select = exports.rand = exports.qrcode = void 0;
const koishi_1 = require("koishi");
const other_1 = require("./utils/other");
async function qrcode(_, platform, ctx, config) {
    if (platform == 'wechat') {
        _.session.send((0, koishi_1.segment)('image', { url: `file:///${__dirname}/assets/qrcode/wechat.png` }));
    }
    if (platform == 'alipay') {
        _.session.send((0, koishi_1.segment)('image', { url: `file:///${__dirname}/assets/qrcode/alipay.png` }));
    }
}
exports.qrcode = qrcode;
async function rand(_, max, min) {
    _.session.send((0, other_1.genRandom)(max, min).toString());
}
exports.rand = rand;
async function select(_, list) {
    if (list.length <= 1) {
        _.session.send(" ▨ PBR | 至少需要提供两个选项。");
    }
    else {
        var randItem = list[(0, other_1.genRandom)(list.length - 1, 0)];
        randItem = randItem.replace("我", "你");
        if (list.includes("土豆") || list.includes("马铃薯")) {
            _.session.send("支持土豆喵，支持土豆谢谢喵");
        }
        else {
            _.session.send(`建议选择 ${randItem} 。`);
        }
    }
}
exports.select = select;
