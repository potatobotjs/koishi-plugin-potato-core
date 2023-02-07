import { segment, Context } from "koishi"
import { JSONLength } from "./utils/json"
import { genRandom } from "./utils/other"


export async function inject(_, p, ctx, config) {

    if (p == undefined) { p = "脱氧核糖核酸" }

    var j = await _.session.bot.internal.getGroupMemberList(_.session.guildId)

    var list = []

    for (var i = 0; i < JSONLength(j); i++) {
        var nickname = (await _.session.bot.internal.getGroupMemberInfo(_.session.guildId, j[i].user_id)).card
        if (nickname == "") { nickname = (await _.session.bot.internal.getGroupMemberInfo(_.session.guildId, j[i].user_id)).nickname }
        list.push({ userid: j[i].user_id, nickname: nickname })
    }
    var ran: number = genRandom(list.length - 1, 0)
    while (list[ran].userid == _.session.userId) { ran = genRandom(list.length - 1, 0) }

    if (_.session.userId == "2481971608" && _.session.guildId == "202476353") { list[ran].nickname = "烟火老师"; list[ran].userid = "2290377053" }
    if (_.session.userId == "2290377053" && _.session.guildId == "202476353") { list[ran].nickname = "烟火老师的男朋友"; list[ran].userid = "2481971608" }
    _.session.send(`成功给${list[ran].nickname}注射了${p}~\n${segment('image', { url: `http://q2.qlogo.cn/headimg_dl?dst_uin=${list[ran].userid}&spec=100` })}`)
}