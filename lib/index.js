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
exports.apply = exports.schema = exports.name = void 0;
const koishi_1 = require("koishi");
const pbrFile = __importStar(require("./file"));
const pbrCmdPotato = __importStar(require("./potato"));
const pbrCmdWeird = __importStar(require("./weird"));
const pbrCmdUseful = __importStar(require("./useful"));
const pbrCmdAdmin = __importStar(require("./admin"));
exports.name = 'potato-core';
exports.schema = koishi_1.Schema.object({
    logGroupNumber: koishi_1.Schema.string().description("当调用 log2group 方法时，用于推送日志的群号。"),
    potatoRandomIntMax: koishi_1.Schema.number().description("调用获取土豆指令时最大获取的土豆数。"),
    messageListenerList: koishi_1.Schema.string().description("要监听消息的 QQ 号列表，以 \",\" 分割。"),
});
function apply(ctx, config) {
    ctx.model.extend('user', {
        potatoCount: { type: 'integer', initial: 0 },
        potatoEaten: { type: 'integer', initial: 0 },
        potatoProtect: { type: 'boolean', initial: false },
        potatoBuyLastCall: { type: 'integer', initial: 0 },
        potatoEatLastCall: { type: 'integer', initial: 0 }
    });
    //中间件
    ctx.middleware(async (session, next) => {
        async function log2group(partName, content) {
            await session.bot.broadcast([`${config.logGroupNumber}`], `[ PBR | ${partName} ] ${content}`);
        }
        if (session.guildId == "727308105" && (session.content.trim() == "。" || session.content.trim() == " " || session.content.trim() == ".")) {
            session.bot.deleteMessage("727308105", session.messageId);
            session.send("不要再发让人无语的消息了。");
        }
        return next();
    });
    //中间件结束
    ctx.command('potato', '土豆er~');
    ctx.command('potato/buy [potato]', '买土豆（指令别名：buyp 或 🥔）')
        .alias('🥔')
        .alias('buyp')
        .action(async (_, p) => { pbrCmdPotato.buy(_, p, ctx, config); });
    ctx.command('potato/eat [potato]', '吃土豆（指令别名：eatp 或 🥔🥔）')
        .alias('🥔🥔')
        .alias('eatp')
        .action(async (_, p) => { pbrCmdPotato.eat(_, p, ctx, config); });
    ctx.command('potato/rank [potato]', '查看本群土豆等级排名（指令别名：土豆排行榜）')
        .alias('土豆排行榜')
        .action(async (_, p) => { pbrCmdPotato.rank(_, p, ctx, config); });
    ctx.command('meal', '吃啥？');
    ctx.command('meal/what2eat', '吃啥？').alias('吃啥')
        .action((_) => { });
    ctx.command('meal/add <meal>', '添加菜品')
        .action((_, m) => { });
    ctx.command('inject [DNA]', '日群友')
        .alias("日群友")
        .action(async (_, p) => { pbrCmdWeird.inject(_, p, ctx, config); });
    ctx.command('echo <message>', '复读发送的消息', { authority: 2 })
        .action((_, message) => message);
    ctx.command('qrcode <wechat/alipay>', '发送热力图的收款码', { authority: 4 })
        .action(async (_, platform) => { pbrCmdUseful.qrcode(_, platform, ctx, config); });
    ctx.command('rand <min:number> <max:number>', '生成随机整数')
        .action((_, min, max) => { pbrCmdUseful.rand(_, max, min); });
    ctx.command('select [...list]', '从给定的列表中随机选择一个选项')
        .alias('帮选')
        .action((_, ...list) => { pbrCmdUseful.select(_, list); });
    ctx.command('mute <QQ> <time> [groupNumber]', '禁言/解除禁言', { authority: 2 })
        .action(async (_, qq, time, groupNumber) => { pbrCmdAdmin.mute(_, qq, time, groupNumber); });
    ctx.command('allmute <true/false> [groupNumber]', '开启/关闭全员禁言', { authority: 2 })
        .action(async (_, tf, groupNumber) => { pbrCmdAdmin.allmute(_, tf, groupNumber); });
    ctx.command('about', '关于 PotatoBot-Reborn')
        .action((_) => { _.session.send(pbrFile.getText('about')); });
    ctx.command('osu', '音游 osu! 综合查询服务')
        .action((_) => {
        if (_.session.content != "osu") {
            return;
        }
        _.session.send(pbrFile.getText('help_osu'));
    });
    ctx.command('reload', '重载 PotatoBot 配置文件', { authority: 4 })
        .action((_) => { });
    ctx.command('debug', '调试', { authority: 4 })
        .action(async (_) => {
        _.session.send(`
guildId=${_.session.guildId}
${pbrFile.getText('test')}
      `.trim());
    });
}
exports.apply = apply;
