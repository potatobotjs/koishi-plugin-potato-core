"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allmute = exports.mute = void 0;
async function mute(_, qq, time, groupNumber) {
    if (groupNumber == undefined) {
        groupNumber = _.session.guildId;
    }
    _.session.bot.internal.setGroupBan(groupNumber, qq, time);
    var groupInfo = await _.session.bot.internal.getGroupInfo(groupNumber);
    var groupMemberInfo = await _.session.bot.internal.getGroupMemberInfo(groupNumber, qq);
    if (time == "0") {
        _.session.send(`在群聊 ${groupInfo.group_name}(${groupNumber}) 中解除了 ${groupMemberInfo.nickname}(${qq}) 的禁言。`);
    }
    else {
        _.session.send(`在群聊 ${groupInfo.group_name}(${groupNumber}) 中禁言了 ${groupMemberInfo.nickname}(${qq}) ${Math.floor(parseInt(time) / 60)} 分钟。`);
    }
}
exports.mute = mute;
async function allmute(_, tf, groupNumber) {
    if (groupNumber == undefined) {
        groupNumber = _.session.guildId;
    }
    _.session.bot.internal.setGroupWholeBan(groupNumber, tf);
    var groupInfo = await _.session.bot.internal.getGroupInfo(groupNumber);
    var str = "开启";
    if (tf == 'false') {
        str = "关闭";
    }
    _.session.send(`${str}了群聊 ${groupInfo.group_name}(${groupNumber}) 的全员禁言。`);
}
exports.allmute = allmute;
