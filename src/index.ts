//import { group } from 'console'
import { Console } from 'console'
import { $, Context, Schema, segment } from 'koishi'

export const name = 'potato-core'

export interface Config {
  logGroupNumber: string
  potatoRandomIntMax: number
  messageListenerList: string
}

export const schema = Schema.object({
  logGroupNumber: Schema.string().description("当调用 log2group 方法时，用于推送日志的群号。"),
  potatoRandomIntMax: Schema.number().description("调用获取土豆指令时最大获取的土豆数。"),
  messageListenerList: Schema.string().description("要监听消息的 QQ 号列表，以 \",\" 分割。"),
})



// by Lingrottin
function genRandom(maxNumber: number, minNumber?: number): number {
  if (minNumber) {
    return Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
  }
  else {
    return Math.floor(Math.random() * (maxNumber + 1));
  }
}






// TypeScript 用户需要进行类型合并
declare module 'koishi' {
  interface User {
    potatoCount: number
    potatoEaten: number
    potatoProtect: boolean
    potatoBuyLastCall: number
    potatoEatLastCall: number
  }
}



// 变量
var MessageListenerList: string[]





var textAbout =
  `
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
`


var textHelpOsu =
  `
由 KanonBot 提供的 osu 查询服务，要查看完整指令帮助，请前往 info.desu.life 。
------------------------------------------
!set new - 新建 Kanon 账号
!info - 生成个人资料卡
!re - 生成最新成绩的结算图
!bp* - 生成 bp 榜上第 * 个成绩的结算图
`




export function apply(ctx: Context, config: Config) {



  //方法


  function loadMessageListenerList() {
    MessageListenerList = `${config.messageListenerList}`.split(",")
  }
  //方法结束


  //初始化
  loadMessageListenerList()


  //中间件
  ctx.middleware(async (session, next) => {

    async function log2group(partName: string, content: string) {
      await session.bot.broadcast([`${config.logGroupNumber}`], `[ PBR | ${partName} ] ${content}`)
    }





    if (MessageListenerList.includes(session.userId)) {
      log2group('ML',`${session.username} 在群 ${session.guildId} 中发送了：\n${session.content}`)
    }
    return next()
  })
  //中间件结束

  ctx.model.extend('user', {
    potatoCount: { type: 'integer', initial: 0 },
    potatoEaten: { type: 'integer', initial: 0 },
    potatoProtect: { type: 'boolean', initial: false },
    potatoBuyLastCall: { type: 'integer', initial: 0 },
    potatoEatLastCall: { type: 'integer', initial: 0 }
  })











  ctx.command('echo <message>', '复读发送的消息', { authority: 2 })
    .action((_, message) => message)

  ctx.command('about', '关于 PotatoBot-Reborn')
    .action((_) => {
      _.session.send(textAbout.trim())
    })

  function getPotatoLevel(potatoCount) { return Math.floor(Math.sqrt(potatoCount / 1.5)) }


  ctx.command('potato', '土豆er~')

  ctx.command('potato/buy', '买土豆（指令别名：buyp 或 🥔）').alias('🥔').alias('buyp')
    .action(async (_) => {
      var user = await ctx.database.getUser(_.session.platform, _.session.userId)
      if ((Date.now() - user.potatoBuyLastCall) <= 3600000) {
        _.session.send(`还需要等待 ${60 - Math.floor((Date.now() - user.potatoBuyLastCall) / 60000)} 分钟才可以继续吃土豆...`)
      } else {
        var ran: number = genRandom(1, config.potatoRandomIntMax)
        ctx.database.setUser(_.session.platform, _.session.userId, { potatoCount: user.potatoCount + ran, potatoBuyLastCall: Date.now() })
        _.session.send(`成功买到了 ${ran} 个土豆，你目前拥有共拥有 ${(user.potatoCount + ran).toString()} 个土豆！`)
      }
    })

  ctx.command('potato/eat', '吃土豆（指令别名：eatp 或 🥔🥔）').alias('🥔🥔').alias('eatp')
    .action(async (_) => {
      var user = await ctx.database.getUser(_.session.platform, _.session.userId)
      if ((Date.now() - user.potatoEatLastCall) <= 3600000) {
        _.session.send(`还需要等待 ${60 - Math.floor((Date.now() - user.potatoEatLastCall) / 60000)} 分钟才可以继续吃土豆...`)
      } else {
        var ran: number = genRandom(1, config.potatoRandomIntMax)
        if (user.potatoCount - ran >= 0) {
          ctx.database.setUser(_.session.platform, _.session.userId, { potatoCount: user.potatoCount - ran, potatoEaten: user.potatoEaten + ran, potatoEatLastCall: Date.now() })
          _.session.send(`成功吃了 ${ran} 个土豆，你目前的等级为 Lv.${getPotatoLevel(user.potatoEaten + ran)}`)
        } else {
          _.session.send(`你的土豆还不够吃呢...`)
        }
      }
    })

  ctx.command('debug', { authority: 4 })
    .action(async (_) => {
      _.session.send(_.session.guildId)
    })


  ctx.command('qrcode <wechat/alipay>', '发送热力图的收款码', { authority: 4 })
    .action(async (_, platform) => {
      if (platform == 'wechat') { _.session.send(segment('image', { url: `file:///${__dirname}/assets/qrcode/wechat.png` })) }
      if (platform == 'alipay') { _.session.send(segment('image', { url: `file:///${__dirname}/assets/qrcode/alipay.png` })) }
    })


  ctx.command('mute <QQ> <time> [groupNumber]', '禁言/解除禁言', { authority: 2 })
    .action(async (_, qq, time, groupNumber) => {

      if (groupNumber == undefined) { groupNumber = _.session.guildId }
      _.session.bot.internal.setGroupBan(groupNumber, qq, time)

      var groupInfo = await _.session.bot.internal.getGroupInfo(groupNumber)
      var groupMemberInfo = await _.session.bot.internal.getGroupMemberInfo(groupNumber, qq)
      if (time == "0") {
        _.session.send(
          ` ▨ PBR | 在群聊 ${groupInfo.group_name}(${groupNumber}) 中解除了 ${groupMemberInfo.nickname}(${qq}) 的禁言。`)
      }
      else {
        _.session.send(
          ` ▨ PBR | 在群聊 ${groupInfo.group_name}(${groupNumber}) 中禁言了 ${groupMemberInfo.nickname}(${qq}) ${Math.floor(parseInt(time) / 60)} 分钟。`)
      }
    })

  ctx.command('allmute <true/false> [groupNumber]', '开启/关闭全员禁言', { authority: 2 })
    .action(async (_, tf, groupNumber) => {
      if (groupNumber == undefined) { groupNumber = _.session.guildId }
      _.session.bot.internal.setGroupWholeBan(groupNumber, tf)

      var groupInfo = await _.session.bot.internal.getGroupInfo(groupNumber)
      var str: string = "开启"; if (tf == 'false') { str = "关闭" }
      _.session.send(` ▨ PBR | ${str}了群聊 ${groupInfo.group_name}(${groupNumber}) 的全员禁言。`)
    })

  ctx.command('rand <min:number> <max:number>', '生成随机整数')
    .action((_, min, max) => {
      _.session.send(genRandom(max, min).toString())
    })

  ctx.command('select [...list]', '从给定的列表中随机选择一个选项')
    .action((_, ...list) => {
      if (list.length <= 1) { _.session.send(" ▨ PBR | 至少需要提供两个选项。") } else {
        var randItem: string = list[genRandom(list.length - 1, 0)]
        randItem = randItem.replace("我", "你")
        if (list.includes("土豆") || list.includes("马铃薯")) { _.session.send("支持土豆喵，支持土豆谢谢喵") } else { _.session.send(`建议选择 ${randItem} 。`) }
      }
    })
  ctx.command('select').alias('帮选')

  ctx.command('osu', 'osu! 综合查询服务')
    .action((_) => {
      if (_.session.content != "osu") { return }
      _.session.send(textHelpOsu.trim())
    })

  ctx.command('reload', '重载 PotatoBot 配置文件',{ authority: 4 })
    .action((_) => {
      loadMessageListenerList()
      _.session.send(MessageListenerList.toString())
    })
}

