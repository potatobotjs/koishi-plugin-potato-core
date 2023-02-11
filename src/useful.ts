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

  if (list.length <= 1) { _.session.send("至少需要提供两个选项。") } else {
    var randItem: string = list[genRandom(list.length - 1, 0)]
    randItem = randItem.replace("我", "你")
    if (list.includes("土豆") || list.includes("马铃薯")) { _.session.send("支持土豆喵，支持土豆谢谢喵") } else { _.session.send(`建议选择${randItem}。`) }
  }
}

export async function uptime(_, _timeStarted) {
  let u = new Date().getTime() - _timeStarted
  let d = Math.floor(u / 1000 / 60 / 60 / 24)
  u -= d * 24 * 60 * 60 * 1000
  let h = Math.floor(u / 1000 / 60 / 60)
  u -= h * 60 * 60 * 1000
  let m = Math.floor(u / 1000 / 60)
  u -= m * 60 * 1000
  let s = Math.floor(u / 1000)
  _.session.send(`PotatoBot 本次会话已经运行了 ${d} 天 ${h} 小时 ${m} 分钟 ${s} 秒。`)
}