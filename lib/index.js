"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apply = exports.schema = exports.name = void 0;
const koishi_1 = require("koishi");
exports.name = 'potato-core';
exports.schema = koishi_1.Schema.object({
    logGroupNumber: koishi_1.Schema.string().description("当调用 log2group 方法时，用于推送日志的群号。"),
    potatoRandomIntMax: koishi_1.Schema.number().description("调用获取土豆指令时最大获取的土豆数。"),
    messageListenerList: koishi_1.Schema.string().description("要监听消息的 QQ 号列表，以 \",\" 分割。"),
    //aiDrawApiKey: Schema.string().description("Ai 绘图调用的 Api Key"),
});
// by Lingrottin
function genRandom(maxNumber, minNumber) {
    if (minNumber) {
        return Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
    }
    else {
        return Math.floor(Math.random() * (maxNumber + 1));
    }
}
function JSONLength(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key))
            size++;
    }
    return size;
}
;
var by = function (name) {
    return function (o, p) {
        var a, b;
        if (typeof o === "object" && typeof p === "object" && o && p) {
            a = o[name];
            b = p[name];
            if (a === b) {
                return 0;
            }
            if (typeof a === typeof b) {
                return a > b ? -1 : 1;
            }
            return typeof a > typeof b ? -1 : 1;
        }
        else {
            throw ("error");
        }
    };
};
// 变量
var MessageListenerList;
var textAbout = `
 ▨ About - PotatoBot Reborn "Abelia"
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
var textHelpOsu = `
由 KanonBot 提供的 osu 查询服务，要查看完整指令帮助，请前往 info.desu.life 。
------------------------------------------
!set new - 新建 Kanon 账号
!info - 生成个人资料卡
!re - 生成最新成绩的结算图
!bp* - 生成 bp 榜上第 * 个成绩的结算图
`;
function apply(ctx, config) {
    //方法
    function loadMessageListenerList() {
        MessageListenerList = `${config.messageListenerList}`.split(",");
    }
    //方法结束
    //初始化
    loadMessageListenerList();
    //中间件
    ctx.middleware(async (session, next) => {
        async function log2group(partName, content) {
            await session.bot.broadcast([`${config.logGroupNumber}`], `[ PBR | ${partName} ] ${content}`);
        }
        if (MessageListenerList.includes(session.userId)) {
            log2group('ML', `${session.username} 在群 ${session.guildId} 中发送了：\n${session.content}`);
        }
        if (session.guildId == "727308105" && (session.content.trim() == "。" || session.content.trim() == " " || session.content.trim() == ".")) {
            session.bot.deleteMessage("727308105", session.messageId);
            session.send("不要再发让人无语的消息了。");
        }
        return next();
    });
    //中间件结束
    ctx.model.extend('user', {
        potatoCount: { type: 'integer', initial: 0 },
        potatoEaten: { type: 'integer', initial: 0 },
        potatoProtect: { type: 'boolean', initial: false },
        potatoBuyLastCall: { type: 'integer', initial: 0 },
        potatoEatLastCall: { type: 'integer', initial: 0 }
    });
    ctx.command('echo <message>', '复读发送的消息', { authority: 2 })
        .action((_, message) => message);
    ctx.command('about', '关于 PotatoBot-Reborn')
        .action((_) => {
        _.session.send(textAbout.trim());
    });
    function getPotatoLevel(potatoCount) { return Math.floor(Math.sqrt(potatoCount / 1.5)); }
    ctx.command('potato', '土豆er~');
    ctx.command('potato/buy [potato]', '买土豆（指令别名：buyp 或 🥔）').alias('🥔').alias('buyp')
        .action(async (_, p) => {
        if (p == undefined) {
            p = "土豆";
        }
        var user = await ctx.database.getUser(_.session.platform, _.session.userId);
        var t = 3600000;
        var ran = genRandom(1, config.potatoRandomIntMax);
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
    });
    ctx.command('potato/eat [potato]', '吃土豆（指令别名：eatp 或 🥔🥔）').alias('🥔🥔').alias('eatp')
        .action(async (_, p) => {
        if (p == undefined) {
            p = "土豆";
        }
        var user = await ctx.database.getUser(_.session.platform, _.session.userId);
        var t = 3600000;
        var ran = genRandom(1, config.potatoRandomIntMax);
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
    });
    ctx.command('potato/rank [potato]', '查看本群土豆等级排名（指令别名：土豆排行榜）').alias('土豆排行榜')
        .action(async (_, p) => {
        if (p == undefined) {
            p = "土豆";
        }
        var j = await _.session.bot.internal.getGroupMemberList(_.session.guildId);
        var list = [];
        for (var i = 0; i < JSONLength(j); i++) {
            var u = await ctx.database.getUser(_.session.platform, j[i].user_id);
            var nickname = (await _.session.bot.internal.getGroupMemberInfo(_.session.guildId, j[i].user_id)).card;
            if (nickname == "") {
                nickname = (await _.session.bot.internal.getGroupMemberInfo(_.session.guildId, j[i].user_id)).nickname;
            }
            if (u != undefined) {
                list.push({ eat: u.potatoEaten, have: u.potatoCount, userid: j[i].user_id, nickname: nickname });
            }
        }
        list.sort(by("eat"));
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
        list.sort(by("have"));
        s = `本群${p}富婆排行榜：\n--------------------------\n排名 - 昵称 - 持有${p}数\n`;
        for (var i = 0; i < max; i++) {
            s += `#${i + 1} - ${list[i].nickname} - ${list[i].have}\n`;
        }
        s += "--------------------------";
        _.session.sendQueued(s, 2000);
    });
    ctx.command('inject [DNA]', '日群友').alias("日群友")
        .action(async (_, p) => {
        if (p == undefined) {
            p = "脱氧核糖核酸";
        }
        var j = await _.session.bot.internal.getGroupMemberList(_.session.guildId);
        var list = [];
        for (var i = 0; i < JSONLength(j); i++) {
            var nickname = (await _.session.bot.internal.getGroupMemberInfo(_.session.guildId, j[i].user_id)).card;
            if (nickname == "") {
                nickname = (await _.session.bot.internal.getGroupMemberInfo(_.session.guildId, j[i].user_id)).nickname;
            }
            list.push({ userid: j[i].user_id, nickname: nickname });
        }
        var ran = genRandom(list.length - 1, 0);
        while (list[ran].userid == _.session.userId) {
            ran = genRandom(list.length - 1, 0);
        }
        if (_.session.userId == "2481971608" && _.session.guildId == "202476353") {
            list[ran].nickname = "烟火老师";
            list[ran].userid = "2290377053";
        }
        if (_.session.userId == "2290377053" && _.session.guildId == "202476353") {
            list[ran].nickname = "烟火老师的男朋友";
            list[ran].userid = "2481971608";
        }
        _.session.send(`成功给${list[ran].nickname}注射了${p}~\n${(0, koishi_1.segment)('image', { url: `http://q2.qlogo.cn/headimg_dl?dst_uin=${list[ran].userid}&spec=100` })}`);
    });
    // ctx.command('aidraw <keyWord> <type>', '让 AI 替你画画')
    //   .action(async (_) => {
    //     var tokenLink = `https://wenxin.baidu.com/moduleApi/portal/api/oauth/token?grant_type=client_credentials&client_id=eB2POOwj9HN8pnLiOuN9nXivNaDHk4oB&client_secret=UtzmUH5yhoM4Vd6QV12A2Ym1V81NuipI`
    //     var access_token = (await ctx.http.post(tokenLink)).data
    //     var link1 = `https://wenxin.baidu.com/moduleApi/portal/api/rest/1.0/ernievilg/v1/txt2img?access_token=${access_token}`
    //     var data1 = {
    //       text: "青绿色草地连成一片，山间起伏，有倾泻的流水，星星点缀天空，蓝天白云，天色泛白，巨幅画面感，遥拍视角，4K，高清",
    //       style: "油画"
    //     }
    //     var resp = await ctx.http.post(link1, data1)
    //     console.log(access_token)
    //     console.log(resp)
    //     var link2 = `https://wenxin.baidu.com/moduleApi/portal/api/rest/1.0/ernievilg/v1/getImg?access_token=${access_token}`
    //     var data2 = { taskId: resp.data.taskId }
    //     function checkPic(ctx) {
    //       return new Promise((resolve, reject) => setTimeout(async () => {
    //         ctx.http.post(link2, data2).then(resp => { resolve(resp) }, rej => { reject(rej) })
    //       }, 5000))
    //     }
    //     var i = 1
    //     while (resp.data.img == undefined || resp.data.img == "") {
    //       resp = await checkPic(ctx)
    //       i++
    //       if (i >= 10) { _.session.send("failed"); break }
    //       console.log("#" + i + "\n" + resp.toString())
    //     }
    //     _.session.send(segment('image', { url: resp.data.img }))
    //   })
    ctx.command('debug', { authority: 4 })
        .action(async (_) => {
        _.session.send(_.session.guildId);
    });
    ctx.command('qrcode <wechat/alipay>', '发送热力图的收款码', { authority: 4 })
        .action(async (_, platform) => {
        if (platform == 'wechat') {
            _.session.send((0, koishi_1.segment)('image', { url: `file:///${__dirname}/assets/qrcode/wechat.png` }));
        }
        if (platform == 'alipay') {
            _.session.send((0, koishi_1.segment)('image', { url: `file:///${__dirname}/assets/qrcode/alipay.png` }));
        }
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
        else {
            var randItem = list[genRandom(list.length - 1, 0)];
            randItem = randItem.replace("我", "你");
            if (list.includes("土豆") || list.includes("马铃薯")) {
                _.session.send("支持土豆喵，支持土豆谢谢喵");
            }
            else {
                _.session.send(`建议选择 ${randItem} 。`);
            }
        }
    });
    ctx.command('select').alias('帮选');
    ctx.command('osu', '音游 osu! 综合查询服务')
        .action((_) => {
        if (_.session.content != "osu") {
            return;
        }
        _.session.send(textHelpOsu.trim());
    });
    ctx.command('reload', '重载 PotatoBot 配置文件', { authority: 4 })
        .action((_) => {
        loadMessageListenerList();
        _.session.send(MessageListenerList.toString());
    });
}
exports.apply = apply;
