"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apply = exports.schema = exports.name = void 0;
const koishi_1 = require("koishi");
exports.name = 'potato-core';
exports.schema = koishi_1.Schema.object({
    logGroupNumber: koishi_1.Schema.string().description("当调用 log2group 方法时，用于推送日志的群号。"),
});
var potatoCount = [];
// by Lingrottin
function genRandom(maxNumber, minNumber) {
    if (minNumber) {
        return Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
    }
    else {
        return Math.floor(Math.random() * (maxNumber + 1));
    }
}
var textAbout = `
 ▨ About - PotatoBot Reborn v0.01
------------------------------------------
Powered by Koishi.js,
Written in TypeScript.
Github: 
https://github.com/Ltfjx/PotatoBot-Reborn
------------------------------------------
Credits:
@Lingrottin    
@RLt
------------------------------------------
查看指令帮助：help
`;
function apply(ctx, config) {
    ctx.middleware(async (session, next) => {
        if (session.content === 'chaxun') {
            session.send(JSON.stringify(potatoCount));
        }
        else if (session.content.indexOf("救命") != -1) {
            await session.send("别急，土豆来了");
            setTimeout(() => {
                session.execute('help', next);
            }, 500);
        }
        return next();
    });
    ctx.model.extend('user', {
        potatoCount: { type: 'integer', initial: 0 },
    });
    async function log2group(partName, content) {
        await ctx.broadcast([`${config.logGroupNumber}`], `[ PBR | ${partName} ] ${content}`);
        console.log([`${config.logGroupNumber}`]);
    }
    ctx.command('echo <message>', '复读发送的消息', { authority: 2 })
        .action((_, message) => message);
    ctx.command('about', '关于 PotatoBot-Reborn')
        .action((_) => {
        _.session.send(textAbout.trim());
    });
    ctx.command('🥔', '获取土豆')
        .action(async (_) => {
        var user = await ctx.database.getUser(_.session.platform, _.session.userId);
        ctx.database.setUser(_.session.platform, _.session.userId, { potatoCount: user.potatoCount + 1 });
        _.session.send(user.potatoCount.toString());
    });
    ctx.command('debug', { authority: 4 })
        .action(async (_) => {
        _.session.send(_.session.guildId);
        log2group("Debug", "This is a debug message");
    });
    ctx.command('mute <QQ> <time> [groupNumber]', '禁言/解除禁言', { authority: 2 })
        .action(async (_, qq, time, groupNumber) => {
        if (groupNumber == undefined) {
            groupNumber = _.session.guildId;
        }
        _.session.bot.internal.setGroupBan(groupNumber, qq, time);
        var groupInfo = await _.session.bot.internal.getGroupInfo(groupNumber);
        var groupMemberInfo = await _.session.bot.internal.getGroupMemberInfo(groupNumber, qq);
        if (time == "0") {
            _.session.send(` ▨ PBR | 在群聊 ${groupInfo.group_name}(${groupNumber}) 中解除了 ${groupMemberInfo.nickname}(${qq}) 的禁言。`);
        }
        else {
            _.session.send(` ▨ PBR | 在群聊 ${groupInfo.group_name}(${groupNumber}) 中禁言了 ${groupMemberInfo.nickname}(${qq}) ${Math.floor(parseInt(time) / 60)} 分钟。`);
        }
    });
    ctx.command('allmute <true/false> [groupNumber]', '开启/关闭全员禁言', { authority: 2 })
        .action(async (_, tf, groupNumber) => {
        if (groupNumber == undefined) {
            groupNumber = _.session.guildId;
        }
        _.session.bot.internal.setGroupWholeBan(groupNumber, tf);
        var groupInfo = await _.session.bot.internal.getGroupInfo(groupNumber);
        var str = "开启";
        if (tf == 'false') {
            str = "关闭";
        }
        _.session.send(` ▨ PBR | ${str}了群聊 ${groupInfo.group_name}(${groupNumber}) 的全员禁言。`);
    });
    ctx.command('rand <min:number> <max:number>', '生成随机整数')
        .action((_, min, max) => {
        _.session.send(genRandom(max, min).toString());
    });
    ctx.command('select [...list]', '从给定的列表中随机选择一个选项')
        .action((_, ...list) => {
        if (list.length <= 1) {
            _.session.send(" ▨ PBR | 至少需要提供两个选项。");
        }
        else
            var randItem = list[genRandom(list.length - 1, 0)];
        randItem = randItem.replace("我", "你");
        if (list.includes("土豆") || list.includes("马铃薯")) {
            _.session.send("支持土豆喵，支持土豆谢谢喵");
        }
        else
            _.session.send(`建议选择 ${randItem} 。`);
    });
}
exports.apply = apply;
