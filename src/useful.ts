import { segment } from "koishi"
import { genRandom } from "./utils/other"

export async function qrcode(_, platform, ctx, config) {
    if (platform == 'wechat') { _.session.send(segment('image', { url: `file:///${__dirname}/assets/qrcode/wechat.png` })) }
    if (platform == 'alipay') { _.session.send(segment('image', { url: `file:///${__dirname}/assets/qrcode/alipay.png` })) }
}

export async function rand(_, max, min) {

_.session.send(genRandom(max, min).toString())
}

export async function select(_, list) {

if (list.length <= 1) { _.session.send(" ▨ PBR | 至少需要提供两个选项。") } else {
    var randItem: string = list[genRandom(list.length - 1, 0)]
    randItem = randItem.replace("我", "你")
    if (list.includes("土豆") || list.includes("马铃薯")) { _.session.send("支持土豆喵，支持土豆谢谢喵") } else { _.session.send(`建议选择 ${randItem} 。`) }
  }
}