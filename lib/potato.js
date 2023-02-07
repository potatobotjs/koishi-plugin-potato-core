"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rank = exports.eat = exports.buy = void 0;
const json_1 = require("./utils/json");
const other_1 = require("./utils/other");
function getPotatoLevel(potatoCount) { return Math.floor(Math.sqrt(potatoCount / 1.5)); }
async function buy(_, p, ctx, config) {
    if (p == undefined) {
        p = "土豆";
    }
    var user = await ctx.database.getUser(_.session.platform, _.session.userId);
    var t = 3600000;
    var ran = (0, other_1.genRandom)(1, config.potatoRandomIntMax);
    if (_.session.userId == "2290377053") {
        t = 3600000 * 24;
        ran = 114;
    }
    if ((Date.now() - user.potatoBuyLastCall) <= t) {
        _.session.send(`还需要等待 ${t / 60000 - Math.floor((Date.now() - user.potatoBuyLastCall) / 60000)} 分钟才可以继续买${p}...`);
    }
    else {
        ctx.database.setUser(_.session.platform, _.session.userId, { potatoCount: user.potatoCount + ran, potatoBuyLastCall: Date.now() });
        _.session.send(`成功买到了 ${ran} 个${p}，你目前共拥有 ${(user.potatoCount + ran).toString()} 个${p}！`);
    }
}
exports.buy = buy;
async function eat(_, p, ctx, config) {
    if (p == undefined) {
        p = "土豆";
    }
    var user = await ctx.database.getUser(_.session.platform, _.session.userId);
    var t = 3600000;
    var ran = (0, other_1.genRandom)(1, config.potatoRandomIntMax);
    if ((Date.now() - user.potatoEatLastCall) <= t) {
        _.session.send(`还需要等待 ${t / 60000 - Math.floor((Date.now() - user.potatoEatLastCall) / 60000)} 分钟才可以继续吃${p}...`);
    }
    else {
        if (user.potatoCount - ran >= 0) {
            ctx.database.setUser(_.session.platform, _.session.userId, { potatoCount: user.potatoCount - ran, potatoEaten: user.potatoEaten + ran, potatoEatLastCall: Date.now() });
            _.session.send(`成功吃了 ${ran} 个${p}，你目前的等级为 Lv.${getPotatoLevel(user.potatoEaten + ran)}`);
        }
        else {
            _.session.send(`你的${p}还不够吃呢...`);
        }
    }
}
exports.eat = eat;
async function rank(_, p, ctx, config) {
    if (p == undefined) {
        p = "土豆";
    }
    var j = await _.session.bot.internal.getGroupMemberList(_.session.guildId);
    var list = [];
    for (var i = 0; i < (0, json_1.JSONLength)(j); i++) {
        var u = await ctx.database.getUser(_.session.platform, j[i].user_id);
        var nickname = (await _.session.bot.internal.getGroupMemberInfo(_.session.guildId, j[i].user_id)).card;
        if (nickname == "") {
            nickname = (await _.session.bot.internal.getGroupMemberInfo(_.session.guildId, j[i].user_id)).nickname;
        }
        if (u != undefined) {
            list.push({ eat: u.potatoEaten, have: u.potatoCount, userid: j[i].user_id, nickname: nickname });
        }
    }
    list.sort((0, other_1.by)("eat"));
    _.session.sendQueued("OK 兄弟们，全体目光向我看齐，看我看我，我宣布个事", 2000);
    var s = `本群${p}食用排行榜：\n--------------------------\n排名 - 昵称 - 等级（食用${p}数）\n`;
    var max = 10;
    if (list.length < 10) {
        max = list.length;
    }
    for (var i = 0; i < max; i++) {
        s += `#${i + 1} - ${list[i].nickname} - Lv.${getPotatoLevel(list[i].eat)} (${list[i].eat})\n`;
    }
    s += "--------------------------";
    _.session.sendQueued(s, 2000);
    list.sort((0, other_1.by)("have"));
    s = `本群${p}富婆排行榜：\n--------------------------\n排名 - 昵称 - 持有${p}数\n`;
    for (var i = 0; i < max; i++) {
        s += `#${i + 1} - ${list[i].nickname} - ${list[i].have}\n`;
    }
    s += "--------------------------";
    _.session.sendQueued(s, 2000);
}
exports.rank = rank;
